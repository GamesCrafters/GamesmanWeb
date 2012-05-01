/*Variables from interface:
var PLAYER1 = true;
var PLAYER2 = false;
var playerTurn = PLAYER1;
var player1Name = "Player 1";
var player2Name = "Player 2";
var player1AI = false;
var player2AI = false;
var randomness1 = 0; // Only applicable if there is AI involved.
var randomness2 = 0; // Only applicable if there is AI involved.
var showPredictions = false;
var showMoveValues = false;
var showDeltaRemoteness = false; // Should only work if showMoveValues is true
var computerPauseTime = 1000; // Only applicable if there is AI involved.
var animationSpeed = 100;
var winStateColor = '00FF00';
var loseStateColor = 'FF0000';
var drawTieStateColor = 'FFFF00';
var gameSpecificOption1 = false;
var gameSpecificOption2 = false;
var gameSpecificOption3 = false;
var gameSpecificOption1Name = "Input name here";
var gameSpecificOption2Name = "Input name here";
var gameSpecificOption3Name = "Input name here";
*/


/**
WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE!
*/
//Variables needed for interaction with server
var canTalkToServer = false;

//Initialization variables
var initialized = false;
var imageLoaded = false;

//Preference, and static variables
var PITS_PER_PLAYER = 6;
var PEBBLES_PER_PIT = 4;
var DEFAULT_PIT_COLOR = "rgba(0,0,0,0.5)";
var verticalMargin = 0;
var horizontalMargin = 0;
var boardX = 0;
var boardY = 0;
var boardH = 0;
var boardW = 0;

//Used for detection of clicks on the scaled board
var boardImage;
var bufferContext;
var bufferCanvas;

//Game instance variables
var pits;
var waitingForInput;
var animateLock;
var moveInterval;

/* Functions */

//Combines drawBoardToBuffer() and drawBufferToCanvas() for convenience
function drawBoard(){
	if(imageLoaded){
		drawBoardToBuffer();
		drawBufferToCanvas();
	}else{
		setTimeout(drawBoard,100);
	}
}
//Function that draws all board elements to the buffer. Buffer cleared and re-drawn every time this is called 
function drawBoardToBuffer(){
	bufferContext.drawImage(boardImage,0,0);
	drawPitsToBuffer();
	drawInfoToBuffer();
}
	
//Function that takes the buffer and draws it onto the scaled canvas gameInterface
function drawBufferToCanvas(){
	if(imageLoaded){
		var height;
		var boardHeight;
		var boardWidth;
		
		//Do a few calculations to scale the board on the interface
		height = gameInterface.height - (gameInterface.height % 6);
		verticalMargin = Math.floor(height/12);
		boardHeight = height - 2*verticalMargin;
		
		//Decrease height so that width(2*height) is not larger than canvas width
		while(boardHeight*2 > gameInterface.width){
			boardHeight -= 2;
			verticalMargin += 1;
		}
		boardWidth = boardHeight * 2;
		horizontalMargin = Math.floor((gameInterface.width + optionsTab.width - boardWidth)/2) - optionsTab.width;

		if(horizontalMargin < 0){
			horizontalMargin = 0;
		}

		//Draw buffer onto the canvas
		interfacecxt.drawImage(bufferCanvas,horizontalMargin,verticalMargin,boardWidth,boardHeight);
		boardX = horizontalMargin;
		boardY = verticalMargin;
		boardW = boardWidth;
		boardH = boardHeight;
	}else{
		setTimeout(drawBufferToCanvas,100);
	}
}

