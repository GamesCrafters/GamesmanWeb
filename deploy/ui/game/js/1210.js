/**
 * 1210.js
 * An implementation of a 1,2,...,10 interface.
 * This is really a 1,2,...,n interface, but since 1,2,...,10 is the equivalent
 * of our "Hello World!", I've named this game after the latter.
 * @author  ide
 * @version 0.1 2010-04-29
 */

/**
 * Constructs a new 1,2,...,n game with the specified parameters.
 * @param target    the game's target number
 * @param options   a dictionary of configuration options
 */
function OneTwoTen(target, options) {
  target = Math.round(target);
  if (target <= 0) {
    target = OneTwoTen.DEFAULT_TARGET;
  }
  options = options || {};
  options.options = {option: 1};  // Regular play; first to the target wins.
  //options.local = true;  // Uncomment this to run in local mode.
  // We must invoke the superclass's constructor, which takes in this
  // game's name, width, height, and other options.
  OneTwoTen.superClass.constructor.call(this, OneTwoTen.NAME, target, 1,
					options);
  // Currently, we ignore the options. For other games, you might want to
  // have some other configuration parameters.

  // Construct the actual cells of the board. We'll first do a little math
  // to see how many tiles fit in a row.
  var boardWidth = 0.85 * GCWeb.Game.getScreenWidth(); // Save some margins.
  var columns = Math.floor(boardWidth / OneTwoTen.TILE_IMAGE_WIDTH);
  // There needs to be at least one tile per row.
  columns = Math.min(Math.max(columns, 1), target);
  var rows = Math.ceil(target / columns);
  // All games have a jQuery object called "board". It's initially a <div>
  // but you can make it whatever you'd like, but use the same ID.
  this.board = $('<table />').attr('id', this.board.attr('id'))
                             .addClass('gc1210-board');
  for (var i = 0; i < rows; i++) {
    var row = $('<tr />');
    for (var j = 0; j < columns; j++) {
	var cell = $('<td />');
	var img = $('<img />').attr({ src: OneTwoTen.TILE_IMAGE,
	                              width: OneTwoTen.TILE_IMAGE_WIDTH });
	// The board zig-zags, so we need to figure out which cells, if any,
	// should be empty.
	if (i == rows - 1) {
	  var overflow = target % columns;
	  if (overflow == 0) {
            overflow += columns;
	  }
	  if ((i % 2 == 0) && (j < overflow) ||
              (i % 2 != 0) && (j > columns - overflow - 1)) {
	    cell.append(img);
	  } else {
            cell.addClass('gc1210-unused');
	  }
	} else {
	  cell.append(img);
	}
	row.append(cell);
    }
    this.board.append(row);

    // Set up some other variables for keeping track of the game's state.
    this.counter = 0;  // 1,2,...,10 starts from 0.
  }

  // We also need to track each player's piece. You don't have to use
  // GCWeb.Piece, but it may be convenient.
  this.teamPieces = {};
  this.teamPieces[GCWeb.Team.RED.toString()] =
      this.createPiece(GCWeb.Piece, GCWeb.Team.RED);
  this.teamPieces[GCWeb.Team.BLUE.toString()] =
      this.createPiece(GCWeb.Piece, GCWeb.Team.BLUE);
  
  // Set some other styling properties on each of the pieces.
  for (var team in this.teamPieces) {
    var piece = this.teamPieces[team].element;
    piece.addClass('gc1210-piece').data('tile', 0)
         .width(OneTwoTen.TILE_IMAGE_WIDTH).appendTo('#gc1210-game');
  }

  // Register event listeners to hook into the framework.
  this.addEventListener('executingmove',
			this.handleExecutingMove.bind(this));
  this.addEventListener('nextvaluesreceived',
			this.handleNextValuesReceived.bind(this));
}
// From an object-oriented perspective, OneTwoTen extends GCWeb.Game.
GCWeb.extend(OneTwoTen, GCWeb.Game);

// Declare the internal name of the game. This is so that we can
// programmatically reference this game's name in the future.
OneTwoTen.NAME = '1210';
// The default value of n is 10; i.e., we default to 1,2,...,10.
OneTwoTen.DEFAULT_TARGET = 10;
// We have a background image for our tiles on the board.
OneTwoTen.TILE_IMAGE = 'game/images/' + OneTwoTen.NAME + '/tile.png';
OneTwoTen.TILE_IMAGE_WIDTH = 100; // px
// Prefetching the images is not required, but it means that the browser
// can speculatively download the images before the game even starts,
// which makes the UI more responsive. This function is variadic.
GCWeb.prefetch(OneTwoTen.TILE_IMAGE);

OneTwoTen.prototype.start = function(team) {
    this.player = team || GCWeb.Team.BLUE;
    // Reverse the team because the call to GCWeb.Game.start() will
    // trigger the nextvaluesreceived event.
    this.switchTeams();
    OneTwoTen.superClass.start.call(this);
}

/**
 * Returns the default board string. The framework expects this function
 * to be implemented unless a property named "defaultBoardString" is
 * present in the configuration options.
 */
OneTwoTen.prototype.getDefaultBoardString = function() {
  // A board in 1,2,...,10 is simply the current number we're at.
  return '0';
};

