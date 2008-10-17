#!/usr/bin/make -f

GCWEBTOP=../../../..
GMDIR=$(GCWEBTOP)/../Gamesman+-

ifndef GAME
	GAME=ttt
endif

JAVACBIN=$(shell which javac)


ifeq ($(shell uname), Darwin)
	SHAREDOPT=-dynamiclib
else
	SHAREDOPT=-shared
endif


ifdef JAVA_HOME
	JDKINCLUDE=$(JAVA_HOME)/include
else
ifeq ($(shell uname), Darwin)
	JDKINCLUDE=/System/Library/Frameworks/JavaVM.framework/Headers
else
	JAVACLINK=$(shell readlink -f $(JAVACBIN))
	JAVACDIR=$(shell dirname $(JAVACLINK))
	
	JDKINCLUDE=$(JAVACDIR)/../include
endif
endif


ifndef OUTDIR
	OUTDIR=$(GCWEBTOP)
endif

#JDKDIR=/usr/local/jdk1.7.0
#JDKDIR=/usr/lib/java//java-jdk-1.6.0

CFLAGS=-I$(JDKINCLUDE)/linux -I$(JDKINCLUDE)
LDFLAGS=-lgamesman -lcutil -lmath -lm -lpthread -pthread -fPIC
JFLAGS=-classpath $(GCWEBTOP)/src

# Target info 
JNILIBNAME=GamesmanJNI
JNILIBEXT=.jnilib
JNILIB=$(JNILIBNAME)$(JNILIBEXT)
JAVACLASS=Gamesman.class

all: Gamesman+- jnilib $(JAVACLASS)
Gamesman+-: $(GMDIR)/lib/libgamesman.a

jnilib: $(OUTDIR)/$(JNILIB)

clean:
	rm -vf $(OUTDIR)/$(JNILIB) $(JAVACLASS)

$(GMDIR)/lib/libgamesman.a $(GMDIR)/src/Games/$(GAME).o:
	make -C $(GMDIR)

$(OUTDIR)/$(JNILIB): Gamesman+- JavaInterface.c $(GMDIR)/src/Games/$(GAME).o
	gcc -g -Wall -L$(GMDIR)/lib -I$(GMDIR)/src $(SHAREDOPT) -o $@ \
		$(GMDIR)/src/Games/$(GAME).c JavaInterface.c $(CFLAGS) $(LDFLAGS)

.java.class: $<
	$(JAVACBIN) $(JFLAGS) $<

.SUFFIXES: .class .java
.PHONY: Gamesman+- all clean jnilib

