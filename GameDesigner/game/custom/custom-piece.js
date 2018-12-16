const Piece = require('../piece')

class CustomPiece extends Piece {
    constructor(name, pieceId, color, positionId = null) {
        super(name,pieceId, color, "Custom", null, positionId)
        this.value = this.getValue()
        this.fileId = this.getId()
        this.class = this.color
    }

    getValue() {
        // let name = this.getId()
        //return `images/games/chess/pieces/${name}.png`
        // let newName = name.toLowerCase()
        return `static/images/games/pieces/${this.fileId}.svg`
    }

    getPosition() {
        console.log(this.positionId)
    }

    setPosition(newPos) {
        console.log(newPos);
    }

    getId() {
        return this.color + this.pieceId
    }

    static getWhiteColor() {
        return "w"
    }

    static getBlackColor() {
        return "b"
    }
}

module.exports = CustomPiece;