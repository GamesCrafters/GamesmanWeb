/**
 * gc-game.js
 * Contains a definition for a general GamesCrafters game that connects to a
 * remote server for move values and other game information.
 * @author  ide
 */

// Create the GCWeb namespace if it doesn't already exist.
var GCWeb = GCWeb || {};

/** Displays a notification to the user. */
GCWeb.alert = function(message) {
  window.alert(message);
};

/** Displays a confirmation prompt to the user. */
GCWeb.confirm = function(prompt, onaccept, oncancel) {
  if (typeof(onaccept) != "function") {
    onaccept = function() { };
  }
  if (typeof(oncancel) != "function") {
    oncancel = function() { };
  }
  // Display a modal dialog.
  var dialogHTML = '<div class="gc-dialog">\n\
  <p class="gc-dialog-prompt" />\n\
  <p class="gc-dialog-controls">\n\
    <button type="button" class="gc-dialog-ok">OK</button>\n\
    <button type="button" class="gc-dialog-cancel">Cancel</button>\n\
  </p>\n\
</div>';
  var dialogScreen = $('<div class="gc-dialog-screen" />');
  dialogScreen.width($(window).width())
              .height($(window).height())
              .css({background: "#000", opacity: 0});
  var dialog = $(dialogHTML).css({background: "#fff"});

  var fadeDuration = 500; // ms
  function removeDialog() {
    dialog.add(dialogScreen).animate(
      {opacity: 0}, fadeDuration, "linear", function () {
        dialog.add(dialogScreen).remove();
      });
  }

  dialog.find(".gc-dialog-prompt").html(prompt);
  dialog.find(".gc-dialog-ok").click(function () {
    onaccept();
    removeDialog();
  });
  dialog.find(".gc-dialog-cancel").click(function () {
    oncancel();
    removeDialog();
  });
  
  // Add the dialog elements to the document so its dimensions are computed.
  $(document.body).append(dialogScreen).append(dialog);
  // Center the dialog.
  dialog.css({
    opacity: 0,
    left: ($(window).width() - dialog.outerWidth()) / 2,
    top: ($(window).height() - dialog.outerHeight()) / 2
  });
  // Fade in the dialog elements.
  dialog.animate({opacity: 1}, fadeDuration);
  dialogScreen.animate({opacity: 0.8}, fadeDuration);
};

/**
 * Extends the subclass from the specified base class.
 * Note that when overriding methods of the parent class,
 * SubClass.superClass.memberMethod.call(this, arg0, arg1, ...) should be
 * called to invoke the super class's implementation of the method.
 */
GCWeb.extend = function(subClass, baseClass) {
   function Parent() {}
   Parent.prototype = baseClass.prototype;

   subClass.prototype = new Parent();
   subClass.prototype.constructor = subClass;
   subClass.superClass = baseClass.prototype;
};

/** An enum type to represent the two teams that a player may be. */
GCWeb.Team = function(name) {
  this.name = name;
};
GCWeb.Team.RED = new GCWeb.Team("Red");
GCWeb.Team.BLUE = new GCWeb.Team("Blue");

/** Returns the other team. */
GCWeb.Team.prototype.other = function() {
  return (this == GCWeb.Team.BLUE) ? GCWeb.Team.RED : GCWeb.Team.BLUE;
};

/**
 * A game piece that may be placed on the board and moved depending on the
 * type of game.
 * A dictionary of options may be passed to the constructor.
 */
GCWeb.Piece = function(game, team, options) {
  options = options || {};
  this.game = game;
  this.team = team;
  this.element = $('<img class="piece">').hide();
  
  var image, altText;
  switch (team) {
    case GCWeb.Team.RED:
      altText = "[Red]";
      image = options.image || "red-piece.png";
      break;
    case GCWeb.Team.BLUE:
      altText = "[Blue]";
      image = options.image || "blue-piece.png";
      break;
    default:
      altText = "[None]";
      image = options.image || "blank-piece.png";
      break;
  }
  this.element.attr({"src": image, "alt": altText});

  if (options.visible) {
    this.show();
  }
};

/** A convenience method to show the piece. */
GCWeb.Piece.prototype.show = function() {
  this.element.show();
};

/** A convenience method to hide the piece. */
GCWeb.Piece.prototype.hide = function() {
  this.element.hide();
};

