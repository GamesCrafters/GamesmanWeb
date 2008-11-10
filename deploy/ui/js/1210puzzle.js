// constants
var EMPTY = ' ';
var FILLED = 'X';

// custom representation of the board, will be different for different games
var currentBoard;
var defaultBoard = [[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY],[EMPTY]];

// easy reference to these constants for yourself (it's static for now, but we might want this to be user-defined later)
var width = 1;
var height = 10;

// used for coloring the table cells
var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];

// other state
var nextMoves = [];
var lastMove = -1;

// bootstrapping function - start up this program after the page structure loads
$(document).ready(function(){
    // create a new game
    var game = GCWeb.newPuzzleGame("1210puzzle", width, height, {
        updateMoveValues: updateMoveValues, 
        onNextValuesReceived:onNextValuesReceived,
        isValidMove: isValidMove,
        onExecutingMove: onExecutingMove
    });
    // load the default board
    game.loadBoard(getBoardString(defaultBoard));
    currentBoard = defaultBoard;
    
    for(var row=0;row<height;row++) {
        for(var col=0;col<width;col++) {
            // what happens when you click a table cell
            $('#cell-'+row+'-'+col).click(function(row, col){
                return function(){
                    // find the move information that we stored and attempt to execute the move
                    for(i=0;i<nextMoves.length;i++){
                        if(nextMoves[i].move == row){
                            game.doMove(nextMoves[i]);
                        }
                    }
                }
            }(row, col));
        }
    }
});

// check to see whether the current move is valid
function isValidMove(moveInfo)
{
    return currentBoard[moveInfo.move][0] == EMPTY && moveInfo.move > lastMove
}

// called when doMove executes successfully
function onExecutingMove(moveInfo){
    // update our own state
    lastMove = moveInfo.move;
    currentBoard[moveInfo.move][0] = FILLED;

    // update the graphical display
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).text(currentBoard[row][col]);
        }
    }
}

// called on intiial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    nextMoves = json;
}

// colors the board based on move values
function updateMoveValues(nextMoves){
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