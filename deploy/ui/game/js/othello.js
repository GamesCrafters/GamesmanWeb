var theGame;
var options;
$(document).ready(function() {
	options = $('#game-options').serializeArray();
	
	if (window.addEventListener) {
		window.addEventListener('load', main, false);
	}
});

var UPDATE_FREQ_MS = 1000 / 20.0;

var WHITE_COLOR = "rgb(255,255,255)";
var BLACK_COLOR = "rgb(0,0,0)";
var GRAY_COLOR = "rgb(100,100,100)";
var NEUTRAL_COLOR = "rgb(0,255,255)";
var WIN_COLOR = "rgb(0,255,0)";
var TIE_COLOR = "rgb(255,255, 51)";
var LOSE_COLOR = "rgb(139,0,0)";
var COLOR_DARK_GREEN = "rgb(0,40,0)";

var PLAYER_X = "X";
var COLOR_X = BLACK_COLOR;
var PLAYER_O = "O";
var COLOR_O = WHITE_COLOR;
var emptySpace = " ";

var FELT_BG_IMAGE = new Image(); 
var FELT_BG_PATH = "game/images/othello/felt.jpg"; 
FELT_BG_IMAGE.src = FELT_BG_PATH;

var FELT_BG_FULL = new Image();
var FELT_BG_FULL_PATH = "game/images/othello/feltbg.png";
FELT_BG_FULL.src = FELT_BG_FULL_PATH;

var PIECE_WHITE_IMAGE = new Image();
var PIECE_WHITE_PATH = "game/images/othello/whitepiece3.png";
PIECE_WHITE_IMAGE.src = PIECE_WHITE_PATH;

var PIECE_BLACK_IMAGE = new Image();
var PIECE_BLACK_PATH = "game/images/othello/blackpiece3.png";
PIECE_BLACK_IMAGE.src = PIECE_BLACK_PATH;

var RECESS_IMAGE = new Image();
var RECESS_PATH = "game/images/othello/rec2.png";
RECESS_IMAGE.src = RECESS_PATH;

var INDEX_SIZE = 0;
var INDEX_SKIN = 1;
var INDEX_VALUE_MOVES = 2;
var INDEX_AUTO_PASS = 3;
var INDEX_BLACK_PLAYER = 4;
var INDEX_BLACK_NAME = 5;
var INDEX_WHITE_PLAYER = 6;
var INDEX_WHITE_NAME = 7;

var ANIMATION_DELAY_MS = 1100;

function main(ev) {
	theGame = new Game();
	theGame.startGame();
}

function handleClick(ev) {
	theGame.handleClick(ev);
}

function update() {
	theGame.updateGame();
}

function animationEnded() {
	theGame.stopAnimating();
}

function getY( oElement ) {
	var iReturnValue = 0;
	while(oElement != null ) {
		iReturnValue += oElement.offsetTop;
		oElement = oElement.offsetParent;
	}
	return iReturnValue;
}

function getX( oElement ) {
	var iReturnValue = 0;
	while(oElement != null ) {
		iReturnValue += oElement.offsetLeft;
		oElement = oElement.offsetParent;
	}
	return iReturnValue;
}

function updateOptions() {
	options = getOptions();
}

function undoButtonClicked() {
	theGame.undoLastMove();
}

function undoAnimationEnded() {
	theGame.endUndoAnimation();
}

