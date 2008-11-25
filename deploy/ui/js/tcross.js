const NONEXIST = '';
const EMPTY = '+';
var pieceToText = ['1', '2', '3', '4', 'B', 'A', 'O', 'O', 'O'];

var defaultBoard = getRandomBoard();
var currentBoard;

var width = 9;
var height = 4;

// x's mark possible clickable positions:
//   0 1 2 3 4 5 6 7 8
// 0 - - x x - x x - -
// 1 x x - - - - - x x
// 2 x x - - - - - x x
// 3 - - x x - x x - -
var clickables = [[1,1], [2,1], [0,2], [0,3], [3,5], [3,6], [1,7], [2,7], 
                  [1,0], [2,0], [3,2], [3,3], [0,5], [0,6], [1,8], [2,8]];
			  
// sloppy
var nonExistants = [0*width+0, 0*width+1, 0*width+4, 0*width+7, 0*width+8, 3*width+0, 
					3*width+1, 3*width+4, 3*width+7, 3*width+8]

// used for coloring the table cells
var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];

var nextMoves = [];
var lastMove = -1;

var options = {"circle": 0, "binArt": 0, "dots": 1, "exactSol": 1};

$(document).ready(function(){
	var game = GCWeb.newPuzzleGame("tcross", width, height, {
        onNextValuesReceived: onNextValuesReceived,
        isValidMove: isValidMove,
        onExecutingMove: onExecutingMove,
        updateMoveValues: updateMoveValues, 
        clearMoveValues: clearMoveValues,
        getPositionValue: getPositionValue,
        getNextMoveValues: getNextMoveValues,
		options: options
    });
	
	// handle options
	getSelectedOptions();
	if (!options["circle"])
		for (piece = 0; piece < 4; piece++)
			defaultBoard[piece] = -1;
	if (!options["binArt"])
		for (piece = 4; piece < 6; piece++)
			defaultBoard[piece] = -1;
	if (!options["dots"])
		for (piece = 6; piece < 9; piece++)
			defaultBoard[piece] = -1;	
	
	game.loadBoard(getBoardString(defaultBoard));
	currentBoard = defaultBoard;
	
	// loop through the possible clickable positions
	for(i = 0; i < clickables.length; i++) {
		$('#cell-' + clickables[i][0] + '-' + clickables[i][1]).click(function(row, col){
            return function(){
				// find the move information that we stored and attempt to execute the move
				for (j = 0; j < nextMoves.length; j++) {
					if ((nextMoves[j].move == 'R' && col < 2) ||
						(nextMoves[j].move == 'L' && col > 6) ||
						(nextMoves[j].move == 'D' && ((row < 1 && col < 4) || (row > 2 && col > 4))) ||
						(nextMoves[j].move == 'U' && ((row < 1 && col > 4) || (row > 2 && col < 4)))) {
						game.doMove(nextMoves[j]);
						break; // must break because nextMoves is changed after call to doMove
					}							
				}
			}
		}(clickables[i][0], clickables[i][1]));
	}
	// temp
	displayBoard();
	//onExecutingMove(nextMoves[0]); // temp
});

// check to see whether the current move is valid
function isValidMove(moveInfo) {
	horizPos = currentBoard[9];
	vertPos =  currentBoard[10];
	move = moveInfo.move;
    return ((horizPos >= 0 && move == 'L') ||
		   (horizPos <= 0 && move == 'R') ||
		   (vertPos == 0 && move == 'D') ||
		   (vertPos == 1 && move == 'U'));
}


// called when doMove executes successfully
function onExecutingMove(moveInfo){
    // update our own state
    lastMove = moveInfo.move;	
	boardString = moveInfo.board;
	var i = 0; // string index
    for (piece = 0; piece < 9; piece++) { // loop through pieces 0 to 8
		currentBoard[piece] = parseInt(boardString.substring(i,i+3));
		i += 3;
	}

    currentBoard[9] = parseInt(boardString.substring(i,i+3)); // update horizPos
    i += 3;
	// update vertPos
    currentBoard[10] = 0;
    if (parseInt(boardString.charAt(i)))
        currentBoard[10] = 1;

	// update the graphical display
	displayBoard();
}

