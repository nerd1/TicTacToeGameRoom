'use strict'

import io from 'socket.io-client'

let socket = io.connect('http://localhost:3100', {reconnect: true})

export default class{

    constructor($doc){
        this.$doc = $doc
        this.player1 = 0
        this.player2 = 0
        this.player = 1
        this.running = true
        this.gameEnabled = false
        this.$nameInput = this.$doc.querySelector("#name_input")
        this.$board = this.$doc.querySelector("#board")
        this.$waiting = this.$doc.querySelector("#waiting")
        this.$nameInput.addEventListener("change", this.onChangeNameInput.bind(this))
        this.$resultDiv = this.$doc.querySelector("#result")
        this.$statsDiv = this.$doc.querySelector("#stats")
        this.$fields = $doc.querySelectorAll("div.field")
        this.$fields.forEach(function(element) {
            element.addEventListener("click", this.onClickField.bind(this))
        }, this);

        // connection
        socket.on('connect', function() {
            console.log(socket.id)
        })

        // messages from server...
        socket.on('start_game', (data)=>{
            console.log('game started...')
            this.$board.classList.remove("hidden")
        })

        socket.on('your_turn', (data)=>{
            console.log('your turn...')
            this.playerToken = data.player
            this.$waiting.innerText = `${data.username}, it's your turn ... (${data.player})`
            this.gameEnabled = true
        })

        socket.on('other_turn', (data)=>{
            console.log('other turn...')
            this.$waiting.innerText = `Waiting for user '${data.username}' ...`
            this.gameEnabled = false
        })

        socket.on('new_move', (data)=>{
            console.log('new move: ' + data.field + '('+data.player+')')
            this.$doc.querySelector('#'+data.field).innerText = data.player
        })

        socket.on('game_finished', (data)=>{
            console.log('game finished, winner: ' + data.winner)
            this.$waiting.innerText = `Game has been finished, winner: '${data.winner}'`
            this.running = false
        })
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

    onClickField(ev){
        if (ev.target.innerText === "" && this.running && this.gameEnabled){
            ev.target.innerText = this.playerToken
            this.send_action(this.player, ev.target.id)
        }
    }

    onChangeNameInput(ev){
        this.add_user(ev.target.value.trim())
        this.$nameInput.classList.add("hidden")
        this.$waiting.classList.remove("hidden")
    }

    add_user(username) {
        socket.emit('add_user', {'username': username})
    }

    send_action(player, field) {
        socket.emit('player_action', {'player': this.playerToken, 'field': field})
    }
}