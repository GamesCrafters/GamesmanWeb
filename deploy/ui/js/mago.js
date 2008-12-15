// JavaScript Document
var EMPTY = ' ';
var currentBoard = [];
var pieces = ['X', 'O'];
var currentPlayer = 0;
var defaultBoard = "";
var width = 4;
var height = 4;
var meanings = ['','Lose','Draw','Win'];
var moveValueColors = ['#8a0000', '#ff0', '#0f0'];
var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];
var nextMoves = [];
/*
var urlParams = window.location.toString().split("?")[1].split("&");
for (var i = 0; i < urlParams.length; i++) {
	var key = unescape(urlParams[i].split("=")[0]);
 	var value = unescape(urlParams[i].split("=")[1]);
 	if (key == "puzzle") {
 	puzzletype = value;
}
if (key == "height") {
	height = parseInt(value);
 	$("#heightinput").val(height)
}
if (key == "width") {
 	width = parseInt(value);
 	$("#widthinput").val(width)
 	}
}
*/
$(document).ready(function(){
	$("#startbutton").click(function(){
		var mywidth = parseInt($("#widthinput").val());
		var myheight = parseInt($("#heightinput").val());
		if (! (mywidth > 0 && myheight > 0)) {
			alert("You specified an invalid width '"+mywidth+"' or height '"+myheight+"'");
			return false;
		}
		width = mywidth;
		height = myheight;
		$("#optionsform").hide();
		//generate board
		var imgWidth = 50;
		var imgHeight = 50;
		var tableposition = $("#test").position();
		for(var row=0;row<height+1;row++) {
			var cellwid, cellhei;
			if (row == 0 || row == height)
				cellhei = 30 + imgHeight/2;
			else
				cellhei = 30 + imgHeight;
			document.getElementById('test').insertRow(0);
			var element = "";
			for(var col=0;col<width+1;col++) {
				if (col == 0 || col == width)
					cellwid = 30 + imgWidth/2;
				else
					cellwid = 30 + imgWidth;
				var colString = "<td border='2' width='"+cellwid+"px' height='"+cellhei+"px' style='background: #9F5000; vertical-align: top'>";
				element += colString;
				if (row != height && col != 0) {
					element += "<div style='margin-top: "+ (-imgHeight/2) +"px; margin-left: " + (-imgWidth/2) + "px;'><img id='cell-"+ (row) +"-"+ (col-1) +"' class='click' src='images/mago/blank.png'></div>";
				}
				element += "</td>";
			}
			document.getElementById('test').rows[0].innerHTML = element;
		}
		
		//generate pieces
		var topStart = tableposition.top + 8 + imgHeight/2;
		var leftStart = tableposition.left + 8 + imgWidth/2;
		var pieceString = "";

		for(var row=0;row<height;row++) {
			var top = topStart + (100+8)*row;
			for(var col=0;col<width;col++) {
				var left = leftStart + (100+8)*col;
				// pieceString += "<span style='position:absolute; top: "+ top +"px; left: " + left + "px;'> <img id='cell-"+ row +"-"+ col +"' class='click' src='images/mago/blank.png'> </span>";
				defaultBoard += EMPTY;
				currentBoard[row*width + col] = EMPTY;
			}
		}
		document.getElementById('pieces').innerHTML = pieceString;
		
	
	   var game = GCWeb.newPuzzleGame("mago", width, height, {
									 onExecutingMove: function(moveInfo) {updateBoard(game, moveInfo)},
 									 isValidMove: isValidMove,
									 updateMoveValues: function(nextMoves) {updateMoveValues(game, nextMoves);},
									 clearMoveValues: clearMoveValues,
									 onNextValuesReceived: onNextValuesReceived, debug: 0});
	   game.loadBoard(defaultBoard);
		
		for(var row=0;row<height;row++) {
			for(var col=0;col<width;col++) {
				$('#cell-'+row+'-'+col).click(function(row, col){
					return function(){
						for (var i = 0; i < nextMoves.length; i++) {
							var thisrow = height-nextMoves[i].move.substr(1);
							var thiscol = nextMoves[i].move.charCodeAt(0)-'a'.charCodeAt(0);
							if(row == thisrow && col == thiscol){
								game.doMove(nextMoves[i]);
								return;
							}
						}
						//alert("not doing move: thisrow = " + thisrow + " thiscol = " + thiscol);
						/*
						if(currentBoard[row*height + col] == EMPTY && !win){

							currentBoard[row*height + col] = pieces[currentPlayer];
							//currentPlayer = (currentPlayer+1)%2;
							//gui logic{
							if (currentPlayer == 0) { 
								document.getElementById('cell-'+row+'-'+col).src = "images/mago/black.png";
								//$(this).text("<img id=#cell-"+row+"-"+col+" class='red' src='img/black.png'/>");
							}
							else {
								//alert("enter else list");
								document.getElementById('cell-'+row+'-'+col).src = "images/mago/white.png";
							}
							//currentPlayer = (currentPlayer+1)%2;  
							// end gui logic
							
							var thisrow = height-nextMoves[i].move.substr(1);
							var thiscol = nextMoves[i].move.charCodeAt(0)-'a'.charCodeAt(0);
							alert("do we even get here?");
							if(row == thisrow && col == thiscol){
								alert("this is called");
								game.doMove(nextMoves[i]);
							}
							
							//onExecutingMove(game, currentBoard);
							 
						}*/
					}
				}(row, col));
			}
		}
	});
});


