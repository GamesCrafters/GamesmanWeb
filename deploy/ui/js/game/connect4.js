/**
 * connect-four.js
 * An implementation of a Connect Four interface.
 * This file is dependent upon the jQuery library and has been tested with
 * jQuery 1.3.2.
 * @author  ide
 * @version 0.1 2009-02-02 ide
 */

/**
 * Creates a new ConnectFour game with the provided parameters.
 * The rows and columns may be specified in the params object.
 */
function ConnectFour(options) {
  ConnectFour.prototype.constructor.call(this, options);
}
GCWeb.extend(ConnectFour, GCWeb.Game);

ConnectFour.NAME = "connect4";
ConnectFour.DEFAULT_HEIGHT = 6;
ConnectFour.DEFAULT_WIDTH = 7;
ConnectFour.DEFAULT_IN_A_ROW = 4;
ConnectFour.DEFAULT_SIZE = 500;
ConnectFour.GRID_CLASS_NAME = ConnectFour.NAME + "-grid";
ConnectFour.TOP_TILE_IMAGE = "images/game/" + ConnectFour.NAME + "/top-tile.png";
ConnectFour.TILE_IMAGE = "images/game/" + ConnectFour.NAME + "/tile.png";
ConnectFour.WIN_MARKER_IMAGE = "images/game/" + ConnectFour.NAME + "/win-marker.png";
ConnectFour.TIE_MARKER_IMAGE = "images/game/" + ConnectFour.NAME + "/tie-marker.png";
ConnectFour.LOSE_MARKER_IMAGE = "images/game/" + ConnectFour.NAME + "/lose-marker.png";

ConnectFour.prototype.constructor = function(config) {
  config = config || {};
  config.options = config.options || {};
  config.options.pieces = config.options.pieces || ConnectFour.DEFAULT_IN_A_ROW;
  GCWeb.Game.prototype.constructor.call(this, ConnectFour.NAME,
    config.width || ConnectFour.DEFAULT_WIDTH,
    config.height || ConnectFour.DEFAULT_HEIGHT, config);
  
  // Create the HTML table to represent the game grid
  var table = document.createElement("table");
  table.className = ConnectFour.GRID_CLASS_NAME;
  // Add a hidden row up top where the pieces may stay before being dropped
  table.insertRow(-1).insertCell(-1).setAttribute("colspan", this.width);
  // Create the rows and cells of the grid
  for (var i = 0; i < this.height; i++) {
    var row = table.insertRow(-1);
    for (var j = 0; j < this.width; j++) {
      var cell = row.insertCell(-1);
      var image = document.createElement("img");
      image.src = (i == 0) ? ConnectFour.TOP_TILE_IMAGE :
                             ConnectFour.TILE_IMAGE;
      image.alt = "";
      cell.appendChild(image);
    }
  }

  this.currentPiece = null;
  // Encapsulate the DOM element in an jQuery object
  this.board = $(table).attr("id", this.board.attr("id"));
  this.addEventListener("executingmove", this.handleExecutingMove);
  this.addEventListener("nextvaluesreceived", this.handleNextValuesReceived);

  var pixelWidth = config.maxPixelWidth || ConnectFour.DEFAULT_SIZE;
  if (this.height + 1 > this.width) {
    pixelWidth *= this.width / (this.height + 1.0);
  }
  this.resize(pixelWidth);
};

ConnectFour.prototype.getDefaultBoardString = function() {
  var pieces = [];
  for (var i = 0; i < this.width * this.height; i++) {
    pieces.push(" ");
  }
  return pieces.join("");
};

ConnectFour.prototype.start = function(team) {
  this.player = team || GCWeb.Team.BLUE;
  // Reverse the team because the call to superClass.start() will
  // trigger the nextvaluesreceived event.
  this.switchTeams();
  this.removeMoveListener();
  this.removePieceTrackers();
  this.attachMoveListener();

  ConnectFour.superClass.start.call(this);
};

ConnectFour.prototype.createPiece = function(team) {
  team = team ||  this.player;
  var piece = ConnectFour.superClass.createPiece.call(
    this, ConnectFourPiece, team);
  // Display the piece in the grid
  piece.show();
  return piece;
};

/**
 * Returns the bottom-most unoccupied row in the specified column. If no
 * row is free, -1 is returned.
 * @param column  the column in which to find the bottom-most free row
 * @param board   the string representing the current board state
 */
ConnectFour.prototype.findFreeRow = function(column, board) {
  var row = this.height - 1;    // Start from the bottom and move up
  var position = column;
  while ((row >= 0) && (board.charAt(position) != " ")) {
    row--;
    position += this.width;     // Move up one row
  }
  return row;
};