// called on intiial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    nextMoves = json;
}

// colors the board based on move values
function updateMoveValues(nextMoves){
    // reset everything first
    clearMoveValues();
    
    // set background color to new values
    for(i = 0; i < nextMoves.length; i++) {
        move = nextMoves[i].move;
        if (move == 'R') {
			for (row = 1; row < 3; row++)
				for (col = 0; col < 2; col++)
					$('#cell-' + row + '-' + col).addClass(moveValueClasses[nextMoves[i].value-1]);
		}
        else if (move == 'L') {
			for (row = 1; row < 3; row++)
				for (col = 7; col < 9; col++)
					$('#cell-' + row + '-' + col).addClass(moveValueClasses[nextMoves[i].value-1]);
		}
        else if (move == 'U') {
			// top right pieces
			$('#cell-0-5').addClass(moveValueClasses[nextMoves[i].value-1]);
			$('#cell-0-6').addClass(moveValueClasses[nextMoves[i].value-1]);
			// bottom left pieces
			$('#cell-3-2').addClass(moveValueClasses[nextMoves[i].value-1]);
			$('#cell-3-3').addClass(moveValueClasses[nextMoves[i].value-1]);
		}
        else {
            // top left pieces
			$('#cell-0-2').addClass(moveValueClasses[nextMoves[i].value-1]);
			$('#cell-0-3').addClass(moveValueClasses[nextMoves[i].value-1]);
			// bottom right pieces
			$('#cell-3-5').addClass(moveValueClasses[nextMoves[i].value-1]);
			$('#cell-3-6').addClass(moveValueClasses[nextMoves[i].value-1]);
		}
    }
}

// remove all indicators of move values
function clearMoveValues(){
	for (i = 0; i < clickables.length; i++)
		$('#cell-' + clickables[i][0] + '-' + clickables[i][1]).removeClass();
}

function getBoardString(board) {
	var str = '';
	for (piece = 0; piece < 9; piece++) {
		if (board[piece] < 10 && board[piece] >= 0)
			str += ' '; // add an extra space for 1-digit numbers that are non-negative
		str += board[piece] + ' ';
	}
	if (board[9] >= 0) // if horizPos is not -1
		str += ' '; // add an extra space because no negative sign
	str += board[9] + ' ';
	str += board[10];
	return str;
}

function getSelectedOptions() { 
     for (i = 0; i < document.solveform.solveoptions.length; i++)
        if (document.solveform.solveoptions[i].checked)
            options[i] = document.solveform.solveoptions[i].value; 
}

function getRandomBoard() {
	var gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // set horizPos and vertPos to 0
	
	var validPositions = [2, 3, 10, 11, 12, 13, 14, 15, 16, 
						  19, 20, 21, 22, 23, 24, 25, 32, 33]; // based on horizPos and vertPos being 0

	for (piece = 0; piece < 9; piece++) {
		// generate a random number from 0 to number of valid positions left
		var randomPosIndex = Math.floor(Math.random() * validPositions.length); 
		
		gameboard[piece] = validPositions[randomPosIndex];
		
		// remove the position chosen from the board so it isn't chosen again
		validPositions.splice(randomPosIndex, 1);
	}
	
	return gameboard;
}

