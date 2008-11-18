GCWeb = {
    newPuzzleGame: function(gameName, width, height, options) {
        if(width <= 0 || height <= 0) {
            return null; // ERROR
        }
        args = options || {};
        args['width'] = width;
        args['height'] = height;
        return function(gameName, args){
            return {
                // member variables
                currentBoardString: null,
                previousMoves: new Array(),
                
                // board state functions
                loadBoard: function(newBoardString){
                    this.currentBoardString = newBoardString;
                    this.previousMoves = new Array();
                    
                    // gets the initial state and sets remoteness
                    this.getPositionValue(this.currentBoardString, this.setRemoteness);
                    
                    // get move values in case the user wants to display them
                    this.doMove({board: this.currentBoardString, isSetup: 1});
                },
                
                // move functions
                doMove: function(newMove){
                    // if this is an invalid move, return and do not continue
                    if(options.isValidMove && !newMove.isSetup){
                        if(!options.isValidMove(newMove))
                            return;
                    }
                    
                    // tell the user we are executing this specific move (basically if isValidMove returned okay)
                    if(options.onExecutingMove && !newMove.isSetup){
                        options.onExecutingMove(newMove);
                    }
                    
                    // update the current board string and the move stack
                    this.currentBoardString = newMove.board;
                    if(newMove.isSetup){
                        this.previousMoves.push(newMove);
                    }
                    
                    // grab the next values
                    this.getNextMoveValues(newMove.board, 
                        function(game, newMove){
                            return function(moveValues){
                                // housekeeping for each move
                                if(!newMove.isSetup){
                                    game.setRemoteness(newMove);
                                }
                                if($('#option-move-values').is(':checked')){
                                    if(options.updateMoveValues){
                                        options.updateMoveValues(moveValues);
                                    }
                                }else{
                                    if(options.clearMoveValues){
                                        options.clearMoveValues();
                                    }
                                }
                                if(options.onNextValuesReceived){
                                    options.onNextValuesReceived(moveValues);
                                }
                            };
                        }(this, newMove)
                    );
                },
                undoMove: function(){
                    if(args.allowUndo)
                        return this.previousMoves.pop();
                    return null;
                },
                
                // position: string
                // onValueReceived: function(json)
                getPositionValue: function (position, onValueReceived) {
                    url = '/gcweb/service/gamesman/puzzles/'+gameName+'/getMoveValue;board='+escape(position);
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    
                    // debug if available
                    if(options.debug && options.getPositionValue){
                        options.getPositionValue(position, onValueReceived);
                        return;
                    }
                    
                    $.getJSON(url, {}, function (json) {
                        onValueReceived(json);
                    });
                },
                // position: string
                // onMoveValuesReceived: function(json)
                getNextMoveValues: function (position, onMoveValuesReceived) {
                    url = '/gcweb/service/gamesman/puzzles/'+gameName+'/getNextMoveValues;board='+escape(position);
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    
                    // debug if available
                    if(options.debug && options.getNextMoveValues){
                        options.getNextMoveValues(position, onMoveValuesReceived);
                        return;
                    }
                    
                    $.getJSON(url, {}, function (json) {
                        onMoveValuesReceived(json);
                    });
                },
                
                // game messages
                // set the status message to "Player <player> to win in <remoteness>"
                setRemoteness: function (moveValue) {
                    if($('#option-predictions').is(':checked')){
                        $('#prediction').text(['Lose','Draw','Win'][moveValue.value-1]+" in "+moveValue.remoteness);
                    } else{
                        $('#prediction').text('');
                    }
                }
            }
        }(gameName, args);
    },
    
    newGame: function(gameName, width, height, options) {
        if(width <= 0 || height <= 0) {
            return null; // ERROR
        }
        args = options || {};
        args['width'] = width;
        args['height'] = height;
        return function(gameName, args){
            return {
                getPositionValue: function (position, callback) {
                    url = '/gcweb/service/gamesman/'+gameName+'/getMoveValue;position='+position.replace(' ', '%20');
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    $.getJSON(url, {}, function (json) {
                        callback(json);
                    });
                },
                getNextMoveValues: function (position, callback) {
                    url = '/gcweb/service/gamesman/'+gameName+'/getNextMoveValues;position='+position.replace(' ', '%20');
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    $.getJSON(url, {}, function (json) {
                        callback(json);
                    });
                },
                // set the status message to "Player <player> to win in <remoteness>"
                setRemoteness: function (player, remoteness) {
                    $('#prediction').text("Player "+player+" to win in "+remoteness);
                }
            }
        }(gameName, args);
    }
}