/**
 * A GamesCrafters game that provides basic functionality to make a game.
 * This class may be extended to implement actual games or to create new
 * game types.
 * @param name    the internal name of the game
 * @param width   the width of the game board (e.g. the number of columns)
 * @param height  the height of the game board (e.g. the number of rows)
 * @param options a dictionary specifying any game variants
 */
GCWeb.Game = function(name, width, height, options) {
  GCWeb.Game.prototype.constructor.call(this, name, width, height, options);
}

/** The URL of the server that is the gateway to the Gamesman provider. */
GCWeb.Game.serviceUrl = "http://nyc.cs.berkeley.edu:8080/gcweb/service/gamesman/puzzles/";

/** Generates a unique ID for a game instance. */
GCWeb.Game.generateId = function() {
  var id = 0;
  return function() {
    return id++;
  };
}();

GCWeb.Game.prototype.constructor = function(name, width, height, config) {
  config = config || {};
  this.local = config.local || false;  // Whether to connect to the server
  this.name = name;
  this.width = width;
  this.height = height;
  this.options = config.options || {}; // Dictionary of game-specific options
  this.id = this.name + "-" + GCWeb.Game.generateId();
  this.player = GCWeb.Team.BLUE;
  this.board = $('<div id="' + this.id + '" />');
  this.defaultBoardString = config.defaultBoardString || this.getDefaultBoardString();
  this.handlingDoMove = false;
  this.doMoveRequestQueue = [];

  this.pieces = [];
  this.moveHistory = [];
  this.nextMoves = [];
  this.eventListeners = {};
};

/**
 * Starts the game by requesting the value of the initial board position
 * and the next move values. Subclasses that override the start() function
 * should call this method.
 */
GCWeb.Game.prototype.start = function() {
  this.showingMoveValues = $("#options-move-values:checked").length > 0;
  var self = this;
  $("#option-move-values").click(function() {
    self.showingMoveValues = $("#options-move-values:checked").length > 0;
	if (self.showingMoveValues) {
		self.showMoveValues();
	} else {
		self.hideMoveValues();
	}
  });
  // Prevent the user from making any moves (move-making will be restored
  // in the callback from getNextMoveValues).
  this.handlingDoMove = true;
  // Get the move-value of the initial board state, and then get the values
  // of all of the next moves that can be made.
  if (!this.local) {
    var self = this;
    var serverUrl = GCWeb.Game.serviceUrl + encodeURIComponent(this.name) +
      "/getMoveValue" + this.createParameterString();
    var options = {cache: false, dataType: "json", url: serverUrl};
    options.success = function(data, textStatus) {
      if (data.status == "ok") {
        var moveValue = data.response;
        self.moveHistory.push(moveValue);
		
		self.updatePrediction(moveValue);
		
        self.getNextMoveValues(moveValue.board);
      } else {
        GCWeb.alert("The GamesCrafters server could not handle the request (" + data.status + ").");
        self._clearDoMoveRequests();
      }
    };
    options.error = function(textStatus) {
      GCWeb.alert("The GamesCrafters server is not responding (" + textStatus + ").");
      self._clearDoMoveRequests();
    };
    $.ajax(options);
  } else {
    var initialState = this.localGetMoveValue(this.defaultBoardString);
    this.moveHistory.push(initialState);
    this.nextMoves = this.localGetNextMoveValues(initialState.board);
    if (this.nextMoves.length == 0) {
      this.handleGameOver();
    } else {
      this.fireEvent("nextvaluesreceived", this.nextMoves);
      this._dequeueDoMoveRequest(); // Also sets handlingDoMove to false
    }
  }
};

GCWeb.Game.prototype.createParameterString = function(board) {
  board = board || this.defaultBoardString;
  var paramString = ";board=" +  encodeURIComponent(board) +
    ";width=" + encodeURIComponent(this.width) +
    ";height=" + encodeURIComponent(this.height);
  for (var key in this.options) {
    if ((key != "width") && (key != "height")) {
      paramString += ";" + encodeURIComponent(key) +
        "=" + encodeURIComponent(this.options[key]);
    }
  }
  return paramString;
};

/**
 * Creates a game piece of the specified type and adds it to the game's
 * internal list of pieces.
 * @param type    the type of the piece, which is typically its constructor
 * @param team    the team to which the piece belongs, passed to the piece's
 *        constructor
 * @param options a dictionary of options to pass to the piece's constructor
 */
