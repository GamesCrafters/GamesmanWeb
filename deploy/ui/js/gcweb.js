GCWeb = {
    newDartboardGame: function(gameName, width, height, options) {
        if(width <= 0 || height <= 0) {
            return null; // ERROR
        }
        args = options || {};
        args['width'] = width;
        args['height'] = height;
        return function(gameName, args){
            return {
                getPositionValue: function (position, callback) {
                    url = '/service/'+gameName+'/getMoveValue;position='+position.replace(' ', '%20');
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    /*
                    if(position == '         ' || position == 'X        ')
                        callback({"value":"2","remoteness":"-1"});
                    else if(position == 'XXOXXOOOX') {
                        callback({"value":"3","remoteness":"-1"});
                    }
                    else
                        callback({"value":"1","remoteness":"-1"});
                    return;*/
                    $.getJSON(url, {}, function (json) {
                        callback(json);
                    });
                },
                getNextMoveValues: function (position, callback) {
                    url = '/service/'+gameName+'/getNextMoveValues;position='+position;
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }                   
                    
                    // hack to test 1210
                    if(position == 10)
                        return 'Game Over';
                    if(position % 3 == 2)
                        return '+2';
                    return '+1';
                    
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
