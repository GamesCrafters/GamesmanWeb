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
//TODO - width and height don't make sense for a 2x2x2!
var game = GCWeb.newPuzzleGame("2x2x2", width, height, {
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

// bootstrapping function - start up this program after the page structure loads
$(document).ready(function(){
    // load the default board
    game.loadBoard(getBoardString(defaultBoard));
    currentBoard = defaultBoard;
    $('#optimalMove').click(function() {
    	document.getElementById('cube').doMove($(this).text());
    });
});

function cubeStateChanged(turn) {
	if(turn != null) { //this means a turn actually happened
		//TODO - this won't capture cube rotations, or "double layer" turns
		for(i in nextMoves) {
			if(nextMoves[i].move == turn) {
				game.doMove(nextMoves[i]);
				break;
			}
		}
	} else {
		//TODO - deal with cube reset
	}
}

// check to see whether the current move is valid
function isValidMove(moveInfo)
{
    return true;
}

// called when doMove executes successfully
function onExecutingMove(moveInfo){
    //Due to the nature of the applet, I'm pretty sure nothing should go here
}

// called on intiial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    nextMoves = json;
}

// colors the board based on move values
function updateMoveValues(nextMoves){
    // reset everything first
    clearMoveValues();

    //TODO - choose optimal move!
    for(i in nextMoves) {
    	$('#optimalMove').text(nextMoves[i].move);
    }
}

// remove all indicators of move values
function clearMoveValues(){
	//TODO - do something here?
}

// converts our own representation of the board (2d/3d array) into a board string
function getBoardString(board){
	return document.getElementById('cube').getBoardString();
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

//TODO - due to the move restriction, some legal turns aren't going to be in the database...
var faces = ["F", "U", "R", "B", "L", "D"];
var dirs = ["", "2", "'"];
function getNextMoveValues(position, onMoveValuesReceived) {
    var retval = [];
    for(f in faces) {
    	for(d in dirs) {
		    retval.push({"board": '', "move": faces[f] + dirs[d], "remoteness": 2, "status": "OK", "value": 2});
    	}
    }
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
	str+='          <param name="MAYSCRIPT" value="true" \/>';
	str+='          <param name="archive" value="' + archive + '" \/>';
	str+= params
	str+='        <\/object>';
	str+='      <!--[if !IE]>-->';
	str+='      <\/object>';
	str+='      <!--<![endif]-->';
	document.write(str);
}
function getBGColor() {
	if(typeof(getComputedStyle) != 'undefined')
		color = getComputedStyle(document.body, "").getPropertyValue('background-color');
	else
		color = document.body.currentStyle['backgroundColor'];
	if(color.charAt(0) == '#') {
		if(color.length == 4) {
			old = color;
			color = "#";
			for(i = 1; i < old.length; i++) {
				color = color + old.charAt(i) + old.charAt(i);
			}
		}
	} else { //color is in the form rgb(r, g, b)
		color = eval(color);
	}
	return color;
}
function getFGColor() {
	return "#ffffff"
}
function rgb(r, g, b) {
	return "#" + pad(r.toString(16)) + pad(g.toString(16)) + pad(b.toString(16));
}
function pad(i) {
	if(i.length == 2)
		return i;
	else
		return "0" + i;
}