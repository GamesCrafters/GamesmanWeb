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
                },
                
                // move functions
                doMove: function(newMove, onMoveValuesReceived){
                    this.currentBoardString = newMove.board;
                    this.previousMoves.push(newMove);
                    this.getNextMoveValues(newMove.board, 
                        function(game, newMove, onMoveValuesReceived){
                            return function(moveValues){
                                // housekeeping for each move
                                console.log(newMove);
                                game.setRemoteness(newMove);
                                if(onMoveValuesReceived){
                                    onMoveValuesReceived(moveValues);
                                }
                            };
                        }(this, newMove, onMoveValuesReceived)
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
                    url = '/gcweb/service/gamesman/'+gameName+'/getMoveValue;position='+position.replace(' ', '%20');
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    
                    // debugging for 1210 puzzle
                    if(gameName == '1210puzzle') {
                        onValueReceived({
                            "board": position, 
                            "move": null, 
                            "remoteness": "-1",
                            "value": 3
                        });
                        return;
                    }
                    
                    $.getJSON(url, {}, function (json) {
                        onValueReceived(json);
                    });
                },
                // position: string
                // onMoveValuesReceived: function(json)
                getNextMoveValues: function (position, onMoveValuesReceived) {
                    url = '/gcweb/service/gamesman/'+gameName+'/getNextMoveValues;position='+position.replace(' ', '%20');
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    
                    // debugging for 1210 puzzle
                    if(gameName == '1210puzzle') {
                        var retval = [];
                        var last = -1;
                        for(i=0;i<args.height;i++) {
                            if(position[i] == 'X'){
                                last = i;
                            }
                        }
                        if(last+1 < args.height){
                            newBoard = '';
                            for(i=0;i<args.height;i++) {
                                newBoard += (i==last+1) ? 'X' : position[i];
                            }
                            retval.push({"board": newBoard, "move": (last+1), "remoteness": Math.floor((args.height-last-1)/2), "status": "OK", "value": 3});
                        }
                        if(last+2 < args.height){
                            newBoard = '';
                            for(i=0;i<args.height;i++) {
                                newBoard += (i==last+2) ? 'X' : position[i];
                            }
                            retval.push({"board": newBoard, "move": (last+2), "remoteness": Math.floor((args.height-last-2)/2), "status": "OK", "value": 3});
                        }
                        onMoveValuesReceived(retval);
                        return;
                    }
                    
                    $.getJSON(url, {}, function (json) {
                        onMoveValuesReceived(json);
                    });
                },
                
                // game messages
                // set the status message to "Player <player> to win in <remoteness>"
                setRemoteness: function (moveValue) {
                    $('#prediction').text(['Lose','Draw','Win'][moveValue.value-1]+" in "+moveValue.remoteness);
                }
            }
        }(gameName, args);
    }
}