ConnectFour.prototype.handleExecutingMove = function(moveValue) {
  if (this.currentPiece) {
    // Remove the mouse tracker from the current piece.
    this.removePieceTrackers();

    var column = parseInt(moveValue.move);
    // Find the row where the piece is represented in the future board string.
    var lastMove = this.moveHistory[this.moveHistory.length - 1];
    var row = this.findFreeRow(column, moveValue.board) + 1;
    row = this.findFreeRow(column, lastMove.board);
    // Move the piece to the specified column and slide it down.
    this.currentPiece.moveToColumn(moveValue.move);
    var dropTime = (row + 1) * ConnectFourPiece.MILLIS_PER_ROW;
    this.currentPiece.moveToRow(row, dropTime);
    this.currentPiece = null;
  }
  return true;
};

ConnectFour.prototype.handleNextValuesReceived = function() {
  // TODO: Check that the game is not yet over; i.e. if there are next moves.
  this.switchTeams();
  this.currentPiece = this.createPiece();
  this.attachPieceTracker(this.currentPiece);
};

ConnectFour.prototype.attachMoveListener = function() {
  var self = this;
  // Create an event handler to listen for clicks.
  var clickHandler = function(e) {
    if (self.currentPiece) {
      var mouseColumn = self.computeColumn(e.pageX);
      // Call doMove with the column as the move-delta.
      ConnectFour.superClass.doMove.call(self, mouseColumn.toString());
    }
  };
  this.board.bind("click.move", clickHandler);
};

ConnectFour.prototype.removeMoveListener = function() {
  this.board.unbind("click.move");
};

ConnectFour.prototype.attachPieceTracker = function(piece) {
  piece = piece || this.currentPiece;
  if (piece == null) {
    return false;
  }
  
  var self = this;
  var previousColumn = this.computeColumn(piece.element.offset().left);
  var tracker = function(e) {
    var mouseColumn = self.computeColumn(e.pageX);
    // Align the piece with the column over which the mouse is positioned
    if (mouseColumn != previousColumn) {
      piece.moveToColumn(mouseColumn, 200);
      previousColumn = mouseColumn;
    }
    return true;    // Allow event propagation
  };
  this.board.bind("mousemove.tracker", tracker);
  return true;
};

ConnectFour.prototype.removePieceTrackers = function() {
  this.board.unbind("mousemove.tracker");
};

ConnectFour.prototype.resize = function(pxWidth) {
  if (pxWidth === undefined) {
    pxWidth = this.board.width();
  }
  var imageWidth = Math.floor(pxWidth / this.width);
  this.board.find("img").width(imageWidth).height(imageWidth);
  // Resize the drop space height
  this.board.find("td[colspan]").height(imageWidth);
  // Scale the border width to the grid width
  var borderWidth = Math.round(pxWidth / 100.0);
  this.board.css("border-width", (borderWidth > 0) ? borderWidth : 1);

  // Resize all of the pieces
  for (var i = 0; i < this.pieces.length; i++) {
    this.pieces[i].resize();
  }
};

/**
 * Returns the column that is associated with the absolute x-coordinate.
 * The returned column is within the bounds of the grid.
 */
ConnectFour.prototype.computeColumn = function(x) {
  var dropAreaPosition = this.board.find("td[colspan]").offset();
  var columnWidth = this.board.innerWidth() / this.width;
  var column = Math.floor((x - dropAreaPosition.left) / columnWidth);
  if (column < 0) {
    column = 0;
  } else if (column >= this.width) {
    column = this.width - 1;
  }
  return column;
};

/**
 * Returns the row that is associated with the absolute y-coordinate.
 * The returned row is within the bounds of the grid, with -1 being the
 * drop area row.
 */
//ConnectFour.prototype.computeRow = function(y) {
//  var dropAreaPosition = this.board.find("td[colspan]").offset();
//  var rowHeight = this.board.innerHeight() / this.height;
//  var row = Math.floor((y - dropAreaPosition.top) / rowHeight);
//  if (row < 0) {
//    row = 0;
//  } else if (row >= this.height) {
//    row = this.height - 1;
//  }
//  return row - 1;
//};

/**
 * Returns the x-coordinate of the left side of the specified column.
 * If the column is out of the range of the board, it is first clamped to be
 * a valid column, and then the x-coordinate is calculated.
 */
ConnectFour.prototype.computeColumnOffset = function(column) {
  if (column < 0) {
    column = 0;
  } else if (column >= this.width) {
    column = this.width - 1;
  }

  var columnWidth = (this.board.innerWidth()) / this.width;
  return column * columnWidth;
};

