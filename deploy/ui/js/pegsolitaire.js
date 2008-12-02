// constants
var EMPTY = ' ';
var FILLED = 'X';

// custom representation of the board, will be different for different games
var currentBoard;
var defaultBoard = ".;oo;ooo;oooo;ooooo;";

// easy reference to these constants for yourself (it's static for now, but we might want this to be user-defined later)
var width = 1;
var height = 10;

var boardSize = 5;
var havePeg = 0;
var seen = 0;
var curPeg;


// used for coloring the table cells
var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];

// other state
var nextMoves = [];
var lastMove = -1;

// bootstrapping function - start up this program after the page structure loads
function initBoard() {
    // create a new game
    var game = GCWeb.newPuzzleGame("TriangularPegSolitaire", boardSize, boardSize, {
        onNextValuesReceived:onNextValuesReceived,
        isValidMove: isValidMove,
        onExecutingMove: onExecutingMove,
        updateMoveValues: updateMoveValues, 
        clearMoveValues: clearMoveValues,
        getPositionValue: getPositionValue,
        getNextMoveValues: getNextMoveValues,
        debug: 0
    });
    // load the default board
    game.loadBoard(getBoardString(defaultBoard));
    currentBoard = defaultBoard;
    alert(nextMoves[0].board);
    for (var row = 0; row < boardSize; row ++) {
        for (var col = 0; col < row + 1; col ++) {
            // what happens when you click a table cell
            //console.log($('#r'+row+' > #p'+col));
            $('#r'+row+' > #p'+col).click(function(row, col){
                return function(){
                    // find the move information that we stored and attempt to execute the move
                    /*for(i=0;i<nextMoves.length;i++){
                        if(nextMoves[i].move == row){
                            game.doMove(nextMoves[i]);
                        }
                    }*/
                    //alert("blah");
                    //alert(nextMoves);
                    var cursor = $("body").css("cursor");
                    if (cursor == "pointer") {
                      //for (var n = 0; n < nextMoves.length()); n ++) {
                        //var bString = nextMoves[i].move.
                      //}
                    }
                }
            }(row, col));
        }
    }
}

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
    // reset everything first
    clearMoveValues();
    
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

// remove all indicators of move values
function clearMoveValues(){
    // clear background color
    for(row=0;row<height;row++) {
        for(col=0;col<width;col++) {
            // resets the css classes on this table cell
            $('#cell-'+row+'-'+col).removeClass();
        }
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

// local debugging
function getPositionValue(position, onValueReceived){
    onValueReceived({
        "board": position, 
        "move": null, 
        "remoteness": "5",
        "value": 3
    });
    return;
}

function getNextMoveValues(position, onMoveValuesReceived){    
    var retval = [];
    var last = -1;
    for(i=0;i<args.height;i++) {
        if(position[i] == 'X'){
            last = i;
        }
    }
    if(last+1 < args.height){
        newBoard = '';
        for(i=0;i<args.height;i++) {
            newBoard += (i==last+1) ? 'X' : position[i];
        }
        retval.push({"board": newBoard, "move": (last+1), "remoteness": Math.floor((args.height-last-1)/2), "status": "OK", "value": 3});
    }
    if(last+2 < args.height){
        newBoard = '';
        for(i=0;i<args.height;i++) {
            newBoard += (i==last+2) ? 'X' : position[i];
        }
        retval.push({"board": newBoard, "move": (last+2), "remoteness": Math.floor((args.height-last-2)/2), "status": "OK", "value": 3});
    }
    onMoveValuesReceived(retval);
}

//Allows for Enter key to be used to confirm input in text box.
function enterKey(aEvent) {
	if (aEvent.keyCode == 13) {
		validateInput();
	}
}

function validateInput() {
    var tmp = $("#boardSizeNumber").val();    
    if (tmp.indexOf(".") >= 0 || !isFinite(tmp) || tmp < 5) {
      $("#boardSizeNumber").val("");         
      alert("Please enter a valid board size.");
    } else {
      if (tmp != '')
        boardSize = tmp;
      createBoard();
      $("#boardSizeInput").css("display", "none");
      $("#mainBoard").css("display", "block");
      var board = ".;";      
      for (var row = 1; row < boardSize; row ++) {
        //$("<div id='r"+row+"'>").appendTo("#mainBoard");                        
        for (var peg = 0; peg < row+1; peg ++) {
          //$('<img src="images/white96.png" id="p'+peg+'" alt="Peg" onclick="checkPeg(this)">').appendTo("#r"+row);
          board += "o";
        }
        board += ";";
      }
      defaultBoard = board;
      initBoard();
    }
}

function createBoard() {
  var divWidth = document.getElementById("game").offsetWidth - 20;
  var resize = divWidth/boardSize
  $("<div id='r0'>").appendTo("#mainBoard");
  $('<img src="images/blank96.png" id="p0" alt="Peg" onclick="checkPeg(this)">').appendTo("#r0");
  for (var row = 1; row < boardSize; row ++) {
    $("<div id='r"+row+"'>").appendTo("#mainBoard");
    for (var peg = 0; peg < row+1; peg ++)
      $('<img src="images/white96.png" id="p'+peg+'" alt="Peg" onclick="checkPeg(this)">').appendTo("#r"+row);
  }
  $("#mainBoard > div > img").css("height", resize+"px");
  $("#mainBoard > div > img").css("width", resize+"px");
  $("#mainBoard > div").css("line-height", "0");
  resizePeg(resize);
}

function checkPeg(peg) {  
  var cursor = $("body").css("cursor");
  var img = $(peg).attr("src");  
  if (peg.nodeName == "IMG") {  
    havePeg = 1;    
    if (curPeg == peg && cursor == "pointer") {
      $(peg).attr("src", "images/white96.png");
      hideTrail();
      havePeg = 0;
      seen = 0
    } else if (img.indexOf("white") >= 0 && cursor == "auto") {
      curPeg = peg;
      $(peg).attr("src", "images/black96.png");
      showTrail();
    } else if (img.indexOf("blank") >= 0 && cursor == "pointer") {    
      var remove = jumpPeg(peg);      
      $(peg).attr("src", "images/white96.png");
      $("#r"+remove[0] + " > #p"+remove[1]).attr("src", "images/blank96.png");
      $(curPeg).attr("src", "images/blank96.png");      
      hideTrail();
      havePeg = 0;
      seen = 0;
    }
  } else {    
    if (cursor == "pointer" && havePeg == 1 && seen == 1) {            
      $(curPeg).attr("src", "images/white96.png");      
      hideTrail();
      seen = 0
    } else if (cursor == "pointer" && havePeg == 1 && seen == 0)
      seen += 1;
  }
}

function jumpPeg(peg) {
  var newCol = $(peg).attr("id");    
  var newRow = $(peg).parent().attr("id");
  var newColNum = parseInt(newCol.substr(1));
  var newRowNum = parseInt(newRow.substr(1));
  
  var oldCol = $(curPeg).attr("id");    
  var oldRow = $(curPeg).parent().attr("id");
  var oldColNum = parseInt(oldCol.substr(1));
  var oldRowNum = parseInt(oldRow.substr(1));
  
  var remRow = (oldRowNum+newRowNum)/2;
  var remCol = (oldColNum+newColNum)/2;  
  return new Array(remRow, remCol);  
}

function fixPeg() {
  var divWidth = document.getElementById("game").offsetWidth - 20;
  var resize = divWidth/boardSize  
  $("#mainBoard > div > img").css("height", resize+"px");
  $("#mainBoard > div > img").css("width", resize+"px");
  resizePeg(resize);
}