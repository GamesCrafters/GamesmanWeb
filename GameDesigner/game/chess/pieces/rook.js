const ChessPiece = require('./ChessPiece')

class Rook extends ChessPiece {
    constructor(color, positionId) {
        super("Rook", "R", color, positionId)
    }
}

module.exports = Rook;