// import io from 'socket.io-client'
import clientConnection from './clientConnection';
import keyHandler from './keyHandler';
import gameBoard from './gameBoard';
import stringState from './stringState';
import boardStateHandler from './boardStateHandler';
import { fetchWords } from './dataProvider';

const FALL_SPEED = 500;
const BOARD_ROWS = 40;
const BOARD_COLS = 30;

const startGame = async () => {
const boardState = boardStateHandler(BOARD_ROWS, BOARD_COLS);
const connection = clientConnection(boardState.addWord);
connection.initConnection();
const words = await fetchWords()

// const initialWords = ['hello', 'world', 'yksi', 'kaksi', 'kolme'];

const typingState = stringState(words, connection);
// boardState.addWord('Moik');
// boardState.addWord('HELLOOOO');
// boardState.addWord('pöö');
// boardState.moveWordsDown();
// boardState.addWord('sanananin');
// boardState.moveWordRight();
// boardState.moveWordRight();
// boardState.moveWordRight();
// boardState.moveWordRight();
// boardState.moveWordRight();
// console.log(boardState.getWordBoard());

const handler = keyHandler(typingState.updateString, boardState);

const canvas = document.getElementById('game');
const board = gameBoard(canvas, typingState, boardState);
connection.setOpponentBoardUpdater(board.updateOpponentBoard);
board.initBoard();

document.addEventListener('keydown', handler.keyDownHandler);



let lastMoveDown = Date.now();
const gameLoop = () => {
  const currentTime = Date.now();
  if (currentTime >= lastMoveDown + FALL_SPEED) {
    boardState.moveWordsDown();
    connection.sendBoard(boardState.getWordBoard());
    lastMoveDown = currentTime;
  }
  board.draw();
};

// TODO: set this lower when boardState is updated to work better
setInterval(gameLoop, 40);
}

startGame();
