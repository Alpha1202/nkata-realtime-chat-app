const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const Port = process.env.PORT || 5000

const router = require('./router')


const app = express()
const server = http.createServer(app)
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('We have a new connection');

    socket.on('join', ({ name, join }, callback) => {

    })

    socket.on('disconnect', () => {
        console.log('User just left')
    })
})

app.use(router); 

server.listen(Port, () => console.log(`server is running on port ${Port}`))