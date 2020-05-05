import _io from 'socket.io-client';
import { BACKEND_URL } from './util';

export const dependencies = {
  io: _io
};

const clientConnection = addWord => {
  let socket;
  let updateOpponentBoard = () => {};

  const getRoomName = () => {
    const path = document.location.pathname.split('/');
    const roomPathIndex = path.findIndex(item => item === 'room') + 1;
    return path[roomPathIndex];
  };

  const initConnection = () => {
    const room = getRoomName();

    socket = dependencies.io(BACKEND_URL);
    socket.emit('joinroom', room);

    socket.on('msg', msg => {
      // console.log('hello hellooooo')
      // const li = document.createElement('li')
      // const text = document.createTextNode(msg)
      // li.appendChild(text)
      // messages.appendChild(li)
      addWord(msg);
    });

    socket.on('error', error => console.log(error));

    socket.on('board', board => updateOpponentBoard(board))
  };

  const sendBoard = board => {
    socket.emit('board', board);
  };
  
  const sendMessage = message => {
    socket.emit('msg', message);
  };
  
  const getSocket = () => socket;

  const setOpponentBoardUpdater = updater => {
    updateOpponentBoard = updater;
  }

  return { getSocket, initConnection, sendMessage, sendBoard, setOpponentBoardUpdater };
};

export default clientConnection;
