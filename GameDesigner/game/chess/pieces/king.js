const ChessPiece = require('./ChessPiece')

class King extends ChessPiece {
    constructor(color, positionId) {
        super("King", "K", color, positionId)
    }
}

module.exports = King;