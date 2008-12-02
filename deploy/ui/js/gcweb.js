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
                    
                    if(newMove.remoteness != undefined){
                        width = newMove.remoteness * 10;
                        if(options.maxRemoteness){
                            width = newMove.remoteness*100/options.maxRemoteness;
                        }
                        if(width == 0){
                            width = '10px';
                        } else {
                            width = width+'%';
                        }
                        text = newMove.remoteness;
                        text = '&nbsp;';
						$("#move-value-history").append("<div class='mvh-row' style='background: transparent url(images/greendot.png) no-repeat right; width: "+width+"; text-align: right;'><span>"+text+"</span></div>").scrollTop(Number.MAX_VALUE);
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
                        if(key == "board" || key == "width" || key == "height")
                            url += ";"+key+"="+args[key];
                    }
                    if (args.options) {
                        for (var key in args.options) {
                            url += ";"+key+"="+args.options[key];
                        }
                    }
                    
                    // debug if available
                    if(options.debug && options.getPositionValue){
                        options.getPositionValue(position, onValueReceived);
                        return;
                    }
                    
                    $.getJSON(url, {}, function (json) {
                        if (json && json.response && !json.error) {
                            onValueReceived(json.response);
                        }
                    });
                },
                // position: string
                // onMoveValuesReceived: function(json)
                getNextMoveValues: function (position, onMoveValuesReceived) {
                    url = '/gcweb/service/gamesman/puzzles/'+gameName+'/getNextMoveValues;board='+escape(position);
                    for (var key in args) {
                        if(key == "board" || key == "width" || key == "height")
                            url += ";"+key+"="+args[key];
                    }
                    if (args.options) {
                        for (var key in args.options) {
                            url += ";"+key+"="+args.options[key];
                        }
                    }
                    
                    
                    // debug if available
                    if(options.debug && options.getNextMoveValues){
                        options.getNextMoveValues(position, onMoveValuesReceived);
                        return;
                    }
                    
                    $.getJSON(url, {}, function (json) {
                        if (json && json.response && !json.error) {
                            onMoveValuesReceived(json.response);
                        }
                    });
                },
                
                // game messages
                // set the status message to "Player <player> to win in <remoteness>"
                setRemoteness: function (moveValue) {
                    if($('#option-predictions').is(':checked')){
                        var text;
                        if (moveValue.value >= 1 && moveValue.value <= 3) {
                            text = ['Lose','Draw','Win'][moveValue.value-1];
                        } else {
                            text = 'Complete';
                        }
                        $('#prediction').text(text+" in "+moveValue.remoteness);
                        var hist = document.getElementById('all-history');
                        if (hist) {
                            hist.value = text+" in "+moveValue.remoteness+"\n"+hist.value;
                        }
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
                    url = '/gcweb/service/gamesman/'+gameName+'/getMoveValue;position='+escape(position);
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    $.getJSON(url, {}, function (json) {
                        callback(json);
                    });
                },
                getNextMoveValues: function (position, callback) {
                    url = '/gcweb/service/gamesman/'+gameName+'/getNextMoveValues;position='+escape(position);
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
