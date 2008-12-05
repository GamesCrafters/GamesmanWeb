// images
var imgDir = "images/tcross/";

var imgSrc = [imgDir+"topLeft.png", imgDir+"topRight.png", imgDir+"botLeft.png",
		imgDir+"botRight.png", imgDir+"bin.png", imgDir+"art.png", imgDir+"dot.png",
		imgDir+"dot.png", imgDir+"dot.png"];
	
var emptyImgSrc = imgDir+"empty.png";

var topLeftSliderSrc = imgDir+"topLeftSlider.png";
var topRightSliderSrc = imgDir+"topRightSlider.png";
var leftSliderSrc = imgDir+"leftSlider.png";
var rightSliderSrc = imgDir+"rightSlider.png";
var botLeftSliderSrc = imgDir+"botLeftSlider.png";
var botRightSliderSrc = imgDir+"botRightSlider.png";

// starting left position in px
var slp = 190;
// starting top position in px
var stp = 135;
// piece image width/height (size)
var sz = 50;

var animationSpeed = 350; // milliseconds

var chosenBoard;

var width = 9;
var height = 4;

// x's mark possible clickable positions:
//   0 1 2 3 4 5 6 7 8
//-1 - - - - - x x - -
// 0 - - x x - - - - -
// 1 x - - - - - - - x
// 2 x - - - - - - - x
// 3 - - - - - x x - -
// 4 - - x x - - - - -
var clickables = [[0, 2], [-1, 5], [1, 0], [1, 8], [4, 2], [3, 5]];
			  
// used for coloring
var moveValueClasses = ["lose-move", "tie-move", "win-move"];

var nextMoves = [];
var lastMove = -1;

var options = {"circle": 1, "binArt": 1, "dots": 1, "exactSol": 1};
var opKeys = ["circle", "binArt", "dots", "exactSol"];

// determined by radio button on options page
var userWantsRandomBoard = true;

$(document).ready(function() {
	// hide the gameboard while user chooses options
	$("#board").hide();
	// hide the board input panel while user chooses options
	$("#inputBoard").hide();
	
	// set up result of clicking the start button on options page
	$("#startButton").click(function() {
		getSelectedOptions();
		
		// make sure the user has at least chosen one of the sets of pieces
		if (options.circle || options.binArt || options.dots) {
			setUpImagePositions();
			
			// handle the two possible radio button options:
			if (userWantsRandomBoard) {
				chosenBoard = getRandomBoard();
				startGame();
			}
			else
				getUserBoard();
		}
		else
			alert("You must choose at least one of the three sets of pieces to play with.");
	});
});

function setUpImagePositions() {
	// set up board div
	$("#board").css("height", sz * 7);
	
	// set up top and bottom rows
	for (row = 0; row < 4; row+=3)
		for (col = 5-row; col < 7-row; col++)
			setUpImage(row, col, emptyImgSrc, sz, sz);

	// set up middle rows
	for (row = 1; row < 3; row++)
		for (col = 1; col < 8; col++)
			setUpImage(row, col, emptyImgSrc, sz, sz);
		
	// set up sliders
	setUpImage(0, 2, topLeftSliderSrc, sz * 2, sz);
	setUpImage(-1, 5, topRightSliderSrc, sz * 2, sz);
	setUpImage(1, 0, leftSliderSrc, sz, sz * 2);
	setUpImage(1, 8, rightSliderSrc, sz , sz * 2);
	setUpImage(4, 2, botLeftSliderSrc, sz * 2, sz);
	setUpImage(3, 5, botRightSliderSrc, sz * 2, sz);
}

function setUpImage(row, col, src, width, height) {
	imgId = "#cell-"+row+"-"+col;
	$(imgId).css({ position: "absolute",
				   left: slp + sz * (col + 1) + "px",
				   top: stp + sz * (row + 1) + "px",
				   width: width,
				   height: height });
	$(imgId).attr("src", src);	
}

// tracks which piece the user currently has selected
var curPiece = 0;

