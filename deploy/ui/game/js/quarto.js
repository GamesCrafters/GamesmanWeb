//quarto.js
var Quarto = {};

function initQuarto() {
    Quarto.IMAGE_DIR = "images/quarto/";
    Quarto.canvas = document.getElementById('canvas');
    Quarto.ctx = Quarto.canvas.getContext('2d');
    Quarto.canvas.width = (window.innerHeight-Quarto.canvas.offsetTop)*0.92;
    Quarto.canvas.height = (window.innerHeight-Quarto.canvas.offsetTop)*0.92;

    Quarto.TOTAL_WIDTH = Quarto.canvas.width;
    Quarto.TOTAL_HEIGHT = Quarto.canvas.height;
    Quarto.LINE_WIDTH = Quarto.TOTAL_WIDTH/600;
    Quarto.PLATFORM_COORDS;
    Quarto.RED = "red";
    Quarto.GRAY = "gray";
    Quarto.BROWN = "brown";
    Quarto.BLUE = "blue";
    Quarto.SQUARE = false;
    Quarto.CIRCLE = true;
    Quarto.LEFT_PLAYER = true;
    Quarto.RIGHT_PLAYER = false;
    Quarto.TALL = false;
    Quarto.HOLLOW = true;
    Quarto.HOLEY = false;
    Quarto.NONHOLEY = true;
    Quarto.Pieces = [];

    var boardwood = new Image();    
    boardwood.src = Quarto.IMAGE_DIR+'boardwood.jpg';
    console.log(boardwood.src);
    Quarto.BOARDWOOD = boardwood;

    var redwoodSquares = []; 
    var redwoodSrcs = ['square1.jpg', 'square2.jpg','square3.jpg', 'square4.jpg', 'square5.jpg', 'square6.jpg',
    'square7.jpg', 'square8.jpg', 'square9.jpg', 'square10.jpg', 'square11.jpg', 'square12.jpg', 'square13.jpg', 'square14.jpg',
    'square15.jpg', 'square16.jpg']; 
    for( var i = 0; i < 16; i++ ) { 
        redwoodSquares[i] = new Image(); 
        redwoodSquares[i].src = Quarto.IMAGE_DIR+redwoodSrcs[i]; 
    } 

    Quarto.REDWOOD_SQUARES = redwoodSquares;

    var redwoodCircle = new Image();
    redwoodCircle.src = Quarto.IMAGE_DIR+'platform.png';
    Quarto.REDWOOD_CIRCLE = redwoodCircle;

    Quarto.drawFromString = function(boardString) {
        if(boardString[16] == ' ') {
            Quarto.thisGame.pieceChosen = false;
            Quarto.thisGame.chosenPiece = null;
        } else {
            console.log('pieceChosen');
            Quarto.thisGame.pieceChosen = true;
        }
        var i = 0;
        var affectedPieces = []
        for(var col in Quarto.squaresCoords) {
            for(var row in Quarto.squaresCoords[col]) {
                if(boardString[i] != ' ') {
                    var pieceIndex = parseInt(Quarto.pieceBinaryFromChar(boardString[i]), 2);
                    // console.log('piece index '+pieceIndex);
                    affectedPieces[pieceIndex] = true;
                    var piece = Quarto.Pieces[pieceIndex];
                    piece.moveTo(col, row);
                }
                i++;
            }
        }
        i = 16;
        if(boardString[i] != ' ') {
            var pieceIndex = parseInt(Quarto.pieceBinaryFromChar(boardString[i]), 2);
            affectedPieces[pieceIndex] = true;
            Quarto.Pieces[pieceIndex].moveTo("platform");
        }

        for(var p = 0; p < 16; p++) {
            if(!affectedPieces[p]) {
                var piece = Quarto.Pieces[p];
                piece.returnToOrigPosition();
            }
        }

        Quarto.update()
    }

    Quarto.pieceBinaryFromChar = function(aChar) {
        var charHex = aChar.charCodeAt(0) - 1;
        // console.log(charHex);
        var longBinary = charHex.toString(2);
        // console.log(longBinary);
        var len = longBinary.length;
        var binary = longBinary[len - 4] + longBinary[len - 3] + longBinary[len - 2] + longBinary[len - 1];
        console.log('binary '+binary);
        return binary;
    }

    Quarto.pieceAttrObjFromBinary = function(charBinary) {
        if(Quarto.Pieces.length == 0) {
            Quarto.Pieces.initVert();
            Quarto.Pieces.initHoriz();
        }
        var piece = Quarto.Pieces[parseInt(charBinary, 2)];
        return { color: piece.color, shape: piece.shape, holeyness: piece.holey, hollowness: piece.hollow };
    }

    Quarto.Pieces.draw = function () {
        for (var i = 0; i < Quarto.Pieces.length; i++) {
            if (Quarto.Pieces[i] !== undefined) {
                // console.log("drawing piece ", i);
                Quarto.Pieces[i].put();
            }
        }
    }; 

    Quarto.Pieces.initVert = function () {
        var originX = Quarto.Grid.originX/4+Quarto.PIECERADIUS/3;
        var originY = Quarto.Grid.originY+Quarto.Grid.spaceWidth/2;
        var inc = Quarto.Grid.spaceWidth;
        var xInc = Quarto.Grid.spaceWidth/1.7;
        Quarto.Pieces[parseInt('0100',2)] = new Quarto.Piece
        (originX + 0*xInc, originY + 0*inc, "white", "round", false, false);
        Quarto.Pieces[parseInt('0111',2)] = new Quarto.Piece     
        (originX + 0*xInc, originY + 1*inc, "white", "round", true, true);
        Quarto.Pieces[parseInt('0000',2)] = new Quarto.Piece     
        (originX + 0*xInc, originY + 2*inc, "white", "square", false, false);
        Quarto.Pieces[parseInt('0011',2)] = new Quarto.Piece     
        (originX + 0*xInc, originY + 3*inc, "white", "square", true, true);
        Quarto.Pieces[parseInt('1101',2)] = new Quarto.Piece     
        (originX + 1*xInc, originY + 0*inc, "black", "round", false, true);
        Quarto.Pieces[parseInt('1110',2)] = new Quarto.Piece     
        (originX + 1*xInc, originY + 1*inc, "black", "round", true, false);
        Quarto.Pieces[parseInt('1001',2)] = new Quarto.Piece     
        (originX + 1*xInc, originY + 2*inc, "black", "square", false, true);
        Quarto.Pieces[parseInt('1010',2)] = new Quarto.Piece     
        (originX + 1*xInc, originY + 3*inc, "black", "square", true, false);
    }; 

    Quarto.Pieces.initHoriz = function () {
        var originY = Quarto.Grid.originY/4+Quarto.PIECERADIUS/3;
        var originX = Quarto.Grid.originX+Quarto.Grid.spaceWidth/2;
        var inc = Quarto.Grid.spaceWidth;
        var yInc = Quarto.Grid.spaceWidth/1.7;
        Quarto.Pieces[parseInt('0101',2)] = new Quarto.Piece
        (originX + 0*inc, originY + 0*yInc, "white", "round", false, true);
        Quarto.Pieces[parseInt('0110',2)] = new Quarto.Piece     
        (originX + 1*inc, originY + 0*yInc, "white", "round", true, false);
        Quarto.Pieces[parseInt('0001',2)] = new Quarto.Piece    
        (originX + 2*inc, originY + 0*yInc, "white", "square", false, true);
        Quarto.Pieces[parseInt('0010',2)] = new Quarto.Piece    
        (originX + 3*inc, originY + 0*yInc, "white", "square", true, false);
        Quarto.Pieces[parseInt('1100',2)] = new Quarto.Piece    
        (originX + 0*inc, originY + 1*yInc, "black", "round", false, false);
        Quarto.Pieces[parseInt('1111',2)] = new Quarto.Piece    
        (originX + 1*inc, originY + 1*yInc, "black", "round", true, true);
        Quarto.Pieces[parseInt('1000',2)] = new Quarto.Piece    
        (originX + 2*inc, originY + 1*yInc, "black", "square", false, false);
        Quarto.Pieces[parseInt('1011',2)] = new Quarto.Piece    
        (originX + 3*inc, originY + 1*yInc, "black", "square", true, true);
    }; 

    Quarto.Pieces.init = function () {
        if(Quarto.Pieces.length == 0)
        Quarto.Pieces.initVert();
        Quarto.Pieces.initHoriz();
        Quarto.Pieces.draw();
    };



    Quarto.Game = function(options) {
        this.options = options || {};
        this.turn = Quarto.LEFT_PLAYER;
        if(this.turn) {
            document.getElementById('playerTurn').innerHTML = "Left Player Turn";
        } else {
            document.getElementById('playerTurn').innerHTML = "Right Player Turn";
        }
        // this.prototype = GCWeb.Game.prototype;
        this.pieceChosen = false;
        this.chosenPiece = null;

        this.init = function () {
            Quarto.Background.draw();
            Quarto.Grid.draw();
            Quarto.Platform.draw();
            Quarto.Pieces.init();
            // Quarto.update();
        };
    };

    Quarto.update = function () {
        Quarto.Background.draw();
        Quarto.Grid.draw();
        Quarto.Platform.draw();
        Quarto.Pieces.draw();
    };

    Quarto.Background = {
        width: Quarto.TOTAL_WIDTH,
        height: Quarto.TOTAL_HEIGHT,
        ctx: Quarto.ctx,
        canvas: Quarto.canvas,

        draw: function() {
            //        Quarto.Background.height = Quarto.TOTAL_HEIGHT;
            //        Quarto.Background.width = Quarto.TOTAL_WIDTH;
            var ctx = Quarto.ctx;

            var width = Quarto.canvas.width;
            var height = Quarto.canvas.height;
            var originX = 0;
            var originY = 0;
            var spaceAroundSquares = (Quarto.Grid.spaceWidth - Quarto.Grid.squareWidth)/2;
            //draw black border
            ctx.save();
            ctx.fillStyle = "black";
            roundRect(ctx, originX, originY, width, height, 5, true, false);
            ctx.drawImage(Quarto.BOARDWOOD, spaceAroundSquares, spaceAroundSquares, width - spaceAroundSquares*2, height - spaceAroundSquares*2);
            ctx.restore();
        }
    };

    Quarto.Grid = {
        width: Quarto.TOTAL_WIDTH*0.75,
        height: Quarto.TOTAL_HEIGHT*0.75,
        originX: Quarto.canvas.width*.25,
        originY: Quarto.canvas.height*.25,
        spaceWidth: Quarto.TOTAL_WIDTH*0.75/4,
        spaceHeight: Quarto.TOTAL_HEIGHT*0.75/4,
        squareWidth: (Quarto.TOTAL_WIDTH*0.75/4)*0.8,
        squareHeight: (Quarto.TOTAL_HEIGHT*0.75/4)*0.8,
        //squaresCoords: added at init()
        //checks if the specified square is empty
        isEmpty: function(col, row) {
            for (var i = 0; i < 16; i++) {
                var piece = Quarto.Pieces[i];
                if (piece != null) {
                    if (piece.location.col == col && piece.location.row == row) {
                        return false;
                    }
                }
            }
            return true;
        },

        drawRect: function(centerX, centerY, width, height, color, ctx) {
            ctx.save();
            ctx.fillStyle = color;
            roundRect(ctx, centerX - width/2, centerY - height/2, width, height, 5, true, false);
            ctx.restore();
        },

        drawHoleyRect: function(centerX, centerY, width, height, color, ctx) {
            ctx.save();
            ctx.fillStyle = color;
            roundRect(ctx, centerX - width/2, centerY - height/2, width, height, 5, true, false);
            ctx.globalCompositeOperation = "xor";
            if( ctx.fillStyle == "black") {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "black";
            }
            roundRect(ctx, centerX - width/8, centerY - height/8, width/4, height/4, 2, true, false);
            ctx.restore();
        },


        drawRedwoodSquare: function (centerX, centerY, ctx, img) {
            ctx.save();
            ctx.drawImage(img, centerX-Quarto.Grid.squareWidth/2, centerY-Quarto.Grid.squareWidth/2, Quarto.Grid.squareWidth, Quarto.Grid.squareHeight);
            ctx.restore();
        },

        draw: function() {
            var ctx = Quarto.ctx;
            var width = this.width;
            var height = this.height;
            var originX = this.originX;
            var originY = this.originY;

            //draw black behind the squares
            ctx.save();
            ctx.fillStyle = "black";
            roundRect(ctx, originX-0.5, originY-0.5, width, height, 5, true, false);
            ctx.restore();

            var spaceWidth = this.spaceWidth;
            var spaceHeight = this.spaceHeight;
            var squareWidth = this.squareWidth;
            var squareHeight = this.squareHeight;

            var redwood = Quarto.REDWOOD;
            //draw squares
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    var centerX = Quarto.squaresCoords[col][row].centerX-0.5;
                    var centerY = Quarto.squaresCoords[col][row].centerY-0.5;
                    ctx.save();
                    Quarto.Grid.drawRedwoodSquare(centerX, centerY, ctx, Quarto.REDWOOD_SQUARES[col*4+row]);
                    ctx.restore();
                }
            }

            var squaresTopBound = originY + (spaceHeight - squareHeight)/2;
            var squaresBottomBound = originY + height - (spaceHeight - squareHeight)/2;
            var squaresLeftBound = originX + (spaceWidth - squareWidth)/2;
            var squaresRightBound = originX + width - (spaceWidth - squareWidth)/2;

            //draw vertical white lines
            for (var vert = 1; vert <= 3; vert++) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(originX + vert*spaceWidth-0.5, squaresTopBound-0.5);
                ctx.lineTo(originX + vert*spaceWidth-0.5, squaresBottomBound-0.5);
                ctx.lineWidth = Quarto.LINE_WIDTH*2-0.5;
                ctx.strokeStyle = "white";
                ctx.stroke();
                ctx.restore();
            }
            //draw horizontal white lines
            for (var horiz = 1; horiz <= 3; horiz++) {
                ctx.save(); 
                ctx.beginPath();
                ctx.moveTo(squaresLeftBound-0.5, originY + horiz*spaceHeight-0.5);
                ctx.lineTo(squaresRightBound-0.5, originY + horiz*spaceHeight-0.5);
                ctx.lineWidth = Quarto.LINE_WIDTH*2-0.5;
                ctx.strokeStyle = "white";
                ctx.stroke();
                ctx.restore();
            }

        }
    } 

    Quarto.PIECERADIUS = Quarto.Grid.squareWidth/3.7;

    Quarto.Platform = {
        centerX: (Quarto.Background.width - Quarto.Grid.width)/1.7,
        centerY: (Quarto.Background.height - Quarto.Grid.height)/1.7,
        radius: ((Quarto.Background.width - Quarto.Grid.width)/1.7)*0.6,
        //whether there is piece placed on platform or not; default false
        loaded: false,

        draw: function() {

            var ctx = Quarto.ctx;
            var centerX = this.centerX;
            var centerY = this.centerY;
            var radius = this.radius*1.3;
            Quarto.PLATFORM_COORDS = {
                x: centerX,
                y: centerY
            };

            ctx.save();
            ctx.drawImage(Quarto.REDWOOD_CIRCLE, centerX-radius*0.925, centerY-radius*0.925, 1.85*radius, 1.85*radius); 
            ctx.restore();
        }
    };

    // whether any piece is currently selected

    Quarto.Piece = function(x, y, color, shape, holey, hollow) {
        this.used = false;
        this.color = color;
        this.shape = shape;
        this.holey = holey;
        this.hollow = hollow;
        this.radius = Quarto.PIECERADIUS;
        this.strokeLineWidth = this.radius/5
        var ctx = Quarto.ctx;
        this.clicked = false;
        this.origX = x;
        this.origY = y;
        this.location = new Quarto.Location(x, y);
        this.stroked;
        this.innerStrokeStyle = this.color;
        this.moveValue = 'green';
        this.outerStrokeStyle = this.color;


        this.drawHole = function() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.location.x, this.location.y, this.radius/3.0, 0, Math.PI*2, false);
            if(this.hollow) {
                ctx.save();
                ctx.strokeStyle = this.innerStrokeStyle;
                ctx.lineWidth = this.strokeLineWidth*2;
                // ctx.stroke();
                ctx.restore();
            }

            ctx.clip();
            if(this.location.valid) {
                Quarto.Platform.draw();
                Quarto.Grid.draw();
            } else {
                Quarto.Background.draw();
            }
            ctx.restore();
        }


        //draws the piece based on its characteristics and location
        this.put = function() {
            ctx.save();
            // this.outerStrokeStyle = Quarto.thisGame.pieceChosen || this.used || !Quarto.thisGame.options['valueMoves'] ? this.innerStrokeStyle : this.moveValue;
            if (this.shape == "round") {
                ctx.fillStyle = color;
                if(this.hollow) {
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                } 
                ctx.beginPath();
                ctx.arc(this.location.x, this.location.y, this.radius, 0, Math.PI*2, false);
                ctx.fill();
                ctx.restore();
                ctx.save();
                ctx.lineWidth = this.strokeLineWidth;
                ctx.strokeStyle = this.moveValue;
                if (Quarto.thisGame.options.valueMoves) {
                    ctx.stroke();
                }

                ctx.restore();


            }

            if (this.shape == "square") {
                if(this.hollow) {
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                }
                Quarto.Grid.drawRect(this.location.x, this.location.y, this.radius*2, this.radius*2, this.color, ctx);
                ctx.restore();
                ctx.lineWidth = this.strokeLineWidth;
                ctx.strokeStyle = this.moveValue;
                if (Quarto.thisGame.options.valueMoves) {
                    ctx.stroke();
                }
            }

            if(this.holey) {
                this.drawHole();
            }
            ctx.restore();
        };


        this.click = function () {
            Quarto.thisGame.chosenPiece = this;
            Quarto.thisGame.pieceChosen = true;
            this.moveTo("platform");


        };
        this.moveTo = function (col, row) {
            if( arguments[0] == "platform" ) {

                this.location = new Quarto.Location(Quarto.Platform.centerX, Quarto.Platform.centerY); 
                Quarto.thisGame.pieceChosen = true;
                Quarto.thisGame.turn = !Quarto.thisGame.turn;
                if(Quarto.thisGame.turn) {
                    document.getElementById('playerTurn').innerHTML = "Left Player Turn";
                } else {
                    document.getElementById('playerTurn').innerHTML = "Right Player Turn";
                }
            } else {
                var grid = Quarto.squaresCoords;
                this.location = new Quarto.Location(grid[col][row].centerX, grid[col][row].centerY); 
                Quarto.thisGame.pieceChosen = false;
                grid[col][row].piece = this;
                this.used = true;

            }
            Quarto.update();
        };

        this.returnToOrigPosition = function() {
            var col = this.location.col;
            var row = this.location.row;
            if(col && row) {
                Quarto.squaresCoords[col][row].piece = null;
            }
            this.location = new Quarto.Location(this.origX, this.origY); 
            this.used = false;
            // Quarto.thisGame.pieceChosen = false;
        }

        //determines whether a piece is at the given column and row on the grid
        this.isAt = function (col, row) {
            if (arguments[0] == "platform") {
                return location.platform;
            }
            if (this.location.grid) {
                return (this.location.row == row && this.location.col == col);
            } else { 
                return false;
            }
        };

        this.isUnderClick = function (x, y) {
            if (this.shape == "round" ) {
                return ((Math.pow(x-this.location.x, 2) + Math.pow(y-this.location.y, 2)) < Math.pow(this.radius,2));
            } else {
                var result = ((x > this.location.x-this.radius && x < this.location.x+this.radius) && 
                (y > this.location.y-this.radius && y < this.location.y + this.radius));
                return result;
            }
        };
    };

    Quarto.onClick =  function(e) { 
        var x = e.clientX-Quarto.canvas.offsetLeft;
        var y = e.clientY-Quarto.canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;


        var click = new Quarto.Location(x, y);
        if (!Quarto.thisGame.pieceChosen) {
            for (var i = 0; i < 16; i++) {
                var piece = Quarto.Pieces[i];
                //if a piece hasn't yet been clicked 
                if (!piece.used) {
                    //mark the correct one clicked
                    if (piece.isUnderClick(x, y)) {
                        piece.click();
                        return;
                    }    
                }
            }

        } else if(click.grid) {
            if(  Quarto.squaresCoords[click.col][click.row].piece === null) {
                console.log('putting piece at '+click.col+','+click.row);
                Quarto.thisGame.chosenPiece.moveTo(click.col, click.row);
                Quarto.squaresCoords[click.col][click.row].piece = Quarto.thisGame.chosenPiece;
                Quarto.squaresCoords[click.col][click.row].moveValue = false;
            }
        }


    };

    Quarto.onMouseover = function(e) {
        var x = e.clientX-Quarto.canvas.offsetLeft;
        var y = e.clientY-Quarto.canvas.offsetTop;
        // var hover = Quarto.processCoords(x, y);
        // console.log(hover)
        // Quarto.update();
    };
    Quarto.innerHeight = window.innerHeight*0.92;

    Quarto.resize = function() {
        Quarto.canvas.width = window.innerHeight*0.92;
        Quarto.canvas.height = window.innerHeight*0.92;
        var scaleFactor = window.innerHeight*0.92/Quarto.innerHeight;
        Quarto.ctx.save();
        Quarto.ctx.scale(scaleFactor, scaleFactor);
        Quarto.innerHeight = window.innerHeight*0.92;
        Quarto.update();
        Quarto.ctx.restore();     


        console.log('resized');
    };

    Quarto.processCoords = function (x, y) {
        // console.log('calling processCoords');
        var spaceWidth = Quarto.Grid.spaceWidth;
        var squareWidth = Quarto.Grid.squareWidth;
        var squareBorderWidth = (spaceWidth - squareWidth)/2;
        var gridLeftBound = Quarto.Grid.originX;
        var gridTopBound = Quarto.Grid.originY;

        //make 2D array of board square boundaries; horizonal array with arrays coming down for columns
        var squaresCoords = new Array(4);

        for (var col = 0; col < 4; col++) {
            squaresCoords[col] = new Array(4);

            for (var row = 0; row < 4; row++) {
                squaresCoords[col][row] = {

                    left: gridLeftBound + col*spaceWidth + squareBorderWidth,
                    right: gridLeftBound + (col+1)*spaceWidth - squareBorderWidth,
                    top: gridTopBound + row*spaceWidth + squareBorderWidth,
                    bottom: gridTopBound + (row+1)*spaceWidth - squareBorderWidth,
                    centerX: gridLeftBound + col*spaceWidth + squareBorderWidth + squareWidth/2,
                    centerY: gridTopBound + row*spaceWidth + squareBorderWidth + squareWidth/2,
                    piece: null
                };
            }
        }
        if (arguments[0] == "squaresCoords") { 
            return squaresCoords;
        }


        //detect in which square on the grid the mouse coords lie
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                var left = squaresCoords[col][row].left;
                var right = squaresCoords[col][row].right;
                var top = squaresCoords[col][row].top;
                var bottom = squaresCoords[col][row].bottom;

                if (x > left && x < right && y > top && y < bottom) {
                    return { platform: false, grid: true, col: col, row: row};
                }
            }
        }
        var platformCenterX = Quarto.Platform.centerX;
        var platformCenterY = Quarto.Platform.centerY;
        var platformRadius = Quarto.Platform.radius;
        if ((Math.pow(x-platformCenterX, 2) + Math.pow(y-platformCenterY, 2)) < Math.pow(platformRadius+5,2)) {
            return { platform: true, grid: false };
        }
        return false;
    };

    Quarto.squaresCoords = Quarto.processCoords("squaresCoords");

    Quarto.Location = function (x, y) {
        this.x = x;
        this.y = y;
        var processCoordsOutput = Quarto.processCoords(x, y);
        if (processCoordsOutput) {
            if (processCoordsOutput.grid) {
                this.valid = true;
                this.grid = true;
                this.platform = false;
                this.row = processCoordsOutput.row;
                this.col = processCoordsOutput.col;
                return;
            } else if (processCoordsOutput.platform) {
                this.valid = true;
                this.grid = false;
                this.platform = true;
                return;
            }
        }
        this.valid = false;
    };

    Quarto.startGame = function() {
        Quarto.thisGame = new Quarto.Game({'valueMoves': true});
        Quarto.canvas.addEventListener("mousedown", Quarto.onClick, false);
        Quarto.thisGame.init();
    };

};

$(document).ready(function() {
    initQuarto();
    Quarto.startGame();
});

