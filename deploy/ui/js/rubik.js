var game;

// used for coloring the table cells
//var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];
var moveValueClasses = ['lose', 'tie', 'win'];

// other state
var nextMoves = [];
var lastMove = -1;

var doingMove = false;
var queuedMoves = [];

function invertMap(map) {
	invertedMap = {};
	for(key in map) {
		invertedMap[map[key]] = key;
	}
	return invertedMap;
}

function mergeMaps(map1, map2) {
	merged = {};
	for(key in map1)
		merged[key] = map1[key];
	for(key in map2)
		merged[key] = map2[key];
	return merged;
}

var keyMap = { 
//		"a": "y'", ";": "y", "q": "z'", "p": "z", "t": "x", "y": "x", "b": "x'", "n": "x'", //cube rotations
//		"l": "D'", "s": "D", "w": "B", "o": "B'", "e": "L'", "d": "L", //extension turns
		"f": "U'", "j": "U", "i": "R", "k": "R'", "g": "F'", "h": "F" //solver turns 
	};
var invertedKeyMap = invertMap(keyMap);

// bootstrapping function - start up this program after the page structure loads
$(document).ready(function(){
	//TODO - width and height don't make sense for a 2x2x2!
	var width = 1;
	var height = 10;
	// create a new game
	game = GCWeb.newPuzzleGame("rubik", width, height, {
		onNextValuesReceived: onNextValuesReceived,
		isValidMove: isValidMove,
		onExecutingMove: onExecutingMove,
		updateMoveValues: updateMoveValues, 
		clearMoveValues: clearMoveValues,
		getBoardString: getBoardString,
		getPositionValue: getPositionValue,
		getNextMoveValues: getNextMoveValues,
		debug: 0
	});
	
    // load the default board
    game.loadBoard(getBoardString());
    
//TODO - possibly sync this with the properties file the applet reads from?
//    var oRequest = new XMLHttpRequest();
//    var sURL  = "rubik.html";
//
//    oRequest.open("GET",sURL,false);
//    oRequest.setRequestHeader("User-Agent",navigator.userAgent);
//    oRequest.send(null)
//
//    if (oRequest.status==200) alert(oRequest.responseText);
//    else alert("Error executing XMLHttpRequest call!");
    
    
    var qwerty = [[ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
                  [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';' ],
                  [ 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/' ]];
    table = '';
    for(row in qwerty) {
    	table += '<table align="center" class="keyboard">';
    	table += "<tr>";
    	table += "<td style='border: none; width: " + 20 * row + "'></td>"
    	for(col in qwerty[row]) {
    		key = qwerty[row][col];
    		turn = keyMap[key] || "";
    		table += "<td id='" + key + "' style='width: 30px; height: 30px'>" +
			    "<div class='letter'>" + key + "</div><div class='move'>" + turn + "</div></td>";
    	}
    	table += "</tr>";
    	table += "</table>";
    }
    table += "</table>";
    $('#key-help').append(table);
	
	var _createClickHandler = function(key) {
		return function _handleClick() {
			$("#cube").get(0).doMove(keyMap[key]);
		};
	};
	
	for (var key in keyMap) {
		$("#" + key).click(_createClickHandler(key)).addClass(".move-key");
	}
});

function debug(mytext) {
//	$("#debug").text($("#debug").text()+"\n"+mytext);
	typeof console != "undefined" && console.log && console.log(mytext);
}

//returns a list of moves equivalent to the cardinal move
var dirs = {"": 1, "2" : 2, "'": 3};
var cardinalToEquivalent = { "R": "L", "U": "D", "F": "B" }
var toCardinalFromEquivalent = { "L": "R x'", "D": "U y'", "B": "F z'" }
var equivalences = mergeMaps(cardinalToEquivalent, toCardinalFromEquivalent);
var invertTurns = { "": "'", "'": "", "2": "2" }

var xMap = { "F": "U", "U": "B", "B": "D", "D": "F", "L": "L", "R": "R" };
var xInvMap = invertMap(xMap);
var yMap = { "R": "F", "F": "L", "L": "B", "B": "R", "U": "U", "D": "D" };
var yInvMap = invertMap(yMap);
var zMap = { "U": "R", "R": "D", "D": "L", "L": "U", "F": "F", "B": "B" };
var zInvMap = invertMap(zMap);
var rotationMaps = { "x": xMap, "x'": xInvMap, "y": yMap, "y'": yInvMap, "z": zMap, "z'": zInvMap };

var moveR = [ [ [0, 2], [2, 1], [6, 2], [4, 1] ] ];
var moveF = [ [ [0, 1], [4, 2], [5, 1], [1, 2] ] ];
var moveU = [ [ [0, 0], [1, 0], [3, 0], [2, 0] ] ];
var moveB = [ [ [2, 2], [3, 1], [7, 2], [6, 1] ] ];
var moveL = [ [ [1, 1], [5, 2], [7, 1], [3, 2] ] ];
var moveD = [ [ [4, 0], [6, 0], [7, 0], [5, 0] ] ];
var movex = [ moveR[0], moveL[0].slice().reverse() ];
var movey = [ moveU[0], moveD[0].slice().reverse() ];
var movez = [ moveF[0], moveB[0].slice().reverse() ];
var fixedPiece = [ 7, 0 ];

function applyMove(move) {
	var moveArr = eval("move" + move);
	for(var cycle in moveArr) {
		for(var i in moveArr[cycle]) {
			if(moveArr[cycle][i][0] == fixedPiece[0]) {
				//for some reason, i is a string, not a number!!!
				var index = parseInt(i) + 1;
				old = fixedPiece.slice();
				fixedPiece[0] = moveArr[cycle][index % moveArr[cycle].length][0];
				fixedPiece[1] = (fixedPiece[1] + moveArr[cycle][i][1])%3; //update orientation
				return;
			}
		}
	}
}

function toCardinalMove(move) {
	var face = move.substring(0, 1);
	var turn = move.substring(1);
	for(var i = 0; i < dirs[turn]; i++)
		applyMove(face);
	if(move in rotationMaps) {
		//since this isn't an actual move, we won't be hearing back from the server
		updateMoveValues(nextMoves);
	} else {
		cubeRotations = [];
		//TODO - figure out rotations to fix orientation and permutation of fixed piece,
		//and apply them to move
		for(var i in cubeRotations) {
			var face = move.substring(0, 1);
			var turn = move.substring(1);
			move = rotationMaps[cubeRotations[i]][face] + turn;
		}
	}
	var face = move.substring(0, 1);
	var turn = move.substring(1);
	if(face in toCardinalFromEquivalent) { //BLD
		move = toCardinalFromEquivalent[face].split(' ');
		applyMove(move[1]);
		move = move[0] + turn;
	}
	return move;
}
function fromCardinalMove(move) {
	old = move;
//	for(var i in cubeRotations) {
//		var face = move.substring(0, 1);
//		var turn = move.substring(1);
//		move = rotationMaps[cubeRotations[i]][face] + turn;
//	}
	return [ move, equivalences[move.substring(0, 1)].split(' ')[0] + move.substring(1) ];
}

function doQuery(turn) {
	if (turn == null) {
		cubeRotations = [];
		game.loadBoard(getBoardString());
		return false;
	}
	turn = turn.toString(); //this converts from the java object to a string
	turn = toCardinalMove(turn);
	for(var i in nextMoves) {
		if(nextMoves[i].move == turn) {
			debug("requesting move "+nextMoves[i].move+", queue length = "+queuedMoves.length);
			game.doMove(nextMoves[i]);
			return true;
		}
	}
	return false;
}
function cubeStateChanged(turn) {
	if(queuedMoves.length == 0 && doingMove == false) { //this means a turn actually happened
		doingMove = true;
		debug("Nothing in the queue, doing move "+turn);
		if (!doQuery(turn))
			doingMove = false;
	} else {
		// nextMoves is empty, so queue up the move request.
		queuedMoves.push(turn);
		debug("already doing move "+turn+"; queue length is now "+queuedMoves.length+"; doing move is "+doingMove);
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

// called on initial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    debug("onNextValuesReceived, queue length = "+queuedMoves.length);
    nextMoves = json;
    doingMove = false;
    if (queuedMoves.length != 0) {
        doingMove = true;
        debug("There is something in the queue length "+queuedMoves.length+", doing move "+queuedMoves[0]);
        if (!doQuery(queuedMoves.shift()))
            doingMove = false;
    }
}

// colors the board based on move values
function updateMoveValues(nextMoves){
    // reset everything first
	clearMoveValues();
    nextMoves.sort(function(a, b) { //sorts in decreasing remoteness
    	return b.remoteness - a.remoteness;
    });
    for(var i in nextMoves) {
    	old = nextMoves[i].move;
    	var equivMoves = fromCardinalMove(old);
    	value = nextMoves[i].value - 1;
    	if(nextMoves[i].move.substring(1) == "2" && value == 2) {
    		for(var ch in equivMoves.slice()) {
    			equivMoves[ch] = equivMoves[ch].substring(0, 1);
    			equivMoves.push(equivMoves[ch] + "'");
			}
		}
    	for(var ch in equivMoves) {
    		$('#' + invertedKeyMap[equivMoves[ch]]).removeClass();
    		$('#' + invertedKeyMap[equivMoves[ch]]).addClass(moveValueClasses[value]);
    	}
    }
}

// remove all indicators of move values
function clearMoveValues(){
	$('table.keyboard td').removeClass();
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

var faces = ["F", "U", "R"];
function getNextMoveValues(position, onMoveValuesReceived) {
    var retval = [];
    for(f in faces) {
    	for(d in dirs) {
		    retval.push({"board": '', "move": faces[f] + dirs[d], "remoteness": Math.floor(Math.random()*11), "status": "OK", "value": 2});
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
	} else { //color is in the form rgb(r, g, b)a
		var rgb =color.match(/rgba?\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)\s*.*\)/);
		if (rgb && rgb.length == 4) {
			var rgbcolor = parseInt(rgb[3]) + (parseInt(rgb[2])<<8) + (parseInt(rgb[1])<<16);
			color = "000000" + rgbcolor.toString(16);
			color = "#" + color.substr(color.length-6)
		}
	}
	return color;
}
function getFGColor() {
	return "#ffffff"
}
