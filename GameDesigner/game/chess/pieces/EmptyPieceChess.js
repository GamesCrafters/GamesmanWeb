const ChessPiece = require('./ChessPiece')

class EmptyPieceChess extends ChessPiece {
    constructor(color, positionId) {
        super("Empty", "E", color, positionId)
    }
}

module.exports = EmptyPieceChess;