/**
 * connections.js
 * Extends GamesCrafters Web interface for Connections board game
 * Requires jquery, gc-game.js
 * Some issues:
 * This supports moves on the outer edge, solver version does not
 * Here red goes first
 * showMoveValues doesn't yet work, I think getDefaultBoardString & createParamString generate string for getNextMoveValues
 */

var size;
var RED = 0; var BLUE = 1;
var colors = ['red', 'blue'];
var boardArray = new Array();
var TURN = 0;
function nextTurn() { checkPrimitive(); TURN = (TURN == 0) ? 1 : 0; Connections.prototype.showMoveValues(); }

function Connections(options) {
  Connections.prototype.constructor.call(this, options);
}
GCWeb.extend(Connections, GCWeb.Game);

Connections.NAME = 'connections';
// size must be odd as defined here, 11 => top row has 5 squares, 6 empty
Connections.DEFAULT_SIZE = 11;
// array representation of board

Connections.prototype.constructor = function(config) {
  config = config || {};
  config.options = config.options || {};
  size = config.size || Connections.DEFAULT_SIZE;
  boardArray = new Array(size);
  this.generateBoard(size);
  GCWeb.Game.prototype.constructor.call(this, Connections.NAME, size, size, config);
  $('#board').show();
  this.addEventListener('executingmove', this.handleExecutingMove);
  this.addEventListener('nextvaluesreceived', this.handleNextValuesReceived);
}

Connections.prototype.getDefaultBoardString = function() {
  var s = '';
  var dict = new Array();
  // Is Blue X or Red?
  dict['r'] = 'X';
  dict['b'] = 'O';
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

Connections.prototype.createParameterString = function() {
  var paramString = ";board=" + Connections.prototype.getDefaultBoardString();
  return paramString;
};

Connections.prototype.start = function(team) {
  this.player = team || GCWeb.Team.BLUE;
  this.switchTeams();
  Connections.superClass.start.call(this);
}

Connections.prototype.handleNextValuesReceived = function() {
	this.switchTeams();
	nextTurn();
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

// for now just completely random since not hooked up to backend
Connections.prototype.showMoveValues = function() {
	// for a board of size N (as defined by select dropdown) the # of possible moves
	// assuming an empty board is (n-2)*n+(n-1)^2 = 2N^2 - 4N + 1
	// clear move values
	alert(this.nextMoves.length);
	Connections.prototype.hideMoveValues();
	if ($('#option-move-values:checked').val() == null) {	
		return;
	}
	var vals = ['win', 'loss', 'tie'];
	$('#board .odd .odd').each(function() {
		if (Connections.prototype.occupied(this)) return;
		$(this).addClass(vals[Math.floor(Math.random()*3)])
	});
	$('#board .even .even').each(function() {
		if (Connections.prototype.occupied(this)) return;
		$(this).addClass(vals[Math.floor(Math.random()*3)])
	});
}

Connections.prototype.hideMoveValues = function() {
	$('.win').removeClass('win');
	$('.loss').removeClass('loss');
	$('.tie').removeClass('tie');
}

Connections.prototype.generateBoard = function(size) {
  
  this.board = $(document.getElementById('board'));
  this.board.html('');

  // initialize board array
  boardArray = new Array(size);
  for (var i = 0; i < size; i++) boardArray[i] = new Array(size);
  for (var i = 0; i < size; i++) for (var j = 0; j < size; j++) boardArray[i][j] = (i%2==j%2) ? ' ' : ((i%2==0) ? 'r' : 'b');
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
  $('#board .even .odd .square').addClass('red');
  $('#board .odd .even .square').addClass('blue');
  
  // event handling
  
  function hoverIn() {
    if (Connections.prototype.occupied(this)) return;
    $(this).css('backgroundColor', (TURN==0)?'pink':'lightblue');
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
    this.getNextMoveValues();
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
  //var game = new Connections();
  //game.start();
}