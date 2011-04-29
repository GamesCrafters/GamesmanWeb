//The number of pieces necessary to win.
var winningPieces = 3;

var gameStart = false;

// function called on page load
$(document).ready(function(){
	//does nothing
});

window.onresize = function(event) {
	if(gameStart) {
		// set the canvas dementions
		//if(window.innerWidth < 500 || window.innerHeight < 500) {
			canvas_size = Math.min(window.innerWidth,window.innerHeight);
		//}
		//else {
		//	canvas_size = 500;
		//}
		var canvas = document.getElementById('canvas');
	
		//calculate cell size
		if (canvas_size/row > canvas_size/col) {
			cell_size = canvas_size/col;
		} else {
			cell_size = canvas_size/row;
		}
	
		$(document.getElementById("playerturn")).css("width", cell_size*col);
		canvas.setAttribute("width",cell_size*col);
		canvas.setAttribute("height",cell_size*row);
		drawBoard(board,-1);
	}
}

//function called when the submit button is clicked
function submitclick() {
	gameStart = true;
	var f = document.getElementById("gameform");
	var r = parseInt(f.row.value);
	var c = parseInt(f.col.value);
	var w = parseInt(f.dropmenu.value);
	
//	if (isNaN(f.row.value) || isNaN(f.col.value) || f.row.value == "" || f.col.value == "" || f.row.value <= 0 || f.col.value <= 0)
//		alert("invalid row or column");
	if(w == 1) {
		row = 3;col = 3;
		winningPieces = 3;
	}
	if(w == 2) {
		row = 3;
		col = 4;
		winningPieces = 3;
	}
	if(w == 3) {
		row = 4;
		col = 3;
		winningPieces = 4;
	}
	if(w == 4) {
		row = 4;
		col = 4;
		winningPieces = 3;
	}
	//initialize and draw the board
	init();
	drawBoard(board,-1);
	
	//hideform
	f.style.display = "none";
}

//function called to change the showvalue variable
function valuechange() {
	if (showvalue)
		showvalue = false;
	else
		showvalue = true;
	drawBoard(board,-1);
}

// size of the canvas
var canvas_size; //ok to change

//board values
var board = ""; //do not change (board constructer)
var moves_to_child; //mapping from current valid moves to child
var moves_to_value; //mapping from current valid moves to its value
var row = 4; //ok to change
var col = 4; //ok to change
var cell_size = 0; //do not change

//value moves on
var showvalue = false;

//current player (1 or 2)
var player = 1;

//enable and disable user input
var enable_user_input = true;
var gameover = false;

//images used
var cell_img = new Image();
cell_img.src = "game/images/quickcross/cell2.png";
var h_img = new Image();
h_img.src = "game/images/quickcross/horizontal3.png";
var v_img = new Image();
v_img.src = "game/images/quickcross/vertical3.png";
var empty_img = new Image();
empty_img.src = "game/images/quickcross/empty.png";
var lose_v_img = new Image();
lose_v_img.src = "game/images/quickcross/lose_v.png";
var lose_h_img = new Image();
lose_h_img.src = "game/images/quickcross/lose_h.png";
var win_v_img = new Image();
win_v_img.src = "game/images/quickcross/win_v.png";
var win_h_img = new Image();
win_h_img.src = "game/images/quickcross/win_h.png";
var tie_v_img = new Image();
tie_v_img.src = "game/images/quickcross/tie_v.png";
var tie_h_img = new Image();
tie_h_img.src = "game/images/quickcross/tie_h.png";

// initialization function
function init() {
	// set the canvas dementions
	//if(window.innerWidth < 500 || window.innerHeight < 500) {
		canvas_size = Math.min(window.innerWidth,window.innerHeight);
	//}
	//else {
	//	canvas_size = 500;
	//}
	var canvas = document.getElementById('canvas');
	
	//calculate cell size
	if (canvas_size/row > canvas_size/col) {
		cell_size = canvas_size/col;
	} else {
		cell_size = canvas_size/row;
	}
	
	$(document.getElementById("playerturn")).css("width", cell_size*col);
	canvas.setAttribute("width",cell_size*col);
	canvas.setAttribute("height",cell_size*row);
	
	//initialize board
	for (var i=0; i<row*col;i++){
		board += " ";
	}
	
	//initailize objects
	loadvalues_and_children()

	//click event handle
	canvas.addEventListener("click", 
                        function(e) { 
						   event_handle(e.clientX-canvas.offsetLeft + window.pageXOffset, e.clientY-canvas.offsetTop + window.pageYOffset);
                        }, false);						
}

