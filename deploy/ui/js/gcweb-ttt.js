var puzzleMessages = {
        1:'Solvable',
        2:'Tie',
        3:'Solvable',
	'lose':'Lose',
	'tie':'Tie',
	'draw':'Draw',
	'win':'Win'};
var waitcount = 0;
function waiting() {
    if (waitcount == 0) {
        setTimeout(function() {
            if (waitcount) {
                document.getElementById("waitingnotice").style.visibility = "visible";
                //document.body.style.cursor = "wait";
            }
        }, 10);
    }
    waitcount += 1;
}

function doneWaiting() {
    waitcount -= 1;
    if (waitcount == 0) {
        document.getElementById("waitingnotice").style.visibility = "hidden";
        //document.body.style.cursor = "auto";
        //delete document.body.style['cursor'];
    }
}

function toggleTimer() {
    if ($('#option-timer').is(':checked')) {
        $('#timer').show();
    } else {
        $('#timer').hide();
    }
}

function showTooltip(x, y, contents) {
   $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            color: 'rgb(0, 0, 102)',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
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
                moveValues: $('#option-move-values').is(':checked'),

                previousMoves: new Array(),
                
                // board state functions
                loadBoard: function(newBoardString){
                    this.currentMoveValue = null;
                    this.currentBoardString = newBoardString;
                    this.previousMoves = new Array();
                    this.drawMoveValueHistory(this.previousMoves);
                    
                    // gets the initial state and sets remoteness
                    this.getPositionValue(this.currentBoardString, this.setRemoteness);
                    
                    // get move values in case the user wants to display them
                    this.doMove({board: this.currentBoardString, isSetup: 1});
                    
                    this.maxRemotenessSeen = 0;
                    this.minRemotenessSeen = 0;
                    this.numMoves = 0;
                    if(this.timer) // cancel the timer if it's already running
                    	clearInterval(this.timer);
                    this.timer = null;
                    //$('#max-remoteness').text(this.maxRemotenessSeen);
                    //$('#mid-remoteness').text((this.maxRemotenessSeen/2).toFixed(2));
                    //$('#min-remoteness').text(this.minRemotenessSeen);
                    
                    $("#history-graph").bind("plothover", function (event, pos, item) {
                        //$("#x").text(pos.x.toFixed(2));
                        //$("#y").text(pos.y.toFixed(2));

                        //if ($("#enableTooltip:checked").length > 0) {
                        if (item) {
                            if (previousPoint != item.datapoint) {
                                previousPoint = item.datapoint;

                                $("#tooltip").remove();
                                showTooltip(item.pageX, item.pageY, item.datapoint[0].toFixed(0));
                                        //"value " + x + "at move " + window.plot.getAxes().yaxis.max - y);
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;            
                        }
                    });
                    $("#history-graph").bind("mouseout", function(){$("#tooltip").remove();});
                },				
				
                drawMoveValueHistory: function(pMoves) {
				document.getElementById("history-graph").innerHTML = "<canvas id='canvas' width='150' height='300'>";
	                /* find maximum remoteness */
	                var m = 0;
	                for (var i = 0; i < pMoves.length; i++) {
					m = Math.max(m, pMoves[i].remoteness)};
					m+=1;
					var r = [m];
					var w = [2];
					var p = [1];
	                for(var i = 0; i < pMoves.length; i++){
					r.push(pMoves[i].remoteness);
					switch(pMoves[i].value){
					case "win": w.push(1); break;
					case "tie": w.push(2); break;
					case "lose": w.push(3); break;
					}
					p.push(i % 2);
					}					
	                if($('#option-move-value-history').is(':checked')) {
	                    // Draw graph
	                    main("Player 1","Player 2",r,w,p,m);
	                    // Scroll to bottom
	                    $("#history-graph-container").scrollTop(10000);
	                }
                },
                
                // move functions
                doMove: function(newMove){
                    
                    // if this is an invalid move, return and do not continue
                    if(options.isValidMove && !newMove.isSetup){
                        if(!options.isValidMove(newMove))
                            return;
                        this.currentMoveValue = newMove;
                    }
                    
                    // tell the user we are executing this specific move (basically if isValidMove returned okay)
                    if(options.onExecutingMove && !newMove.isSetup){
                        options.onExecutingMove(newMove);
                    }
                    if(newMove.remoteness != undefined){
                        setTimeout(this.drawMoveValueHistory, 10, this.previousMoves);
                    }
                    
                    // update the current board string and the move stack
                    this.currentBoardString = newMove.board;
                    if(!newMove.isSetup){
                        this.previousMoves.push(newMove);
                        this.numMoves += 1;
                        if (this.numMoves == 1) {
                          $('#timer').text("0:00");
                          $('#nr-moves').text("1 move");
                          var mythis=this;
                          (function() {
                            var time = 0;
                            mythis.timer = setInterval(function() {
                                time+=1;
                                min = (time/60)>>0; // integer
                                sec = time%60;
                                secStr = (sec<10?('0'+sec):''+sec);
                                $('#timer').text(min+":"+secStr);
                            },1000);
                          })();
                        } else {
                          $('#nr-moves').text(this.numMoves + " moves");
                        }
                    }
                    
                    // grab the next values
                    this.getNextMoveValues(newMove.board, 
                        function(game, newMove){
                            return function(moveValues){
                                // housekeeping for each move
                                if(!newMove.isSetup){
                                    game.setRemoteness(newMove);
                                }
                                if(game.moveValues) {
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
                    url = 'http://nyc.cs.berkeley.edu:8080/gcweb/service/gamesman/puzzles/'+gameName+'/getMoveValue;board='+escape(position);
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
                            this.currentMoveValue = json.response;
                            onValueReceived(json.response);
                        }
                    });
                },
                // position: string
                // onMoveValuesReceived: function(json)
                getNextMoveValues: function (position, onMoveValuesReceived) {
                    url = 'http://nyc.cs.berkeley.edu:8080/gcweb/service/gamesman/puzzles/'+gameName+'/getNextMoveValues;board='+escape(position);
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
                    var mythis = this;
                    waiting();
                    $.getJSON(url, {}, function (json) {
                        doneWaiting();
                        if (json && json.response && !json.error) {
                            var moveValues = json.response;
                            var thisRemoteness = 0;
                            if (mythis.currentMoveValue && mythis.currentMoveValue.remoteness) {
                                thisRemoteness = mythis.currentMoveValue.remoteness;
                            }
                            for (mvkey in moveValues) {
                                var mv = moveValues[mvkey];
                                mv.delta = mv.remoteness - thisRemoteness;
                                //alert(mv.delta+";"+mv.remoteness+";"+thisRemoteness);
                            }
                            if (moveValues.length == 0 && mythis.timer != null) {
                                clearInterval(mythis.timer);
                                mythis.timer = null;
                            }
                            onMoveValuesReceived(moveValues);
                        }
                    });
                },
                
                // game messages
                // set the prediction message announcing the number of moves to win
                setRemoteness: function (moveValue) {
                    var hist = $('#prediction > span');
                    if (hist) {
						var text = "";
						if (moveValue.remoteness < 0) {
							text = "Prediction unavailable.";
						} else if (moveValue.remoteness == 0) {
                            if (this.timer != null) {
                                clearInterval(this.timer);
                                this.timer = null;
                                this.numMoves = 0;
                            }
							text = "Puzzle complete!";
						} else {
							if (moveValue.value) {
								text = puzzleMessages[moveValue.value];
								if (!text) text = "Unsolvable";
								text += " in " + moveValue.remoteness + " move" +
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
            $('#option-move-value-history').change(
            	function(g) {
            		return function(){
            			$('#move-value-history').slideToggle(500);
            			g.drawMoveValueHistory(g.previousMoves);
            			toggleMoveValueKey(false);
            		}
            	}(g)
            );
            
            $('#option-move-values').change(function(){
                if($('#option-move-values').is(':checked')){
                    g.moveValues = true;
                    //if(g.previousMoves.length > 0){
                        if(options.updateMoveValues){
                            g.getNextMoveValues(g.currentBoardString, function(json){options.updateMoveValues(json);});
                        }
                    //}
                } else {
                    g.moveValues = false;
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
                    url = 'http://nyc.cs.berkeley.edu:8080/gcweb/service/gamesman/'+gameName+'/getMoveValue;position='+escape(position);
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
                    url = 'http://nyc.cs.berkeley.edu:8080/gcweb/service/gamesman/'+gameName+'/getNextMoveValues;position='+escape(position);
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

