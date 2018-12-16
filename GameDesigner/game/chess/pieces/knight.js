const ChessPiece = require('./ChessPiece')

class Knight extends ChessPiece {
    constructor(color, positionId) {
        super("Knight", "N", color, positionId)
    }
}

module.exports = Knight;