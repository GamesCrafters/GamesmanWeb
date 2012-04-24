/**
WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE!
*/
var gameName = "ttt"
var offsetX = 40;
var offsetY = 40;
var interfaceSideLength = 1;
var interfaceDotRadius = interfaceSideLength/75;
var possiblePositions = new Array(); // Count from top left corner to bottom right corner
var P1PieceLocations = new Array(); // Count from top left corner to bottom right corner
var P2PieceLocations = new Array(); 
var P1PiecesToPlace = 9;
var P2PiecesToPlace = 9;
var P1PiecesOnBoard = 0;
var P2PiecesOnBoard = 0;
var deletePhase = false;

var P1PieceColor = "rgb(255, 0, 0)";
var P2PieceColor = "rgb(0, 0, 255)";

// this should go in initializeGame() later
clearBoard();

function resetInterfaceLength(){
	if (interfaceWidth > interfaceHeight){
		interfaceSideLength = interfaceHeight*0.85;
	}
	else{
		interfaceSideLength = interfaceWidth*0.85;
	}
	offsetX = (interfaceWidth-optionsWidth-interfaceSideLength)/2;
	offsetY = (interfaceHeight-interfaceSideLength)/2;
	
	interfaceDotRadius = interfaceSideLength/75;
	
	findPossiblePositions();
}

function findPossiblePositions(){
	var side = interfaceSideLength;
	possiblePositions[0]  = [offsetX+side*0/6, offsetY+side*0/6]; // top row
	possiblePositions[1]  = [offsetX+side*3/6, offsetY+side*0/6];
	possiblePositions[2]  = [offsetX+side*6/6, offsetY+side*0/6];
	possiblePositions[3]  = [offsetX+side*1/6, offsetY+side*1/6]; // second row
	possiblePositions[4]  = [offsetX+side*3/6, offsetY+side*1/6];
	possiblePositions[5]  = [offsetX+side*5/6, offsetY+side*1/6];
	possiblePositions[6]  = [offsetX+side*2/6, offsetY+side*2/6]; // third row
	possiblePositions[7]  = [offsetX+side*3/6, offsetY+side*2/6];
	possiblePositions[8]  = [offsetX+side*4/6, offsetY+side*2/6];
	possiblePositions[9]  = [offsetX+side*0/6, offsetY+side*3/6]; // fourth row
	possiblePositions[10] = [offsetX+side*1/6, offsetY+side*3/6];
	possiblePositions[11] = [offsetX+side*2/6, offsetY+side*3/6];
	possiblePositions[12] = [offsetX+side*4/6, offsetY+side*3/6];
	possiblePositions[13] = [offsetX+side*5/6, offsetY+side*3/6];
	possiblePositions[14] = [offsetX+side*6/6, offsetY+side*3/6];
	possiblePositions[15] = [offsetX+side*2/6, offsetY+side*4/6]; // fifth row
	possiblePositions[16] = [offsetX+side*3/6, offsetY+side*4/6];
	possiblePositions[17] = [offsetX+side*4/6, offsetY+side*4/6];
	possiblePositions[18] = [offsetX+side*1/6, offsetY+side*5/6]; // sixth row
	possiblePositions[19] = [offsetX+side*3/6, offsetY+side*5/6];
	possiblePositions[20] = [offsetX+side*5/6, offsetY+side*5/6];
	possiblePositions[21] = [offsetX+side*0/6, offsetY+side*6/6]; // seventh row
	possiblePositions[22] = [offsetX+side*3/6, offsetY+side*6/6];
	possiblePositions[23] = [offsetX+side*6/6, offsetY+side*6/6];
}

function clearBoard(){
	for(i = 0; i<24; i++){
		P1PieceLocations[i] = false;
		P2PieceLocations[i] = false;
	}
}

function floatEq(a, b){
	return Math.abs(a - b) < 0.05
}

function indexOfPosition(posX, posY){
	for (i=0; i<24; i++){
	// float equality issue.  solve here
		if (floatEq(posX, possiblePositions[i][0]) && floatEq(posY, possiblePositions[i][1])){
			return i;
		}
	}
	return -1;
}