function getUserBoard() {
	// hide the options and show the gameboard and input panel
	$("#Options").hide();
	$("#board").show();
	$("#inputBoard").show();
	
	chosenBoard = [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1];
	
	// for each radio button, make it so when the user clicks it it changes curPiece
	for (piece = 0; piece < 9; piece++)
		$("#userP"+piece).click(function(p) {
			return function(){
				curPiece = p;
			};
		}(piece));
	
	// based on the options chosen, hide the radio buttons for pieces
	// the user doesn't want to use and put them in a separate category called "off"
	if (!options.circle) {
		$("#placeCircle").hide();		
		// (once the 0th piece is placed in "off", inputBoard actually shifts so
		// that the next piece is now the 0th piece)
		document.choosePiece.inputBoard[0].name = "off";
		document.choosePiece.inputBoard[0].name = "off";
		document.choosePiece.inputBoard[0].name = "off";
		document.choosePiece.inputBoard[0].name = "off";
	}
	if (!options.binArt) {
		$("#placeBinArt").hide();
		var buttonNum = document.choosePiece.inputBoard.length - 5;
		document.choosePiece.inputBoard[buttonNum].name = "off";
		document.choosePiece.inputBoard[buttonNum].name = "off";
	}
	if (!options.dots) {
		$("#placeDots").hide();
		buttonNum = document.choosePiece.inputBoard.length - 3;
		document.choosePiece.inputBoard[buttonNum].name = "off";
		document.choosePiece.inputBoard[buttonNum].name = "off";
		document.choosePiece.inputBoard[buttonNum].name = "off";
	}
	
	// simulate the user clicking the first piece's radio button
	document.choosePiece.inputBoard[0].click();
	
	displayBoard(chosenBoard);
	
	// loops through 36 pieces but just ends up ignoring ones that aren't valid
	for (row = 0; row < height; row++) { 
		for (col = 0; col < width; col++) {
			$("#cell-"+row+"-"+col).click(function(row, col) {
				return function(){
					// make sure the cell the user clicked on exists and does not already contain a piece
					if ($("#cell-"+row+"-"+col).attr("src") == emptyImgSrc && chosenBoard.indexOf(row * width + col) < 0) {
						// get the currently selected button
						for (but = 0; but < document.choosePiece.inputBoard.length; but++)
							if (document.choosePiece.inputBoard[but].checked) {
								var curButton = but;
								break;
							}
						
						// update the board
						chosenBoard[curPiece] = row * width + col;
						
						// if the user wants to cycle through pieces as they place them and they aren't
						// on the last piece, then automatically click the next radio button
						if (document.choosePiece.cyclePieces.checked && 
							curButton != document.choosePiece.inputBoard.length - 1)
							document.choosePiece.inputBoard[curButton+1].click();
						
						displayBoard(chosenBoard);
					}
				};
			}(row, col));
		}
	}
	
	$("#donePlacingPieces").click(function() {
		// make sure the user actually placed all the pieces
		var countPiecesPlaced = 0;
		for (i = 0; i < chosenBoard.length - 2; i++)
			if (chosenBoard[i] != -1)
				countPiecesPlaced++;
		if (countPiecesPlaced == document.choosePiece.inputBoard.length)
			// if they did, then start the game
			startGame();
		else
			alert("You haven't placed all the pieces yet.");
	});
}

function startGame() {	
	// hide the options (circle, binArt, etc.)
	$("#Options").hide();
	// show the gameboard
	$("#board").show();
	// but hide the menu for placing pieces
	$("#inputBoard").hide();
	
	var game = GCWeb.newPuzzleGame("tcross", width, height, {
		onNextValuesReceived: onNextValuesReceived,
		onExecutingMove: onExecutingMove,
		updateMoveValues: updateMoveValues, 
		clearMoveValues: clearMoveValues,
		options: options,
		//getPositionValue: getPositionValue,
		//getNextMoveValues: getNextMoveValues,
		debug: 0
	});

	game.loadBoard(getBoardString(chosenBoard));
	
	// remove previous click functions (specifically, the ones created in getUserBoard())
	for (row = 0; row < height; row++)
		for (col = 0; col < width; col++)
			$("#cell-"+row+"-"+col).unbind("click");

	// loop through the possible clickable positions
	for(i = 0; i < clickables.length; i++)
		// do a move on click
		$("#cell-" + clickables[i][0] + "-" + clickables[i][1]).click(function(row, col){
			return function(){
				if ($("img[id^='cell']:animated").length == 0) {
					imgSrc = $("#cell-"+row+"-"+col).attr("src");
		
					// find the move information that we stored and compare it to the slider clicked
					for (j = 0; j < nextMoves.length; j++)
						if ((nextMoves[j].move == "R" && imgSrc == leftSliderSrc) ||
							(nextMoves[j].move == "L" && imgSrc == rightSliderSrc) ||
							(nextMoves[j].move == "D" && (imgSrc == topLeftSliderSrc || imgSrc == botRightSliderSrc)) ||
							(nextMoves[j].move == "U" && (imgSrc == topRightSliderSrc || imgSrc == botLeftSliderSrc))) {
							game.doMove(nextMoves[j]);
							break;
						}
					}
			};
		}(clickables[i][0], clickables[i][1]));
		
	displayBoard(chosenBoard);
}

