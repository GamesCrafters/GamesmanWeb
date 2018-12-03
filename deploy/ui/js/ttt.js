var EMPTY = ' ';
var currentBoard = [[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY]];
var pieces = ['X', 'O'];
var currentPlayer = 0;
var width = 3;
var height = 3;
var meanings = ['','Lose','Draw','Win'];
var moveValueColors = ['', '#8a0000', '#ff0', '#0f0'];
var moveValueClasses = ['', 'lose-move', 'tie-move', 'win-move'];
var coordinatelist = 
[[0,0], [0,1], [0,2],
[1,0], [1,1], [1,2],
[2,0], [1,2], [2,2]];
var winningtriples = 
[[[0,0], [0,1], [0,2]],
[[1,0], [1,1], [1,2]],
[[2,0], [1,2], [2,2]],
[[0,0], [1,0], [2,0]],
[[0,1], [1,1], [1,2]],
[[0,2], [1,2], [2,2]],
[[0,0], [1,1], [2,2]],
[[0,2], [1,1], [2,0]]]
var winnerStatus = ["X wins" , "O wins","No winner yet", "It's a tie"];
var winnerStatusnum = 2;

$(document).ready(function(){
    var game = GCWeb.newGame("ttt", width, height, {});
    updateBoard(game, currentBoard);
    
    for(var row=0;row<height;row++) {
        for(var col=0;col<width;col++) {
            $('#cell-'+row+'-'+col).click(function(row, col){
                return function(){
                    if(currentBoard[row][col] == EMPTY){
                        currentBoard[row][col] = pieces[currentPlayer];
                        currentPlayer = (currentPlayer+1)%2;
                        for (var i = 0; i < winningtriples.length; i += 1){
                            var triple = winningtriples[i];
                            var win = 0;
                            for (var j = 0; j < triple.length; j += 1){
                                var row = triple[j][0];
                                var col = triple[j][1];
                                if (currentBoard[row][col] == pieces[currentPlayer]){
                                    win += 1;
                                }
                            }
                            if (win == 3){
                                winnerStatusnum = currentPlayer;
                            }
                        }
                        var tiecount = 0;
                        for (var k = 0; k < coordinatelist.length; k += 1){
                            var row = coordinatelist[k][0];
                            var col = coordinatelist[k][1];
                            if (currentBoard[row][col] == EMPTY){
                                tiecount += 1;
                            }
                        }
                        if (tiecount == 0){
                            winnerStatusnum = 3;
                        }
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
    $('#winner').text(winnerStatus[winnerStatusnum])
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