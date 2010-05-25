/**
 * connections.js
 * Extends GamesCrafters Web interface for Connections board game
 * Requires jquery, gc-game.js
 */

var size;
var BLUE = 0; var RED = 1;
var colors = ['blue', 'red'];
var boardArray = new Array();
var TURN = 0;
function nextTurn() { checkPrimitive(); TURN = (TURN == 0) ? 1 : 0; }

function Connections(options) {
  Connections.prototype.constructor.call(this, options);
}
GCWeb.extend(Connections, GCWeb.Game);

Connections.NAME = 'connections';
Connections.DEFAULT_SIZE = 11;

Connections.prototype.constructor = function(config) {
  config = config || {};
  config.options = config.options || {};
  size = config.size || Connections.DEFAULT_SIZE;
  boardArray = new Array(size);
  this.generateBoard(size);
  GCWeb.Game.prototype.constructor.call(this, Connections.NAME, size, size, config);
  $('#board').show();
  //this.addEventListener('executingmove', this.handleExecutingMove);
  this.addEventListener('nextvaluesreceived', this.handleNextValuesReceived);
  this.name = 'connections';
}

Connections.prototype.getDefaultBoardString = function() {
  var s = '';
  var dict = new Array();
  dict['b'] = 'X';
  dict['r'] = 'O';
  dict[' '] = '%20';
  for (var i = boardArray.length-2; i >= 0; i -= 2) for (var j = 1; j < boardArray.length-1; j+=2) {
	s += dict[boardArray[i][j]];
  }
  for (var i = boardArray.length-3; i > 1; i -= 2) for (var j = 2; j < boardArray.length-2; j+=2) {
	s += dict[boardArray[i][j]];
  }
  s += ';side=' + ((boardArray.length-1)/2) + ';';
  return s;
}

Connections.prototype.createParameterString = function(board) {
  if (board != null && board.length >= 10) return ";board=" + board + ';side=' + ((boardArray.length-1)/2) + ';';
  var paramString = ";board=" + Connections.prototype.getDefaultBoardString();
  return paramString;
};

Connections.prototype.doMove = function(moveDelta, moves) {
	  // Find the current move-value object that represents the specified move.
	  var moveValue = null;
	  for (var i = 0; (i < moves.length) && (moveValue == null); i++) {
	    if (moves[i].move == moveDelta) {
	      moveValue = moves[i];
	    }
	  }
	  //this.moveHistory.push(moveValue);
	  this.getNextMoveValues(moveValue.board);
	  return true;
}


Connections.prototype.getNextMoveValues = function(board) {
	  var serverUrl = GCWeb.Game.serviceUrl + encodeURIComponent('connections') +
	    "/getNextMoveValues" + this.createParameterString(board);
	  var options = {dataType: "json", url: serverUrl};
	  options.success = function(data, textStatus, xhr) {
	    if (data.status == "ok") {
	      var moveValues = data.response;
	      this.nextMoves = moveValues;
	      this.handleNextValuesReceived();
	    } else {
	      var message = data.message ? '\n[' + data.message  + ']' : '';
	      GCWeb.alert('The GamesCrafters server could not handle the request.' +
	                  message);
	      //this._clearDoMoveRequests();
	    }
	  }.bind(this);
	  options.error = function(xhr, textStatus, errorThrown) {
	    GCWeb.alert('The GamesCrafters server is not responding. [' + textStatus +
	                ': ' + errorThrown + ']');
	    //this._clearDoMoveRequests();
	  }.bind(this);
	  $.ajax(options);
	};

Connections.prototype.start = function(team) {
  var TURN = 0;
  this.switchTeams();
  this.player = team || GCWeb.Team.BLUE;
  //this.getNextMoveValues(this.getDefaultBoardString());
  Connections.superClass.start.call(this);
}

Connections.prototype.occupied = function(space) {
	var xpos = parseInt($(space).attr('id').split('_')[0]);
    var ypos = parseInt($(space).attr('id').split('_')[1]);
    if (boardArray[xpos][ypos] != ' ' ||
		(TURN == 1 && (xpos == 0 || xpos == size-1)) ||
    	(TURN == 0 && (ypos == 0 || ypos == size-1))) {
			return true;
	}
	return false;
}

Connections.prototype.assignMoves = function(moves) {
	var squares = $($('#board .even .even, #board .odd .odd').get().reverse());
	squares.unbind('click', moveHandler);
	var count = 0;
	squares.each(function() {
		if (Connections.prototype.occupied(this)) return;
		count++;
	});
	var i = 0;
	var moveDeltas = new Array(count);
	for (var j = 0; j < moveDeltas.length; j++) moveDeltas[j] = j;
	squares.each(function() {
		if (Connections.prototype.occupied(this)) return;
		var moveDelta = moveDeltas[i];
		$(this).bind('click', {moveDelta: moveDelta, moves: moves}, moveHandler);
		i++;
	});
}

var moveHandler = function(e) { Connections.prototype.doMove(e.data.moveDelta, e.data.moves); } 

Connections.prototype.showMoveValues = function(moves) {
	// clear move values
	Connections.prototype.hideMoveValues();
	if ($('#option-move-values:checked').val() == null) {	
		return;
	}
	var squares = $($('#board .even .even, #board .odd .odd').get().reverse());
	var i = 0;
	squares.each(function() {
		if (Connections.prototype.occupied(this)) return;
		$(this).addClass(moves[i].value);
		i++;
	});
	this.assignMoves(moves);
}

Connections.prototype.hideMoveValues = function() {
	$('.win').removeClass('win');
	$('.loss').removeClass('loss');
	$('.tie').removeClass('tie');
}

