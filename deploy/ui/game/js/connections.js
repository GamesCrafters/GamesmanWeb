var ctx;
var canvas;
var canvasWidth = 500;
var canvasHeight = 500;
var boardSize; //Size of board
var divFactor; //Number of cols of the grid: size 2 = 5x5 grid = divFactor of 5
var componentLength; //Length of one unit on the grid
var boardString; //String that represents the board
$(document).ready(
function() 
	{
		canvasHeight = $(window).height() * 0.95; 
		canvasWidth = $(window).width() * 0.95;
		canvasHeight = Math.min(canvasHeight, canvasWidth);
		canvasWidth = canvasHeight;
		$('#canvasContainer').append('<canvas id="canvas" width="'+canvasWidth+'" height="'+canvasHeight+'"></canvas>');
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		addEventListener("click", connectionsClick, false);
		boardSize = 3;
		//boardString = "20000001020002000301000000"
		//boardString = "20000001020002000301000000"
		boardString = "30000000000001000000000002000000010000000000000000"
		drawBoard(boardSize, boardString);
	}	
)

function drawBoard(size, board){ //size is an int, board is a string depiction
	ctx.fillStyle = "#E8E8E8"
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	divFactor = size*2+1;
	componentLength = canvasWidth/divFactor;
	//Draws in lines
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	for (i=1; i<divFactor; i++){
		ctx.beginPath();
		ctx.moveTo(i*componentLength, 0);
		ctx.lineTo(i*componentLength, canvasHeight);
		ctx.moveTo(0, i*componentLength);
		ctx.lineTo(canvasWidth, i*componentLength);
		ctx.stroke();
		ctx.closePath();
	}
	//Draws in default squares
	drawSquares();
	//Draws in board
	var boardArray = makeArray(board);
	drawArray(boardArray);
}
	
function drawSquares(){
	//draws player one's squares
	ctx.fillStyle = "blue";
	for (a = 1; a < divFactor; a+=2){
		for (b = 0; b <= divFactor; b+=2){
			drawOneSquare(a*componentLength, b*componentLength);
		}
	}
	ctx.fillStyle = "red";
	for (a = 0; a <= divFactor; a+=2){
		for (b = 1; b < divFactor; b+=2){
			drawOneSquare(a*componentLength, b*componentLength);
		}
	}
}
function drawOneSquare(x, y){
	var squareOffset = componentLength * 0.2
	ctx.fillRect(x+squareOffset, y+squareOffset,
		componentLength-2*squareOffset, componentLength-2*squareOffset);
}

function drawArray(array){
	for(x = 0; x < array.length; x++){
		for(y = 0; y < array.length; y++)
			drawLine(x, y, array[x][y]);
	}
}

function makeArray(s){
	//Sample size 2 board: "20000001020002000301000000"
	var array_size = s.charAt(0);
	var array_dim = array_size*2+1;
	var board = new Array(array_dim);
	for (i=0; i<array_dim; i++){
		board[i] = new Array(array_dim); //makes it a 2-d Array, array_dim by array_dim
	}
	var position = 1; //Position we are at in s
	for (y=0; y<array_dim; y++){
		for (x=0; x<array_dim; x++){
			board[x][y] = s.charAt(position*1); //Saves it as an int
			position+=1;
		}
	}
//	console.log(board);
	return board;
}

function drawLine(x, y, val) {
// not currently error checking for correct inputs
	var startx;
	var starty;
	var dir;
	componentLength = canvasWidth/divFactor;
	var offset = componentLength*.2;
	var len = componentLength + (2 * offset);
	ctx.lineWidth = Math.round(canvasWidth / 40); //Sets line width for a stroke
	ctx.beginPath();
	//draw player 1's line
	if (val == 1) {
//		console.log("Drew player 1's");
		ctx.strokeStyle = "blue";
		if((x%2 == 0) && (y%2 == 0)) { //draw horiz line
			startx = (componentLength * x) - offset;
			starty = (componentLength * y) + (componentLength * .5);
			ctx.moveTo(startx, starty);			
			ctx.lineTo(startx + len, starty);
			ctx.stroke();
		} else { //draw vertical line 
			startx = (componentLength * x) + (componentLength * .5);
			starty = (componentLength * y) - offset;
			ctx.moveTo(startx, starty);
			ctx.lineTo(startx, starty + len);
			ctx.stroke();
	//draw player 2's line
		}
	} else if (val == 2) {
//		console.log("Drew player 2's");
		ctx.strokeStyle = "red";
		if((x%2 == 0) && (y%2 == 0)) { //draw vertical line
			startx = (componentLength * x) + (componentLength * .5);
			starty = (componentLength * y) - offset;
			ctx.moveTo(startx, starty);
			ctx.lineTo(startx, starty + len);
			ctx.stroke();
		} else { //draw horiz line
			startx = (componentLength * x) - offset;
			starty = (componentLength * y) + (componentLength * .5);
			ctx.moveTo(startx, starty);			
			ctx.lineTo(startx + len, starty);
			ctx.stroke();
		}
	}
	ctx.closePath();
}

//Note: the mouse clicking stuff is not done yet
function connectionsClick(e) {
    var x = e.clientX-canvas.offsetLeft;
	var y = e.clientY-canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;
	console.log("x, y: ", x, y);
	//Now we need to convert x and y into board coordinates
	x = parseInt(x / canvasWidth * divFactor);
	y = parseInt(y / canvasHeight * divFactor);
	console.log("Converted x, y: ", x, y);
	boardString = changeBoard(boardString, x, y);
	console.log("New boardString: ", boardString);
	drawBoard(boardSize, boardString);
}

function changeBoard(board, x, y) {
	var newBoard = board;
	//Change the string board at coordinate x, y
	var strPos = y*divFactor + x + 1
	newBoard = newBoard.substr(0, strPos) + (newBoard.charAt(strPos)+1)%3 + newBoard.substr(strPos + 1)
	return newBoard;
}

function getCursorPosition(e, letter) {
	var xory;
	var xoffset = 10;
	var yoffset = 10;
	if (letter == 'x'){
		if (e.pageX){
			xory = e.pageX;
			xory -= xoffset;
		} else {
			console.log("Not pageX");
			//xory = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			//xory -= xoffset;
		}
	}
	else {
		if (e.pageY) {
			xory = e.pageY;
			xory -= yoffset;
		} else {
			console.log("Not pageY");
			//xory = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			//xory -= yoffset;
		}
	}
	return xory;
}





