const ChessPiece = require('./ChessPiece')

class Bishop extends ChessPiece {
    constructor(color, positionId) {
        super("Bishop", "B", color, positionId)
    }
}

module.exports = Bishop;