require('dotenv').config();
const express = require('express');
const _io = require('socket.io');
const http = require('http');
const cors = require('cors');
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = _io(server);

app.set('view engine', 'pug');
app.set('views','./views');

const apiService = require('./apiService').apiService();
const BASE_URL = process.env.BACKEND_URL;

app.use(cors());

app.use(express.static('dist'));
app.use(express.static('public'));

let existingRooms = ['room1', 'top_room', 'gangsta'];

app.get('/asd', (req, res) => {
  io.in('/room/1').clients((error, clients) => {
    res.send('hello ' + clients.length);
  });
});

app.get('/', (req, res) => {
  const rooms = io.sockets.adapter.rooms
  const acualRooms = existingRooms.map(room => {
    return {
      name: room,
      players: rooms[room] ? rooms[room].length : 0,
      link: BASE_URL + '/room/' + room  
    }
  })
  res.render('index', {
    rooms: acualRooms
  });
});

app.get(
  '/room/:room',
  (req,res) => {
    if (existingRooms.includes(req.params.room)) {
      res.sendFile(__dirname + '/dist/room.html')
    } else {
      res.redirect('/')
    }
  }
);

app.get('/api/words', (req, res) => {
  const returnWords = apiService.getEnglishWords(500, 20);
  console.log('got request: ' + req);

  res.json(returnWords);
});

io.on('connection', socket => {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
});

io.on('connection', socket => {
  socket.on('joinroom', room => {
    console.log(room);
    // do room exist check and number of clients check here
    // and if no-go, never even join the room
    socket.join(room);

    io.in(room).clients((error, clients) => {
      console.log(clients);
      if (clients.length > 2) {
        socket.disconnect(true);
      }

      socket.emit('joinroom', clients.length);
      socket.to(room).emit('joinroom', clients.length);
    });

    socket.on('ready', readyMsg => {
      socket.to(room).emit('ready', readyMsg);
    });

    socket.on('msg', msg => {
      console.log(msg);
      // socket.emit menee lähettäjälle itselle pelkästään
      // socket.emit('msg', 'PRIVAVIESTI ' + msg)
      socket.to(room).emit('msg', msg);
    });

    socket.on('board', board => {
      socket.to(room).emit('board', board);
    });

    socket.on('status', status => {
      socket.to(room).emit('status', status);
    })
  });
});

server.listen(PORT, () =>
  console.log(
    'App listening on ' + PORT + '\nStarted on ' + new Date().toLocaleString()
  )
);