// called when doMove executes successfully
function onExecutingMove(moveInfo){
    // update our own state
    lastMove = moveInfo.move;
	
	var allPieceImgs = $("img[id^='cell']");
	
	if (lastMove == "R")
		for (i = 0; i < allPieceImgs.length; i++) {
			var row = (parseInt($(allPieceImgs[i]).css("top")) - stp - sz) / sz;
			if (row == 1 || row == 2)
				$(allPieceImgs[i]).animate({"left": "+="+sz+"px"}, animationSpeed);
		}
	else if (lastMove == "L")
		for (i = 0; i < allPieceImgs.length; i++) {
			var row = (parseInt($(allPieceImgs[i]).css("top")) - stp - sz) / sz;
			if (row == 1 || row == 2)
				$(allPieceImgs[i]).animate({"left": "-="+sz+"px"}, animationSpeed);
		}
	else if (lastMove == "D")
		for (i = 0; i < allPieceImgs.length; i++) {
			var col = (parseInt($(allPieceImgs[i]).css("left")) - slp - sz) / sz;
			if (col == 2 || col == 3 )
				$(allPieceImgs[i]).animate({"top": "+="+sz+"px"}, animationSpeed);
			if (col == 5 || col == 6)
				$(allPieceImgs[i]).animate({"top": "-="+sz+"px"}, animationSpeed);
		}
	else if (lastMove == "U")
		for (i = 0; i < allPieceImgs.length; i++) {
			var col = (parseInt($(allPieceImgs[i]).css("left")) - slp - sz) / sz;
			if (col == 2 || col == 3 )
				$(allPieceImgs[i]).animate({"top": "-="+sz+"px"}, animationSpeed);
			if (col == 5 || col == 6)
				$(allPieceImgs[i]).animate({"top": "+="+sz+"px"}, animationSpeed);
		}
}

// called on intiial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    nextMoves = json;
	// now that we have the nextmoves, update the sliders so they display them
	updateSliders();
}

// called when game starts and after every doMove (called in onNextValuesReceived)
function updateSliders() {
	// first reset all the sliders' cursors
	for(i = 0; i < clickables.length; i++)
		$("#cell-" + clickables[i][0] + "-" + clickables[i][1]).css("cursor", "default");
	
	// look at the possible next moves and update the cursor for the appropriate sliders
	for (j = 0; j < nextMoves.length; j++) {
		if (nextMoves[j].move == "R")
			updateSlider(clickables[2][0], clickables[2][1]);
		else if (nextMoves[j].move == "L")
			updateSlider(clickables[3][0], clickables[3][1]);
		else if (nextMoves[j].move == "D") {
			updateSlider(clickables[0][0], clickables[0][1]);
			updateSlider(clickables[5][0], clickables[5][1]);
		}
		else if (nextMoves[j].move == "U") {
			updateSlider(clickables[1][0], clickables[1][1]);
			updateSlider(clickables[4][0], clickables[4][1]);
		}
	}
	
}

// small helper for updateSliders
function updateSlider(row, col) {
	sliderId = "#cell-" + row + "-" + col;
	// update pointer
	$(sliderId).css("cursor", "pointer");
	// update class so that user can tell if clicking the slider results in a valid move
	// but make sure move values aren't turned on
	if (!$(sliderId).hasClass(moveValueClasses[0]) 
		&& !$(sliderId).hasClass(moveValueClasses[1])
		&& !$(sliderId).hasClass(moveValueClasses[2]))
		$(sliderId).addClass("valid-move");
}

// colors the board based on move values
function updateMoveValues(nextMoves){
    // reset everything first
    for (i = 0; i < clickables.length; i++)
		$("#cell-" + clickables[i][0] + "-" + clickables[i][1]).removeClass();
	
    // set background color to new values
    for(i = 0; i < nextMoves.length; i++) {
        move = nextMoves[i].move;
        if (move == "R")
			$("#cell-1-0").addClass(moveValueClasses[nextMoves[i].value-1]);
        else if (move == "L")
			$("#cell-1-8").addClass(moveValueClasses[nextMoves[i].value-1]);
        else if (move == "U") {
			$("#cell--1-5").addClass(moveValueClasses[nextMoves[i].value-1]);
			$("#cell-4-2").addClass(moveValueClasses[nextMoves[i].value-1]);
		}
        else {
			$("#cell-0-2").addClass(moveValueClasses[nextMoves[i].value-1]);
			$("#cell-3-5").addClass(moveValueClasses[nextMoves[i].value-1]);
		}
    }
}

// remove all indicators of move values
function clearMoveValues(){
	for (i = 0; i < clickables.length; i++) {
		sliderId = "#cell-" + clickables[i][0] + "-" + clickables[i][1];
		// check if the slider has a move value
		// if it does then replace it with a valid-move because that means
		// the move-values checkbox was just unchecked
		if ($(sliderId).hasClass(moveValueClasses[0]) 
			|| $(sliderId).hasClass(moveValueClasses[1])
			|| $(sliderId).hasClass(moveValueClasses[2])) {
				$(sliderId).removeClass();
				$(sliderId).addClass("valid-move");
		}
		// if the slider doesn't have a move value then just remove the valid-move class
		else
			$(sliderId).removeClass();			
	}
}

