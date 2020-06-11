import _io from 'socket.io-client';
import { BACKEND_URL } from './util';

export const dependencies = {
  io: _io
};

const LOSE_STATUS = 'lost';

const clientConnection = addWord => {
  let socket;
  let opponentConnected = false;
  let updateOpponentBoard = () => {};
  let readyOpponnent = () => {};
  let winGame = () => {};

  const getRoomName = () => {
    const path = document.location.pathname.split('/');
    const roomPathIndex = path.findIndex(item => item === 'room') + 1;
    return path[roomPathIndex];
  };

  const initConnection = () => {
    const room = getRoomName();

    socket = dependencies.io(BACKEND_URL);
    socket.emit('joinroom', room);

    socket.on('joinroom', nInRoom => {
      if (nInRoom === 2) {
        opponentConnected = true;
      }
    });

    socket.on('ready', readyMsg => readyOpponnent(readyMsg));

    socket.on('msg', msg => addWord(msg));

    socket.on('error', error => console.log(error));

    socket.on('board', board => updateOpponentBoard(board));

    socket.on('status', status => {
      if (status === LOSE_STATUS) {
        winGame();
      }
    })
  };

  const sendReady = ready => {
    socket.emit('ready', ready);
  };

  const sendBoard = board => {
    socket.emit('board', board);
  };

  const sendMessage = message => {
    socket.emit('msg', message);
  };
  
  const sendGameStatus = status => {
    socket.emit('status', status)
  }

  const getSocket = () => socket;

  const setOpponentBoardUpdater = updater => {
    updateOpponentBoard = updater;
  };

  const setReadyOpponent = readier => {
    readyOpponnent = readier;
  };

  const setWinGame = callback => {
    winGame = callback;
  }

  const isOpponentConnected = () => opponentConnected;

  return {
    getSocket,
    initConnection,
    sendReady,
    sendMessage,
    sendBoard,
    sendGameStatus,
    setOpponentBoardUpdater,
    setReadyOpponent,
    setWinGame,
    isOpponentConnected
  };
};

export default clientConnection;