function topNeighborIndex(index){
	if (index===17){
		return null;
	}
	
	var pos = possiblePositions[index];
	var posX = pos[0];
	var posY = pos[1];
	var side = interfaceSideLength;
	var up1 = indexOfPosition(posX, posY-side*1/6);
	var up2 = indexOfPosition(posX, posY-side*2/6);
	var up3 = indexOfPosition(posX, posY-side*3/6);
	
	if (up1 != -1) return up1;
	if (up2 != -1) return up2;
	if (up3 != -1) return up3;
	return null;
}

function bottomNeighborIndex(index){
	if (index===7){
		return null;
	}
	
	var pos = possiblePositions[index];
	var posX = pos[0];
	var posY = pos[1];
	var side = interfaceSideLength;
	var down1 = indexOfPosition(posX, posY+side*1/6);
	var down2 = indexOfPosition(posX, posY+side*2/6);
	var down3 = indexOfPosition(posX, posY+side*3/6);
	
	if (down1 != -1) return down1;
	if (down2 != -1) return down2;
	if (down3 != -1) return down3;
	return null;
}

function rightNeighborIndex(index){
	if (index===11){
		return null;
	}
	
	var pos = possiblePositions[index];
	var posX = pos[0];
	var posY = pos[1];
	var side = interfaceSideLength;
	var right1 = indexOfPosition(posX+side*1/6, posY);
	var right2 = indexOfPosition(posX+side*2/6, posY);
	var right3 = indexOfPosition(posX+side*3/6, posY);
	
	if (right1 != -1) return right1;
	if (right2 != -1) return right2;
	if (right3 != -1) return right3;
	return null;
}

function leftNeighborIndex(index){
	if (index===12){
		return null;
	}
	
	var pos = possiblePositions[index];
	var posX = pos[0];
	var posY = pos[1];
	var side = interfaceSideLength;
	var left1 = indexOfPosition(posX-side*1/6, posY);
	var left2 = indexOfPosition(posX-side*2/6, posY);
	var left3 = indexOfPosition(posX-side*3/6, posY);
	
	if (left1 != -1) return left1;
	if (left2 != -1) return left2;
	if (left3 != -1) return left3;
	return null;
}

function findEmptyNeighbors(i){
		var neighbors = newArray();
		var count = 0;
		
		//Create an array, containing the index of the locations to check for empty spots (based on current position)
		if(i == 0){
			var check = [1,9];
		}
		if(i == 1){
			var check = [0,2,4];
		}
		
		if(i == 2){
			var check = [1,14];
		}
		
		if(i == 3){
			var check = [4,10];
		}
		
		if(i == 4){
			var check = [1,3,5,7];
		}
		
		if(i == 5){
			var check = [4,13];
		}
		
		if(i == 6){
			var check = [7,11];
		}
		
		if(i == 7){
			var check = [4,6,8];
		}
		
		if(i == 8){
			var check = [7,12];
		}
		
		if(i == 9){
			var check = [0,10];
		}
		
		if(i == 10){
			var check = [3,9,11,18];
		}
		
		if(i == 11){
			var check = [6,10,16];
		}
		
		if(i == 12){
			var check = [8,13,17];
		}
		
		if(i == 13){
			var check = [5,12,14,20];
		}
		
		if(i == 14){
			var check = [2,13,23];
		}
		
		if(i == 15){
			var check = [11,16];
		}
		
		if(i == 16){
			var check = [15,17,19];
		}
		
		if(i == 17){
			var check = [12,16];
		}
		
		if(i == 18){
			var check = [10,19];
		}
		
		if(i == 19){
			var check = [16,18,20,22];
		}
		
		if(i == 20){
			var check = [13,19];
		}
		
		if(i == 21){
			var check = [9,22];
		}
		
		if(i == 22){
			var check = [19,21,23];
		}
		
		if(i == 23){
			var check = [14,22];
		}
		
		var j = 0;
		var index = 0;
		//Check if the respective spots are empty. If it is, put the index into neighbor array
		for(j = 0; j < check.length; j++){
			index = check[j];
			if(P1PieceLocations[index] == false && P2PieceLocations[index] == false){
			 	neighbors[count] = index;
				count++;
			}
		}
		
		return neighbors;
}
	

function P1ThreeInARow(index){
	
}

function drawP1Piece(x, y){

	interfacecxt.beginPath();
	interfacecxt.fillStyle = P1PieceColor;  
	interfacecxt.arc(x,y,interfaceSideLength/20, 0, Math.PI*2, true);
	interfacecxt.fill();
	interfacecxt.stroke();
}

