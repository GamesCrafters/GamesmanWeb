// JavaScript Document
var EMPTY = ' ';
//var currentBoard = [[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY]];
var currentBoard = [[EMPTY,EMPTY],[EMPTY,EMPTY]];
var pieces = ['X', 'O'];
var currentPlayer = 0;
var width = 3;
var height = 3;
var meanings = ['','Lose','Draw','Win'];
var moveValueColors = ['', '#8a0000', '#ff0', '#0f0'];
var moveValueClasses = ['', 'lose-move', 'tie-move', 'win-move'];


$(document).ready(function(){
      $turn = 0;
      $board = new Array();
		
		//generate board
		/*
		for(var row=0;row<height;row++) {
			for(var col=0;col<width;col++) {
				var board = document.getElementById('board');
				if (row == 0 && col == 0) {// NWcorner
					document.write('<span><img src="img/nwcorner.png" style="position:absolute;"></span>');
				}
				else if (row == 0 && col == width) {// NEcorner 
					document.write('<span><img src="img/nwcorner.png" style="position:absolute; left:108;"></span>');
				}
				else if (row == height && col == 0) {// SWcorner  
				}
				else if (row == height && col == width) {// SEcorner 
				}
				else if (row == 0) {// Top
				}
				else if (row == width) { // Bottom
				}
				else if (col == 0) { //left
				}
				else if (col == height) { // right
				}
				else { // middle
				}
			}
		}
		*/
	   var game = GCWeb.newPuzzleGame("mago", 2, 2, {debug: 1});
		for(var row=0;row<height;row++) {
			for(var col=0;col<width;col++) {
				$('#cell-'+row+'-'+col).click(function(row, col){
					return function(){
						if(currentBoard[row][col] == EMPTY){
							
								currentBoard[row][col] = pieces[currentPlayer];
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
							  currentPlayer = (currentPlayer+1)%2;
		
							  // end gui logic
							 
							onExecutingMove(game, currentBoard);
							 
						}
					}
				}(row, col));
			}
		}
});

function getBoardString(currentBoard) {
	var str = '';
	for(row=0;row<height;row++) {
		for(col=0;col<width;col++) {
			str += board[row][col];
		}
	}
	return str;
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
}