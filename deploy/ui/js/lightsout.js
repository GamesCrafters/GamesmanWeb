var EMPTY = ' ';
var pieces = [EMPTY, 'X'];
var currentPlayer = 0;
var width = 3;
var height = 3;
var defaultBoard = ""; //new Array(width*height);
for (var i = 0; i < width*height; i++) {
	defaultBoard += EMPTY;
}
var meanings = ['','Lose','Draw','Win'];
var moveValueColors = ['', '#8a0000', '#ff0', '#0f0'];
var moveValueClasses = ['', 'lose-move', 'tie-move', 'win-move'];
var nextMoves = [];

$(document).ready(function(){
    var game = GCWeb.newPuzzleGame("lightsout", width, height, {
	onExecutingMove: function(moveInfo) {updateBoard(game, moveInfo)},
	isValidMove: isValidMove,
	updateMoveValues: updateMoveValues,
	clearMoveValues: clearMoveValues,
	onNextValuesReceived: onNextValuesReceived
	});
    game.loadBoard(defaultBoard);
    
    var htmlstr='<table>';
    for(var row=0;row<height;row++) {
        htmlstr += '<tr>';
        for (var col=0;col<width;col++) {
            cellhtml = '<td id="cell-'+row+'-'+col+'"></td>';
            htmlstr+=cellhtml;
        }
        htmlstr += '</tr>';
    }
    htmlstr+='</table>';
    document.getElementById('board').innerHTML = htmlstr;
    
    for(var row=0;row<height;row++) {
        for(var col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).click(function(row, col){
                return function(){
                    for(i=0;i<nextMoves.length;i++){
                        var thisrow = height-nextMoves[i].move.substr(1);
                        var thiscol = nextMoves[i].move.charCodeAt(0)-'a'.charCodeAt(0);
                            if(row == thisrow && col == thiscol){
                            game.doMove(nextMoves[i])
                        }
                    }
                }
            }(row, col));
        }
    }
});

// called on intiial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    nextMoves = json;
}

function isValidMove(moveInfo)
{
	return true;
}

// colors the board based on move values
function updateMoveValues(nextMoves){
    // reset everything first
    clearMoveValues();
    
    // set background color to new values
    for(i=0;i<nextMoves.length;i++) {
        move = nextMoves[i].move;
	row = move.charCodeAt(0) - 'a'.charCodeAt(0)
	col = height - move.substr(1)
        $('#cell-'+row+'-'+col).addClass(moveValueClasses[nextMoves[i].value-1]);
    }
}

// remove all indicators of move values
function clearMoveValues(){
    for (var row = 0; row < height; row++) {
	for (var col = 0; col < width; col++) {
	    $('#cell-'+row+'-'+col).removeClass();
	}
    }
}

function updateBoard(game, moveInfo) {
	//var newBoard = new Array(height*width);
	//for (var r = 0; r < height; r++)
	//	for (var c = 0; c < width; c++)
	var newBoard = (moveInfo.board)
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).text(newBoard[row*width+col]);
        }
    }
    game.getPositionValue(getBoardString(newBoard), function(json){
        $('#current-value').text('Current Value: '+meanings[json.value]);
    });
    game.getNextMoveValues(getBoardString(newBoard), function(json){
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
    $('#turn').text("It's "+pieces[currentPlayer]+"'s turn!");
}

function getBoardString(board){
    var str = '';
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            str += board[row*width + col];
        }
    }
    return str;
}