//given a point p and the three corners of a triangle a, b, and c
// return true if and only if point p is inside of that triangle
function pointInTriangle(p,a,b,c) {
	//use triangle collision detection algorithm via barycentric coordinates
	
	var b0 = ((b[0]-a[0]) * (c[1]-a[1])) - ((c[0]-a[0]) * (b[1]-a[1]));
	var b1 = (((b[0]-p[0]) * (c[1]-p[1])) - ((c[0]-p[0]) * (b[1]-p[1])))/b0;
	var b2 = (((c[0]-p[0]) * (a[1]-p[1])) - ((a[0]-p[0]) * (c[1]-p[1])))/b0;
	var b3 = (((a[0]-p[0]) * (b[1]-p[1])) - ((b[0]-p[0]) * (a[1]-p[1])))/b0;
	
	if (b1 >= 0 && b2 >= 0 && b3 >= 0)
		return true;
	else
		return false;
}

function event_handle(x,y) {
	var fixX = Math.floor(x/(cell_size))*cell_size;
	var fixY = Math.floor(y/(cell_size))*cell_size;
	var pos = Math.floor(((fixY/cell_size)*col)+(fixX/cell_size));
	var vertical = false;
	
	if(board[pos] == " ") { //only check mouse position if cell is empty
		var point = new Array(x,y);
		
		//check if in the vertical area
		var vertexA = new Array(fixX, fixY);//topleft
		var vertexB = new Array(fixX+cell_size, fixY);//topright
		var vertexC = new Array(fixX+cell_size/2, fixY+cell_size/2);//center
		var vertexD = new Array(fixX,fixY+cell_size);//bottomleft
		var vertexE = new Array(fixX+cell_size,fixY+cell_size);//bottomright
		if(pointInTriangle(point,vertexA,vertexB,vertexC)
			|| pointInTriangle(point,vertexD,vertexE,vertexC)) {
			vertical = true;
		}
	}
	
	if (enable_user_input){
		if (board[pos] == " ") {
			update(pos,vertical);
			drawBoard(board,-1);
		} else {
			enable_user_input = false;
			animateTurnPiece(pos,board[pos]);
			update(pos,null);
		}
		if (!gameover) {
			if (player == 1) {
				player = 2;
				document.getElementById("playerturn").innerHTML = "Right Player Turn"
			} else {
				player = 1;
				document.getElementById("playerturn").innerHTML = "Left Player Turn"
			}
		}
		if(player == 1){
			//document.getElementById("playerturn").innerHTML.style.textAlign="left";
			$(document.getElementById("playerturn")).css("text-align", "left");
		}else{
			//document.getElementById("playerturn").innerHTML.style.textAlign="right";
			$(document.getElementById("playerturn")).css("text-align", "right");
		}
	}
}

// given a move. cell clicked and vertical or horizontal position (null if cell is not empty)
// updates the board and all move_to json objects
function update(pos,vertical) {
	//convert the move into string format
	var move;
	if (vertical == null)
		move = "F";
	else if (vertical)
		move = "V";
	else
		move = "H";
	move = move+pos;
	
	// update current board
	board = moves_to_child[move];
	// update move_to objects;
	loadvalues_and_children();
	
}

//given a description of the current board, draw the quickcross board.
// fits a table of square cells in a 1000x1000 area
// the int passed to clear means that the pice in that cell pos will be blank.
function drawBoard(boardString,clear) {
	//get the canvas and clear it
	var ctx = document.getElementById('canvas').getContext('2d');
	
	ctx.clearRect(0,0,canvas_size,canvas_size);

	//loop to draw cells and pieces
	for (var i=0; i<row; i++) {
		for (var j=0; j<col; j++) {
			var pos = (i*col)+j; //iterator over the boardString
			
			//draw cell
			ctx.drawImage(cell_img,j*cell_size,i*cell_size,cell_size,cell_size);
			
			//draw value******************
			if (showvalue) {
				var F_move = moves_to_value["F"+pos];
				var V_move = moves_to_value["V"+pos];
				var H_move = moves_to_value["H"+pos];
				if (V_move != null) {
					if (V_move == "WIN")
						ctx.drawImage(win_v_img,j*cell_size,i*cell_size,cell_size,cell_size);
					if (V_move == "LOSE")
						ctx.drawImage(lose_v_img,j*cell_size,i*cell_size,cell_size,cell_size);
					if (V_move == "TIE")
						ctx.drawImage(tie_v_img,j*cell_size,i*cell_size,cell_size,cell_size);
				}
				if (H_move != null) {
					if (H_move == "WIN")
						ctx.drawImage(win_h_img,j*cell_size,i*cell_size,cell_size,cell_size);
					if (H_move == "LOSE")
						ctx.drawImage(lose_h_img,j*cell_size,i*cell_size,cell_size,cell_size);
					if (H_move == "TIE")
						ctx.drawImage(tie_h_img,j*cell_size,i*cell_size,cell_size,cell_size);
				}
				if (F_move != null) {
					if (F_move == "WIN") {
						ctx.drawImage(win_v_img,j*cell_size,i*cell_size,cell_size,cell_size);
						ctx.drawImage(win_h_img,j*cell_size,i*cell_size,cell_size,cell_size);
					}
					if (F_move == "LOSE") {
						ctx.drawImage(lose_v_img,j*cell_size,i*cell_size,cell_size,cell_size);
						ctx.drawImage(lose_h_img,j*cell_size,i*cell_size,cell_size,cell_size);
					}
					if (F_move == "TIE") {
						ctx.drawImage(tie_v_img,j*cell_size,i*cell_size,cell_size,cell_size);
						ctx.drawImage(tie_h_img,j*cell_size,i*cell_size,cell_size,cell_size);
					}
				}
			}
			//****************************
			if (boardString[pos] == "|" && pos != clear){
				ctx.drawImage(v_img,j*cell_size,i*cell_size,cell_size,cell_size);
			}
			if (boardString[pos] == "-" && pos != clear){
				ctx.drawImage(h_img,j*cell_size,i*cell_size,cell_size,cell_size);
			}
		}
	}
}

