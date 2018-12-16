class Piece {
    constructor (name, pieceId, color, game, value = null, positionId = null) {
        this.name = name
        this.pieceId = pieceId
        this.color = color
        this.game = game
        this.value = value
        this.positionId = positionId
        
        if (new.target === Piece) throw TypeError("new of abstract class Piece");
    }
    
    getPosition() {
        throw new Error('You have to implement the method getPosition!');
    }

    setPosition(newPos) {
        throw new Error('You have to implement the method setPosition!');
    }

    getId() {
        throw new Error('You have to implement the method setPosition!');
    }

}

module.exports = Piece;