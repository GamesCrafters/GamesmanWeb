/*
 * JavaInterface.c
 *
 *  Created on: Oct 13, 2008
 *      Author: Patrick Horn
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
 * GNU General Public License for more details.
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <jni.h>

#include "Core/GamesmanObjects/Game.h"
#include "Core/UserInterface.h"
#include "Core/Board.h"
#include "Core/BoardDefinition.h"
#include "Solvers/Solvers.h"
#include "Util/DataStructure/HashTable.h"
#include "Hashers/Hasher.h"
#include "Hashers/GenericHash.h"
#include "Util/DataStructure/ArrayList.h"
#include "Shells/ShellArguments.h"

/* FIXME: Allow multiple functions to be linked at the same time without using any dlopen hacks. */

ShellArguments *sa;

JNIEXPORT void JNICALL Java_edu_berkeley_jgamesman_GamesmanC_initnative(JNIEnv *env, jclass cls)
{
	sa = ShellArguments_malloc();
	sa->solver = 0;
	sa->outputFilename = "game.fdb";
	sa->inputFilename = "game.fdb";
	sa->theGame = GameSpecific_createGame();
	sa->bd = sa->theGame->bd;
	
	sa->gh = (struct Hasher*)GenericHash_create(sa->bd);
	sa->fdb = FlatDB_create(sa->outputFilename, Hasher_getMaxHash(((struct Hasher*)sa->gh), sa->bd), (int)(intptr_t)Game_getProperty(sa->theGame, "Data Size"));
	struct Solver *s = NULL;
	if (sa->solver == 0){
		s = Solver_createSolver(sa->fdb, (struct Hasher*)sa->gh, &Solver_Undo_solve);
	} else if (sa->solver == 1){
		s = Solver_createSolver(sa->fdb, (struct Hasher*)sa->gh, &Solver_MAX_solve);
	} else {
		s = Solver_createSolver(sa->fdb, (struct Hasher*)sa->gh, &Solver_MAX_solve_iterator);
		s->tierIterator = Iterator_createNumberIterator(sa->gh->bd->size, -1, -1);
	}
	Solver_solve(s, sa->theGame);
	printf("\n\n");
	
	FlatDB_saveDB(sa->fdb);
	// sa->processArguments(0, NULL);
}

static jobject java_new_HashMap(JNIEnv *env) {
	jclass class_HashMap = (*env)->FindClass(env, "java/util/HashMap");
	if (!class_HashMap) return NULL;
	jmethodID cid = (*env)->GetMethodID(env, class_HashMap, "<init>", "()V");
	if (!cid) return NULL;
	jobject newInst = (*env)->NewObject(env, class_HashMap, cid);
	return newInst;
}