var rotation_amount = 0;
var piece_pos = -1;
var piece_type;
//given a board string position animate the turning of the piece at that position
// call before board is changed
function animateTurnPiece(pos,type) {
	rotation_amount = 0;
	piece_pos = pos;
	piece_type = type;
	setTimeout(anim,1);
}

function anim() {
	drawBoard(board,piece_pos);
	var ctx = document.getElementById('canvas').getContext('2d');
	
	
	var i = Math.floor(piece_pos/col);
	var j = piece_pos - ((i)*col);
	
	ctx.translate(j*cell_size+(cell_size/2),i*cell_size+(cell_size/2));
	ctx.rotate(rotation_amount * Math.PI / 180);

	if (piece_type == "|"){
		//draw rotated piece
		ctx.drawImage(v_img,-cell_size/2,-cell_size/2,cell_size,cell_size);
	} else {
		//draw rotated piece
		ctx.drawImage(h_img,-cell_size/2,-cell_size/2,cell_size,cell_size);
	}

	ctx.rotate(-rotation_amount * Math.PI / 180);
	ctx.translate(-1*(j*cell_size+(cell_size/2)),-1*(i*cell_size+(cell_size/2)));
	rotation_amount += 15;
	//rotate again if needed

	if (rotation_amount <= 90) {
		setTimeout(anim,1);
	} else {
		drawBoard(board,-1);
		if (!gameover)
			enable_user_input = true;
	}
}

function randomWin() {
	var r=Math.floor(Math.random()*3) //returns random int 0-2
	if(r == 0) var value = "WIN";
	else if(r == 1) var value = "LOSE";
	else var value = "TIE";
	return value;
}

function getNextMoveValue(board) {
    var childrenArray = new Array();
    var count = 0;
    for(i = 0; i < row; i++) {
        for (j = 0; j < col; j++){
            var pos = (i*col)+j;
            var Barray = board.split("");
            if(Barray[pos] == " "){
                Barray[pos] = "|";
                childrenArray[count] = {"board": Barray.toString().replace(/,/g,""), "move": "V" + pos, "value": randomWin()};
                Barray[pos] = "-";
                childrenArray[count+1] = {"board": Barray.toString().replace(/,/g,""), "move": "H" + pos, "value": randomWin()};
                count+=2;
            }
            else {
                if (Barray[pos] == "|")
					Barray[pos] = "-";
                else if (Barray[pos] == "-")
					Barray[pos] = "|";
                childrenArray[count] = {"board": Barray.toString().replace(/,/g,""), "move": "F" + pos, "value": randomWin()};
                count++;
            }
        }
    }
    return {"status":"ok","response":childrenArray};
}



//loads the moves_to_value object and moves_to_child object with the curent board
function loadvalues_and_children() {
	//get json object
	var children = getNextMoveValue(board).response;
	//reset objects
	moves_to_value = {};
	moves_to_child = {};
	
	for (var i=0; i < children.length; i++){
		//get a single child
		var child = children[i];
		
		moves_to_value[child.move] = child.value;
		moves_to_child[child.move] = child.board;
	}
	
	//gameend
	if (children.length == 0) {
		enable_user_input = false;
		gameover = true;
		setTimeout(alerter,1000);
	}
	
	// tempory gameend check
	if (gameend()) {
		gameover = true;
		setTimeout(alerter,1000);
	}
}

//delayed alert function to indicate someone has won
function alerter(){
	if(player == 1)	alert("Left Player Wins");
	else alert("Right Player Wins");
}

//tempory gameend function only for 4x4 board
function gameend() {
	var check = true;
	for (var i = 0; i < row*col; i+=col) {
		for (var n = 0; n < col; n++) {
			if (board[i+n] != "-")
				check = false;
		}
		if (check) {
			//alert("player "+ player +" WINS-");
			enable_user_input = false;
			return true;
		}
		check = true;
	}
	
	for (var i = 0; i < col; i++) {
		for (var n = 0; n < row*col; n+=col) {
			if (board[i+n] != "|")
				check = false;
		}
		if (check) {
			//alert("player "+ player +" WINS|");
			enable_user_input = false;
			return true;
		}
		check = true;
	}
	return false;
}