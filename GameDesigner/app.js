var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var publicPath = path.join(__dirname, 'public');
var helpers = require('handlebars-helpers');
var handlebars = require('handlebars');
var object = helpers.object();
var object = helpers.string();
var port = process.env.PORT || 3000;
const Chess = require('./game/chess/chess');
const Game = require('./game/game');
const CustomGame = require('./game/custom/custom');
const CustomPiece = require('./game/custom/custom-piece');
let sockets = {}
let games = {}
const debug = true

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.locals.basedir = path.join(__dirname, 'views');

app.use('/static', express.static(publicPath));
app.use(favicon(path.join(publicPath, 'images', 'favicon.ico')));

app.get('/', (req, res) => {
    res.redirect("/builder");

    // var name = 'Abhijay'
    // res.render('index', {
    //     title: 'Configurable Game | Abhijay B.',
    //     name: name
    // })
})

io.on('connection', function (socket) {
    console.log('a user connected');
    var socketId = socket.id;
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('chess new move', function (pos) {
        let oldPos = pos.oldPos;
        let newPos = pos.newPos;
        var guid = pos.gameGUID;
        if (!(socketId in sockets)) {
            sockets[socketId] = guid
        }
        //Move this
        // io.emit('chess receive move', { for: 'everyone' });
        if (guid in games) {
            const game = games[guid]
            for (let playerID of game.players) {
                if (playerID in io.sockets.connected) {
                    console.log(game.currentLayout)
                    game.makeMove(oldPos, newPos)
                    console.log(game.currentLayout)
                    io.sockets.connected[playerID].emit('chess receive move', oldPos, newPos, pos.socketId)

                    if (debug) console.log(`emitted to player ${playerID}`)
                } else {
                    if (debug) {
                        console.log(`player ${playerID} not in list`)
                        console.log(games[guid].players)
                    }
                }
            }
        }
    });
    socket.on('add player to game', function(params) {
        let guid = params['guid']
        let playerId = params['socketId']
        if (guid in games) {
            games[guid].players.push(playerId)
            console.log(`added ${playerId} to ${guid}`)
        } else {
            if (debug) console.log(`${guid} not in ${Object.keys(games)}`)
        }
    })
});

handlebars.registerHelper('processPiece', function(context, options) {
    let posId = options.fn(this).replace(/\s+/g,'')
    console.log('process piece', context)
    if (context.hasOwnProperty(posId)) {
        let val = context[posId];
        // <img src="static/images/games/pieces/{{this.fileId}}.svg" draggable="false" class="{{this.class}} board-icon" id="piece-{{this.fileId}}" piece="{{this.name}}-{{this.color}}-{{this.pieceId}}"></img>
        if (val) {
            return new handlebars.SafeString(
                `<img src=${val.getValue()} class="board-icon" id="piece-${val.getId()}-${posId}" draggable="false">`
            )
        }
    }

    return new handlebars.SafeString(
        '<p id="empty-text">'
        + "Empty" //Used to be "EMPTY"
        + '</p>');
  });

app.get('/builder', (req, res) => {
    let js_script =
    `
    `

    let init_js =
    `
    <script src="static/scripts/builder.js"></script>
    `

    res.render('builder', {
        title: 'Configurable Game | New Game',
        script: js_script,
        init: init_js
    })

})

app.get('/pieces', (req, res) => {
    var fullName = req.query.name;
    var gameName = req.query.game;
    var rows = parseInt(req.query.rows);
    var columns = parseInt(req.query.columns);


    let customGame = new CustomGame(gameName,rows,columns);
    customGame.init()

    let pieces = customGame.getAllAvailablePieces()

    let availablePieces = []

    // for (var x = 0; x < rows; x++) {
        while (pieces.wPieces.length + pieces.bPieces.length > 0) {
            var arr = []
            for (var y = 0; y < columns; y++) {
                if (pieces.wPieces.length + pieces.bPieces.length > 0) {
                    if (y < columns / 2 && pieces.wPieces.length > 0) {
                        var piece = pieces.wPieces.pop()
                    } else {
                        var piece = pieces.bPieces.pop()
                    }
                    arr.push(piece)
                } else {
                    break;
                }
            }
            availablePieces.push(arr)
        }
    // }


    let js_script =
    `
    `

    let init_js =
    `
    <script src="static/scripts/pieces.js"></script>
    `

    res.render('pieces', {
        title: 'Configurable Game | New Game',
        script: js_script,
        init: init_js,
        rowLabels: customGame.rowLabels.reverse(),
        columnLabels: customGame.columnLabels,
        currentLayout: customGame.currentLayout,
        availablePieces: availablePieces,
        guid:customGame.guid
    })
})

