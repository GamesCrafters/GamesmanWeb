const ChessPiece = require('./ChessPiece')

class Pawn extends ChessPiece {
    constructor(color, positionId) {
        super("Pawn", "P", color, positionId)
    }
}

module.exports = Pawn;