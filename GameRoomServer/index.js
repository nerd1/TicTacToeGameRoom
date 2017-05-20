'use strict'

import express from 'express'
import socketio from 'socket.io'
import cors from'cors'

let app = express()
let server = app.listen(3100)
let io = socketio.listen(server)

app.use(cors())

let connections = []

io.on('connection', function (socket) {
    // connection tests
    console.log('connection')
    socket.emit('news', { hello: 'world' })
    socket.on('my other event', function (data) {
        console.log(data)
    })

    // check other connections
    connections.push(socket)
    console.log('connections count: ' + connections.length)

    // receive action
    socket.on('player action', (data)=>{
        console.log(`player '${data.player}' set field '${data.field}'`)
    })
})
