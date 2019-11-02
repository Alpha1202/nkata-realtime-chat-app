const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const Port = process.env.PORT || 5000

const router = require('./router')


const app = express()
const server = http.createServer(app)
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({ name, join }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        // admin welcome message
        socket.emit("message", { user: "admin", text: `${user.name} welcome to the room ${user.room}`})

        // send an admin broadcast to everyone in the room
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`});

        // join a user to a room
        socket.join(user.room)

        callback();
    })

    // events for user generated messages
     socket.on('sendMessage', (message, callback) => {
         const user = getUser(socket.id);

         io.to(user.room).emit('message', {user: user.name, text: message});

         callback();
     })


    socket.on('disconnect', () => {
        console.log('User just left')
    })
})

app.use(router); 

server.listen(Port, () => console.log(`server is running on port ${Port}`))