var EMPTY = ' ';
var width = 5;
var height = 5;
var puzzletype = "ttt";

// N-ARY TIMES OPERATOR vs. LARGE CIRCLE
//var piecechars = {'X':"\u2A2F", 'O':"\u3007",' ':' '};
var piecechars = {'X':"\u00D7", 'O':"O",' ':' '};
// 2A09
// white/black smiley:
//var piecechars = {'X':"\u263A", 'O':"\u263B",' ':' '};


var playerpieces = ['X', 'O'];
var currentPlayer = 0;

var defaultBoard = ""; //new Array(width*height);

var moveValueNames = {1:'lose',2:'tie',3:'win','lose':'lose','tie':'tie','win':'win','draw':'draw'};

var moveValueClasses = {'lose':'lose-move', 'tie':'tie-move', 'win':'win-move','draw':'tie-move'};
var nextMoves = [];

var ttthack=true;

var urlParams = "https://nyc.cs.berkeley.edu:8080/ui/puzzle.jsp?puzzle=ttt".split("#")[0].split("?")[1].split("&");
$(document).ready(function(){
for (var i = 0; i < urlParams.length; i++) {
    var key = unescape(urlParams[i].split("=")[0]);
    var value = unescape(urlParams[i].split("=")[1]);
    if (key == "puzzle") {
        puzzletype = value;
    }
    if (key == "height") {
        height = parseInt(value); ttthack=false;
        $("#heightinput").val(height)
    }
    if (key == "width") {
        width = parseInt(value); ttthack=false;
        $("#widthinput").val(width)
    }
    if (key == "pieces") {
        pcs = parseInt(value);
        $("#piecesinput").val(pcs)
    }
}
if (puzzletype=="atarigo") $("#piecesinput").hide();
if (ttthack && puzzletype == "ttt") {
    width=3; height=3;
    $("#heightinput").val(3); $("#widthinput").val(3);
}
  function startGame(){
	var mywidth = parseInt($("#widthinput").val());
    var myheight = parseInt($("#heightinput").val());
    var pieces = parseInt($("#piecesinput").val());
    if (! (mywidth > 0 && myheight > 0)) {
        alert("You specified an invalid width '"+mywidth+"' or height '"+myheight+"'");
        return false;
    }
    width = mywidth;
    height = myheight;
    $("#optionsform").hide();
    window.location.hash="#"+width+","+height+","+pieces;

    defaultBoard = ""; //new Array(width*height);
    for (var i = 0; i < width*height; i++) {
        defaultBoard += EMPTY;
    }
    
    var game = GCWeb.newPuzzleGame(puzzletype, width, height, {
	onExecutingMove: function(moveInfo) {updateBoard(game, moveInfo)},
	isValidMove: isValidMove,
	updateMoveValues: function(nextMoves) {updateMoveValues(game, nextMoves);},
	clearMoveValues: clearMoveValues,
	onNextValuesReceived: onNextValuesReceived,
	options: {pieces: pieces}
	});
    game.loadBoard(defaultBoard);
    
    var htmlstr='<table>';
    for(var row=0;row<height;row++) {
        htmlstr += '<tr>';
        for (var col=0;col<width;col++) {
            cellhtml = '<td id="cell-'+row+'-'+col+'">&nbsp;</td>';
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
                        var thisrow;
                        if (puzzletype == "connect4")
                            thisrow = row;
                        else
                            thisrow = height-nextMoves[i].move.substr(1);
                        var thiscol = getMoveColumn(nextMoves[i].move);
                        if(row == thisrow && col == thiscol){
                            game.doMove(nextMoves[i]);
                            nextMoves = [];
                            break;
                        }
                    }
                }
            }(row, col));
        }
    }
  };
  $("#startbutton").click(startGame);
  if (location.hash != '') {
    var args = location.hash.substr(1).split(',');
    if (args.length >= 3) {
      var wid=parseInt(args[0]);
      var hei=parseInt(args[1]);
      var pcs=parseInt(args[2]);
      $("#widthinput").val(""+wid);
      $("#heightinput").val(""+hei);
      $("#piecesinput").val(""+pcs);
      startGame();
    }
  }
});

// called on intiial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    nextMoves = json;
    $('#turn').text("It's "+piecechars[playerpieces[currentPlayer]]+"'s turn!");
    if (nextMoves.length == 0) {
        $('#turn').text("Game Over!");
     }
}

function isValidMove(moveInfo)
{
	return true;
}

function getMoveColumn(move) {
        if (move.charCodeAt(0) >= '0'.charCodeAt(0) &&
            move.charCodeAt(0) <= '9'.charCodeAt(0)) {
            return parseInt(move);
        } else if (move.charCodeAt(0) < 'a'.charCodeAt(0)) {
            return move.charCodeAt(0) - 'A'.charCodeAt(0);
        } else {
            return move.charCodeAt(0) - 'a'.charCodeAt(0);
        }
}

// colors the board based on move values
function updateMoveValues(game, nextMoves){
    var row, col, move;
    // reset everything first
    clearMoveValues();
   
    // set background color to new values
    for(i=0;i<nextMoves.length;i++) {
        move = nextMoves[i].move;
        if (puzzletype == "connect4")
            row = 0;
        else
            row = height - parseInt(move.substr(1));
        col = getMoveColumn(move);
        if (typeof(nextMoves[i].value) != 'undefined') {
            if (puzzletype == "connect4") {
                var j;
                for (j = 0; j < height; j++){
                    $('#cell-'+j+'-'+col).addClass(moveValueClasses[moveValueNames[nextMoves[i].value]]);
                }
            } else {
                $('#cell-'+row+'-'+col).addClass(moveValueClasses[moveValueNames[nextMoves[i].value]]);
            }
        }
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
	var newBoard = (moveInfo.board);
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            $('#cell-'+(height-row-1)+'-'+col).text(piecechars[newBoard[row*width+col]]);
        }
    }
    currentPlayer = (currentPlayer+1)%2;
    $('#turn').text("It's "+piecechars[playerpieces[currentPlayer]]+"'s turn!");
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

