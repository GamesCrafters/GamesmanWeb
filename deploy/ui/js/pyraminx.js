var game;

// used for coloring the table cells
//var moveValueClasses = ['lose-move', 'tie-move', 'win-move'];
var moveValueClasses = ['win', 'tie', 'lose'];

// other state
var nextMoves = [];
var lastMove = -1;

var queuedMoves = [];

function invertMap(map) {
	var invertedMap = {};
	for(var key in map) {
		invertedMap[map[key]] = key;
	}
	return invertedMap;
}

var keyMap = { 
		//"a": "y'", ";": "y", "q": "z'", "p": "z", "t": "x", "y": "x", "b": "x'", "n": "x'", //cube rotations
		"W": "b", "O": "b'", "E": "l'", "D": "l", "F": "u'", "J": "u", "I": "r", "K": "r'", //solver turns 
		"w": "B", "o": "B'", "e": "L'", "d": "L", "f": "U'", "j": "U", "i": "R", "k": "R'" //solver turns 
	};
var invertedKeyMap = invertMap(keyMap);

function appletLoaded() {
	//TODO - applet steals scrollwheel
	//TODO - move value history doesn't always work w/ ie and chrome when pressing scramble
	//TODO - ie doesn't change buttons when they're clicked
	//TODO - chrome still gives focus to the applet
	//TODO - checkboxes are really weird with ie
	//TODO - select all, select none for checkboxes (in framework)
	//TODO - keyboard table resizes if the window is too small
	//TODO - horizontal scrollbar in ie
	
	$(window).focus();
	$('#cube').focus(function() {
		//apparently there needs to a bit of a delay for this to work
		setTimeout("$(window).focus();", 150);
	});

	$("#cube").mousewheel(function(event, delta) {
		console.log(event);
		console.log("DELTA:");
		console.log(delta);
	});
}

//$(document).ready(function(){
function appletLoaded() {
	//although the dom is ready to be traversed,
	//our applet is not necessarily ready to be accessed
	//we must wait until appletLoaded() is called to access the applet
	
	//TODO - width and height don't make sense for a pyraminx!
	var width = 1;
	var height = 10;
	// create a new game
	game = GCWeb.newPuzzleGame("pyraminx", width, height, {
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
	
	$(this).keypress(function(e) {
		if(e.originalEvent.altKey || e.originalEvent.ctrlKey) return;
		var keycode = e.which;
		var key = String.fromCharCode(e.which);
		if(!(key in keyMap)) //if this key is not defined, fall back to lowercase
			key = key.toLowerCase();
		if(key in keyMap) {
			$('#cube')[0].doMove(keyMap[key]);
		}
	});
    
    var qwerty = [[ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
                  [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';' ],
                  [ 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/' ]];
    var table = '';
    for(var row = 0; row < qwerty.length; row++) {
    	table += '<table style="margin-left: auto; margin-right: auto" class="keyboard">';
    	table += "<tr>";
    	table += "<td style='border: none; width: " + 20 * row + "px' ></td>"
    	for(var col in qwerty[row]) {
    		var key = qwerty[row][col];
    		var safeId = key == ';' ? 'semicolon' : key;
    		var turn = keyMap[key] || "";
    		table += "<td id='" + safeId + "' style='width: 30px; height: 30px'>" +
			    "<div class='letter'>" + key + "</div><div class='move'>" + turn + "</div></td>";
    	}
    	table += "</tr>";
    	table += "</table>";
    }
    table += "</table>";
    $('#key-help').append(table);
	
	var createClickHandler = function(key) {
		return function _handleClick() {
			$("#cube")[0].doMove(keyMap[key == 'semicolon' ? ';' : key]);
		};
	};
	
	for (var key in keyMap) {
		$("#" + (key == ';' ? 'semicolon' : key)).addClass("move-key").click(createClickHandler(key));
	}
	game.loadBoard(getBoardString());
}
//});

function debug(mytext) {
//	$("#debug").text($("#debug").text()+"\n"+mytext);
	typeof console != "undefined" && console.log && console.log(mytext);
}

function doQuery(turn, board) {
	if (turn == null || !nextMoves) {
		game.loadBoard(board);
		return false;
	}

	var face = turn.substring(0, 1);
	var dir = turn.substring(1);
	turn = face + dir;
		
	var moveInfo = { board: board };
	for(var i in nextMoves) {
		if(nextMoves[i].move == turn) {
			 moveInfo.move = turn;
			 moveInfo.remoteness = nextMoves[i].remoteness;
			 moveInfo.value = nextMoves[i].value;
			 break;
		}
	}
	if(!moveInfo.move)
		return false;
	game.doMove(moveInfo);
	return true;
}

function puzzleStateChanged(turn, boardState) {
	var face = null;
	var dir = null;
	if(turn != null) {
		turn = turn.toString(); //this converts from the java object to a string
		face = turn.substring(0, 1);
		dir = turn.substring(1);
	}
	
	if(queuedMoves.length == 0) { //this means a turn actually happened
		debug("Nothing in the queue, doing move "+turn);
		doQuery(turn, boardState);
	} else {
		// nextMoves is empty, so queue up the move request.
		queuedMoves.push([turn, boardState]);
		debug("already doing move "+queuedMoves[0]+"; queue length is now "+queuedMoves.length + "; queueing move " + turn);
	}
}

// check to see whether the current move is valid
function isValidMove(moveInfo) {
    return true;
}

// called when doMove executes successfully
function onExecutingMove(moveInfo) {
    //Due to the nature of the applet, I'm pretty sure nothing should go here
}

// called on initial load, and each subsequent doMove will also reference this
function onNextValuesReceived(json){
    debug("onNextValuesReceived, queue length = "+queuedMoves.length);
    nextMoves = json;
    deQueue();
}

function deQueue() {
    if(queuedMoves.length != 0) {
        debug("There is something in the queue length "+queuedMoves.length+", doing move "+queuedMoves[0]);
        do {
        	var turn_board = queuedMoves.shift();
        } while(!doQuery(turn_board[0], turn_board[1]));
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
    	value = nextMoves[i].delta + 1;
        //debug(i+":"+nextMoves[i].move+"="+value+" ("+nextMoves[i].remoteness+")");
    	$('#' + invertedKeyMap[nextMoves[i].move]).removeClass(moveValueClasses.join(" "));
    	$('#' + invertedKeyMap[nextMoves[i].move]).addClass(moveValueClasses[value]);
    }
}

// remove all indicators of move values
function clearMoveValues(){
	$('.keyboard td').removeClass(moveValueClasses.join(" "));
}

//converts our own representation of the board (2d/3d array) into a board string
function getBoardString(board){
	return $("#cube")[0].getBoardString();
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
		    retval.push({"board": '', "move": faces[f] + dirToCount[d], "remoteness": Math.floor(Math.random()*11), "status": "OK", "value": 2});
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
