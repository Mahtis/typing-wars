const express = require('express')
const _io = require('socket.io')
const http = require('http')
const PORT = 3000

const app = express()
const server = http.createServer(app)
const io = _io(server)

const rooms = ['room1', 'room2', 'room3', 'room4', 'room5']

app.use('/', express.static(__dirname + '/dist', { 'index': 'room.html' }));

app.use('/room/:room', express.static(__dirname + '/dist', { 'index': 'room.html' }));

io.on('connection', (socket) => {
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
})

rooms.forEach(room => {
  const roomNamespace = io.of(room);
  roomNamespace.on('connection', socket => {
  roomNamespace.clients((error, clients) => {
    console.log(clients)
    if (clients.length > 2) {
      socket.disconnect(true)
    }
  })
  socket.on('msg', msg => {
    console.log(msg)
    socket.emit('msg', 'PRIVAVIESTI ' + msg)
    roomNamespace.emit('msg', msg)
  })
})
})

server.listen(PORT, () => console.log('App listening on ' + PORT 
  + '\nStarted on ' + new Date().toLocaleString()))