function onNextValuesReceived(json){
	nextMoves = json;
}

function isValidMove(moveInfo) {
	return true;
}

function updateMoveValues(game, nextMoves){
	var row, col, move;
 	// reset everything first
 	clearMoveValues();

 	// set background color to new values
 	for(i=0;i<nextMoves.length;i++) {
	 	move = nextMoves[i].move;
 		col = move.charCodeAt(0) - 'a'.charCodeAt(0);
		row = height - move.substr(1)
		$('#cell-'+row+'-'+col).addClass(moveValueClasses[nextMoves[i].value-1]);
	}
}
function clearMoveValues(){
	for (var row = 0; row < height; row++) {
		for (var col = 0; col < width; col++) {
 			$('#cell-'+row+'-'+col).removeClass();
 		}
 	}
}
function onExecutingMove(game, currentBoard){
    game.getPositionValue(getBoardString(currentBoard), function(json){
        $('#current-value').text('Current Value: '+meanings[json.value]);
    });
    game.getNextMoveValues(getBoardString(currentBoard), function(json){
        // clear background color
        for(row=0;row<height;row++) {
            for(col=0;col<width;col++) {
                $('#cell-'+row+'-'+col).removeClass();
            }
        }
        // set background color to new values
        for(i=0;i<json.length;i++) {
            row = height-json[i].move[1];
            col = json[i].move.charCodeAt(0)-'a'.charCodeAt(0);
            $('#cell-'+row+'-'+col).addClass(moveValueClasses[json[i].value]);
        }
    });
	//checkWin(getBoardString(currentBoard));
}
function updateBoard(game, moveInfo) {
	var newBoard = (moveInfo.board);
 	for(row=0;row<height;row++) {
 		for(col=0;col<width;col++) {
			if (newBoard[row*width+col] == pieces[0]) { 
				document.getElementById('cell-'+row+'-'+col).src = "images/mago/black.png";
				//$(this).text("<img id=#cell-"+row+"-"+col+" class='red' src='img/black.png'/>");
			}
			else if (newBoard[row*width+col] == pieces[1]){
				document.getElementById('cell-'+row+'-'+col).src = "images/mago/white.png";
			}
			else if (newBoard[row*width+col] == EMPTY){
				document.getElementById('cell-'+row+'-'+col).src = "images/mago/blank.png";
			}
			else alert("Something has gone horribly wrong");
 		}
 	}
 	currentPlayer = (currentPlayer+1)%2;
}
