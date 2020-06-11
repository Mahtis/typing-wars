import clientConnection from './clientConnection';
import keyHandler from './keyHandler';
import gameBoard from './gameBoard';
import stringState from './stringState';
import boardStateHandler from './boardStateHandler';
import { fetchWords } from './dataProvider';
import startSequenceDrawer from './drawing/startSequenceDrawer';
import readyingDrawer from './drawing/readyingDrawer';

const FALL_SPEED = 500;
const BOARD_ROWS = 40;
const BOARD_COLS = 30;

const startGame = async () => {
  let gameState = 'CONNECTED';
  let playerReady = false;
  let opponentReady = false;

  const beginReadying = () => {
    gameState = 'READYING';
  };

  const beginStartSequence = () => {
    gameState = 'START';
  };

  const startMatch = () => {
    gameState = 'PLAYING';
  };

  const loseMatch = () => {
    console.log('I LOSE!!!');
    
    gameState = 'LOST';
  };

  const winMatch = () => {
    gameState = "WON";
  }

  const boardState = boardStateHandler(BOARD_ROWS, BOARD_COLS, loseMatch, 0);
  const connection = clientConnection(boardState.addWord);
  connection.initConnection();
  const words = await fetchWords();

  const typingState = stringState(words, connection);

  const handler = keyHandler();

  const canvas = document.getElementById('game');
  const board = gameBoard(canvas, typingState, boardState);

  board.initBoard();
  
  const startSequence = startSequenceDrawer(
    canvas.getContext('2d'),
    startMatch
  );

  const readyDrawer = readyingDrawer(canvas.getContext('2d'));
  
  const setPlayerReady = () => {
    playerReady = !playerReady;
    connection.sendReady(playerReady);
  };
  
  const setOpponentReady = readyStatus => {
      opponentReady = readyStatus;
  };
  
  connection.setOpponentBoardUpdater(board.updateOpponentBoard);
  connection.setReadyOpponent(setOpponentReady);
  connection.setWinGame(winMatch);
  
  document.addEventListener('keydown', handler.readyKeyHandler(setPlayerReady));

  let lastMoveDown = Date.now();

  const gameLoop = () => {
    switch (gameState) {
      case 'CONNECTED':
        // wait for everything to be set up and opponent has connected
        if(connection.isOpponentConnected()) {
          beginReadying();
        }
        break;
      case 'READYING':
        // render text saying click enter or space to ready up
        // listen to those key presses
        // render waiting for opponent to ready-up
        // when opponent sends ready, move on to starting
        readyDrawer.draw(playerReady, opponentReady);
        if (playerReady && opponentReady) {
          beginStartSequence();
          
          document.removeEventListener(
            'keydown',
            handler.readyKeyHandler(setPlayerReady)
          );

          document.addEventListener(
            'keydown',
            handler.gameKeyHandler(typingState.updateString, boardState)
          );
        }

        break;
      case 'START':
        startSequence.draw();
        break;
      case 'PLAYING':
        // actual game loop
        const currentTime = Date.now();
        if (currentTime >= lastMoveDown + FALL_SPEED) {
          boardState.moveWordsDown();
          connection.sendBoard(boardState.getWordBoard());
          lastMoveDown = currentTime;
        }
        board.draw();
        break;
      case 'LOST':
        // render losing
        connection.sendGameStatus('lost');
        board.drawMatchEndScreen('LOST');
        break;
      case 'WON':
        // render winning!
        board.drawMatchEndScreen('WON');
        break;
      default:
        break;
    }
  };

  // TODO: set this lower when boardState is updated to work better
  setInterval(gameLoop, 40);
};

startGame();
