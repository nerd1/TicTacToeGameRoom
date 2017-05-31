'use strict'

export default class {
    constructor(socketPlayer1, socketPlayer2) {
        this.socketPlayer1 = socketPlayer1
        this.socketPlayer2 = socketPlayer2
        socketPlayer1.board = this
        socketPlayer2.board = this
        this.player1 = socketPlayer1.username
        this.player2 = socketPlayer2.username
        this.fields = [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        this.moves = 0
        this.done = false
        this.timestamp = new Date().toLocaleString("en-US")
    }

    setField(data) {
        let field = parseInt(data.field.replace('field', ''))
        this.fields = this.fields.map((item,pos)=>pos === field ? data.player : item)
        this.move++
        this.timestamp = new Date().toLocaleString("en-US")
        console.log('board: ' + this.fields)
    }

    checkFields(fields){
        let checkString = this.fields[fields[0]] + this.fields[fields[1]] + this.fields[fields[2]]
        if (checkString.match("xxx")) {
            return 'x'
        }
        if (checkString.match("ooo")) {
            return 'o'
        }
    }

    checkBoard(){
        this.winner = this.checkFields([0,1,2]) ||
                    this.checkFields([3,4,5]) ||
                    this.checkFields([6,7,8]) ||
                    this.checkFields([0,3,6]) ||
                    this.checkFields([1,4,7]) ||
                    this.checkFields([2,5,8]) ||
                    this.checkFields([0,4,8]) ||
                    this.checkFields([2,4,6])

        if (this.winner) {
            this.done = true
            return this.winner
        }
        if (this.fields.filter((item)=>item===' ').length === 0) {
            this.winner = 'draw'
            this.done = true
            return this.winner
        }
    }
}