GCWeb.Game.prototype.createPiece = function(type, team, options) {
  if (typeof type != "function") {
    throw new Exception("The specified type " + type + " is not a function.");
  }
  var piece = new type(this, team, options);
  this.pieces.push(piece);
  return piece;
};

/**
 * Removes the specified piece from the game and the HTML DOM.
 * @param piece the piece to remove
 */
GCWeb.Game.prototype.removePiece = function(piece) {
  piece.element.remove();
};

/**
 * Switches the current player to the opposite team.
 * If an optional team argument is provided, then the current player will be
 * set to the specified team.
 * @param team  an optional argument specifying which team to make active
 */
GCWeb.Game.prototype.switchTeams = function(team) {
  this.player = team || this.player.other();
};

/**
 * Adds a listener that is invoked when the specified event is triggered.
 * @param event     the name of the event for which to listen. Possible values
 *                  include "callenqueued", "invalidmove", "executingmove",
 *                  "nextvaluesreceived", "calldequeued", "win", "lose", "tie".
 * @param listener  the callback function to invoke when the event fires
 */
GCWeb.Game.prototype.addEventListener = function(event, listener) {
  this.eventListeners[event] = this.eventListeners[event] || [];
  this.eventListeners[event].push(listener);
};

/**
 * Checks the specified move for validity and then executes it if valid.
 * The next move values are then retrieved from the server.
 * @param moveDelta the move that was performed. This must be in the
 *        "move-delta" format that the Gamesman service uses for this game.
 */
GCWeb.Game.prototype.doMove = function(moveDelta) {
  /*
   *  If a call to doMove has not yet received its list of next move values,
   *  then enqueue this request so that it may be subsequently handled.
   */
  if (this.handlingDoMove) {
    this._enqueueDoMoveRequest(arguments);
    return false;
  }
  this.handlingDoMove = true;
  
  // Find the current move-value object that represents the specified move.
  var moveValue = null;
  for (var i = 0; (i < this.nextMoves.length) && (moveValue == null); i++) {
    if (this.nextMoves[i].move == moveDelta) {
      moveValue = this.nextMoves[i];
    }
  }
  
  if ((moveValue == null) || !this.isValidMove(moveValue)) {
    this.fireEvent("invalidmove");
    this._clearDoMoveRequests();
    return false;
  }
  
  // Execute the valid move
  this.fireEvent("executingmove", moveValue);
  this.moveHistory.push(moveValue);
  
  // Request the next move values.
  if (!this.local) {
    this.updatePrediction(moveValue);
    var nextMoves = this.getNextMoveValues(moveValue.board);
	if (this.showingMoveValues) {
		this.showMoveValues(nextMoves);
	}
  } else {
    this.nextMoves = this.localGetNextMoveValues(moveValue.board);
    if (this.nextMoves.length == 0) {
      this.handleGameOver();
    } else {
      this.fireEvent("nextvaluesreceived", this.nextMoves);
      this._dequeueDoMoveRequest();
    }
  }
  
  return true;
};

GCWeb.Game.prototype.handleGameOver = function() {
  // Clear any pending doMove requests.
  this._clearDoMoveRequests();
  
  var lastMove = (this.moveHistory.length > 0) ?
                  this.moveHistory[this.moveHistory.length - 1] : null;
  // Display a prompt to the user.
  var prompt;
  var value = lastMove ? lastMove.value : null;
  switch (value) {
    case "win":
      prompt = this.player.name + " won the game!";
      break;
    case "lose":
      prompt = this.player.name + "lost the game.";
      break;
    case "tie":
      prompt = "The game has ended in a tie!";
      break;
    case "draw":
      prompt = "The game has ended in a draw!";
      break;
    default:
      prompt = "The game has ended!";
      break;
  }
  prompt += " Would you like to reset the game and play again?";
  var onAccept = function() {
    window.location.reload();
  };
  GCWeb.confirm(prompt, onAccept);
};

/**
 * Contacts the server to retrieve the values of the moves that can be
 * performed on the board with the specified board string.
 * @param board the string that represents the current state of the board
 */