//Function that draws pits onto the buffer
function drawPitsToBuffer(){
	bufferContext.save();

	var vertPadding = Math.floor(bufferCanvas.height/20);
	var horizPadding = 10;
	var pitWidth = Math.floor((bufferCanvas.width-10)/(PITS_PER_PLAYER + 2));
	var pitHeight = 6*vertPadding;
	var playerPitWidth = pitWidth - 10;
	var playerPitHeight = bufferCanvas.height - 2*vertPadding;
	var p1Text = "" + pits[2*PITS_PER_PLAYER + 1].getNumOfPebbles();
	var p2Text = "" + pits[PITS_PER_PLAYER].getNumOfPebbles();

	//Add a zero to the front of player text if < 10, for consistent 2 digits
	if(pits[2*PITS_PER_PLAYER + 1].getNumOfPebbles() < 10){
		p1Text = "0" + p1Text;
	}
	if(pits[PITS_PER_PLAYER].getNumOfPebbles() < 10){
		p2Text = "0" + p2Text;
	}

	bufferContext.fillStyle = "rgba(0,0,0,0.5)";
	bufferContext.font = (playerPitWidth-40) + "px Arial";
	//Draw player1 pit
	bufferContext.fillRect(horizPadding,vertPadding,playerPitWidth,playerPitHeight);
	bufferContext.fillStyle = "rgba(256,256,256,0.8)";
	bufferContext.fillText(p1Text,horizPadding+10,vertPadding+Math.floor(playerPitHeight/2));
	
	bufferContext.fillStyle = "rgba(0,0,0,0.5)";
	//Draw Player2 pit
	bufferContext.fillRect(bufferCanvas.width-horizPadding-playerPitWidth,vertPadding,playerPitWidth,playerPitHeight);
	bufferContext.fillStyle = "rgba(256,256,256,0.8)";
	bufferContext.fillText(p2Text,bufferCanvas.width-horizPadding-playerPitWidth+10,vertPadding+Math.floor(playerPitHeight/2));

	var startingPoint = horizPadding + playerPitWidth;
	//Draw the individual pits on top
	for(var i=0;i<PITS_PER_PLAYER;i++){
		var pitColor = DEFAULT_PIT_COLOR;
		var number = pits[getPitIndex(i+1,0)].getNumOfPebbles();
		var text = "" + number;
		if(number<10){
			text = "0" + number;
		}
	
		//Determine pit color (move values and delta remoteness)
		if(waitingForInput && (playerTurn == PLAYER2) && showMoveValues){
			pitColor = pits[getPitIndex(i+1,0)].color;
			if(!showDeltaRemoteness){
				pitColor = pitColor.substring(0,pits[getPitIndex(i+1,0)].color.length-4) + "1)";
			}
		}

		bufferContext.fillStyle = pitColor;
		bufferContext.fillRect(startingPoint+horizPadding+i*pitWidth,vertPadding,pitWidth-2*horizPadding,pitHeight-2*vertPadding);
		bufferContext.fillStyle = "rgba(256,256,256,0.8)";
		bufferContext.fillText(text,startingPoint+horizPadding+i*pitWidth+10,vertPadding+pitWidth-50);
	}

	//Draw the individual pits on bottom
	for(var i=0;i<PITS_PER_PLAYER;i++){
		var pitColor = DEFAULT_PIT_COLOR;
		var number = pits[i].getNumOfPebbles();
		var text = "" + number;
		if(number<10){
			text = "0" + number;
		}

		//Determine pit color (move values and delta remoteness)
		if(waitingForInput && (playerTurn == PLAYER1) && showMoveValues){
			pitColor = pits[i].color;
			if(!showDeltaRemoteness){
				pitColor = pitColor.substring(0,pits[i].color.length-4) + "1)";
			}
		}

		bufferContext.fillStyle = pitColor;
		bufferContext.fillRect(startingPoint+horizPadding+i*pitWidth,bufferCanvas.height-pitHeight+vertPadding,
				pitWidth-2*horizPadding,pitHeight-2*vertPadding);
		bufferContext.fillStyle = "rgba(256,256,256,0.8)";
		bufferContext.fillText(text,startingPoint+horizPadding+i*pitWidth+10,bufferCanvas.height-pitHeight+vertPadding
			+(playerPitWidth-40));
	}
			
	bufferContext.restore();
}

