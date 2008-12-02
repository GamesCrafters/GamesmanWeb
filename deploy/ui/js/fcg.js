// constants
const FOX = 'F';
const CHICKEN = 'C';
const GRAIN = 'G';
const BOAT = '-';

// custom representation of the board, will be different for different games
var defaultBoard = "FCGB | ";

// easy reference to these constants for yourself (it's static for now, but we might want this to be user-defined later)
var width = 3;
var height = 1;
var horizontalMovement;

// used for coloring the table cells
var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];

// other state
var boatOnLeft = true;
var foxOnLeft = true;
var chickenOnLeft = true;
var grainOnLeft = true;
var nextMoves = [];
var lastMove = -1;

// bootstrapping function - start up this program after the page structure loads
$(document).ready(function(){
    // create a new game
    var game = GCWeb.newPuzzleGame("fcg", width, height, {
        onNextValuesReceived: onNextValuesReceived,
        isValidMove: isValidMove,
        onExecutingMove: onExecutingMove,
        updateMoveValues: updateMoveValues, 
        clearMoveValues: clearMoveValues,
        //getPositionValue: getPositionValue,
        //getNextMoveValues: getNextMoveValues,
        //debug: 1
    });
	// calculate by how much to move the pieces
	var passengerWidth = $("#fox").outerWidth() + $("#chicken").outerWidth() + $("#grain").outerWidth();
	alert($("#game").width() + " " + passengerWidth);
	horizontalMovement = $("#game").width() - Math.max(passengerWidth, $("#boat > img").outerWidth());
	
    // load the default board
    game.loadBoard(defaultBoard);
    $("#fox").click(function(){
        if(boatOnLeft == foxOnLeft){
            for(i=0;i<nextMoves.length;i++){
                if(nextMoves[i].move == FOX){
                    game.doMove(nextMoves[i]);
                }
            }
        }
    });
    $("#chicken").click(function(){
        if(boatOnLeft == chickenOnLeft){
            for(i=0;i<nextMoves.length;i++){
                if(nextMoves[i].move == CHICKEN){
                    game.doMove(nextMoves[i]);
                }
            }
        }
    });
    $("#grain").click(function(){
        if(boatOnLeft == grainOnLeft){
            for(i=0;i<nextMoves.length;i++){
                if(nextMoves[i].move == GRAIN){
                    game.doMove(nextMoves[i]);
                }
            }
        }
    });
    $("#boat").click(function(){
        for(i=0;i<nextMoves.length;i++){
            if(nextMoves[i].move == BOAT){
                game.doMove(nextMoves[i]);
            }
        }
    });
});

// check to see whether the current move is valid
function isValidMove(moveInfo)
{
    if(moveInfo.move == FOX)
        return boatOnLeft == foxOnLeft;
    else if(moveInfo.move == CHICKEN)
        return boatOnLeft == chickenOnLeft;
    else if(moveInfo.move == GRAIN)
        return boatOnLeft == grainOnLeft;
    return true
}

// called when doMove executes successfully
function onExecutingMove(moveInfo){
    // update our own state
    lastMove = moveInfo.move;
    if(moveInfo.move == FOX){
        $("#fox").animate({"left": (foxOnLeft?'+':'-')+"="+horizontalMovement+"px"}, "slow");
        $("#boat").animate({"left": (boatOnLeft?'+':'-')+"="+horizontalMovement+"px"}, "slow");
        boatOnLeft = !boatOnLeft;
        foxOnLeft = !foxOnLeft;
    } else if(moveInfo.move == CHICKEN) {
        $("#chicken").animate({"left": (chickenOnLeft?'+':'-')+"="+horizontalMovement+"px"}, "slow");
        $("#boat").animate({"left": (boatOnLeft?'+':'-')+"="+horizontalMovement+"px"}, "slow");
        boatOnLeft = !boatOnLeft;
        chickenOnLeft = !chickenOnLeft;
    } else if(moveInfo.move == GRAIN) {
        $("#grain").animate({"left": (grainOnLeft?'+':'-')+"="+horizontalMovement+"px"}, "slow");
        $("#boat").animate({"left": (boatOnLeft?'+':'-')+"="+horizontalMovement+"px"}, "slow");
        boatOnLeft = !boatOnLeft;
        grainOnLeft = !grainOnLeft;
    } else {
        $("#boat").animate({"left": (boatOnLeft?'+':'-')+"="+horizontalMovement+"px"}, "slow");
        boatOnLeft = !boatOnLeft;
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
        move = nextMoves[i].move;
        if(move == FOX)
            $('#fox').addClass(moveValueClasses[nextMoves[i].value-1]);
        else if(move == CHICKEN)
            $('#chicken').addClass(moveValueClasses[nextMoves[i].value-1]);
        else if(move == GRAIN)
            $('#grain').addClass(moveValueClasses[nextMoves[i].value-1]);
        else
            $('#boat').addClass(moveValueClasses[nextMoves[i].value-1]);
    }
}

// remove all indicators of move values
function clearMoveValues(){
    $('#fox').removeClass();
    $('#chicken').removeClass();
    $('#grain').removeClass();
    $('#boat').removeClass();
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
    retval.push({"board": "", "move": FOX, "remoteness": -1, "status": "OK", "value": 3});
    retval.push({"board": "", "move": CHICKEN, "remoteness": -1, "status": "OK", "value": 3});
    retval.push({"board": "", "move": GRAIN, "remoteness": -1, "status": "OK", "value": 3});
    retval.push({"board": "", "move": BOAT, "remoteness": -1, "status": "OK", "value": 3});
    onMoveValuesReceived(retval);
}