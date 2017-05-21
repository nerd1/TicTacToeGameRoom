'use strict'

import express from 'express'
import socketio from 'socket.io'
import cors from'cors'
import Board from './board'

let app = express()
let server = app.listen(3100)
let io = socketio.listen(server)

app.use(cors())

let userQueue = []
let boardList = []

io.on('connection', function (socket) {
    let username
    let board

    // connection tests
    console.log('connection: ' + socket.id)

    function connectUsers() {
        console.log('userQueue: ' + userQueue.map((item)=>item.username))
        if (userQueue.length > 1) {
            socket.board = new Board(userQueue.shift(), userQueue.shift())
            boardList.push(socket.board)
            socket.board.socketPlayer2.board = socket.board
            socket.emit('start_game')
            socket.to(socket.board.socketPlayer1.id).emit('start_game')
            socket.emit('your_turn', {'player':'x', 'username':socket.username})
            socket.to(socket.board.socketPlayer1.id).emit('other_turn', {'player': 'x', 'username': socket.board.socketPlayer2.username})
            console.log(`player1 '${socket.board.socketPlayer1.username}' plays versus player2 '${socket.board.socketPlayer2.username}'`)            
        }
    }

    // receive new user
    socket.on('add_user', (data)=>{
        console.log(`username '${data.username}'`)
        socket.username = data.username
        userQueue.push(socket)
        connectUsers();
    })

    // player moves
    socket.on('player_action', (data)=>{
        console.log(`player '${data.player}' set field '${data.field}'`)
        socket.board.setField(data)
        let gameResult = socket.board.checkBoard()
        if (socket.id === socket.board.socketPlayer2.id) {
            if (gameResult) {
                socket.to(socket.board.socketPlayer1.id).emit('new_move', {'player': 'x', 'field': data.field})
                socket.to(socket.board.socketPlayer1.id).emit('game_finished', {'winner': gameResult})
                socket.emit('game_finished', {'winner': gameResult})
            } else {
                socket.to(socket.board.socketPlayer1.id).emit('new_move', {'player': 'x', 'field': data.field})
                socket.to(socket.board.socketPlayer1.id).emit('your_turn', {'player': 'o', 'username': socket.board.socketPlayer1.username})
                socket.emit('other_turn', {'player': 'o', 'username': socket.board.socketPlayer1.username})
            }
        } else {
            if (gameResult) {
                socket.to(socket.board.socketPlayer2.id).emit('new_move', {'player': 'o', 'field': data.field})
                socket.to(socket.board.socketPlayer2.id).emit('game_finished', {'winner': gameResult})
                socket.emit('game_finished', {'winner': gameResult})
            } else {
                socket.to(socket.board.socketPlayer2.id).emit('new_move', {'player': 'o', 'field': data.field})
                socket.to(socket.board.socketPlayer2.id).emit('your_turn', {'player': 'x', 'username': socket.board.socketPlayer2.username})
                socket.emit('other_turn', {'player': 'x', 'username': socket.board.socketPlayer2.username})
            }
        }
    })

    socket.on('new_game', (data)=>{
        socket.board = null
        userQueue.push(socket)
        connectUsers();
    })
})