//returns the rgba color of the pit ***Random for now***
function getMoveValue(pitIndex){
	var randomColor = Math.floor(Math.random()*3);
	var colorToRet = "rgba(";
	var randomDelta = 0;
	while(randomDelta < 0.1){
		randomDelta = Math.floor(10 * Math.random())/10;
	}
	
	if(randomColor == 2){
		colorToRet += "255,0,0,";
	}else if(randomColor == 1){
		colorToRet += "0,255,0,";
	}else{
		colorToRet += "255,255,0,";
	}

	if(randomColor != 0){
		colorToRet += randomDelta + ")";
	}else{
		colorToRet += "1.0)";
	}

	if(pits[pitIndex].getNumOfPebbles() == 0){
		colorToRet = "rgba(255,0,0,1.0)";
	}
	return colorToRet;
}
//This function is used to draw player names to the board and stuff like that
function drawInfoToBuffer(){
	//Use verticalMargin and horizontalMargin
	var pitWidth = Math.floor((bufferCanvas.width-10)/(PITS_PER_PLAYER + 2));

	//Player 2
	bufferContext.save();
	bufferContext.font = Math.floor(pitWidth/3) + "px Arial";
	if(playerTurn == PLAYER2){
		bufferContext.shadowColor = 'black';
		bufferContext.shadowOffsetX = 5;
		bufferContext.shadowOffsetY = 5;
		bufferContext.shadowBlur = 20;
	}
	bufferContext.fillStyle = "rgba(0,0,0,0.6)";
	bufferContext.textAlign = "center";
	bufferContext.fillText(player2Name,700,pitWidth+60);
	bufferContext.restore();

	//Player 1
	bufferContext.save();
	bufferContext.font = Math.floor(pitWidth/3) + "px Arial";
	if(playerTurn == PLAYER1){
		bufferContext.shadowColor = 'black';
		bufferContext.shadowOffsetX = 5;
		bufferContext.shadowOffsetY = 5;
		bufferContext.shadowBlur = 20;
	}
	bufferContext.fillStyle = "rgba(0,0,0,0.5)";
	bufferContext.textAlign = "center";
	bufferContext.fillText(player1Name,700,700-pitWidth-30);
	bufferContext.restore();
}

//Handles click operations. Checks what was chosen, if valid, acts accordingly
function clickOp(x,y){
	if(x > boardX && x < (boardW + boardX) && y > boardY && y < (boardH + boardY)){
		var intervalH = Math.floor(boardW/(2+PITS_PER_PLAYER));
		var intervalV = Math.floor(boardH/2);
		var relativeX = x - boardX;
		var relativeY = y - boardY;
		var xPos = Math.floor(relativeX/intervalH);
		var yPos = Math.floor(relativeY/intervalV);
		
		//alert("You chose (" + xPos + "," + yPos + ")");
		if(xPos != 0 && xPos != (PITS_PER_PLAYER + 1) && yPos == 1 && playerTurn == PLAYER1 && (xPos != 0 && xPos != (PITS_PER_PLAYER+1))){
			waitingForInput = false;
			distributePebbles(xPos,yPos);
			moveLoop();
			drawBoard();
		}else if(xPos != 0 && xPos != (PITS_PER_PLAYER + 1) &&yPos == 0 && playerTurn == PLAYER2 && (xPos != 0 && xPos != (PITS_PER_PLAYER+1))){
			waitingForInput = false;
			distributePebbles(xPos,yPos);
			moveLoop();
			drawBoard();
		}else{
			if(xPos != 0 && xPos != (PITS_PER_PLAYER+1)){
				if(playerTurn == PLAYER1){
					alert("Player1's turn: Choose from the bottom.");
				}else{
					alert("Player2's turn: Choose from the top.");
				}
			}
		}
	}
}

//Returns the index of the pit that was chosen given the x and y coordinates relative to the board
function getPitIndex(x,y){
	if(y == 0){
		return (2*PITS_PER_PLAYER-x+1);
	}else if(y == 1){
		return (x-1);
	}else{
		//Handle error if needed
	}
}

//Takes coordinates of pit from which to take pebbles, and distributes pebbles to appropriate pits **MAKE SURE TO HANDLE ANIMATION**
//If only one variable is input, then it is treated as the index
function distributePebbles(x,y){
	//alert("distribute from " + x + "," + y);
	var srcPitIndex;
	if(y == -1){
		srcPitIndex = x;
	}else{
		srcPitIndex = getPitIndex(x,y);
	}
	var srcPit = pits[srcPitIndex];
	var lastDestIndex = (srcPitIndex+srcPit.getNumOfPebbles())%(2*PITS_PER_PLAYER+2);
	var numOfPebbles = srcPit.getNumOfPebbles();
	
	if(numOfPebbles == 0){
		return;
	}
	
	for(var i = 0; i < numOfPebbles;i++){
		var pebble = srcPit.removePebble();
		var destPitIndex = (srcPitIndex+i+1)%(2*PITS_PER_PLAYER+2);
		animateTransition(pebble,srcPitIndex,destPitIndex);
		pits[destPitIndex].addPebble(pebble);
	}
	
	handleLastLanding(srcPitIndex,lastDestIndex);
	//Handle change of turn later
	drawBoard();
}

