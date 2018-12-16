class Game {
    constructor (rows, columns, rowLabels = [], columnLabels = [], currentLayout = {}) {
        this.rows = rows
        this.columns = columns
        this.rowLabels = rowLabels
        this.columnLabels = columnLabels
        this.currentLayout = currentLayout
        this.pieces = this.loadPieces()
        this.players = []

        if (new.target === Game) throw TypeError("new of abstract class Game");
    }

    loadPieces() {
        throw new Error('You have to implement the method loadPieces!');
    }

    /**
     * Implementation optional
     */
    setLayout() {

    }

    makeMove(oldPos, newPos) {
        if (oldPos in this.currentLayout && newPos in this.currentLayout) {
            this.currentLayout[newPos] = this.currentLayout[oldPos]
            this.currentLayout[oldPos] = ""
        }
    }

    setGUID() {
        throw new Error('You have to implement the method setGUID!');
    }

    /**
     * Implementation required
     */
    setInitialLayout() {
        throw new Error('You have to implement the method load!');
    }

    /**
     * Implementation required
     */
    setInitialPieces() {
        throw new Error('You have to implement the method load!');
    }

    /**
     * Implementation optional
     */
    init(saveData = null) {
        if (saveData) {
            this.loadGame(saveData)
        } else {
            this.setInitialLayout(true)
            this.setInitialPieces()
            this.setGUID()
        }
    }

    /**
     * Implementation required
     */
     loadGame(saveData) {
        throw new Error('You have to implement the method load!');
     }

}

module.exports = Game;