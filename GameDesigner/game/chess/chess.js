const Game = require('../game')
const Rook = require('./pieces/rook')
const Knight = require('./pieces/knight')
const Bishop = require('./pieces/bishop')
const King = require('./pieces/king')
const Queen = require('./pieces/queen')
const Pawn = require('./pieces/pawn')
const EmptyPieceChess = require('./pieces/EmptyPieceChess')
const ChessPiece = require('./pieces/ChessPiece')

class Chess extends Game {
    constructor() {
        let rowLabels = ['1','2','3','4','5','6','7','8']
        let columnLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

        super(8,8,rowLabels, columnLabels)
    }

    loadPieces() {
        return [Rook, Knight, Bishop, King, Queen, Pawn, EmptyPieceChess]
    }

    setInitialLayout() {
        var currentLayout = {}
        for (let column of this.columnLabels) {
            for (let row of this.rowLabels) {
                let posId = column + row;
                currentLayout[posId] = ""
            }
        }
        this.currentLayout = currentLayout
    }

    setInitialPieces() {
        this.currentLayout["a1"] = new Rook(ChessPiece.getWhiteColor(), "a1")
        this.currentLayout["b1"] = new Knight(ChessPiece.getWhiteColor(), "b1")
        this.currentLayout["c1"] = new Bishop(ChessPiece.getWhiteColor(), "c1")
        this.currentLayout["d1"] = new King(ChessPiece.getWhiteColor(), "d1")
        this.currentLayout["e1"] = new Queen(ChessPiece.getWhiteColor(), "e1")
        this.currentLayout["f1"] = new Bishop(ChessPiece.getWhiteColor(), "f1")
        this.currentLayout["g1"] = new Knight(ChessPiece.getWhiteColor(), "g1")
        this.currentLayout["h1"] = new Rook(ChessPiece.getWhiteColor(), "h1")

        this.currentLayout["a8"] = new Rook(ChessPiece.getBlackColor(), "a8")
        this.currentLayout["b8"] = new Knight(ChessPiece.getBlackColor(), "b8")
        this.currentLayout["c8"] = new Bishop(ChessPiece.getBlackColor(), "c8")
        this.currentLayout["d8"] = new King(ChessPiece.getBlackColor(), "d8")
        this.currentLayout["e8"] = new Queen(ChessPiece.getBlackColor(), "e8")
        this.currentLayout["f8"] = new Bishop(ChessPiece.getBlackColor(), "f8")
        this.currentLayout["g8"] = new Knight(ChessPiece.getBlackColor(), "g8")
        this.currentLayout["h8"] = new Rook(ChessPiece.getBlackColor(), "h8")

        for (let column of this.columnLabels) {
            this.currentLayout[column+"2"] = new Pawn(ChessPiece.getWhiteColor(), column+"2")
            this.currentLayout[column+"7"] = new Pawn(ChessPiece.getBlackColor(), column+"7")
        }
    }

    createGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4();
    }

    setGUID() {
        this.guid = this.createGUID()
    }

    loadGame(fen_string) {
        console.log(fen_string);
    }

    init(saveData = null) {
        super.init(saveData)
    }
}

module.exports = Chess;