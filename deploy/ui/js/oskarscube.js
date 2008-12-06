// custom representation of the board, will be different for different games
var currentBoard;
var defaultBoard;

// easy reference to these constants for yourself (it's static for now, but we might want this to be user-defined later)
var width = 1;
var height = 10;

// used for coloring the table cells
var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];

// other state
var nextMoves = [];
var lastMove = -1;

// create a new game
//TODO - width and height don't make sense for oskars cube!
var game;

// bootstrapping function - start up this program after the page structure loads
$(document).ready(function(){
    // load the default board
    game  = GCWeb.newPuzzleGame("oskarscube", width, height, {
            onNextValuesReceived: onNextValuesReceived,
            isValidMove: isValidMove,
            onExecutingMove: onExecutingMove,
            updateMoveValues: updateMoveValues, 
            clearMoveValues: clearMoveValues,
            getBoardString: getBoardString,
            getPositionValue: getPositionValue,
            getNextMoveValues: getNextMoveValues,
            debug: 1
           }); 
    game.loadBoard(getBoardString(defaultBoard));
    currentBoard = defaultBoard;
    $('#optimalMove').click(function() {
    	document.getElementById('cube').doMove($(this).text());
    });
});

//function cubeStateChanged(turn) {
//	if(turn != null) { //this means a turn actually happened
//		//TODO - this won't capture cube rotations, or "double layer" turns
//		for(i in nextMoves) {
//			if(nextMoves[i].move == turn) {
//				game.doMove(nextMoves[i]);
//				break;
//			}
//		}
//	} else {
//		//TODO - deal with cube reset/sticker's changing
//	}
//}

// check to see whether the current move is valid
function isValidMove(moveInfo)
{
	//This needs to be modified to actually check..
	alert(nextMoves + ':::' + moveInfo)
	for (i in nextMoves){
		if (nextMoves[i].move == moveInfo){
			$('#debug').text(moveInfo+' was valid');
			return true;
		}
	}
//	$('#debug').text(moveInfo+'');
//	$('#debug').text(moveInfo+' was invalid');
	$('#debug').text(nextMoves);
    return false;
}

// called when doMove executes successfully
function onExecutingMove(moveInfo){
    //Due to the nature of the applet, I'm pretty sure nothing should go here
}

// called on intiial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
//	alert('inside onNextValuesRecieved');
    nextMoves = json;
}

// colors the board based on move values
function updateMoveValues(nextMoves){
    // reset everything first
//    clearMoveValues();
//
//	document.getElementById('optimalMove').style.display = 'block';
//    msg = ''
//   for(i in nextMoves) {
//    	msg += " | " + nextMoves[i].remoteness + ": " + nextMoves[i].move;
//    }
//    nextMoves.sort(function(a, b) {
//   	return a.remoteness - b.remoteness;
//    });
//    $('#optimalMove').text(nextMoves[0].move);
}

// remove all indicators of move values
function clearMoveValues(){
	document.getElementById('optimalMove').style.display = 'none';
}

// converts our own representation of the board (2d/3d array) into a board string
function getBoardString(board){
	//return document.getElementById('cube').getBoardString();
	return "000";
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

function getNextMoveValues(position, onMoveValuesReceived) {
    var retval = [];
	retval.push({"board": "000", "move": "001", "remoteness": Math.floor(Math.random()*11), "status": "OK", "value": 2});
	retval.push({"board": "000", "move": "010", "remoteness": Math.floor(Math.random()*11), "status": "OK", "value": 2});
//	alert('inside getNextMoveValues ' + retval[0].move);
    onMoveValuesReceived(retval);
}

//the following are useful functions for making it easy to display an applet
function drawApplet(id, archive, mainClass, params, width, height) {
	var str='';
	str+='<!--[if !IE]>--><object id="' + id + '" classid="java:' + mainClass + '.class"';
	str+='              type="application\/x-java-applet"';
	str+='              archive="' + archive + '"';
	str+='              height="' + height + '" width="' + width + '" >';
	str+='        <!-- Konqueror browser needs the following param -->';
	str+='        <param name="archive" value="' + archive + '" \/>';
	str+= params
	str+='      <!--<![endif]-->';
	str+='        <object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"';
	str+='                id="' + id + '" height="' + height + '" width="' + width + '" >';
	str+='          <param name="code" value="' + mainClass + '" \/>';
	str+='          <param name="archive" value="' + archive + '" \/>';
	str+= params
	str+='        <\/object>';
	str+='      <!--[if !IE]>-->';
	str+='      <\/object>';
	str+='      <!--<![endif]-->';
	document.write(str);
}
