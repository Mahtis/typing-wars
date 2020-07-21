import clientConnection from './clientConnection';
import keyHandler from './keyHandler';
import gameBoard from './gameBoard';
import scoreTracker from './scoreTracker';
import stringState from './stringState';
import boardStateHandler from './boardStateHandler';
import { fetchWords } from './dataProvider';
import startSequenceDrawer from './drawing/startSequenceDrawer';
import readyingDrawer from './drawing/readyingDrawer';
import waitingOpponentDrawer from './drawing/waitingOpponentDrawer';
import _scoreDrawer from './drawing/scoreDrawer';
import drawHelper from './drawing/mainDrawer';

const FALL_SPEED = 500;
const BOARD_ROWS = 30;
const BOARD_COLS = 20;

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

  const score = scoreTracker();
  const typingState = stringState(words, connection, score.updateScore);

  const handler = keyHandler();

  const canvas = document.getElementById('game');

  const helper = await drawHelper()

  const board = gameBoard(canvas, typingState, boardState, helper);

  board.initBoard();
  
  const startSequence = startSequenceDrawer(
    canvas.getContext('2d'),
    startMatch
  );

  const readyDrawer = readyingDrawer(canvas.getContext('2d'));
  const waitOpponentDrawer = waitingOpponentDrawer(canvas.getContext('2d'));
  const scoreDrawer = _scoreDrawer(canvas.getContext('2d'), score);
  
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
        waitOpponentDrawer.draw();
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
        scoreDrawer.draw();
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