function drawP2Piece(x, y){

	interfacecxt.beginPath();
	interfacecxt.fillStyle = P2PieceColor;
	interfacecxt.arc(x,y,interfaceSideLength/20, 0, Math.PI*2, true);
	interfacecxt.fill();
	interfacecxt.stroke();
}

function drawPieceCounter(x, y){
	interfacecxt.fillStyle = "black";
	interfacecxt.fillText("P1 Pieces left to place: "+P1PiecesToPlace, x, y);
	interfacecxt.fillText("P2 Pieces left to place: "+P2PiecesToPlace, x, y+15);
}

function drawDeleteIndicator(x, y){
	interfacecxt.fillStyle = "black";
	interfacecxt.fillText("Select a piece from the opposing player to remove from the board")
}

function animate(position, end) { // takes a starting point and end point
    var side = interfaceSideLength;

    if (P1PieceLocations[position] && P1PieceLocations[end] === false){
	//makes sure position is true and end is false
		P1PieceLocations[position] = false; //sets position to false = beginning of animation
        if (possiblePositions[position] === (P1PieceLocations[0] ||
		P1PieceLocations[1] || P1PieceLocations[2] || P1PieceLocations[9] ||
		P1PieceLocations[14] || P1PieceLocations[21] || P1PieceLocations[22]
		|| P1PieceLocations[23])) { 
            possiblePositions[position] = possiblePositions[end]/[offsetX+side*0/6 +1, offsetY+side*0/6] 
			// !@#$!trying to animate by setting position to a multiple of end, because end can be in 4 different directions from position
        } else if (P1PieceLocations[position] === (P1PieceLocations[3] ||
		P1PieceLocations[4] || P1PieceLocations[5] || P1PieceLocations[10] ||
		P1PieceLocations[13] || P1PieceLocations[18] || P1PieceLocations[20]))
		{
            //possiblePositions[]  = [offsetX+side*0/6 +1, offsetY+side*0/6]
        } else if (P1PieceLocations[position] === (P1PieceLocations[6] ||
		P1PieceLocations[7] || P1PieceLocations[8] || P1PieceLocations[11] ||
		P1PieceLocations[12] || P1PieceLocations[15] || P1PieceLocations[16]
		|| P1PieceLocations[17]))
		{
        // if statement separate positions by outside square, middle square, inside square
        } else if (P2PieceLocations[i]){ // does the same thing above for p2pieces
                       P2PieceLocations[i] = false;
		}
	}
}

function drawArrow(start, end){
	//Y-coordinates are the same (moving piece to empty space in the same row). 
	if ( possiblePositions[start][1] == possiblePositions[end][1]){
		//If starting point's X-coordinate is less than ending point's X-coordinate, arrow points to right
		if( possiblePositions[start][0] < possiblePositions[end][0]){
			//Draw arrow pointing to the right
		}
		else{
			//Draw arrow pointing to the left
		}
	}
	
	//Y-coordinates are different (moving piece to empty space in the same column)
	else{
		if( possiblePositions[start][1] < possiblePositions[end][1]){
			//Draw arrow pointing down
		}
		else{
			//Draw arrow pointing up
		}
	}
}

function drawDot(x, y){
	var radius = interfaceDotRadius;
	interfacecxt.beginPath();
	interfacecxt.fillStyle = "black";
	interfacecxt.arc(x,y,radius, 0, Math.PI*2, true);
	interfacecxt.fill();
	interfacecxt.stroke();
}