//This function that handles special events where the last pit is placed in a particular place ***NOT DONE***
function handleLastLanding(srcPitIndex,lastDestIndex){
	//For now, do default and change turn
	//TODO
	if(playerTurn == PLAYER1){
		playerTurn = PLAYER2;
	}else{
		playerTurn = PLAYER1;
	}
}
//Function that gets move from AI if AI turn, else waits for click from user
function moveLoop(){
	if(isAITurn()){
		clearMoveValues();
		distributePebbles(askForMove(),-1);
		setTimeout(moveLoop,0);
	}else{
		setMoveValues();
		waitingForInput = true;
		drawBoard();
	}
}

function pause(msecs){
	var start = new Date().getTime();
	var cur = start;

	while(cur - start < msecs){
		cur = new Date().getTime();
	}	
} 

//Sets all of the pit colors to default
function clearMoveValues(){
	for(var i = 0; i < pits.lenght; i++){
		pits[i].setColor(DEFAULT_PIT_COLOR);
	}
}

//Sets all of the pit colors to their respective move values
function setMoveValues(){
	for(var i = 0; i < pits.length; i++){
		pits[i].setColor(getMoveValue(i));
	}
}

//This function checks if the current move is an AI move
function isAITurn(){
	if(playerTurn == PLAYER1){
		return player1AI;
	}else{
		return player2AI;
	}
}

//This function will ask the mancala AI on server(or code) for a move **random for now**
function askForMove(){
	//should return an index of the chosen pit
	var randomNum = PITS_PER_PLAYER;
	while(randomNum  == PITS_PER_PLAYER){
		randomNum = Math.floor(PITS_PER_PLAYER * Math.random());
	}

	if(playerTurn == PLAYER1){
		return randomNum;
	}else{
		return randomNum + PITS_PER_PLAYER + 1;
	}
}

//Returns pebbles with random values, which may include pebble color
function getRandomPebble(){
	//For now, returns simple pebble object
	return new pebble();
}

//Animates the transition of a pebbles between two pits
function animateTransition(pebble,srcPitIndex,destPitIndex){
	//alert(pitIndexToCoor(1).x);
	/*Instructions:
	1.Call drawBoardToBuffer() to draw the board to the buffer with all the pits and other pebbles not
		including the one being animated
	2.Draw pebble being animated somewhere else
	3.Call drawBufferToCanvas() to display whatever you just drew
	4.Repeat until the pebble is where you want it.
	*/
}


//Returns the coordinatePair object of the position of the pit. Takes index of the pit
function pitIndexToCoor(index){
	//Calculations from drawPitsToBuffer(). This will be generalized
	var vertPadding = Math.floor(bufferCanvas.height/20);
	var horizPadding = 10;

	var pitSize = Math.floor((1400 - horizPadding*2)/(PITS_PER_PLAYER + 2));
	var leftToRightPos = 0;
	var top;
	var x = 0;
	var y = 0;

	if(index < PITS_PER_PLAYER){
		leftToRightPos = index + 1;
		top = false;
	}else if((index < pits.length) && (index > PITS_PER_PLAYER)){
		leftToRightPos = PITS_PER_PLAYER - (index - 1 - PITS_PER_PLAYER);
		top = true;
	}else{
		//This happens when the index belongs to a player pit
		leftToRightPos = null;
	}

	if(leftToRightPos != null){
		x = (pitSize * leftToRightPos) + horizPadding;
		if(top){
			y = vertPadding;
		}else{
			y = 700 - (pitSize + vertPadding);
		}

		return new coordinatePair(x,y);
	}else{
		return null;
	}
}

/*
*Objects
*/