static void java_Map_putstring(JNIEnv *env, jobject map, const char *keystr, const char *valstr) {
	jobject value = NULL;
	if (valstr) {
		value = (jobject) ((*env)->NewStringUTF(env, valstr));
		if (!value) return;
	}
	jobject key = (jobject) ((*env)->NewStringUTF(env, keystr));
	if (!key) return;
	jclass class_Map = (*env)->FindClass(env, "java/util/Map");
	if (!class_Map) return;
	jmethodID putID = (*env)->GetMethodID(env, class_Map, "put",
					  "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
	if (!putID) return;

	(*env)->CallObjectMethod(env, map, putID, key, value);
}

static void java_Map_putint(JNIEnv *env, jobject map, const char *keystr, int val) {
	char valstr[100];
	sprintf(valstr,"%d",val);
	java_Map_putstring(env, map, keystr, valstr);
}

/*
static jstring java_Map_get(JNIEnv *env, jobject map, const char *keystr, jobject value) {
	jobject key = (*env)->NewStringUTF(env, lastfile);
	
	jclass class_Map = (*env)->FindClass(env, "java/util/Map");
	jmethodID getID = (*env)->GetMethodID(env, class_Map, "get", "(Ljava/lang/Object;)Ljava/lang/Object;");

	(*env)->CallObjectMethod(env, map, getID, key);
	
}
*/


static struct Board *javaToBoard(JNIEnv *env, jstring jBoardStr) {
	const char *boardStr;
	char *myBoardStr;
	struct Board *b;
	
	if (jBoardStr == NULL) {
		return NULL;
	}
	boardStr = (*env)->GetStringUTFChars(env, jBoardStr, NULL);
	if (boardStr == NULL) {
		return NULL;
	}
	if (strlen(boardStr) != sa->bd->size) {
		fprintf(stderr,"Error with board! %s\n",boardStr);
		(*env)->ReleaseStringUTFChars(env, jBoardStr, boardStr);
		return NULL;
	}
	//fprintf(stderr,"Looking up board: %s\n",boardStr);
	myBoardStr = strdup(boardStr);
	(*env)->ReleaseStringUTFChars(env, jBoardStr, boardStr);
	
	b = Board_create_string(myBoardStr, sa->bd);
	Board_convertDataToString(b, sa->bd);

	return b;
}

jobject positionValue_to_hashtable(JNIEnv *env, int positionValue, char *boardstr) {

	jobject hash = java_new_HashMap(env);
	if (!hash) return NULL;
	java_Map_putstring(env, hash, "board", boardstr); // so that javascript can match up request.
	java_Map_putint(env, hash, "value", positionValue);
	java_Map_putint(env, hash, "remoteness", -1);
	
	return hash;
}

void ThrowIllegalArgument(JNIEnv *env, const char *msg) {
	/*jclass newExcCls = (*env)->FindClass(env, "edu/berkeley/gcweb/InvalidBoardException"); */
	jclass newExcCls = (*env)->FindClass(env, "java/lang/IllegalArgumentException");
	
	if (newExcCls) {
		(*env)->ThrowNew(env, newExcCls, msg);
	}
}

jobject board_to_hash(JNIEnv *env, ShellArguments *sa, struct Board *b, const char *move)
{
	int positionValue;
	jobject hash;
	char *boardstr;
	Board_convertStringToData(b, sa->bd);
	boardstr = Board_data_toString(b, sa->bd);
	Board_convertDataToString(b, sa->bd);
	if (!boardstr) return NULL;
	
	positionValue = UserInterface_getValue(b, (struct Hasher*)sa->gh, sa->fdb);
	
	hash = positionValue_to_hashtable(env, positionValue, boardstr);
	
	if (!hash) return NULL;
	
	java_Map_putstring(env, hash, "move", move); // so that javascript can match up request.
	
	return hash;
}

JNIEXPORT jobjectArray JNICALL
Java_edu_berkeley_jgamesman_GamesmanC_getNextMoveValues(JNIEnv *env, jclass cls, jstring jboardStr)
{
	ArrayList *moves;
	int i;
	jarray arr;
	struct Board * b = javaToBoard(env, jboardStr);
	
	jclass class_Map = (*env)->FindClass(env, "java/util/Map");
	if (!class_Map) return NULL;

	if (!b) {
		ThrowIllegalArgument(env, "Invalid board string passed to getMoveValue");
		return NULL;
	}

	//children = UserInterface_generateChildren(b, sa->theGame);
	moves = UserInterface_generateMoves(b, sa->theGame);
	arr = (*env)->NewObjectArray(env, moves->count, class_Map, NULL);
	
	for (i = 0; i < moves->count; i++) {
		char *nextMove = ArrayList_get(moves, i);
		jobject hash;
		struct Board *newBoard = Board_clone(b, sa->bd);
		newBoard = UserInterface_doMove(nextMove, newBoard, sa->theGame);
		
		hash = board_to_hash(env, sa, newBoard, nextMove);
		Board_free(newBoard);
		if (!hash) {
			break;
		}
		(*env)->SetObjectArrayElement(env, arr, i, hash);
		
	}

	ArrayList_free(moves);
	Board_free(b);
	
	return arr;
}

JNIEXPORT jobject JNICALL
Java_edu_berkeley_jgamesman_GamesmanC_getMoveValue(JNIEnv *env, jclass cls, jstring jboardStr)
{
	jobject ret;
	struct Board * b = javaToBoard(env, jboardStr);
	if (!b) {
		ThrowIllegalArgument(env, "Invalid board string passed to getMoveValue");
		return NULL;
	}

	ret = board_to_hash(env, sa, b, NULL);

	Board_free(b);
	// free list of positions
	return ret;
}