function drawBoardLines(){
	interfacecxt.lineWidth = 5;
	interfacecxt.strokeStyle = 'black';
	
    interfacecxt.strokeRect(offsetX, offsetY, interfaceSideLength, interfaceSideLength);
	interfacecxt.strokeRect(1/6 * interfaceSideLength + offsetX, 1/6 * interfaceSideLength + offsetY, 2/3 * interfaceSideLength, 2/3 * interfaceSideLength);
    interfacecxt.strokeRect(2/6 * interfaceSideLength + offsetX, 2/6 * interfaceSideLength + offsetY, 2/6 * interfaceSideLength, 2/6 * interfaceSideLength);
	
	interfacecxt.moveTo(interfaceSideLength/2 + offsetX, offsetY);
	interfacecxt.lineTo(interfaceSideLength/2 + offsetX, interfaceSideLength/3 + offsetY);
	
	interfacecxt.moveTo(interfaceSideLength/2 + offsetX, interfaceSideLength*2/3 + offsetY);
	interfacecxt.lineTo(interfaceSideLength/2 + offsetX, interfaceSideLength + offsetY);
	
	interfacecxt.moveTo(offsetX, interfaceSideLength/2 + offsetY);
	interfacecxt.lineTo(interfaceSideLength/3 + offsetX, interfaceSideLength/2 + offsetY);
	
	interfacecxt.moveTo(interfaceSideLength*2/3 + offsetX, interfaceSideLength/2 + offsetY);
	interfacecxt.lineTo(interfaceSideLength + offsetX, interfaceSideLength/2 + offsetY);
		
	interfacecxt.stroke();
}

/**
You can use this as the main graphics function. It will call itself over and over every .01 seconds. Please try to make it to just display graphics based on data rather than manipulating data. Otherwise, it may have errors with screen size change and such.
*/
function drawInterface() {
    // This should be at the front of your code!
	// YOUR CODE STARTS HERE
	// You MUST draw the interface based on the currentPosition variable for any none-permanent graphics! (Like piece locations and such)
    resetInterfaceLength();
	interfacecxt.clearRect(0, 0, interfaceWidth, interfaceHeight);
	drawBoardLines();
	drawPieceCounter(interfaceWidth-200, 150);
	
	
	// redraw pieces that are supposed to be on the board.  if nothing's there, draw a dot
	for (i = 0; i < possiblePositions.length; i++){
		posX = possiblePositions[i][0];
		posY = possiblePositions[i][1];
		if (P1PieceLocations[i]){
			drawP1Piece(posX, posY);
		}
		else if (P2PieceLocations[i]){
			drawP2Piece(posX, posY);
		}
		else{
			drawDot(possiblePositions[i][0], possiblePositions[i][1]);
		}
	}
}

/**
This is the function you will use to register clicks. The xPos and yPos are the coordinates of the mouse clicks, when the mouse is clicked.
*/
function clickFunction(xPos, yPos) {
	
	var radius = interfaceDotRadius;
	
	for (i = 0; i < possiblePositions.length; i++){
		dotXPos = possiblePositions[i][0];
		dotYPos = possiblePositions[i][1];
		PieceInPosition = P1PieceLocations[i] || P2PieceLocations[i];
		
		if (xPos <= dotXPos + radius*2 && xPos >= dotXPos - radius*2 && yPos <= dotYPos + radius*2 
		&& yPos >= dotYPos - radius*2 && !PieceInPosition){
			if(playerTurn == PLAYER1){
				P1PieceLocations[i] = true;
				P1PiecesToPlace -= 1;
				P1PiecesOnBoard += 1;
				//drawP1Piece(dotXPos, dotYPos);
			}
			else{
				P2PieceLocations[i] = true;
				P2PiecesToPlace -= 1;
				P2PiecesOnBoard += 1;
				//drawP2Piece(dotXPos, dotYPos);
			}
		playerTurn = !playerTurn;
		}
	}
	drawInterface()
	
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
	
	// This code should be at the bottom of the initializeGame.
	pushPosition(currentPosition);
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



/**
The notifier class to be used by the GCAPI
*/
function NMMNotify(canvas){
  this.canvas = canvas;
}

NMMNotify.prototype.drawBoard = function(board){
  $('#outputs').append("Drawing board: '" + board + "'<br />");
}

var done = false;
NMMNotify.prototype.drawMoves = function(data){
  $('#outputs').append("Drawing Moves: '" + JSON.stringify(data) + "'<br />")
  if(data.length > 0 && !done)
    game.makeMove(data[0]);
  else if(done){
    game.undo()
  }else{
    done = true;
    $('#outputs').append("End of Game<br />");
    game.undo()
  }
}
var notifier = null
var game = null
var canvas = null
function loadBoard(){
  //canvas = document.getElementById('gameInterface');
  //notifier = new NMMNotify(canvas)
  //game = new Game(gameName, {
  //  width: 3,
  //  height: 3,
  //  pieces: 3
  //}, notifier, "         ");
  //game.startGame()
  sizeUpdate();
}