function displayBoard() {
	// VERY sloppy way of handling nonexistants for now (BAD)
	updatedNonExistants = nonExistants.slice();		

	var vertPos = currentBoard[10];
	var notVertPos = 0;
	if (vertPos == 0)
		notVertPos = 1;
	updatedNonExistants.push(width * 3 * vertPos + 5);
	updatedNonExistants.push(width * 3 * vertPos + 6);
	updatedNonExistants.push(width * 3 * notVertPos + 2);
	updatedNonExistants.push(width * 3 * notVertPos + 3);
	
	var horizPos = currentBoard[9];
	if (horizPos > -1) {
		updatedNonExistants.push(width * 1 + 0);
		updatedNonExistants.push(width * 2 + 0);
	}
	if (horizPos < 1) {
		updatedNonExistants.push(width * 1 + 8);
		updatedNonExistants.push(width * 2 + 8);
	}
	if (Math.abs(horizPos) == 1) {
		updatedNonExistants.push(width * 1 + 1 + 6 * (horizPos == -1));
		updatedNonExistants.push(width * 2 + 1 + 6 * (horizPos == -1));
	}
	// End sloppy
	
	
    for (row = 0; row < height; row++) { 
        for (col = 0; col < width; col++) {  
			piece = currentBoard.slice(0, 9).indexOf(row * width + col); 
			if (piece >= 0) // if the current row-col has a piece 
				$('#cell-'+row+'-'+col).text(pieceToText[piece]); 
			else if (updatedNonExistants.indexOf(row * width + col) >= 0)
				$('#cell-'+row+'-'+col).text(NONEXIST);
			else
				$('#cell-'+row+'-'+col).text(EMPTY);
		}
    } 
}


// debugging
function getPositionValue(position, onValueReceived){
    onValueReceived({
        "board": position, 
        "move": "L", 
        "remoteness": "5",
        "value": 3
    });
    return;
}

function getNextMoveValues(position, onMoveValuesReceived){
	var retval = [];
	var moves = '';
	
	// get the positionBoard
	var positionBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var i = 0; // string index
    for (piece = 0; piece < 9; piece++) { // loop through pieces 0 to 8
		positionBoard[piece] = parseInt(position.substring(i,i+3));
		i += 3;
	}
	
    positionBoard[9] = parseInt(position.substring(i,i+3)); // update horizPos
		
    i += 3;
	// update vertPos
    positionBoard[10] = 0;
    if (parseInt(position.charAt(i)))
        positionBoard[10] = 1;
	
	// generateMoves
	if (positionBoard[9] > -1)
        moves += 'L';
    if (positionBoard[9] < 1)
        moves += 'R';         
    if (positionBoard[10])
        moves += 'U';
    else
		moves += 'D';
	
	// doMove
	for (i = 0; i <  moves.length; i++) { 
		var newBoard = positionBoard.slice(0);
		var horizontalPos = newBoard[9];
		var verticalPos = newBoard[10];
		if (moves.charAt(i) == 'L') {
			for (p = 0; p < 9; p++)
				if (positionBoard[p] > 8 && positionBoard[p] < 27)
					newBoard[p] -= 1;
			horizontalPos -= 1;
		}
		else if (moves.charAt(i) == 'R') {
			for (p = 0; p < 9; p++)
				if (positionBoard[p] > 8 && positionBoard[p] < 27)
					newBoard[p] += 1;
			horizontalPos += 1;
		}
		else if (moves.charAt(i) == 'U') {
			for (p = 0; p < 9; p++) {
				if ((((positionBoard[p] - 2) % 9) == 0) || (((positionBoard[p] - 3) % 9) == 0))
					newBoard[p] -= 9;
				else if ((((positionBoard[p] - 5) % 9) == 0) || (((positionBoard[p] - 6) % 9) == 0))
					newBoard[p] += 9;
			}
			verticalPos = 0;
		}
		else if (moves.charAt(i) == 'D') {
			for (p = 0; p < 9; p++) {
				if ((((positionBoard[p] - 2) % 9) == 0) || (((positionBoard[p] - 3) % 9) == 0))
					newBoard[p] += 9;
				else if ((((positionBoard[p] - 5) % 9) == 0) || (((positionBoard[p] - 6) % 9) == 0))
					newBoard[p] -= 9;
			}
			verticalPos = 1;
		}
		newBoard[9] = horizontalPos;
		newBoard[10] = verticalPos;
		retval.push({"board": getBoardString(newBoard), "move": moves.charAt(i), "remoteness": 4, "status": "OK", "value": 3});
	}

	onMoveValuesReceived(retval);
}