app.get('/game', (req, res) => {
     if ("guid" in req.query && req.query.guid in games) {
        var game = games[req.query.guid]
        var flipBoard = true;
        var guid = game.guid

    } else {
        var fullName = req.query.name;
        var gameName = req.query.game;
        var rows = parseInt(req.query.rows);
        var columns = parseInt(req.query.columns);

        var game = new CustomGame(gameName,rows,columns);
        game.init()
        game.guid = req.query.guid

        for (var item in req.query) {
            item = item.toString()
            if (item !== "name" && item !== "game" && item !== "rows" && item !== "columns" && item !== "guid") {
                var pieceName = req.query[item]
                var pieceInfo = pieceName.split("-")
                var name = pieceInfo[0]
                var color = pieceInfo[1]
                var pieceId = pieceInfo[2]
                var piece = new CustomPiece(name, pieceId, color, item)
                game.currentLayout[item] = piece
            }
        }

        var guid = game.guid
        games[guid] = game
    }
    // console.log(`user: ${socketId} is joining: ${game.guid}`)
    // io.sockets.connected[socketId].emit('joined game', game.guid)

    // game.players.push(socketId)
    // pieces_found = {}

    rows = game.rows
    columns = game.columns
    let rowLabels = game.rowLabels.reverse() //helps generate correct position
    let columnLabels = game.columnLabels
    if (flipBoard) {
        columnLabels=game.columnLabels.reverse()
    }
    let currentLayout = game.currentLayout
    let js_script =
    `
    <script src="//code.jquery.com/jquery-3.3.1.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.js"></script>

    `

    let init_js =
    `
    <script src="static/scripts/game.js"></script>
    `


    // let pieces = customGame.getAllAvailablePieces()

    // let availablePieces = []

    // for (var x = 0; x < rows; x++) {
    //     if (pieces.length > 0) {
    //         var arr = []
    //         for (var y = 0; y < columns; y++) {
    //             if (pieces.length > 0) {
    //                 var piece = pieces.pop()
    //                 arr.push(piece)
    //             } else {
    //                 break;
    //             }
    //         }
    //         availablePieces.push(arr)
    //     } else {
    //         break;
    //     }
    // }

    var title = (Object.hasOwnProperty('name')) ? game.name : 'Configurable Game'
    var host = req.get('host');
    var share_url = `http://${host}/game?guid=${guid}`

    res.render('game', {
        title: title,
        rows: rows,
        columns: columns,
        rowLabels: rowLabels,
        columnLabels: columnLabels,
        script: js_script,
        init: init_js,
        currentLayout: currentLayout,
        guid: guid,
        share_url:share_url
    })

})

app.get('/chess', (req, res) => {
    //

    if ("guid" in req.query && req.query.guid in games) {
        var game = games[req.query.guid]
        var flipBoard = true;
    } else {
        var fullName = req.query.name;
        var gameName = req.query.game;
        var rows = parseInt(req.query.rows);
        var columns = parseInt(req.query.columns);

        var game = new Chess()
        game.init() //Initialize the Game, can pass FEN string to load game -- game.init("INSERT FEN STRING")

        for (var item in req.query) {
            item = item.toString()
            if (item !== "name" && item !== "game" && item !== "rows" && item !== "columns" && item !== "guid") {
                var pieceName = req.query[item]
                var pieceInfo = pieceName.split("-")
                var name = pieceInfo[0]
                var color = pieceInfo[1]
                var pieceId = pieceInfo[2]
                var piece = new CustomPiece(name, pieceId, color, item)
                game.currentLayout[item] = piece
            }
        }

        guid = game.guid
        games[guid] = game
    }

    // console.log(`user: ${socketId} is joining: ${game.guid}`)
    // io.sockets.connected[socketId].emit('joined game', game.guid)

    // game.players.push(socketId)
    // pieces_found = {}

    rows = game.rows
    columns = game.columns
    let rowLabels = game.rowLabels.reverse() //helps generate correct position
    let columnLabels = game.columnLabels
    if (flipBoard) {
        columnLabels=game.columnLabels.reverse()
    }
    let currentLayout = game.currentLayout
    let js_script =
    `
    <script src="//code.jquery.com/jquery-3.3.1.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.js"></script>

    `

    let init_js =
    `
    <script src="static/scripts/game.js"></script>
    `

    games[guid] = game

    res.render('chess', {
        title: 'Configurable Game | Chess',
        rows: rows,
        columns: columns,
        rowLabels: rowLabels,
        columnLabels: columnLabels,
        script: js_script,
        init: init_js,
        currentLayout: currentLayout,
        guid: guid
    })
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});
