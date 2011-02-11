var imgDir = "images/quickcross/";
var imgSrc = [imgDir+"blueh.png", imgDir+"bluev.png",
				imgDir+"redh.png", imgDir+"redv.png",
				imgDir+"cell.png"];

$(document).ready(function(){
	// your function statements go here
});
	
// create a new game
var game = GCWeb.newPuzzleGame("quickcross", width, height, {
    onNextValuesReceived: onNextValuesReceived,
    isValidMove: isValidMove,
    onExecutingMove: onExecutingMove,
    updateMoveValues: updateMoveValues,
    clearMoveValues: clearMoveValues
});

// load the default board
game.loadBoard(getBoardString(defaultBoard));
currentBoard = defaultBoard;

//User Input
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
            }(row, col)); // eval the outer function NOW and bind row and col to the inner function
        }
    }