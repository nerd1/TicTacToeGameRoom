'use strict'

export default class{
    constructor($doc, store){
        this.$doc = $doc
        this.store = store;
        this.player1 = 0
        this.player2 = 0
        this.player = 1
        this.running = true
        this.$resultDiv = this.$doc.querySelector("#result")
        this.$statsDiv = this.$doc.querySelector("#stats")
        this.$fields = $doc.querySelectorAll("div.field")
        this.$fields.forEach(function(element) {
            element.addEventListener("click", this.onClickField.bind(this))
        }, this);
    }

    finishGame(resultText){
        this.$resultDiv.innerText = resultText
        this.running = false
        // show result and new game button
        if (this.$newGame === undefined){
            this.$newGame = this.$doc.createElement("a")
            this.$newGame.innerText = "<start new game>"
            this.$newGame.addEventListener("click", this.onClickNewGame.bind(this))
            this.$newGame.setAttribute("id", "newGame")
            this.$newGame.setAttribute("href", "#")
        }
        this.$resultDiv.appendChild(this.$newGame)
        // update statistic
        this.$statsDiv.innerText = "Player X: " + this.player1 + "\n" + "Player O: " + this.player2
    }

    onClickNewGame(ev){
        this.$fields.forEach(function(element) {
            element.innerText = ""
            element.classList.remove("fieldWon")
        }, this);
        this.running = true
        this.$resultDiv.removeChild(this.$newGame)
        this.$resultDiv.innerText = ""
    }

    checkFields(fields){
        if ((this.$fields[fields[0]].innerText + this.$fields[fields[1]].innerText + this.$fields[fields[2]].innerText).match("XXX|OOO")) {
            this.$fields[fields[0]].classList.add("fieldWon")
            this.$fields[fields[1]].classList.add("fieldWon")
            this.$fields[fields[2]].classList.add("fieldWon")
            this.player === 1 ? this.player1++ : this.player2++
            this.finishGame("you win!")
        }
    }

    checkBoard(){

        let isBoardFull = true
        
        this.checkFields([0,1,2])
        this.checkFields([3,4,5])
        this.checkFields([6,7,8])
        this.checkFields([0,3,6])
        this.checkFields([1,4,7])
        this.checkFields([2,5,8])
        this.checkFields([0,4,8])
        this.checkFields([2,4,6])

        if (this.running) {
            this.$fields.forEach(function(element){
                if (element.innerText === ""){
                    isBoardFull = false
                }
            })
            if (isBoardFull){
                this.finishGame("...draw")
            }
        }
    }

    onClickField(ev){
        if (ev.target.innerText === "" && this.running){
            ev.target.innerText = this.player === 1 ? "X" : "O"
            this.checkBoard.bind(this)()
            this.player === 1 ? this.player++ : this.player--
            this.store.send_action(this.player, ev.target.id)
        }
    }

}