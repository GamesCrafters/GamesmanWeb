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
                    this.getNextMoveValues(newMove.board, function(moveValues){
                        // housekeeping for each move
                        this.setRemoteness(newMove.board);
                        onMoveValuesReceived(moveValues);
                    };
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
