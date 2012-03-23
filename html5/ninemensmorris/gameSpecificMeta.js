/**
WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE!
*/
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

var P1PieceColor = "rgb(255, 0, 0)";
var P2PieceColor = "rgb(155, 75, 125)";

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
		
		if (xPos <= dotXPos + radius*2 && xPos >= dotXPos - radius*2 && yPos <= dotYPos + radius*2 && yPos >= dotYPos - radius*2){
			if(player1Turn == true){
				P1PieceLocations[i] = true;
				P1PiecesToPlace -= 1;
				P1PiecesOnBoard += 1;
				drawP1Piece(dotXPos, dotYPos);
				interfacecxt.fillStyle = "black";
				interfacecxt.fillText("P1 Pieces left to place: "+P1PiecesToPlace, interfaceWidth - 200, interfaceHeight - 400);
			}
			else{
				P2PieceLocations[i] = true;
				P2PiecesToPlace -= 1;
				P2PiecesOnBoard += 1;
				drawP2Piece(dotXPos, dotYPos);
				interfacecxt.fillStyle = 'black';
				interfacecxt.fillText("P2 Pieces left to place: "+P2PiecesToPlace, interfaceWidth - 200, interfaceHeight - 200);
			}
		player1Turn = !player1Turn;
		}
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