function Game() {
	
	var boardWidth = 4;
	var boardHeight = 4;
	
	var colorBarHeight = 10;
	
	var myBoard;
	var myColorBar;
	var player1Turn = true;
	var possibleMoves;
	
	var animating = false;
	var myMoveGenerator;
	
	var winningMessage = "";
	var winningMessageBottom = "";
	var lastPlayerPassed = false;
	
	var legalLetters = ["A","B","C","D","E","F","G","H"];
	var legalIndeces = [];
	
	this.handleMouseMove = handleMouseMove;
	this.getNextMoveValues = getNextMoveValues;
	this.updateGame = updateGame;
	this.startGame = startGame;
	this.handleClick = handleClick;
	this.stopAnimating = stopAnimating;
	this.isAnimating = isAnimating;
	this.endCurrentTurn = endCurrentTurn;
	this.displayCurrentPlayerTurn = displayCurrentPlayerTurn;
	this.playComputerMoves = playComputerMoves;
	this.chooseAppropriateMove = chooseAppropriateMove;
	this.endGame = endGame;
	this.alertTurnSkip = alertTurnSkip;
	this.undoLastMove = undoLastMove;
	this.endUndoAnimation = endUndoAnimation;
	
	function handleMouseMove(ev) {
		var canvas = document.getElementById('canvas');
		myBoard.setMousePos(ev.layerX - 5 - getX(canvas), ev.layerY - 5 - getY(canvas)); //subtract 5 for mouse point
	}
	
	function startGame() {
		myBoard = new Board(boardWidth, boardHeight, this);
		myMoveGenerator = new MoveGenerator();
		myColorBar = new ColorBar(boardWidth * myBoard.getSpaceSide(), colorBarHeight);

		for (var i = 0; i < boardHeight; i++) {
			legalIndeces[i] = "" + (1 + i); // (boardHeight - i);
		}
		
		var ctx = document.getElementById('canvas').getContext('2d');
		// ctx.clearRect(0,0,500,500);
        // ctx.fillStyle = BLACK_COLOR;
        // ctx.fillRect(0, 0, myBoard.getSpaceSide() * boardWidth, myBoard.getSpaceSide() * boardHeight);
		
		if (window.addEventListener) {
			window.addEventListener('click', handleClick, false);
			window.addEventListener('mousemove', handleMouseMove, false);
		}
		//myBoard.setPossibleMoves(getNextMoveValues(myBoard.toString(), player1Turn));
		queryServer();
		updateGame(player1Turn);
		playComputerMoves();
	}
	
	function getNextMoveValues(boardState, isP1Turn) {
		// var rtn = [];
		// var newBoard = "";
		
		// for (var i = 0; i < boardState.length; i++) {
			// var rnd = Math.floor(Math.random()*3);
			// if (rnd == 0) {
				// newBoard += '_';
			// } else if (rnd == 1) {
				// newBoard += 'B';
			// } else {
				// newBoard += 'W';
			// }
		// }
		
		
		// for (var i = 0; i < boardWidth; i++) {
			// for (var j = 0; j < boardHeight; j++) {
				// if (boardState[i * boardHeight + j] == '_') {
					// var randomNumber = Math.floor(Math.random()*3);
					// if (randomNumber == 0) {
						// randomVal = 'lose';
					// } else if (randomNumber == 1) {
						// randomVal = 'win';
					// } else {
						// randomVal = 'tie';
					// }
					// rtn.push({move:legalLetters[i] + legalIndeces[j], value : randomVal, board : newBoard});
				// }
			// }
		// }
		// return rtn;
		return myMoveGenerator.getNextMoveValues(boardState, isP1Turn);
	}
	
	function updateGame() {
		updateOptions();
		playComputerMoves();
		myBoard.update(player1Turn);
		myColorBar.update(UPDATE_FREQ_MS);
		myColorBar.draw(0, boardHeight * myBoard.getSpaceSide());
		displayCurrentPlayerTurn();

		setTimeout('update()', UPDATE_FREQ_MS);
	}
	
	function displayCurrentPlayerTurn() {
		var displayStr = "";
		
		if (player1Turn) {
			displayStr += options[INDEX_BLACK_NAME].value;
		} else {
			displayStr += options[INDEX_WHITE_NAME].value;
		} 
		
		displayStr += "'s turn";
		
		if (player1Turn) {
			displayStr += " (BLACK)";
		} else {
			displayStr += " (WHITE)";
		}
		
		if (winningMessage != "") {
			displayStr = winningMessage;
		}
	
		var ctx = document.getElementById('canvas').getContext('2d');
		ctx.fillStyle = WHITE_COLOR;
		ctx.font = "20pt Arial";
		ctx.textAlign = "center";
		ctx.fillText(displayStr, boardWidth * myBoard.getSpaceSide() / 2.0, boardHeight * myBoard.getSpaceSide() + 50);	
		
		if (winningMessage != "") {
			ctx.fillText(winningMessageBottom, boardWidth * myBoard.getSpaceSide() / 2.0, boardHeight * myBoard.getSpaceSide() + 75);
		}
	}
	
	function handleClick(ev) {
		var ctx = document.getElementById('canvas').getContext('2d');
		var canvas = document.getElementById('canvas');

		if (!animating && myBoard.attemptMove(player1Turn, ev.layerX - 5 - getX(canvas), ev.layerY - 5 - getY(canvas))) { //get mouse point
			possibleMoves = null;
			animating = true;
			myColorBar.animateToBoard(myBoard.getRepresentation());
			setTimeout('animationEnded()', ANIMATION_DELAY_MS);
		}
	}
	
	function endCurrentTurn() {
		player1Turn = !player1Turn;
		queryServer();
		playComputerMoves();
	}
	
	function queryServer() {
		console.log(myBoard.toString());
		possibleMoves = getNextMoveValues(myBoard.toString(), player1Turn);
		myBoard.setPossibleMoves(possibleMoves);
		console.log(possibleMoves);
		console.log(possibleMoves);
		
		if (possibleMoves.length == 0) {
			endGame();
		} else if (possibleMoves[0].move == "P" || possibleMoves[0].move == "pass") {
			if (lastPlayerPassed) {
				endGame();
				return;
			} else if (options[INDEX_AUTO_PASS].value == "false") {
				lastPlayerPassed = true;
				alertTurnSkip();
			}
			endCurrentTurn();
		} else {
			lastPlayerPassed = false;
		}
	}
	
	function endGame() {
		var XCount = myBoard.getXPieces();
		var OCount = myBoard.getOPieces();
		endAlert = "";
		if (XCount == OCount) {
			endAlert += options[INDEX_BLACK_NAME].value + " and " + options[INDEX_WHITE_NAME].value;
			winningMessage = endAlert;
			winningMessageBottom = " have tied.";
			endAlert += winningMessageBottom;
		} else if (XCount > OCount) {
			endAlert += options[INDEX_BLACK_NAME].value + " has won!";
			winningMessage = endAlert;
		} else {
			endAlert += options[INDEX_WHITE_NAME].value + " has won!";
			winningMessage = endAlert;
		}
		
		alert(endAlert);
	}
	
	function alertTurnSkip() {
		var msg = "";
		if (player1Turn) {
			msg += options[INDEX_BLACK_NAME].value + "'s (BLACK) ";
		} else {
			msg += options[INDEX_WHITE_NAME].value + "'s (WHITE) ";
		}
		
		msg += "turn has been skipped.";
		alert(msg);
	}
	
	function playComputerMoves() {
		if (possibleMoves != null && possibleMoves.length > 0 && currentPlayerIsComputer()) {
			myBoard.updateBoard(chooseAppropriateMove().board, 0, 0);
			possibleMoves = null;
			animating = true;
			myColorBar.animateToBoard(myBoard.getRepresentation());
			setTimeout('animationEnded()', ANIMATION_DELAY_MS);
		}
	}
	
	function chooseAppropriateMove() {
		for (var i = 0; i < possibleMoves.length; i++) {
			if (possibleMoves[i].value == "win") {
				return possibleMoves[i];
			} 
		}
		
		for (var i = 0; i < possibleMoves.length; i++) {
			if (possibleMoves[i].value == "tie") {
				return possibleMoves[i];
			}
		}
		
		return possibleMoves[0];
	}
	
	function currentPlayerIsComputer() {
		if (player1Turn) {
			return (options[INDEX_BLACK_PLAYER].value == "false");
		} else {
			return (options[INDEX_WHITE_PLAYER].value == "false");
		}
	}
	
	function stopAnimating(){
		endCurrentTurn();
		animating = false;
		//myColorBar.animateToBoard(myBoard.getRepresentation());
		//myColorBar.animateToBoard(myBoard.getRepresentation());
	}
	
	function isAnimating() {
		return animating;
	}
	
	function undoLastMove() {
		if (myBoard.canUndo() && !animating) {
			myBoard.undoLastMove();
			possibleMoves = null;
			animating = true;
			myColorBar.animateToBoard(myBoard.getRepresentation());
			winningMessage = "";
			setTimeout('undoAnimationEnded()', ANIMATION_DELAY_MS);
		}
	}
	
	function endUndoAnimation() {
		animating = false;
		endCurrentTurn();
	}
function Board(width, height, game) {
	
	var myGame = game;
	
	var boardRep = new Array();
	
	var boardWidth = width;
	var boardHeight = height;
	var boardSize = Math.min(width, height);
	var borderSize = 2;
	
	var piece1 = PLAYER_X;
	var piece2 = PLAYER_O;
	
	var possibleMoves = [];
	
	var spaceSide = 105;
    var bgSize = 100;
	var lineThickness = 2;
    var borderThickness = (spaceSide - bgSize) / 2;
	var pieceRadius = 50;
	var pieceAxis = pieceRadius * 2;
	var recessAxis = pieceAxis / 3.0;

	var promptRadius = 17;
	
	var currentMX = 0; 
	var currentMY = 0;
	var isPlayer1Turn = false;
	
	var playedMoves = new Array();
	
	//constructor code
	for (var i = 0; i < boardWidth; i++) {
		boardRep[i] = new Array();
		for (var j = 0; j < boardHeight; j++) {
			boardRep[i][j] = emptySpace;
		}
	}
	
	bottomLeftX = Math.floor(boardWidth / 2) - 1;
	bottomLeftY = Math.floor((boardHeight - 1) / 2) + 1;
	
	boardRep[bottomLeftX][bottomLeftY] = new Piece(PLAYER_O);
	boardRep[bottomLeftX][bottomLeftY - 1] = new Piece(PLAYER_X);
	boardRep[bottomLeftX + 1][bottomLeftY] = new Piece(PLAYER_X);
	boardRep[bottomLeftX + 1][bottomLeftY - 1] = new Piece(PLAYER_O);
	
	//functions
	this.drawBoard = drawBoard;
	this.drawEmptySpace = drawEmptySpace;
	this.drawPromptCircle = drawPromptCircle;
	this.update = update;
	this.setMousePos = setMousePos;
	this.setPossibleMoves = setPossibleMoves;
	this.getMoveValue = getMoveValue;
	this.getBoardHeight = getBoardHeight;
	this.toString = toString;
	
	this.attemptMove = attemptMove;
	this.isMoveLegal = isMoveLegal;
	this.executeMove = executeMove;
	this.updateBoard = updateBoard;
	this.changeBoardSpace = changeBoardSpace;
	this.getFlipDirection = getFlipDirection;
    this.getSpaceSide = getSpaceSide;
	this.getRepresentation = getRepresentation;
	this.drawFeltBackground = drawFeltBackground;
	this.drawRecess = drawRecess;
	this.getDelay = getDelay;
	this.getXPieces = getXPieces;
	this.getOPieces = getOPieces;
	this.undoLastMove = undoLastMove;
	this.canUndo = canUndo;
	
	function update(player1Turn) {
		isPlayer1Turn = player1Turn;	
	
		for (var i = 0; i < boardWidth; i++) {
			for (var j = 0; j < boardHeight; j++) {
				if (boardRep[i][j] != emptySpace) {
					boardRep[i][j].update(UPDATE_FREQ_MS);
				}
			}
		}
		drawBoard();
	}
	
	function drawBoard() {
		drawFeltBackground();
		for (var i = 0; i < boardWidth; i++) {
			for (var j = 0; j < boardHeight; j++) {
				if (boardRep[i][j] == emptySpace) {
					//drawEmptySpace(i,j);
                    drawFeltSpace(i,j,false,true,boardRep[i][j]);
					//drawPromptCircle(i,j);
				} else {
					drawFeltSpace(i, j,true,false,boardRep[i][j]);
					//drawPiece(i, j, boardRep[i][j]);
				}
			}
		}
	}
	
	function drawEmptySpace(col, row) {
		if (col >= boardWidth || row >= boardWidth) {
			return;
		}
		var ctx = document.getElementById('canvas').getContext('2d');
		ctx.fillStyle = BLACK_COLOR;
		ctx.fillRect(col * spaceSide, row * spaceSide, spaceSide, spaceSide);

		ctx.fillStyle = COLOR_DARK_GREEN;
		ctx.fillRect(col * spaceSide + borderSize, row * spaceSide + borderSize, spaceSide - (borderSize * 2), spaceSide - (borderSize * 2));
	}
    
	function drawFeltBackground() {
        var ctx = document.getElementById('canvas').getContext('2d');  
		ctx.clearRect(0,0,1000,1000);
		ctx.drawImage(FELT_BG_FULL,0,0,boardWidth * spaceSide, boardHeight * spaceSide);
		
		ctx.fillStyle = COLOR_DARK_GREEN;
		
		for (var i = 1; i < boardWidth; i++) {
			ctx.fillRect(i * spaceSide, 0, lineThickness, boardHeight * spaceSide);
		}
		
		for (var i = 1; i < boardHeight; i++) {
			ctx.fillRect(0, i * spaceSide, boardWidth * spaceSide, lineThickness);
		}
	}
	
    function drawFeltSpace(col, row, underPiece, underPrompt, piece) {
        var ctx = document.getElementById('canvas').getContext('2d');  
		
         //ctx.drawImage(FELT_BG_IMAGE,col * spaceSide + borderThickness,row * spaceSide + borderThickness);  
		if (underPiece) {
			drawPiece(col, row, piece);
		} else if (underPrompt) {
			drawPromptCircle(col,row);
		}
		
        return;
    }
	
	function drawPieceOld(col, row, piece) {
		var ctx = document.getElementById('canvas').getContext('2d');

		ctx.fillStyle = piece.getColor();
		
		ctx.save();
		ctx.translate(col * spaceSide + spaceSide / 2, row * spaceSide + spaceSide / 2);
		ctx.rotate(piece.getOrientation());
		ctx.scale(1,piece.getSize());
		ctx.beginPath();
		ctx.arc(0, 0, pieceRadius, 0, 2 * Math.PI, true);  
		ctx.fill();	
		ctx.restore();
	}
	
	function drawPiece(col, row, piece) {
		var ctx = document.getElementById('canvas').getContext('2d');
		var pieceXOffset = (spaceSide - pieceAxis) / 2.0;
		var pieceYOffset = (spaceSide - pieceAxis) / 2.0;
		
		var pieceImg;
		if (piece.getColor() == BLACK_COLOR) {
			pieceImg = PIECE_BLACK_IMAGE;
		} else {
			pieceImg = PIECE_WHITE_IMAGE;
		}
		
		ctx.save();
		if (piece.getOrientation() == 0) {
			ctx.translate(col * spaceSide, row * spaceSide);
			ctx.rotate(piece.getOrientation());
			ctx.drawImage(pieceImg, (1 - piece.getSize())/2.0*spaceSide + pieceXOffset, pieceYOffset, pieceAxis * piece.getSize(), pieceAxis);
		} else {
			ctx.translate(col * spaceSide + spaceSide / 2, row * spaceSide + spaceSide / 2);
			ctx.rotate(piece.getOrientation());
			ctx.drawImage(pieceImg, (1 - piece.getSize())/2.0*spaceSide - spaceSide / 2.0 + pieceXOffset, -1 * (spaceSide / 2.0) + pieceYOffset, pieceAxis * piece.getSize(), pieceAxis);
		}
		ctx.restore();
	}
	
	function drawPromptCircle(col, row) {
		var value = getMoveValue(col,row);
		
		if (value == null || myGame.isAnimating()) {
			return;
		} else if (value == NEUTRAL_COLOR) {
			drawRecess(col, row);
			return;
		}
				
		var targetCenterX = col * spaceSide + spaceSide / 2;
		var targetCenterY = row * spaceSide + spaceSide / 2;
		var highlighted = (currentMX > targetCenterX - promptRadius && currentMX < targetCenterX + promptRadius) && (currentMY > targetCenterY - promptRadius && currentMY < targetCenterY + promptRadius);
		
		var ctx = document.getElementById('canvas').getContext('2d');
		ctx.beginPath();
		ctx.arc(targetCenterX, targetCenterY, promptRadius, 0, 2 * Math.PI, true);  
		ctx.closePath();
		
		if (highlighted && isPlayer1Turn) {
			ctx.fillStyle = COLOR_X;
		} else if (highlighted && !isPlayer1Turn) {
			ctx.fillStyle = COLOR_O;
		} else {
			ctx.fillStyle = value;
		}
		ctx.fill();
	}
	
	function drawRecess(col, row) {
		var ctx = document.getElementById('canvas').getContext('2d');
		var recessXOffset = (spaceSide - recessAxis) / 2.0;
		var recessYOffset = (spaceSide - recessAxis) / 2.0;
		
		ctx.save();
		
		ctx.translate(col * spaceSide, row * spaceSide);
		ctx.drawImage(RECESS_IMAGE, recessXOffset, recessYOffset, recessAxis, recessAxis);
		
		ctx.restore();

	}
	
	
	function getMoveValue(i,j) {
		
		var moveIndex = legalLetters[i];
		moveIndex += legalIndeces[j];
		for (var i = 0; i < possibleMoves.length; i++) {
			if (possibleMoves[i].move == moveIndex) {
				if (options[INDEX_VALUE_MOVES].value == "false") {
					return NEUTRAL_COLOR;
				} else if (possibleMoves[i].value == "win") {
					return LOSE_COLOR;
				} else if (possibleMoves[i].value == "lose") {
					return WIN_COLOR;
				} else if (possibleMoves[i].value == "tie") {
					return TIE_COLOR;
				} else {
					return NEUTRAL_COLOR;
				}
			}
		}
		return null;
	}
	
	function toString() {
		var rtn = "";
		for (var i = 0; i < boardWidth; i++) {
			for (var j = 0; j < boardHeight; j++) {
				var element = boardRep[j][i];
				if (element == emptySpace) {
					rtn += element;
				} else {
					rtn += element.getFutureOwner();
				}
			}
		}
		return rtn;
	}
	
	function setMousePos(xCor, yCor) {
		currentMX = xCor;
		currentMY = yCor;
	}
	
	function setPossibleMoves(moves) {
		possibleMoves = moves;
	}
	
	function getBoardHeight() {
		return boardHeight;
	}
	
	function attemptMove(isPlayer1Turn, relativeX, relativeY) {
		var moveXCor = Math.floor(relativeX / 100);
		var moveYCor = Math.floor(relativeY / 100);
		
		if (this.isMoveLegal(moveXCor, moveYCor)) {
			this.executeMove(isPlayer1Turn, moveXCor, moveYCor);
			return true;
		}
	}
	
	function isMoveLegal(relX, relY) {
		if (relX >= boardWidth || relY >= boardHeight) {
			return false;
		} 
		
		var moveIndex = legalLetters[relX];
		moveIndex += legalIndeces[relY];
				
		for (var i = 0; i < possibleMoves.length; i++) {
			if (possibleMoves[i].move == moveIndex) {
				return boardRep[relX][relY] == emptySpace;
			}
		}
		
		return false;
	}
	
	function executeMove(isPlayer1Turn, moveX, moveY) {		
		var moveIndex = legalLetters[moveX];
		moveIndex += legalIndeces[moveY];
		
		
		var newBoard;
		for (var i = 0; i < possibleMoves.length; i++) {
			if (possibleMoves[i].move == moveIndex) {
				newBoard = possibleMoves[i].board;
				break;
			}
		}
		
		this.updateBoard(newBoard, moveX, moveY);
	}
	
	
	
	function updateBoard(newBoard, moveX, moveY) {
		newBoard = newBoard.substr(1);
		playedMoves.push(toString());
		
		var newBoardSlot;
		for (var i = 0; i < boardWidth; i++) {
			for (var j = 0; j < boardHeight; j++) {
				newBoardSlot = newBoard[j * boardHeight + i];
				changeBoardSpace(i,j,newBoardSlot, moveX, moveY);
			}
		}
		this.drawBoard();
	}
	
	function changeBoardSpace(col, row, newElement, placedPieceX, placedPieceY) {
		var oldElement = boardRep[col][row];
		if (newElement == emptySpace) {
			boardRep[col][row] = newElement;
		} else if (newElement == PLAYER_X) {
			if (oldElement != emptySpace && oldElement.getOwner() == PLAYER_O) {
				boardRep[col][row].flipPiece(getFlipDirection(col, row, placedPieceX, placedPieceY), getDelay(col, row, placedPieceX, placedPieceY));
			} else {
				boardRep[col][row] = new Piece(PLAYER_X);
			}
		} else if (newElement == PLAYER_O) {
			if (oldElement != emptySpace && oldElement.getOwner() == PLAYER_X) {
				boardRep[col][row].flipPiece(getFlipDirection(col, row, placedPieceX, placedPieceY), getDelay(col, row, placedPieceX, placedPieceY));
			} else {
				boardRep[col][row] = new Piece(PLAYER_O);
			}
		}
	}
	
	function getFlipDirection(targetX, targetY, placedPieceX, placedPieceY) {
		if (targetX == placedPieceX) {
			return "Vertical";
		} else if (targetY == placedPieceY) {
			return "Horizontal";
		} else if ((targetY < placedPieceY && targetX < placedPieceX) || (targetY > placedPieceY && targetX > placedPieceX)) {
			return "BottomDiagonal";
		} else if ((targetY < placedPieceY && targetX > placedPieceX) || (targetY > placedPieceY && targetX < placedPieceX)) {
			return "TopDiagonal";
		} 
		return "Horizontal";
	}
	
	function getDelay(col, row, placedPieceX, placedPieceY) {
		var deltaX = Math.abs(col - placedPieceX);
		var deltaY = Math.abs(row - placedPieceY);
		//return 0;
		return Math.max(deltaX - 1, deltaY - 1);
	}
    
    function getSpaceSide() {
        return spaceSide;
    }
	
	function getRepresentation() {
		return boardRep;
	}
	
	function getXPieces() {
		count = 0;
		for (var i = 0; i < boardWidth; i++) {
			for (var j = 0; j < boardHeight; j++) {
				if (boardRep[i][j] != emptySpace && boardRep[i][j].getFutureOwner() == PLAYER_X) {
					count++;
				}
			}
		}
		return count;
	}
	
	function getOPieces() {
		count = 0;
		for (var i = 0; i < boardWidth; i++) {
			for (var j = 0; j < boardHeight; j++) {
				if (boardRep[i][j] != emptySpace && boardRep[i][j].getFutureOwner() == PLAYER_O) {
					count++;
				}
			}
		}
		return count;
	}
	
	function undoLastMove() {
		if (playedMoves.length <= 0) {
			return;
		}		
				
		var lastBoard = playedMoves.pop();
		
		var newBoardSlot;
		for (var i = 0; i < boardWidth; i++) {
			for (var j = 0; j < boardHeight; j++) {
				newBoardSlot = lastBoard[j * boardHeight + i];
				revertBoardSpace(i,j,newBoardSlot);
			}
		}
		this.drawBoard();
	}
	
	function revertBoardSpace(col, row, newElement) {
		var oldElement = boardRep[col][row];
		if (newElement == emptySpace) {
			boardRep[col][row] = newElement;
		} else if (newElement == PLAYER_X) {
			if (oldElement != emptySpace && oldElement.getOwner() == PLAYER_O) {
				oldElement.performLastAnimation();
			}
		} else if (newElement == PLAYER_O) {
			if (oldElement != emptySpace && oldElement.getOwner() == PLAYER_X) {
				oldElement.performLastAnimation();
			}
		}
	}
	
	function canUndo() {
		return playedMoves.length > 0;
	}
}

function Piece(owner) {
	var myOwner = owner;
	var futureOwner = myOwner;
	
	var mySize = 1;
	var myAngle = 0;
	var scalePerSecond = Math.PI * 2;
	var scalePerMS = scalePerSecond / 1000;
	var scalingFactor = 2;
	
	var scaling = false;
	var scalingUp = false;
	
	var animDelay = 0;
	var flipDelay = 150 / 1000.0;
	
	var myOrientation = 0;
	
	var pastAnimations = [];
	
	this.update = update;
	this.flipPiece = flipPiece; 
	this.scaleDown = scaleDown;
	this.updateSize = updateSize;
	this.scaleUp = scaleUp;
	this.getColor = getColor;
	this.getFutureColor = getFutureColor;
	this.getSize = getSize;
	this.getOrientation = getOrientation;
	this.switchOwner = switchOwner;
	this.setFutureOwner = setFutureOwner;
	this.getOwner = getOwner;
	this.getFutureOwner = getFutureOwner;
	this.performAnimation = performAnimation;
	this.performLastAnimation = performLastAnimation;
	
	function update(timePassedMS) {
		if (scaling) {
			if (scalingUp) {
				scaleUp(timePassedMS);
				checkScaleUpEnd();
			} else {
				scaleDown(timePassedMS);
				checkScaleDownEnd();
			}
		} 
	}
	
	function checkScaleDownEnd(timePassedMS) {
		if (mySize <= .1) {
			switchOwner();
			scalingUp = true;
			mySize = .1;
			return true;
		}
		return false;
	}
	
	function checkScaleUpEnd() {
		if (mySize >= 1) {
			scaling = false;
			scalingUp = false;
			mySize = 1;
			myOrientation = 0;
			return true;
		}
		return false;
	}
	
	function flipPiece(direction, delay) {
		pastAnimations.push(direction);
		performAnimation(direction, delay);
	}
	
	function performAnimation(direction, delay) {
		scaling = true;
		scalingDown = true;
		animDelay = delay * flipDelay;
		setFutureOwner();
		if (direction == "Vertical") {
			myOrientation = Math.PI / 2;
		} else if (direction == "Horizontal") {
			myOrientation = 0;
		} else if (direction == "TopDiagonal") {
			myOrientation = -1 * Math.PI / 4;
		} else if (direction == "BottomDiagonal") {
			myOrientation = Math.PI / 4;
		}
	}
	
	function performLastAnimation() {
		performAnimation(pastAnimations.pop(), 0);
	}
	
	function scaleDown(timePassedMS) {
		if (!animationDelayed(timePassedMS)) {
			myAngle += scalePerMS * timePassedMS;
			updateSize();
		}
	}
	
	function scaleUp(timePassedMS) {
		if (!animationDelayed(timePassedMS)) {
			myAngle -= scalePerMS * timePassedMS;
			updateSize();
		}
	}
	
	function animationDelayed(timePassedMS) {
		if (animDelay <= 0) {
			return false;
		} else {
			animDelay -= (timePassedMS / 1000.0);
			return !(animDelay <= 0);
		}
	}
	
	function updateSize() {
		mySize = Math.cos(myAngle);
	}
	
	function getColor() {
		if (myOwner == PLAYER_X) {
			return COLOR_X;
		} else {
			return COLOR_O;
		}
	}
	
	function getFutureColor() {
		if (futureOwner == PLAYER_X) {
			return COLOR_X;
		} else {
			return COLOR_O;
		}
	}
	
	function getSize() {
		return Math.min(Math.max(mySize, .1), 1);
	}
	
	function switchOwner() {
		myOwner = futureOwner;
	}
	
	function setFutureOwner() {
		if (myOwner == PLAYER_X) {
			futureOwner = PLAYER_O;
		} else {
			futureOwner = PLAYER_X;
		}
	}
	
	function getOrientation() {
		return myOrientation;
	}
	
	function getOwner() {
		return myOwner;
	}
	
	function getFutureOwner() {
		return futureOwner;
	}
}

function ColorBar(length, height) {
	
	var myLength = length;
	var myHeight = height;
	var leftColor = BLACK_COLOR;
	var rightColor = WHITE_COLOR;
	
	var leftProp = .5;
	var rightProp = 1 - leftProp;
	
	var desiredLeftProp = leftProp;
	var desiredRightProp = 1 - desiredLeftProp;
	var animDelta = 0;
	
	var animTimeSeconds = .65; 
	var animating = false;
	var animatingToLeft = false;
	var currentAnimPoint = 0;
		
	
	this.draw = draw;
	this.update = update;
	this.checkAnimationEnd = checkAnimationEnd;
	this.animateToBoard = animateToBoard;
	
	function draw(x, y) {
		var ctx = document.getElementById('canvas').getContext('2d');
		ctx.fillStyle = leftColor;
		ctx.fillRect(x, y, myLength, myHeight);
		
		ctx.fillStyle = rightColor;
		var xCor = x + leftProp * myLength;
		var adjustedLength = myLength - (leftProp * myLength);
		ctx.fillRect(xCor, y, adjustedLength, myHeight);
	}
	
	function update(timePassedMS) {
		if (animating) {
			leftProp += (animDelta * (timePassedMS / (animTimeSeconds * 1000)));
			rightProp = 1 - leftProp;
			checkAnimationEnd();
		}
	}
	
	function checkAnimationEnd(){
		if (animatingToLeft && leftProp <= desiredLeftProp) {
			leftProp = desiredLeftProp;
			rightProp = leftProp - 1;
			animDelta = 0;
			animating = false;
		} else if (!animatingToLeft && leftProp >= desiredLeftProp) {
			leftProp = desiredLeftProp;
			rightProp = leftProp - 1;
			animDelta = 0;
			animating = false;
		}
	}
	
	function animateToBoard(newBoard) {
		var leftCount = 0;
		var rightCount = 0;
		
		for (var i = 0; i < newBoard.length; i++) {
			for (var j = 0; j < newBoard[0].length; j++) {
				if (newBoard[i][j] == emptySpace) {
				
				} else if (newBoard[i][j].getFutureColor() == leftColor) {
					leftCount++;
				} else if (newBoard[i][j].getFutureColor() == rightColor) {
					rightCount++;
				}
			}
		}
		
		desiredLeftProp = leftCount / (leftCount + rightCount);
		desiredRightProp = 1 - desiredLeftProp;
				
		if (desiredLeftProp != leftProp) {
			animating = true;
			animDelta = desiredLeftProp - leftProp;
			
			if (desiredLeftProp < leftProp) {
				animatingToLeft = true;
			} else {
				animatingToLeft = false;
			}
		}
	}
	
}
function MoveGenerator(/*gameOption*/) {
	//Constants
	var SPACE;
	var BLACK_PIECE;
	var WHITE_PIECE; 
	var BLACK_PLAYER;
	var WHITE_PLAYER; 
	var URL_BASE;
	var URL_BOARD;
	var URL_PLAYER;
	var URL_OPTION;

	var gameOption; 
	
	//Constructor 
	function init() {
		SPACE = " ";
		BLACK_PIECE = "X";
		WHITE_PIECE = "O"; 
		BLACK_PLAYER = "X";
		WHITE_PLAYER = "O"; 
		URL_BASE = "http://nyc.cs.berkeley.edu/gcweb/service/gamesman/puzzles/othello/getNextMoveValues";
		URL_BOARD = ";board=";
		URL_OPTION = ";width=4;height=4";
	}
	
	// player's value is determined based on the question: 'Is the current player player 1?'
	function determineCurrentPlayer(player) {
		return player ? BLACK_PLAYER : WHITE_PLAYER; 
	}
	
	function assembleString(board, player) {	
		currentPlayer = determineCurrentPlayer(player);
		return URL_BASE + URL_BOARD + currentPlayer + board + URL_OPTION;
	}
	
	//Initialize state  (pseudo-constructor) 
	init(); 
	
	
	return {
		//public methods
		getNextMoveValues: function(board, player) { 
			currentBoard = board; 
			var rtn ;
			$.ajax({
				url: assembleString(board, player),
				async: false,
				dataType: 'json', 
				success: function(data) {
					if(data.status != "ok") {
						console.err("Return status not \'ok\' in MoveGenerator::queryServer");
						return {};
					} else {
						//console.log("MoveGenerator::queryServer::rtn:" + data.response);
						rtn = data.response; 
					}
				}});
				return rtn; 
			}
		};
}
}
