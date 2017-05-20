'use strict'

import io from 'socket.io-client'

let socket = io.connect('http://localhost:3100', {reconnect: true})

// connection
socket.on('connect', function() {
    console.log(socket.id)
})

// test receive and send messages
socket.on('news', (data)=>{
    console.log(data)
    socket.emit('my other event', 'hello')
})

export default class Store {

    send_action(player, field) {
        socket.emit('player action', {'player': player, 'field': field})
    }

}