//The pit object
function pit(){
	this.pebbles = new Array();
	this.highlighted = false;
	this.coordinates = new coordinatePair(0,0);
	this.color = DEFAULT_PIT_COLOR;

	//Add pebble
	this.addPebble = function(pebble){
		this.pebbles.push(pebble);
	}
	
	//Remove pebble. Return the pebble being removed
	this.removePebble = function(){
		return this.pebbles.pop();
	}
	
	//Get the number of pebbles the pit has
	this.getNumOfPebbles = function(){
		return this.pebbles.length;
	}
	
	//Get the x and y coordinates, returns a coordinatePair object
	this.getCoordinates = function(){
		return this.coordinates;
	}

	//Sets pit color
	this.setColor = function(c){
		this.color = c
	}
}




function pebble(){
	//TODO
}

function coordinatePair(xCoor,yCoor){
	this.x = xCoor;
	this.y = yCoor;
}

/**
You can use this as the main graphics function. It will call itself over and over every .01 seconds. Please try to make it to just display graphics based on data rather than manipulating data. Otherwise, it may have errors with screen size change and such.
*/
function drawInterface() {
    // This should be at the front of your code!
    interfacecxt.clearRect(0, 0, interfaceWidth, interfaceHeight);
    
    // YOUR CODE STARTS HERE
	// You MUST draw the interface based on the currentPosition variable for any none-permanent graphics! (Like piece locations and such)
	if(!initialized){
		initializeGame();
		initialized = true;
	}
    	drawBoard();
    
    
    
    // YOUR CODE ENDS HERE
    /*
	I commented this out, because I decided that it wasn't really necessary to keep refreshing the page, when we only need to really change the page whenever we make a change to the board. Please let me know if you believe otherwise and confer with me! Sung Roa.
    // This should be at the bottom of your code!
	setTimeout("drawInterface()", 10);
	*/
}

/**
This is the function you will use to register clicks. The xPos and yPos are the coordinates of the mouse clicks, when the mouse is clicked.
*/
function clickFunction(xPos, yPos) {
	if(waitingForInput && !animateLock){
		clickOp(xPos,yPos);
	}
}

/**
This is the function you will use to register mouse pressed down and let go. The xPos and yPos are the coordinates while such are happening.
*/
function downFunction(xPos, yPos) {

}
function upFunction(xPos, yPos) {

}

/**
This is the function you will use to initialize your game. It doesn't matter what you do in it, just please keep the position storage in there after you are done initializing. PLEASE Update current position whenever you call this with the boardstate!
*/
function initializeGame() {
	pits = new Array();
	//change to false after modifying functions
	waitingForInput = false;
	animateLock = false;
	
	//Add the total number of pits, including player main pits, to the pits array
	for(var i = 0; i < (2 + 2*PITS_PER_PLAYER);i++){
		pits[i] = new pit();
		pits[i].setColor(DEFAULT_PIT_COLOR);
		//Only add default number of pebble if the pit is not either of the players' main pit
		if(((i+1)%(PITS_PER_PLAYER+1)) != 0){
			for(var k = 0; k < PEBBLES_PER_PIT;k++){
				pits[i].addPebble(getRandomPebble());
			}
		}
	}
	
	//Create and load the board image
	boardImage = new Image();
	boardImage.onload = function(){imageLoaded=true;};
	boardImage.src = "light_wood.png";

	//Create buffer, to not worry about size when drawing to the scaled canvas
	bufferCanvas = document.createElement("canvas");
	bufferCanvas.setAttribute("width","1400px");
	bufferCanvas.setAttribute("height","700px");
	bufferContext = bufferCanvas.getContext("2d");

	//Set turn to player1
	playerTurn = PLAYER1;

	//Start game move loop
	moveLoop();

	// This code should be at the bottom of the initializeGame.
	/*REMOVED FOR NOW. SEEMS TO NOT BE FUNCTIONAL*/
	//pushPosition(currentPosition);
}

/**
This is the function you will use to perform moves. It doesn't matter what you do in it, just please keep this position storage in there. You can also have any inputs that you want in perform move too. I just left it blank because I don't know what you guys want for specific games. PLEASE Update current position whenever you call this with the boardstate!
*/
function performMove() {
	
	
	// This code should be at the bottom of the perform move.
	drawInterface();
	storeCurrentPosition(currentPosition);
	redoMoves = new Array();
}