GCWeb.Game.prototype.getNextMoveValues = function(board) {
  var self = this;
  var serverUrl = GCWeb.Game.serviceUrl + encodeURIComponent(this.name) +
    "/getNextMoveValues" + this.createParameterString(board);
  var options = {cache: false, dataType: "json", url: serverUrl};
  options.success = function(data, textStatus) {
    if (data.status == "ok") {
      var moveValues = data.response;
      self.nextMoves = moveValues;
      // If there are no more next moves, the game is over.
      if (self.nextMoves.length == 0) {
        self.handleGameOver();
      } else {
        self.fireEvent("nextvaluesreceived", self.nextMoves);
		if (self.showingMoveValues) {
		  self.showMoveValues(self.nextMoves);
		}
        // Finally, handle pending doMove calls
        self._dequeueDoMoveRequest();
      }
    } else {
      GCWeb.alert("The GamesCrafters server could not handle the request (" + data.status + ").");
      self._clearDoMoveRequests();
    }
  };
  options.error = function(textStatus) {
    GCWeb.alert("The GamesCrafters server is not responding (" + textStatus + ").");
    self._clearDoMoveRequests();
  };
  $.ajax(options);
};

/** Enqueues a request to doMove given the specified invocation context. */
GCWeb.Game.prototype._enqueueDoMoveRequest = function(fnArguments) {
  // Bind the caller object to a variable
  var caller = this;
  // Create a function that may be invoked that encapsulates this call
  this.doMoveRequestQueue.push(function() {
    return fnArguments.callee.apply(caller, Array.prototype.slice(fnArguments));
  });
  this.fireEvent("callenqueued", fnArguments);
};

/** Dequeues a doMove request if one is queued and invokes it. */
GCWeb.Game.prototype._dequeueDoMoveRequest = function() {
  if (this.doMoveRequestQueue.length > 0) {
    var fn = this.doMoveRequestQueue.shift();
    this.fireEvent("calldequeued", fn);
    fn();
  } else {
    this.handlingDoMove = false;
  }
};

/** Clears the request queue, discarding all doMove requests. */
GCWeb.Game.prototype._clearDoMoveRequests = function() {
  this.doMoveRequestQueue = [];
  this.handlingDoMove = false;
  this.fireEvent("callscleared"/* Pass in the cleared requests? */);
}

/**
 * Fires the event with the specified name, thus invoking all listeners
 * registered for that event. A variable number of arguments may be specified
 * after the event name; these arguments will be passed to the listeners.
 * @param name  the name of the event whose listeners to invoke
 */
GCWeb.Game.prototype.fireEvent = function(name) {
  var handlers = this.eventListeners[name];
  if (handlers) {
    // Truncate the "name" argument from the argument list
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < handlers.length; i++) {
      handlers[i].apply(this, args);
    }
  }
};

/** Returns true if there is an entry in the nextMoves list that
 * has the specified move as a property value.
 * @param move the move whose validity to check. It is a move-value object
 *        that contains the move-delta, board string, value, etc...
 */
GCWeb.Game.prototype.isValidMove = function(move) {
  return true;  // for now
  for (var i = 0; i < this.nextMoves.length; i++) {
    if (move == this.nextMoves[i].move) {
      return true;
    }
  }
  return false;
}

GCWeb.Game.prototype.updatePrediction = function(moveValue) {
  if (moveValue.remoteness !== undefined) {
    $("#prediction span").text(
      moveValue.value + " in " + moveValue.remoteness + " moves");
  }
};

/**
 * Returns the default board string for this game.
 */
GCWeb.Game.prototype.getDefaultBoardString;

/**
 * Displays the win-loss-tie values of the next moves so that the player may
 * view the most up-to-date view.
 */
GCWeb.Game.prototype.showMoveValues = function() { console.log("showMoveValues()"); };

/**
 * Hides the win-loss-tie values of the next moves. If they are already hidden,
 * this method does nothing.
 */
GCWeb.Game.prototype.hideMoveValues = function() { };


/**
 * Removes a callback function so that it will not be invoked when the
 * specified event is triggered in the future. If the listener was found and
 * successfully removed, the listener is returned. Otherwise, false is returned.
 * @param event     the name of the event whose listener to remove
 * @param listener  the callback function to remove
 */
GCWeb.Game.prototype.removeEventListener = function(event, listener) {
  throw new Exception("removeEventListener is unimplemented");
};
