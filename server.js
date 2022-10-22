const path = require("path");

const express = require("express");
const app= express()
const socketio = require("socket.io");
const http = require('http').createServer(app)

app.use(express.static(path.join(__dirname,'public')))


const io= require('socket.io')(http)

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})
const port =8000||process.env.port
http.listen(port,()=>{
    console.log(`running on port ${port}` )
})