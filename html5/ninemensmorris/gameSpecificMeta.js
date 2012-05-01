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
var selectedPieceIndex = null;

// phases
var PLACINGPHASE = 1;
var SLIDINGPHASE = 2;
var FLYINGPHASE = 3;
var DELETEPHASE = 4;
var GAMEOVER = 5;
var gamePhase = PLACINGPHASE;

// aesthetics 
var count = 0;
var speed = 1;
var normalStrokeWidth = 5;
var largerStrokeWidth = 10;
var normalPieceBorderColor = "black";
var neutralStateColor = "rgb(0, 255, 255)";
var arrowOutlineColor = neutralStateColor;
var arrowInnerColor = "white";
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
	if (index===16 || index===null){
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
	if (index===7 || index===null){
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
	if (index===11 || index===null){
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
	if (index===12 || index===null){
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

function emptySpace(i){
	// checks if the index specified is empty
	return !(P1PieceLocations[i] || P2PieceLocations[i])
}

function findEmptyNeighbors(i){
        var neighbors = new Array();
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
            var check = [0,10,21];
        }
        
        if(i == 10){
            var check = [3,9,11,18];
        }
        
        if(i == 11){
            var check = [6,10,15];
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
	
function validTriple(tripleState){
	return tripleState !== undefined && tripleState !== false;
}
	
function makesThree(index, player){
	var aboveOneIndex = topNeighborIndex(index);
	var aboveTwoIndex = topNeighborIndex(aboveOneIndex);
	var belowOneIndex = bottomNeighborIndex(index);
	var belowTwoIndex = bottomNeighborIndex(belowOneIndex);
	var rightOneIndex = rightNeighborIndex(index);
	var rightTwoIndex = rightNeighborIndex(rightOneIndex);
	var leftOneIndex = leftNeighborIndex(index);
	var leftTwoIndex = leftNeighborIndex(leftOneIndex);
	
	switch (player){
	case 1:
		var aboveBelow = P1PieceLocations[aboveOneIndex] && P1PieceLocations[belowOneIndex];
		var aboveTwice = P1PieceLocations[aboveOneIndex] && P1PieceLocations[aboveTwoIndex];
		var belowTwice = P1PieceLocations[belowOneIndex] && P1PieceLocations[belowTwoIndex];
		var makesVertTriple = validTriple(aboveBelow) || validTriple(aboveTwice) || validTriple(belowTwice);
		
		var rightLeft = P1PieceLocations[rightOneIndex] && P1PieceLocations[leftOneIndex];
		var rightTwice = P1PieceLocations[rightOneIndex] && P1PieceLocations[rightTwoIndex];
		var leftTwice = P1PieceLocations[leftOneIndex] && P1PieceLocations[leftTwoIndex];
		var makesHorizTriple = validTriple(rightLeft) || validTriple(rightTwice) || validTriple(leftTwice);
		
		return makesVertTriple || makesHorizTriple;
		break;
	case 2:
		var aboveBelow = P2PieceLocations[aboveOneIndex] && P2PieceLocations[belowOneIndex];
		var aboveTwice = P2PieceLocations[aboveOneIndex] && P2PieceLocations[aboveTwoIndex];
		var belowTwice = P2PieceLocations[belowOneIndex] && P2PieceLocations[belowTwoIndex];
		var makesVertTriple = validTriple(aboveBelow) || validTriple(aboveTwice) || validTriple(belowTwice);
		
		var rightLeft = P2PieceLocations[rightOneIndex] && P2PieceLocations[leftOneIndex];
		var rightTwice = P2PieceLocations[rightOneIndex] && P2PieceLocations[rightTwoIndex];
		var leftTwice = P2PieceLocations[leftOneIndex] && P2PieceLocations[leftTwoIndex];
		var makesHorizTriple = validTriple(rightLeft) || validTriple(rightTwice) || validTriple(leftTwice);
		
		return makesVertTriple || makesHorizTriple;
		break;
	default:
		throw new Error("player must be either 1 or 2 for MakeThree")
	}
}
	

function drawP1Piece(x, y, highlight){

	interfacecxt.beginPath();
	interfacecxt.fillStyle = P1PieceColor;  
	if (highlight===undefined){
		interfacecxt.strokeStyle = normalPieceBorderColor;
		interfacecxt.lineWidth = normalStrokeWidth;
	} else {
		interfacecxt.strokeStyle = neutralStateColor;
		interfacecxt.lineWidth = largerStrokeWidth;
	}
	interfacecxt.arc(x,y,interfaceSideLength/20, 0, Math.PI*2, true);
	interfacecxt.fill();
	interfacecxt.stroke();
}

function drawP2Piece(x, y, highlight){

	interfacecxt.beginPath();
	interfacecxt.fillStyle = P2PieceColor;
	if (highlight===undefined){
		interfacecxt.strokeStyle = normalPieceBorderColor;
		interfacecxt.lineWidth = normalStrokeWidth;
	} else {
		interfacecxt.strokeStyle = neutralStateColor;
		interfacecxt.lineWidth = largerStrokeWidth;
	}
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
	interfacecxt.fillText("Select a piece from the opposing", x, y);
	interfacecxt.fillText("player to remove from the board", x, y+10);
}

function drawGameOverIndicator(x, y){
	interfacecxt.fillStyle = "black";
	if (playerTurn === PLAYER1){
		interfacecxt.fillText("AFTER A LONG AND HARD FOUGHT BATTLE, ", x, y);
		interfacecxt.fillText(""+player2Name+" EMERGES VICTORIOUS!", x, y+10);
	}
	else if (playerTurn === PLAYER2){
		interfacecxt.fillText("AFTER A LONG AND HARD FOUGHT BATTLE, ", x, y);
		interfacecxt.fillText(""+player1Name+" EMERGES VICTORIOUS!", x, y+10);
	}
}

function drawTurnCounter(x, y){
	interfacecxt.fillStyle = "black";
	if (playerTurn === PLAYER1){
		interfacecxt.fillText("Player 1's Turn", x, y);
	}
	else if (playerTurn === PLAYER2){
		interfacecxt.fillText("Player 2's Turn", x, y);
	}
}

function animate (start, end) {
    var x1 = possiblePositions[start][0];
    var y1 = possiblePositions[start][1];
    var x2 = possiblePositions[end][0];
    var y2 = possiblePositions[end][1];
    //var drawPiece = drawP1Piece / drawP2Piece ? Then just add in arguments -> darwPiece(x,y)? 
    
    if(P1PieceLocations[start]){ //Check if the animated piece is Player 1 or Player 2
        //Remove the current piece from its original location
        P1PieceLocations[start] = false;
        //animate the piece to the right or the left, since y1 == y2
        if(y1 == y2){
            if(x1 < x2){
                if(x1+count < x2){ //Sliding the piece to the right
                    drawP1Piece(x1+count, y1);
                    count += speed;             //redraws the circle at 1 pixel away from the normal position
                    if(x1+count >= x2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P1PieceLocations[end] = true;
                        }
                }
            }
            else{
                if(x1-count > x2){  //Sliding the piece to the left
                    drawP1Piece(x1-count, y1);
                    count += speed;             //redraws the circle at 1 pixel away from the normal position
                    if(x1-count <= x2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P1PieceLocations[end] = true;
                        }
                }
            }
        }
        //animate the piece up or down, since y1 == y2
        if(x1 == x2){
            if(y1 < y2){
                if(y1+count < y2){  //Sliding the piece down
                    drawP1Piece(x1, y1+count);
                    count += speed;             //redraws the circle at 1 pixel away from the normal position
                    if(y1+count >= y2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P1PieceLocations[end] = true;
                        }
                }
            }
            else{
                if(y1-count < y2){  //Sliding the piece up
                    drawP1Piece(x1, y1-count);
                    count += speed;             //redraws the circle at 1 pixel away from the normal position
                    if(y1-count <= y2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P1PieceLocations[end] = true;
                        }
                }
            }
        }
    }
    
    //Repeat the same for P2
    else if(P2PieceLocations[start]){ //Check if the animated piece is Player 1 or Player 2
        //Remove the current piece from its original location
        P2PieceLocations[start] = false;
        //animate the piece to the right or the left, since y1 == y2
        if(y1 == y2){
            if(x1 < x2){
                if(x1+count < x2){ //Sliding the piece to the right
                    drawP2Piece(x1+count, y1);
                    count++;             //redraws the circle at 1 pixel away from the normal position
                    if(x1+count == x2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P2PieceLocations[end] = true;
                        }
                }
            }
            else{
                if(x1-count > x2){  //Sliding the piece to the left
                    drawP2Piece(x1-count, y1);
                    count++;             //redraws the circle at 1 pixel away from the normal position
                    if(x1-count == x2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P2PieceLocations[end] = true;
                        }
                }
            }
        }
        //animate the piece up or down, since y1 == y2
        if(x1 == x2){
            if(y1 < y2){
                if(y1+count < y2){  //Sliding the piece down
                    drawP2Piece(x1, y1+count);
                    count++;             //redraws the circle at 1 pixel away from the normal position
                    if(y1+count == y2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P2PieceLocations[end] = true;
                        }
                }
            }
            else{
                if(y1-count < y2){  //Sliding the piece up
                    drawP2Piece(x1, y1-count);
                    count++;             //redraws the circle at 1 pixel away from the normal position
                    if(y1-count == y2){
                        //Stop animation and reset the counter
                        count = 0;
                        //Set the new position of the piece
                        P2PieceLocations[end] = true;
                        }
                }
            }
        }
    }
    
}



function flyPhase(start, end) { //need to call within  Animate
	if (P1PiecesToPlace <= 3) {
		if(P1PieceLocations[start] && possiblePositions[end] == false) {
				P1PieceLocations[start] = false;
				P1PieceLocations[end] = true;
	    }
			
	} else if (P2PiecesToPlace <= 3){
		if(P2PieceLocations[start] && possiblePositions[end] == false) {
			P2PieceLocations[start] = false;
			P2PieceLocations[end] = true;
		}	
	}
}

function drawArrow(start, end){
    //Y-coordinates are the same (moving piece to empty space in the same row). 
    if ( possiblePositions[start][1] == possiblePositions[end][1]){
        //If starting point's X-coordinate is less than ending point's X-coordinate, arrow points to right
        if( possiblePositions[start][0] < possiblePositions[end][0]){
            //Draw arrow pointing to the right
            drawRightArrow(start,end);
        }
        else{
            //Draw arrow pointing to the left
            drawLeftArrow(start,end);
        }
    }
    
    //Y-coordinates are different (moving piece to empty space in the same column)
    else{
        if( possiblePositions[start][1] < possiblePositions[end][1]){
            //Draw arrow pointing down
            drawDownArrow(start,end);
        }
        else{
            //Draw arrow pointing up
            drawUpArrow(start,end);
        }
    }
}

function drawUpArrow(start, end){
	var offset = interfaceSideLength/60;
	
    var x1 = possiblePositions[start][0];
    var y1 = possiblePositions[start][1];
    var x2 = possiblePositions[end][0];
    var y2 = possiblePositions[end][1];
    
    interfacecxt.beginPath();
    
    interfacecxt.moveTo(x1-offset,y1-3*offset);
    interfacecxt.lineTo(x1+offset, y1-3*offset);
    interfacecxt.lineTo(x1+offset,y1-4*offset);
    interfacecxt.lineTo(x1+1.5*offset,y1-4*offset);
    interfacecxt.lineTo(x1,y1-5*offset);
    interfacecxt.lineTo(x1-1.5*offset,y1-4*offset);
    interfacecxt.lineTo(x1-offset,y1-4*offset);
    interfacecxt.lineTo(x1-offset,y1-3*offset);
    
    interfacecxt.fillStyle = arrowInnerColor;
    interfacecxt.fill();
    interfacecxt.strokeStyle = arrowOutlineColor;
    interfacecxt.stroke();
    interfacecxt.closePath();
}

function drawDownArrow(start, end){
	var offset = interfaceSideLength/60;
	
    var x1 = possiblePositions[start][0];
    var y1 = possiblePositions[start][1];
    var x2 = possiblePositions[end][0];
    var y2 = possiblePositions[end][1];
    
    interfacecxt.beginPath();
    
    interfacecxt.moveTo(x1+1*offset,y1+3*offset);
    interfacecxt.lineTo(x1-1*offset, y1+3*offset);
    interfacecxt.lineTo(x1-1*offset,y1+4*offset);
    interfacecxt.lineTo(x1-15,y1+4*offset);
    interfacecxt.lineTo(x1,y1+5*offset);
    interfacecxt.lineTo(x1+15,y1+4*offset);
    interfacecxt.lineTo(x1+1*offset,y1+4*offset);
    interfacecxt.lineTo(x1+1*offset,y1+3*offset);
    
    interfacecxt.fillStyle = arrowInnerColor;
    interfacecxt.fill();
    interfacecxt.strokeStyle = arrowOutlineColor;
    interfacecxt.stroke();
    interfacecxt.closePath();
}

function drawRightArrow(start, end){
	var offset = interfaceSideLength/60;

    var x1 = possiblePositions[start][0];
    var y1 = possiblePositions[start][1];
    var x2 = possiblePositions[end][0];
    var y2 = possiblePositions[end][1];
    
    interfacecxt.beginPath();
    
    interfacecxt.moveTo(x1+3*offset,y1+1*offset);
    interfacecxt.lineTo(x1+3*offset, y1-1*offset);
    interfacecxt.lineTo(x1+4*offset,y1-1*offset);
    interfacecxt.lineTo(x1+4*offset,y1-15);
    interfacecxt.lineTo(x1+5*offset,y1);
    interfacecxt.lineTo(x1+4*offset,y1+15);
    interfacecxt.lineTo(x1+4*offset,y1+1*offset);
    interfacecxt.lineTo(x1+3*offset,y1+1*offset);
    
    interfacecxt.fillStyle = arrowInnerColor;
    interfacecxt.fill();
    interfacecxt.strokeStyle = arrowOutlineColor;
    interfacecxt.stroke();
    interfacecxt.closePath();
}

function drawLeftArrow(start, end){
	var offset = interfaceSideLength/60;

    var x1 = possiblePositions[start][0];
    var y1 = possiblePositions[start][1];
    var x2 = possiblePositions[end][0];
    var y2 = possiblePositions[end][1];
    
    interfacecxt.beginPath();
    
    interfacecxt.moveTo(x1-3*offset,y1-1*offset);
    interfacecxt.lineTo(x1-3*offset, y1+1*offset);
    interfacecxt.lineTo(x1-4*offset,y1+1*offset);
    interfacecxt.lineTo(x1-4*offset,y1+15);
    interfacecxt.lineTo(x1-5*offset,y1);
    interfacecxt.lineTo(x1-4*offset,y1-15);
    interfacecxt.lineTo(x1-4*offset,y1-1*offset);
    interfacecxt.lineTo(x1-3*offset,y1-1*offset);
    
    interfacecxt.fillStyle = arrowInnerColor;
    interfacecxt.fill();
    interfacecxt.strokeStyle = arrowOutlineColor;
    interfacecxt.stroke();
    interfacecxt.closePath();
}


function drawArrowsPhaseTwo(){
    if(playerTurn ==PLAYER1){
    for(i = 0; i < possiblePositions.length; i++){
            if(P1PieceLocations[i]){
                var emptyNeighbors = findEmptyNeighbors(i);
                if(emptyNeighbors != null){
                    for(j = 0; j < emptyNeighbors.length; j++){
                        drawArrow(i, emptyNeighbors[j]);
                    }
                }
            }
        }
    }
    
    else{
    for(i = 0; i < possiblePositions.length; i++){
            if(P2PieceLocations[i]){
                var emptyNeighbors = findEmptyNeighbors(i);
                if(emptyNeighbors != null){
                    for(j = 0; j < emptyNeighbors.length; j++){
                        drawArrow(i, emptyNeighbors[j]);
                    }
                }
            }
        }
    }
}

function drawDot(x, y, highlight){ 
	var radius = interfaceDotRadius;
	interfacecxt.beginPath();
	if (highlight === undefined){
		interfacecxt.fillStyle = "black";
		interfacecxt.strokeStyle = "black";
		interfacecxt.lineWidth = 5;
	}
	else {
		interfacecxt.fillStyle = neutralStateColor;
		interfacecxt.strokeStyle = neutralStateColor;
		interfacecxt.lineWidth = 7;
	}
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
	drawTurnCounter(interfaceWidth-200, 100);
	
	
	// redraw pieces that are supposed to be on the board.  if nothing's there, draw a dot
	for (i = 0; i < possiblePositions.length; i++){
		posX = possiblePositions[i][0];
		posY = possiblePositions[i][1];
		if (P1PieceLocations[i]){
			if (gamePhase === FLYINGPHASE && playerTurn === PLAYER1 && selectedPieceIndex === null){
				drawP1Piece(posX, posY, "highlight");
			}
			else if (gamePhase === FLYINGPHASE && playerTurn === PLAYER1 && selectedPieceIndex === i){
				drawP1Piece(posX, posY, "highlight");
			}
			else{
				drawP1Piece(posX, posY);
			}
		}
		else if (P2PieceLocations[i]){
			if (gamePhase === FLYINGPHASE && playerTurn === PLAYER2 && selectedPieceIndex === null){
				drawP2Piece(posX, posY, "highlight");
			}
			else if (gamePhase === FLYINGPHASE && playerTurn === PLAYER2 && selectedPieceIndex === i){
				drawP2Piece(posX, posY, "highlight");
			}
			else{
				drawP2Piece(posX, posY);
			}
		}
		else{
			if (gamePhase === FLYINGPHASE && selectedPieceIndex !== null){
				drawDot(possiblePositions[i][0], possiblePositions[i][1], "highlight");
			}
			else{
				drawDot(possiblePositions[i][0], possiblePositions[i][1]);
			}
		}
	}
	
	if (gamePhase===DELETEPHASE){
		drawDeleteIndicator(30, 30);
	}
	else if (gamePhase===SLIDINGPHASE){
		drawArrowsPhaseTwo();
	}
	else if (gamePhase===GAMEOVER){
		drawGameOverIndicator(30, 150);
	}
}

function nextPhase(){
	// returns the game phase of the next turn based on the state of the board and pieces left
	if (playerTurn === PLAYER1){
		if (P1PiecesToPlace === 0) {
			if (P1PiecesOnBoard === 3){
				return FLYINGPHASE;
			}
			else if (P1PiecesOnBoard > 3){
				return SLIDINGPHASE;
			}
			else if (P1PiecesOnBoard < 3){
				return GAMEOVER;
			}
		}
		else{
			return PLACINGPHASE;
		}
	} 
	else if (playerTurn === PLAYER2){
		if (P2PiecesToPlace === 0) {
			if (P2PiecesOnBoard === 3){
				return FLYINGPHASE;
			}
			else if (P2PiecesOnBoard > 3){
				return SLIDINGPHASE;
			}
			else if (P2PiecesOnBoard < 3){
				return GAMEOVER;
			}
		}
		else{
			return PLACINGPHASE;
		}
	}
}

function clickedArrow(mouseX, mouseY, i, direction){
	// checks if an arrow was clicked
	// this function assumes that if an index and direction are specified,
	// than the index has an arrow in that direction.
	var offset = interfaceSideLength/60;
	var x1 = possiblePositions[i][0];
	var y1 = possiblePositions[i][1];
	
	switch(direction){
	case "top":
		return (mouseX > x1-offset && mouseX < x1+offset && mouseY > y1-5*offset && mouseY < y1-3*offset);
		break;
	case "bottom":
		return (mouseX > x1-offset && mouseX < x1+offset && mouseY > y1+3*offset && mouseY < y1+5*offset);
		break;
	case "right":
		return (mouseX > x1+3*offset && mouseX < x1+5*offset && mouseY > y1-offset && mouseY < y1+offset);
		break;
	case "left":
		return (mouseX > x1-5*offset && mouseX < x1-3*offset && mouseY > y1-offset && mouseY < y1+offset);
		break;
	default:
		throw new Error("Direction must be top, bottom, right or left")
	}
	
}

function placingPhaseClickFunction(xPos, yPos){
		
	var radius = interfaceDotRadius;
	
	for (i = 0; i < possiblePositions.length; i++){
		dotXPos = possiblePositions[i][0];
		dotYPos = possiblePositions[i][1];
		PieceInPosition = P1PieceLocations[i] || P2PieceLocations[i];
		
		if (xPos <= dotXPos + radius*2 && xPos >= dotXPos - radius*2 && yPos <= dotYPos + radius*2 
		&& yPos >= dotYPos - radius*2 && !PieceInPosition){
			if(playerTurn === PLAYER1){
				P1PieceLocations[i] = true;
				P1PiecesToPlace -= 1;
				P1PiecesOnBoard += 1;
				if (makesThree(i, 1)){
					gamePhase = DELETEPHASE;
				}
			}
			else if(playerTurn === PLAYER2){
				P2PieceLocations[i] = true;
				P2PiecesToPlace -= 1;
				P2PiecesOnBoard += 1;
				if (makesThree(i, 2)){
					gamePhase = DELETEPHASE
				}
			}
			if (gamePhase !== DELETEPHASE){
				playerTurn = !playerTurn;
				gamePhase = nextPhase();
			}
		}
	}
	drawInterface()

}

function slidingPhaseClickFunction(xPos, yPos){
		
	var radius = interfaceDotRadius;
	var successfulClick = false;
	
	for (posIndex = 0; posIndex < possiblePositions.length; posIndex++){
		// check all locations on the board
		
		// ignore immediately if the space is empty or doesn't belong to the right player
		if (emptySpace(posIndex)){
			continue;
		}
		if (playerTurn === PLAYER1 && P2PieceLocations[posIndex]){
			continue;
		}
		if (playerTurn === PLAYER2 && P1PieceLocations[posIndex]){
			continue;
		}
	
		// piece position information and neighbor information
		dotXPos = possiblePositions[posIndex][0];
		dotYPos = possiblePositions[posIndex][1];
		topIndex = topNeighborIndex(posIndex);
		bottomIndex = bottomNeighborIndex(posIndex);
		rightIndex = rightNeighborIndex(posIndex);
		leftIndex = leftNeighborIndex(posIndex);
		
		// split according to player
		if (playerTurn === PLAYER1){
			// check the four directions for arrows and whether they have been clicked
			// if arrow has been clicked the piece will move in that direction
			if (topIndex !== null && emptySpace(topIndex) && clickedArrow(xPos, yPos, posIndex, "top")){
				P1PieceLocations[posIndex] = false;
				P1PieceLocations[topIndex] = true;
				//animate(posIndex, topIndex);
				if (makesThree(topIndex, 1)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
			if (bottomIndex !== null && emptySpace(bottomIndex) && clickedArrow(xPos, yPos, posIndex, "bottom")){
				P1PieceLocations[posIndex] = false;
				P1PieceLocations[bottomIndex] = true;
				if (makesThree(bottomIndex, 1)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
			if (rightIndex !== null && emptySpace(rightIndex) && clickedArrow(xPos, yPos, posIndex, "right")){
				P1PieceLocations[posIndex] = false;
				P1PieceLocations[rightIndex] = true;
				if (makesThree(rightIndex, 1)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
			if (leftIndex !== null && emptySpace(leftIndex) && clickedArrow(xPos, yPos, posIndex, "left")){
				P1PieceLocations[posIndex] = false;
				P1PieceLocations[leftIndex] = true;
				if (makesThree(leftIndex, 1)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
		}
		else if(playerTurn === PLAYER2){
			// check the four directions for arrows and whether they have been clicked
			// if arrow has been clicked the piece will move in that direction
			if (topIndex !== null && emptySpace(topIndex) && clickedArrow(xPos, yPos, posIndex, "top")){
				P2PieceLocations[posIndex] = false;
				P2PieceLocations[topIndex] = true;
				if (makesThree(topIndex, 2)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
			if (bottomIndex !== null && emptySpace(bottomIndex) && clickedArrow(xPos, yPos, posIndex, "bottom")){
				P2PieceLocations[posIndex] = false;
				P2PieceLocations[bottomIndex] = true;
				if (makesThree(bottomIndex, 2)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
			if (rightIndex !== null && emptySpace(rightIndex) && clickedArrow(xPos, yPos, posIndex, "right")){
				P2PieceLocations[posIndex] = false;
				P2PieceLocations[rightIndex] = true;
				if (makesThree(rightIndex, 2)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
			if (leftIndex !== null && emptySpace(leftIndex) && clickedArrow(xPos, yPos, posIndex, "left")){
				P2PieceLocations[posIndex] = false;
				P2PieceLocations[leftIndex] = true;
				if (makesThree(leftIndex, 2)){
					gamePhase = DELETEPHASE;
				}
				successfulClick = true;
			}
		}
	}
	if (successfulClick && gamePhase !== DELETEPHASE){
		playerTurn = !playerTurn;
		gamePhase = nextPhase();
	}
	drawInterface()

}

function flyingPhaseClickFunction1(xPos, yPos){
		
	var radius = interfaceSideLength/20;
	
	// set PieceLocations according the player's turn
	var PieceLocations;
	if (playerTurn === PLAYER1){
		PieceLocations = P1PieceLocations;
	}
	else if (playerTurn === PLAYER2){
		PieceLocations = P2PieceLocations;
	}
	
	for (i = 0; i < possiblePositions.length; i++){
		dotXPos = possiblePositions[i][0];
		dotYPos = possiblePositions[i][1];
		
		if (xPos <= dotXPos + radius*1.5 && xPos >= dotXPos - radius*1.5 && yPos <= dotYPos + radius*1.5 
		&& yPos >= dotYPos - radius*1.5 && PieceLocations[i]){
			selectedPieceIndex = i; 
			
			// redraw the pieces to show that you selected it
		}
	}
	drawInterface();

}

function flyingPhaseClickFunction2(xPos, yPos){
		
	var radius = interfaceSideLength/20;
	
	for (i = 0; i < possiblePositions.length; i++){
		dotXPos = possiblePositions[i][0];
		dotYPos = possiblePositions[i][1];
		PieceInPosition = P1PieceLocations[i] || P2PieceLocations[i];
		
		if (xPos <= dotXPos + radius*1.5 && xPos >= dotXPos - radius*1.5 && yPos <= dotYPos + radius*1.5 
		&& yPos >= dotYPos - radius*1.5 && !PieceInPosition){
			if(playerTurn === PLAYER1){
				P1PieceLocations[i] = true;
				P1PieceLocations[selectedPieceIndex] = false;
				selectedPieceIndex = null;
				if (makesThree(i, 1)){
					gamePhase = DELETEPHASE;
				}
			}
			else if(playerTurn === PLAYER2){
				P2PieceLocations[i] = true;
				P2PieceLocations[selectedPieceIndex] = false;
				selectedPieceIndex = null;
				if (makesThree(i, 2)){
					gamePhase = DELETEPHASE;
				}
			}
			if (gamePhase !== DELETEPHASE){
				playerTurn = !playerTurn;
				gamePhase = nextPhase();
			}
		}
	}
	drawInterface();

}

function deletePhaseClickFunction(xPos, yPos){
		
	var radius = interfaceSideLength/20;
	
	for (i = 0; i < possiblePositions.length; i++){
		dotXPos = possiblePositions[i][0];
		dotYPos = possiblePositions[i][1];
		OpposingPieceInPosition = P1PieceLocations[i] || P2PieceLocations[i];
		if (playerTurn === PLAYER1){
			OpposingPieceInPosition = P2PieceLocations[i];
		}
		else if (playerTurn === PLAYER2){
			OpposingPieceInPosition = P1PieceLocations[i];
		}
		
		if (xPos <= dotXPos + radius && xPos >= dotXPos - radius && yPos <= dotYPos + radius 
		&& yPos >= dotYPos - radius && OpposingPieceInPosition){
			if(playerTurn === PLAYER1){
				P2PieceLocations[i] = false;
				P2PiecesOnBoard -= 1;
			}
			else if(playerTurn === PLAYER2){
				P1PieceLocations[i] = false;
				P1PiecesOnBoard -= 1;
			}
		playerTurn = !playerTurn;
		gamePhase = nextPhase(); 
		}
	}
	drawInterface();
}

/**
This is the function you will use to register clicks. The xPos and yPos are the coordinates of the mouse clicks, when the mouse is clicked.
*/
function clickFunction(xPos, yPos) {
	switch (gamePhase){
	case DELETEPHASE:
		deletePhaseClickFunction(xPos, yPos);
		break;
	case PLACINGPHASE:
		placingPhaseClickFunction(xPos, yPos);
		break;
	case SLIDINGPHASE:
		slidingPhaseClickFunction(xPos, yPos);
		break;
	case FLYINGPHASE:
		if (selectedPieceIndex === null){
			flyingPhaseClickFunction1(xPos, yPos);
		} else {
			flyingPhaseClickFunction2(xPos, yPos);
		}
		break;
	default:
		throw new Error("game has entered unknown phase.  please restart");
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