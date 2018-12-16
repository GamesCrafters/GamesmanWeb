const ChessPiece = require('./ChessPiece')

class Queen extends ChessPiece {
    constructor(color, positionId) {
        super("Queen", "Q", color, positionId)
    }
}

module.exports = Queen;