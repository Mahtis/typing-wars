const express = require('express')
const _io = require('socket.io')
const http = require('http')
const cors = require('cors')
const PORT = 3000

const app = express()
const server = http.createServer(app)
const io = _io(server)

const rooms = ['room1', 'room2', 'room3', 'room4', 'room5']

const apiService = require('./apiService').apiService();

app.use(cors())

app.get('/asd', (req, res) => {
  io.in('/room/1').clients((error, clients) => {
    res.send('hello ' + clients.length)
  })
})

app.use('/', express.static(__dirname + '/dist', { 'index': 'room.html' }));

app.use('/room/:room', express.static(__dirname + '/dist', { 'index': 'room.html' }));

app.get('/api/words', (req, res) => {
  const returnWords = apiService.getEnglishWords(500, 20)
  console.log('got request: ' + req);
  
  res.json(returnWords)
})

io.on('connection', (socket) => {
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
})


io.on('connection', socket => {
  socket.on('joinroom', room => {
    console.log(room)
    // do room exist check and number of clients check here
    // and if no-go, never even join the room
    socket.join(room)

    io.in(room).clients((error, clients) => {
      console.log(clients)
      if (clients.length > 2) {
        socket.disconnect(true)
      }
    })

    socket.on('msg', msg => {
      console.log(msg)
      // socket.emit menee lähettäjälle itselle pelkästään
      // socket.emit('msg', 'PRIVAVIESTI ' + msg)
      socket.to(room).emit('msg', msg)
    })

    socket.on('board', board => {
      socket.to(room).emit('board', board)
    })
  })
})
// rooms.forEach(room => {
//   const roomNamespace = io.of(room);
//   roomNamespace.on('connection', socket => {
//     roomNamespace.clients((error, clients) => {
//       console.log(clients)
//       if (clients.length > 2) {
//         socket.disconnect(true)
//       }
//     })
//     socket.on('msg', msg => {
//       console.log(msg)
//       socket.emit('msg', 'PRIVAVIESTI ' + msg)
//       roomNamespace.emit('msg', msg)
//     })
//   })
// })

server.listen(PORT, () => console.log('App listening on ' + PORT 
  + '\nStarted on ' + new Date().toLocaleString()))
