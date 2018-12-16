const Game = require('../game')
const CustomPiece = require('./custom-piece')

class CustomGame extends Game {
    constructor(name, rows, columns, players=[]) {
        let rowOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        let columnOptions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

        let rowLabels = [];
        let columnLabels = [];

        for (var x = 0; x < rows; x++) {
            let r = rowOptions[x];
            rowLabels.push(r)
        }

        for (var x = 0; x < columns; x++) {
            let r = columnOptions[x];
            columnLabels.push(r)
        }

        super(rows, columns, rowLabels, columnLabels)

        this.name = name;
        this.availablePieces = []
    }

    loadPieces() {
        return [CustomPiece]
    }

    setInitialLayout() {
        var currentLayout = {}
        for (let column of this.columnLabels) {
            for (let row of this.rowLabels) {
                let posId = column + row;
                currentLayout[posId] = ""
            }
        }
        this.currentLayout = currentLayout
    }

    getAllAvailablePieces() {
        var wPieces = []
        var bPieces = []

        var rook = new CustomPiece("Rook", "R", CustomPiece.getWhiteColor(), null)
        var knight = new CustomPiece("Knight", "N", CustomPiece.getWhiteColor(), null)
        var bishop = new CustomPiece("Bishop", "B", CustomPiece.getWhiteColor(), null)
        var king = new CustomPiece("King", "K", CustomPiece.getWhiteColor(), null)
        var queen = new CustomPiece("Queen", "Q", CustomPiece.getWhiteColor(), null)
        var pawn = new CustomPiece("Pawn", "P", CustomPiece.getWhiteColor(), null)

        var brute = new CustomPiece("Brute", "Brute", CustomPiece.getWhiteColor(), null)
        var centaur = new CustomPiece("Centaur", "Centaur", CustomPiece.getWhiteColor(), null)
        var cyborg = new CustomPiece("Cyborg", "Cyborg", CustomPiece.getWhiteColor(), null)
        var defensive = new CustomPiece("Defensive", "Defensive", CustomPiece.getWhiteColor(), null)
        var dragon = new CustomPiece("Dragon", "Dragon", CustomPiece.getWhiteColor(), null)
        var dwarf = new CustomPiece("Dwarf", "Dwarf", CustomPiece.getWhiteColor(), null)
        var fairy = new CustomPiece("Fairy", "Fairy", CustomPiece.getWhiteColor(), null)
        var mite = new CustomPiece("Mite", "Mite", CustomPiece.getWhiteColor(), null)
        var mounted = new CustomPiece("Mounted", "Mounted", CustomPiece.getWhiteColor(), null)
        var orc = new CustomPiece("Orc", "Orc", CustomPiece.getWhiteColor(), null)
        var robber = new CustomPiece("Robber", "Robber", CustomPiece.getWhiteColor(), null)
        var sharp = new CustomPiece("Sharp", "Sharp", CustomPiece.getWhiteColor(), null)
        var sinagot = new CustomPiece("Sinagot", "Sinagot", CustomPiece.getWhiteColor(), null)
        var tank = new CustomPiece("Tank", "Tank", CustomPiece.getWhiteColor(), null)
        var unicorn = new CustomPiece("Unicorn", "Unicorn", CustomPiece.getWhiteColor(), null)
        var witch = new CustomPiece("Witch", "Witch", CustomPiece.getWhiteColor(), null)
        var wolf = new CustomPiece("Wolf", "Wolf", CustomPiece.getWhiteColor(), null)

        var rook2 = new CustomPiece("Rook", "R", CustomPiece.getBlackColor(), null)
        var knight2 = new CustomPiece("Knight", "N", CustomPiece.getBlackColor(), null)
        var bishop2 = new CustomPiece("Bishop", "B", CustomPiece.getBlackColor(), null)
        var king2 = new CustomPiece("King", "K", CustomPiece.getBlackColor(), null)
        var queen2 = new CustomPiece("Queen", "Q", CustomPiece.getBlackColor(), null)
        var pawn2 = new CustomPiece("Pawn", "P", CustomPiece.getBlackColor(), null)

        var brute2 = new CustomPiece("Brute", "Brute", CustomPiece.getBlackColor(), null)
        var centaur2 = new CustomPiece("Centaur", "Centaur", CustomPiece.getBlackColor(), null)
        var cyborg2 = new CustomPiece("Cyborg", "Cyborg", CustomPiece.getBlackColor(), null)
        var defensive2 = new CustomPiece("Defensive", "Defensive", CustomPiece.getBlackColor(), null)
        var dragon2 = new CustomPiece("Dragon", "Dragon", CustomPiece.getBlackColor(), null)
        var dwarf2 = new CustomPiece("Dwarf", "Dwarf", CustomPiece.getBlackColor(), null)
        var fairy2 = new CustomPiece("Fairy", "Fairy", CustomPiece.getBlackColor(), null)
        var mite2 = new CustomPiece("Mite", "Mite", CustomPiece.getBlackColor(), null)
        var mounted2 = new CustomPiece("Mounted", "Mounted", CustomPiece.getBlackColor(), null)
        var orc2 = new CustomPiece("Orc", "Orc", CustomPiece.getBlackColor(), null)
        var robber2 = new CustomPiece("Robber", "Robber", CustomPiece.getBlackColor(), null)
        var sharp2 = new CustomPiece("Sharp", "Sharp", CustomPiece.getBlackColor(), null)
        var sinagot2 = new CustomPiece("Sinagot", "Sinagot", CustomPiece.getBlackColor(), null)
        var tank2 = new CustomPiece("Tank", "Tank", CustomPiece.getBlackColor(), null)
        var unicorn2 = new CustomPiece("Unicorn", "Unicorn", CustomPiece.getBlackColor(), null)
        var witch2 = new CustomPiece("Witch", "Witch", CustomPiece.getBlackColor(), null)
        var wolf2 = new CustomPiece("Wolf", "Wolf", CustomPiece.getBlackColor(), null)


        wPieces.push(brute)
        wPieces.push(centaur)
        wPieces.push(cyborg)
        wPieces.push(defensive)
        wPieces.push(dragon)
        wPieces.push(dwarf)
        wPieces.push(fairy)
        wPieces.push(mite)
        wPieces.push(mounted)
        wPieces.push(orc)
        wPieces.push(robber)
        wPieces.push(sharp)
        wPieces.push(sinagot)
        wPieces.push(tank)
        wPieces.push(unicorn)
        wPieces.push(witch)
        wPieces.push(wolf)

        wPieces.push(rook)
        wPieces.push(knight)
        wPieces.push(bishop)
        wPieces.push(king)
        wPieces.push(queen)
        wPieces.push(pawn)


        bPieces.push(brute2)
        bPieces.push(centaur2)
        bPieces.push(cyborg2)
        bPieces.push(defensive2)
        bPieces.push(dragon2)
        bPieces.push(dwarf2)
        bPieces.push(fairy2)
        bPieces.push(mite2)
        bPieces.push(mounted2)
        bPieces.push(orc2)
        bPieces.push(robber2)
        bPieces.push(sharp2)
        bPieces.push(sinagot2)
        bPieces.push(tank2)
        bPieces.push(unicorn2)
        bPieces.push(witch2)
        bPieces.push(wolf2)

        bPieces.push(rook2)
        bPieces.push(knight2)
        bPieces.push(bishop2)
        bPieces.push(king2)
        bPieces.push(queen2)
        bPieces.push(pawn2)


        this.availablePieces = {wPieces, bPieces}

        return this.availablePieces
    }

    setInitialPieces() {


    }

    createGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4();
    }

    setGUID() {
        this.guid = this.name.replace(/[^A-Za-z0-9]/g, '') + "-" + this.createGUID()
    }

    loadGame(fen_string) {
        console.log(fen_string);
    }

    init(saveData = null) {
        super.init(saveData)
    }
}

module.exports = CustomGame;