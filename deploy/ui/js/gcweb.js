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
                    url = '/service/'+gameName+'/getNextMoveValues;position='+position.replace(' ', '%20');
                    for (var key in args) {
                        url += ";"+key+"="+args[key];
                    }
                    /*
                    callback([
    {
        "board": "X        ",
        "move": "a3",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": " X       ",
        "move": "b3",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": "  X      ",
        "move": "c3",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": "   X     ",
        "move": "a2",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": "    X    ",
        "move": "b2",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": "     X   ",
        "move": "c2",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": "      X  ",
        "move": "a1",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": "       X ",
        "move": "b1",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    },
    {
        "board": "        X",
        "move": "c1",
        "remoteness": "-1",
        "status": "OK",
        "value": "2"
    }
]);
return;*/
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
