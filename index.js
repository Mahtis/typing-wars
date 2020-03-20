const express = require('express')
const _io = require('socket.io')
const http = require('http')
const PORT = 3000

const app = express()
const server = http.createServer(app)
const io = _io(server)

app.use('/', express.static(__dirname + '/dist', { 'index': 'room.html' }));

// app.get('/', async (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// app.get('/room1', async (req, res) => {
//   res.sendFile(__dirname + '/room.html')
// })

io.on('connection', (socket) => {
  // io.of('/').clients((error, clients) => {
  //   if (error) throw error;
  //   console.log(clients);
  // });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
})

const room1 = io.of('room1');
room1.on('connection', socket => {
  room1.clients((error, clients) => {
    console.log(clients)
  })
  socket.on('msg', msg => {
    console.log(msg)
    socket.emit('msg', 'PRIVAVIESTI ' + msg)
    room1.emit('msg', msg)
  })
})

server.listen(PORT, () => console.log('App listening on ' + PORT 
  + '\nStarted on ' + new Date().toLocaleString()))
