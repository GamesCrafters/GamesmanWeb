
var waitcount = 0;
function waiting() {
    if (waitcount == 0) {
        setTimeout(function() {
            if (waitcount) {
                document.getElementById("waitingnotice").style.visibility = "visible";
                document.body.style.cursor = "wait";
            }
        }, 100);
    }
    waitcount += 1;
}

function doneWaiting() {
    waitcount -= 1;
    if (waitcount == 0) {
        document.getElementById("waitingnotice").style.visibility = "hidden";
        document.body.style.cursor = "auto";
    }
}

GCWeb = {
    newPuzzleGame: function(gameName, width, height, options) {

        if(width <= 0 || height <= 0) {
            return null; // ERROR
        }
        args = options || {};
        args['width'] = width;
        args['height'] = height;
        return function(gameName, args){
            g = {
                // member variables
                currentBoardString: null,
                
                previousMoves: new Array(),
                
                // board state functions
                loadBoard: function(newBoardString){
                    this.currentMoveValue = null;
                    this.currentBoardString = newBoardString;
                    this.previousMoves = new Array();
                    
                    // gets the initial state and sets remoteness
                    this.getPositionValue(this.currentBoardString, this.setRemoteness);
                    
                    // get move values in case the user wants to display them
                    this.doMove({board: this.currentBoardString, isSetup: 1});
                    
                    this.maxRemotenessSeen = 0;
                    this.minRemotenessSeen = 0;
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
						// fragile, but measures the width of the history tree without the scrollbar
                        this.historyTreeWidth = this.historyTreeWidth || $("#history-tree").width();
                        if(newMove.remoteness > this.maxRemotenessSeen){
                            this.maxRemotenessSeen = newMove.remoteness;
                            $("#history-tree").html('');
                            for(i=0;i<this.previousMoves.length;i++){
                                width = (this.previousMoves[i].remoteness*100/this.maxRemotenessSeen + 10);
                                $("#history-tree").append("<div class='mvh-row' style='background: transparent url(images/greendot.png) no-repeat right; width: "+width+"px; text-align: right;'><span>&nbsp;</span></div>").scrollTop(10000);
                            }
                        }
                        if(this.maxRemotenessSeen > 0){
                            width = newMove.remoteness*100/this.maxRemotenessSeen + 10;
                        } else {
                            width = 10;
                        }
                        text = newMove.remoteness;
                        text = '&nbsp;';
						$("#history-tree").append("<div class='mvh-row' style='background: transparent url(images/greendot.png) no-repeat right; width: "+width+"px; text-align: right;'><span>"+text+"</span></div>").scrollTop(10000);
                    }
                    
                    // update the current board string and the move stack
                    this.currentBoardString = newMove.board;
                    if(!newMove.isSetup){
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
                    
                    waiting();
                    $.getJSON(url, {}, function (json) {
                        doneWaiting();
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
                    
                    waiting();
                    $.getJSON(url, {}, function (json) {
                        doneWaiting();
                        if (json && json.response && !json.error) {
                            onMoveValuesReceived(json.response);
                        }
                    });
                },
                
                // game messages
                // set the prediction message announcing the number of moves to win
                setRemoteness: function (moveValue) {
                    this.currentMoveValue = moveValue;
                    var hist = $('#prediction > span');
                    if (hist) {
						var text = "";
						if (moveValue.remoteness < 0) {
							text = "Prediction unavailable.";
						} else if (moveValue.remoteness == 0) {
							text = "Puzzle complete!";
						} else {
							if (moveValue.value >= 1 && moveValue.value <= 3) {
								//text = ['Lose','Draw','Win'][moveValue.value-1];
								text = 'Solvable in ' + moveValue.remoteness + " move" +
								       (moveValue.remoteness == 1 ? "" : "s") + ".";
							} else {
								text = 'Puzzle not started.';
							}
						}
                        hist.text(text);
                    }
                }
            };
            
            toggleMoveValueKey = function(immediate){
                if($('#option-move-value-history').is(':checked') || $('#option-move-values').is(':checked')){
                    if(immediate)
                        $('#move-value-key').show();
                    else
                        $('#move-value-key').slideDown(150);
                } else {
                    if(immediate)
                        $('#move-value-key').hide();
                    else
                        $('#move-value-key').slideUp(150);
                }
            };
            
            toggleMoveValueKey(true);
            
            if(!$('#option-predictions').is(':checked')){$('#prediction').hide();}
            $('#option-predictions').change(function(){$('#prediction').slideToggle(150);});
            
            if(!$('#option-move-value-history').is(':checked')){$('#move-value-history').hide();}
            $('#option-move-value-history').change(function(){$('#move-value-history').slideToggle(500).scrollTop(10000); toggleMoveValueKey(false);});
            
            $('#option-move-values').change(function(){
                if($('#option-move-values').is(':checked')){
                    if(g.previousMoves.length > 0){
                        if(options.updateMoveValues){
                            g.getNextMoveValues(g.currentBoardString, function(json){options.updateMoveValues(json);});
                        }
                    }
                } else {
                    if(options.clearMoveValues){
                        options.clearMoveValues();
                    }
                }
                toggleMoveValueKey(false);
            });
            
            return g;
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
                    waiting();
                    $.getJSON(url, {}, function (json) {
                        doneWaiting();
                        callback(json);
                    });
                },
                getNextMoveValues: function (position, callback) {
                    url = '/gcweb/service/gamesman/'+gameName+'/getNextMoveValues;position='+escape(position);
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    waiting();
                    $.getJSON(url, {}, function (json) {
                        doneWaiting();
                        callback(json);
                    });
                },
                // set the status message to "Player <player> to win in <remoteness>"
                setRemoteness: function (player, remoteness) {
                    $('#prediction > span').text("Player "+player+" to win in "+remoteness);
                }
            }
        }(gameName, args);
    }
}