/**
 * Returns the y-coordinate of the top of the specified row.
 * If the row is out of the range of the board, it is first clamped to be
 * a valid row, and then the y-coordinate is calculated.
 */
ConnectFour.prototype.computeRowOffset = function(row) {
  if (row < -1) {
    row = -1;
  } else if (row >= this.height) {
    row = this.height - 1;
  }
  
  var rowHeight = this.board.innerHeight() / (this.height + 1);
  return (row + 1) * rowHeight;
};

/**
 * A local version of getMoveValue.
 * @param board the string that represents the current board state.
 */
ConnectFour.prototype.localGetMoveValue = function(board) {
  return { board: board, value: "?", remoteness: -1 };
};

/**
 * A local version of getNextMoveValues.
 * @param board the string that represents the current board state.
 */
ConnectFour.prototype.localGetNextMoveValues = function(board) {
  // Count the number of Xs and Os to determine whose turn it is (X goes first).
  var nextPlayer = 0;
  for (var i = 0; i < board.length; i++) {
    var piece = board.charAt(i);
    if (piece == "X") {
      nextPlayer++;
    } else if (piece == "O") {
      nextPlayer--;
    }
  }
  nextPlayer = (nextPlayer > 0) ? "O" : "X";

  var nextMoves = [];
  // For each column that has at least one free spot, a move is possible.
  for (var col = 0; col < this.width; col++) {
    // Check if there is a spot free in the highest row.
    if (board.charAt(this.width * (this.height - 1) + col) == " ") {
      // Go down the column to find the first free spot.
      var row = this.findFreeRow(col, board);
      var index = (this.height - 1 - row) * this.width + col;
      var newBoard = board.substring(0, index) + nextPlayer +
        board.substring(index + 1);
      var move = this.localGetMoveValue(newBoard);
      move.move = col;
      nextMoves.push(move);
    }
  }
  return nextMoves;
};

ConnectFour.prototype.showMoveValues = function() {
  for (var i = 0; i < this.nextMoves.length; i++) {
    this.board.find("tr[colspan] + tr td")
	    .removeClass().addClass("win-marker");
  }
};

ConnectFour.prototype.hideMoveValues = function() {
  for (var i = 0; i < this.nextMoves.length; i++) {
    this.board.find("tr[colspan] + tr td").removeClass();
  }
};

/** Represents a Connect Four piece. */
function ConnectFourPiece(game, player) {
  var imgSrc;
  switch (player) {
    case GCWeb.Team.RED:
      imgSrc = "red-piece.png";
      break;
    case GCWeb.Team.BLUE:
      imgSrc = "blue-piece.png";
      break;
    default:
      imgSrc = "blank-piece.png";
      break;
  }
  imgSrc = "images/game/" + ConnectFour.NAME + "/" + imgSrc;
  GCWeb.Piece.prototype.constructor.call(this, game, player, {image: imgSrc});
  var column = parseInt(game.width / 2);
  this.resize();
  this.moveToRow(-1);
  this.moveToColumn(column);
  this.element.appendTo(game.board.find("td[colspan]"));
}
GCWeb.extend(ConnectFourPiece, GCWeb.Piece);

ConnectFourPiece.MILLIS_PER_ROW = 80;

ConnectFourPiece.prototype.resize = function() {
  /*
   * Since the image for pieces is the same size as those for the grid tiles,
   * resize pieces to the same dimensions.
   */
  var columnWidth = Math.floor(this.game.board.width() / this.game.width);
  this.element.width(columnWidth).height(columnWidth);
};

/**
 * Aligns the piece with the specified column.
 */
ConnectFourPiece.prototype.moveToColumn = function(column, slideDuration) {
  slideDuration = slideDuration || false;
  // Stop any currently executing animations immediately
  this.element.stop(/* Clear the queue. */true, /* Don't jump to end.*/false).
    css("position", "absolute");
  var endState = {marginLeft: this.game.computeColumnOffset(column)};
  if (typeof slideDuration == "number") {
    this.element.animate(endState, slideDuration);
  } else {
    this.element.css(endState);
  }
};

/**
 * Aligns the piece with the specified row. Row -1 is the drop area row.
 */
ConnectFourPiece.prototype.moveToRow = function(row, slideDuration) {
  slideDuration = slideDuration || false;
  // Stop any currently executing animations immediately
  this.element.stop(true, false).css("position", "absolute");
  var endState = {marginTop: this.game.computeRowOffset(row)};
  if (typeof slideDuration == "number") {
    this.element.animate(endState, slideDuration);
  } else {
    this.element.css(endState);
  }
};