/**
 * Sets up the board for the next turn. This function is called when the
 * framework receives the next move-values from the server since we register
 * it in the constructor.
 * @param moveValues   the move-values are the first argument to this
 *        function and are also in this.nextMoves. Each move-value is a
 *        JavaScript object with several fields, including the board-string
 *        of the child board and the move to get there.
 */
OneTwoTen.prototype.handleNextValuesReceived = function(moveValues) {
  // HACK: This is to make this compatible with Classic, which will use
  // the GCWeb 2.0 architecture. Don't do this for GCWeb 1.0!
  for (var i = 0; i < moveValues.length; i++) {
    if (moveValues[i].value !== undefined) {
      if (moveValues[i].value == 'win') {
	moveValues[i].value = 'lose';
      } else if (moveValues[i].value == 'lose') {
	moveValues[i].value = 'win';
      }
    }
  }

  this.switchTeams();
  this.board.find('td').removeClass('gc1210-active');
  this.activateNewTiles(moveValues);
};

/**
 * Handles a move that the framework is currently executing.
 * This usually consists of an animation that visualizes the move.
 * This function clears all previously attached click listeners from the
 * preceding turn.
 * This function is registered with the event system in the constructor.
 * @param moveValue the move-value object corresponding to the executing move
 */
OneTwoTen.prototype.handleExecutingMove = function(moveValue) {
  // Remove the click listeners.
  this.board.find('td').unbind('click.move').removeClass('gc1210-active');
  // Get the piece belonging to the current player.
  var currentPiece = this.teamPieces[this.player.toString()].element;
  if (currentPiece.data('tile') == 0) {
    // Add the piece to the board onto the first tile.
    currentPiece.css(this.getTile(1).position()).fadeIn(200);
    currentPiece.data('tile', 1);
  }
  // Move the piece the each tile in sequence. jQuery takes care of queueing
  // our animation requests.
  this.counter += Math.round(moveValue.move);
  for (var i = currentPiece.data('tile') + 1; i <= this.counter; i++) {
    currentPiece.animate(this.getTile(i).position(), 100, 'linear');
  }
  currentPiece.data('tile', this.counter);
};

/**
 * Attaches click event listeners to the cells that are valid next moves.
 * This function also outlines these tiles to let the user know they are
 * active and that they can click the tiles.
 */
OneTwoTen.prototype.activateNewTiles = function(moves) {
  for (var i = 0; i < moves.length; i++) {
    // nextMoves is an array of move-values, which have "move" properties
    // that specify valid moves. For 1,2,...,10, moves are the step amounts
    // by which you can increment the game's counter. For other games, this
    // will be something completely different.
    var move = Math.round(moves[i].move);  // Convert to integer
    // jQuery's namespaced event types make it easy to bind and rebind entire
    // groups of event listeners at once.
    this.getTile(this.counter + move).bind('click.move', function(move) {
      // Call doMove, which tells the framework to contact the server.
      this.doMove(move);
    }.bind(this, move)).addClass('gc1210-active');
  }
};

/**
 * A convenience function to find the cell that corresponds with a number,
 * starting from 1.
 */
OneTwoTen.prototype.getTile = function(index) {
  index--; // Our math assumes a zero offset.
  var columns = this.board.find('tr').first().find('td').length;
  var row = Math.floor(index / columns);
  var column = (row % 2 == 0) ? index % columns :
                                columns - 1 - index % columns;
  return this.board.find('tr').eq(row).find('td').eq(column);
};

/**
 * Display the value indicators to show which moves are winning, losing, or
 * tieing (or drawing) moves. This function must clear win/lose/tie indicators
 * from the previous turn.
 */
OneTwoTen.prototype.showMoveValues = function(moves) {
  this.hideMoveValues();
  for (var i = 0; i < moves.length; i++) {
    if ((typeof moves[i].value) == 'string') {
      var valueClass = null;
      switch (moves[i].value) {
        case 'win':
	  valueClass = 'gc1210-win';
	  break;
        case 'lose':
	  valueClass = 'gc1210-lose';
	  break;
        case 'tie':
	  valueClass = 'gc1210-tie';
	  break;
      }
      if (valueClass) {
	var move = Math.round(moves[i].move);
	this.getTile(this.counter + move).addClass(valueClass);
      }
    }
  }
};

/** Clear all of the value indicators. */
OneTwoTen.prototype.hideMoveValues = function() {
  this.board.find('td').removeClass('gc1210-win gc1210-lose gc1210-tie');
};

/**
 * A local version of getMoveValue for testing. You don't need to include
 * the actual values (win/loss/tie/draw) just to play the game.
 */
OneTwoTen.prototype.localGetMoveValue = function(board) {
  return { board: board };
};

/**
 * A local version of getNextMoveValues that needs to generate the child
 * board positions and the moves that connect the current board to each child.
 */
OneTwoTen.prototype.localGetNextMoveValues = function(board) {
  var moveValues = [];
  var currentCounter = Math.round(board);
  for (var i = 1; (i <= 2) && (currentCounter + i <= this.width); i++) {
      moveValues.push({ board: (currentCounter + i).toString(),
		        move: i.toString() })
  }
  return moveValues;
};