Connections.prototype.handleNextValuesReceived = function() {
	var msg = '';
	this.showMoveValues(this.nextMoves.slice());
	for (var i = 0; i < this.nextMoves.length; i++) msg += this.nextMoves[i].value + '-';
	//alert(msg);
	this.switchTeams();
	nextTurn();
}

Connections.prototype.generateBoard = function(size) {
  
  this.board = $(document.getElementById('board'));
  this.board.html('');

  // initialize board array
  boardArray = new Array(size);
  for (var i = 0; i < size; i++) boardArray[i] = new Array(size);
  for (var i = 0; i < size; i++) for (var j = 0; j < size; j++) {
	  // Since currently moving on outer spaces not allowed
	  if (i == 0 || i == size-1 || j == 0 || j == size-1) {
		  boardArray[i][j] = 'x';
		  continue;
	  }
	  boardArray[i][j] = (i%2==j%2) ? ' ' : ((i%2==0) ? 'b' : 'r');
  }
  boardArray[0][0] = boardArray[size-1][size-1] = boardArray[0][size-1] = boardArray[size-1][0] = 'x';

  // generate table structure
  for (var i = 0; i < size; i++) {
    var row = '<tr>';
    for (var j = 0; j < size; j++) {
      row += '<td id="' + i + '_' + j + '" class="' + ((j%2==0)?'even':'odd') + '"><div class="square"></div></td>';
    }
    row += '</tr>';
    this.board.append(row);
  }
  $('#board tr:even').addClass('even'); 
  $('#board tr:odd').addClass('odd');
  $('#board .even .odd .square').addClass('blue');
  $('#board .odd .even .square').addClass('red');
  
  // event handling
  
  function hoverIn() {
    if (Connections.prototype.occupied(this)) return;
    $(this).css('backgroundColor', (TURN==0)?'lightblue':'pink');
  }
  function hoverOut() {
    $(this).css('backgroundColor', null);
  }
  $('#board .odd .odd').hover(hoverIn, hoverOut);
  $('#board .even .even').hover(hoverIn, hoverOut);
  
  function clickFn() {
    // check that it's a valid move
    var xpos = parseInt($(this).attr('id').split('_')[0]);
    var ypos = parseInt($(this).attr('id').split('_')[1]);
    if (boardArray[xpos][ypos] != ' ' ||
      (TURN == 1 && (xpos == 0 || xpos == size-1)) ||
      (TURN == 0 && (ypos == 0 || ypos == size-1))) {
      return;
    }
    $(this).children().hide();
    // bridge horizontal: row even TURN 0, row odd TURN 1
    // bridge vertical: row even TURN 1, row ODD TURN 0
    if ($(this).parent().hasClass('even')) {
      if (TURN == 0) {
        $(this).children().addClass('bridgeHorizontal');
        boardArray[xpos][ypos] = '-';
      }
      else {
        $(this).children().addClass('bridgeVertical');
        boardArray[xpos][ypos] = '|';
      }
    }
    else {
      if (TURN == 1) {
        $(this).children().addClass('bridgeHorizontal');
        boardArray[xpos][ypos] = '-';
      }
      else {
        $(this).children().addClass('bridgeVertical');
        boardArray[xpos][ypos] = '|';
      }
    }
    $(this).children().addClass(colors[TURN]);
    $(this).children().show('fast');
    nextTurn();
  }
  $('#board .odd .odd').click(clickFn);
  $('#board .even .even').click(clickFn);
  
}

var encountered = ['',''];
function checkPrimitive() {
  encountered = ['',''];
  for (var i = 1; i < size; i+=2) {  
    if (checkConnected(0, i, RED)) {
      var prompt = 'RED WINS!';
      prompt += " Would you like to reset the game and play again?";
      var onAccept = function() {
        var game = new Connections({size: $('#board-options select').val()*2-1});
	game.start();
	game.showMoveValues();
      };
      GCWeb.confirm(prompt, onAccept);
    }
    else if (checkConnected(i, 0, BLUE)) {
      var prompt = 'BLUE WINS!';
      prompt += " Would you like to reset the game and play again?";
      var onAccept = function() {
        var game = new Connections({size: $('#board-options select').val()*2-1});
	game.start();
	game.showMoveValues();
      };
      GCWeb.confirm(prompt, onAccept);
    };
  }
}
function checkConnected(i, j, color) {
  var boardValue = boardArray[i][j];
  if (color == RED && boardValue == 'r');
  else if (color == BLUE && boardValue == 'b');
  else if (boardValue == '-' && ((j>0 && boardArray[i][j-1] == colors[color].charAt(0))||(j<size-1 && boardArray[i][j+1]==colors[color].charAt(0))));
  else if (boardValue == '|' && ((i>0 && boardArray[i-1][j] == colors[color].charAt(0))||(i<size-1 && boardArray[i+1][j]==colors[color].charAt(0))));
  else return false;
  if (encountered[color].indexOf(' '+i+'_'+j+' ') != -1) return false;
  encountered[color] += ' '+i+'_'+j+' ';
  if (color == RED && i == size - 1) return true;
  if (color == BLUE && j == size - 1) return true;
  if (j != 0) if (checkConnected(i,j-1,color)) return true;
  if (j != size-1) if (checkConnected(i,j+1,color)) return true;
  if (i != 0) if (checkConnected(i-1,j,color)) return true;
  if (i != size-1) if (checkConnected(i+1,j,color)) return true;
  return false;
}

window.onload = function() {
  $('#board').hide();
}
