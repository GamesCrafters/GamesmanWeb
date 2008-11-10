var EMPTY = ' ';
var currentBoard = [[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY]];
var width = 1;
var height = 10;
var moveValueColors = ['', '#8a0000', '#ff0', '#0f0'];
var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];
var meanings = ['Lose','Draw','Win'];
var nextMoves = [];

$(document).ready(function(){
    var game = GCWeb.newPuzzleGame("1210puzzle", width, height, {});
    updateBoard(game, currentBoard);
    
    for(var row=0;row<height;row++) {
        for(var col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).click(function(row, col){
                return function(){
                    for(i=0;i<nextMoves.length;i++){
                        if(nextMoves[i].move == row){
                            game.doMove(nextMoves[i]);
                        }
                    }
                    if(currentBoard[row][col] == EMPTY){
                        currentBoard[row][col] = 'X';
                        updateBoard(game, currentBoard);
                    }
                }
            }(row, col));
        }
    }
});

function updateBoard(game, newBoard) {
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).text(newBoard[row][col]);
        }
    }
    game.getPositionValue(getBoardString(newBoard), function(json){
        if(json.remoteness != -1){ // if there is a remoteness, display the remoteness
            $('#current-value').text('Current Value: '+meanings[json.value-1]);
        }
    });
    game.getNextMoveValues(getBoardString(newBoard), function(json){
        nextMoves = json;
        // clear background color
        for(row=0;row<height;row++) {
            for(col=0;col<width;col++) {
                // resets the css classes on this table cell
                $('#cell-'+row+'-'+col).removeClass();
            }
        }
        // set background color to new values
        for(i=0;i<nextMoves.length;i++) {
            // if the move were something like a3, then you would use the commented lines below instead
            // row = height-nextMoves[i].move[1];
            // col = nextMoves[i].move.charCodeAt(0)-'a'.charCodeAt(0);
            
            // else if the move is a simple integer (in the case of 1210 puzzle), then the col is always 0 and the row is just the move number
            row = nextMoves[i].move;
            col = 0;
            
            // adds the css class to the table cell depending on whether it's a lose, draw, or win
            $('#cell-'+row+'-'+col).addClass(moveValueClasses[nextMoves[i].value-1]);
        }
    });
}

// converts our own representation of the board (2d/3d array) into a board string
function getBoardString(board){
    var str = '';
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            str += board[row][col];
        }
    }
    return str;
}