var EMPTY = ' ';
var currentBoard = [[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY]];
var pieces = ['X', 'O'];
var currentPlayer = 0;
var width = 3;
var height = 3;
var meanings = ['','Lose','Draw','Win'];

$(document).ready(function(){
    game = GCWeb.newDartboardGame("ttt", "3", "3", {});
    updateBoard(currentBoard);
    //$('#optimalMove').text(game.getNextMoveValues(currentValue, function(){}));
    
    for(var row=0;row<height;row++) {
        for(var col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).click(function(row, col){
                return function(){
                    if(currentBoard[row][col] == EMPTY){
                        currentBoard[row][col] = pieces[currentPlayer];
                        currentPlayer = (currentPlayer+1)%2;
                        updateBoard(currentBoard);
                    }
                }
            }(row, col));
        }
    }
});

function updateBoard(newBoard) {
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).text(newBoard[row][col]);
        }
    }
    game.getPositionValue(getBoardString(newBoard), function(json){
        $('#current-value').text('Current Value: '+meanings[json.value]);
    });
    
}

function getBoardString(board){
    var str = '';
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            str += board[row][col];
        }
    }
    return str;
}