function getBoardString(board) {
	var str = "";
	for (piece = 0; piece < 9; piece++) {
		if (board[piece] < 10 && board[piece] >= 0)
			str += " "; // add an extra space for 1-digit numbers that are non-negative
		str += board[piece] + " ";
	}
	if (board[9] >= 0) // if horizPos is not -1
		str += " "; // add an extra space because no negative sign
	str += board[9] + " ";
	str += board[10];
	return str;
}

// get the options before the user starts the game
function getSelectedOptions() {
	for (i = 0; i < document.optionsform.solveoptions.length; i++) {
		checked = document.optionsform.solveoptions[i].checked;
		options[opKeys[i]] = checked ? 1 : 0;
	}
	userWantsRandomBoard = document.optionsform.useroptions[0].checked;
}

function getRandomBoard() {
	var gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]; // set horizPos to 0 and vertPos to 1
	
	var validPositions = [5, 6, 10, 11, 12, 13, 14, 15, 16, 
						  19, 20, 21, 22, 23, 24, 25, 29, 30]; // based on horizPos being 0 and vertPos being 1

	for (piece = 0; piece < 9; piece++) {
		// generate a random number from 0 to number of valid positions left
		var randomPosIndex = Math.floor(Math.random() * validPositions.length); 
		
		gameboard[piece] = validPositions[randomPosIndex];
		
		// remove the position chosen from the board so it isn't chosen again
		validPositions.splice(randomPosIndex, 1);
	}
	if (!options.circle)
		for (piece = 0; piece < 4; piece++)
			gameboard[piece] = -1;
	if (!options.binArt)
		for (piece = 4; piece < 6; piece++)
			gameboard[piece] = -1;
	if (!options.dots)
		for (piece = 6; piece < 9; piece++)
			gameboard[piece] = -1;	
	
	return gameboard;
}

// should only be called before the user has started playing
function displayBoard(board) {
	// set up top and bottom rows
	for (row = 0; row < 4; row+=3)
		for (col = 5-row; col < 7-row; col++) {
			piece = board.slice(0,9).indexOf(row * width + col);
			if (piece >= 0)
				$("#cell-"+row+"-"+col).attr("src", imgSrc[piece]);
			else
				$("#cell-"+row+"-"+col).attr("src", emptyImgSrc);
		}

	// set up middle rows
	for (row = 1; row < 3; row++)
		for (col = 1; col < 8; col++) {
			piece = board.slice(0,9).indexOf(row * width + col);
			if (piece >= 0)
				$("#cell-"+row+"-"+col).attr("src", imgSrc[piece]);
			else
				$("#cell-"+row+"-"+col).attr("src", emptyImgSrc);
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
	var moves = "";
	
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
        moves += "L";
    if (positionBoard[9] < 1)
        moves += "R";         
    if (positionBoard[10])
        moves += "U";
    else
		moves += "D";
	
	// doMove
	for (i = 0; i <  moves.length; i++) { 
		var newBoard = positionBoard.slice(0);
		var horizontalPos = newBoard[9];
		var verticalPos = newBoard[10];
		if (moves.charAt(i) == "L") {
			for (p = 0; p < 9; p++)
				if (positionBoard[p] > 8 && positionBoard[p] < 27)
					newBoard[p] -= 1;
			horizontalPos -= 1;
		}
		else if (moves.charAt(i) == "R") {
			for (p = 0; p < 9; p++)
				if (positionBoard[p] > 8 && positionBoard[p] < 27)
					newBoard[p] += 1;
			horizontalPos += 1;
		}
		else if (moves.charAt(i) == "U") {
			for (p = 0; p < 9; p++) {
				if ((((positionBoard[p] - 2) % 9) == 0) || (((positionBoard[p] - 3) % 9) == 0))
					newBoard[p] -= 9;
				else if ((((positionBoard[p] - 5) % 9) == 0) || (((positionBoard[p] - 6) % 9) == 0))
					newBoard[p] += 9;
			}
			verticalPos = 0;
		}
		else if (moves.charAt(i) == "D") {
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
		
		if (!options.circle)
			for (piece = 0; piece < 4; piece++)
				newBoard[piece] = -1;
		if (!options.binArt)
			for (piece = 4; piece < 6; piece++)
				newBoard[piece] = -1;
		if (!options.dots)
			for (piece = 6; piece < 9; piece++)
				newBoard[piece] = -1;	
		retval.push({"board": getBoardString(newBoard), "move": moves.charAt(i), "remoteness": 4, "status": "OK", "value": 1});
	}

	onMoveValuesReceived(retval);
}