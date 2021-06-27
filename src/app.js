import SpriteProvider from './drawing/SpriteProvider';
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
import { range } from './util';
import Wordboard from './game_objects/Wordboard';

const FALL_SPEED = 500;
const BOARD_ROWS = 30;
const BOARD_COLS = 20;

const startGame = async () => {
  let gameState = 'CONNECTED';
  let playerReady = false;
  let opponentReady = false;

  await SpriteProvider.init();

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
    gameState = 'WON';
  };
  // This seems to be the easiest way to ensure that the VCR OSD Mono font is loaded
  await document.fonts.load('15.5px VCR OSD Mono');

  const canvas = document.getElementById('game');

  const helper = await drawHelper();

  const wordboard = Wordboard(
    BOARD_COLS,
    BOARD_ROWS,
    20,
    20,
    canvas.getContext('2d')
  );

  const boardState = boardStateHandler(BOARD_ROWS, BOARD_COLS, loseMatch, 0);
  const connection = clientConnection(wordboard.addWord);
  connection.initConnection();
  const words = await fetchWords();

  const score = scoreTracker();
  const typingState = stringState(words, connection, score.updateScore);

  const handler = keyHandler();

  const board = gameBoard(canvas, typingState, null, helper);

  board.initBoard();

  const addRowsCallback = rows => {
    boardState.addRows(rows);
    // range() "to" is inclusive,
    // so that is taken into account using BOARD_ROWS in "to" without the -1
    helper.addRows(range(BOARD_ROWS - rows.length, BOARD_ROWS - 1));
  };

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
  connection.setReceiveRows(addRowsCallback);

  document.addEventListener('keydown', handler.readyKeyHandler(setPlayerReady));

  let lastMoveDown = Date.now();
  let lastCompleted = [];

  const gameLoop = () => {
    switch (gameState) {
      case 'CONNECTED':
        // wait for everything to be set up and opponent has connected
        waitOpponentDrawer.draw();
        if (connection.isOpponentConnected()) {
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
            handler.gameKeyHandler(typingState.updateString, {
              rotateWord: wordboard.rotateActiveWord,
              dropWord: wordboard.dropActiveWord,
              moveWordLeft: wordboard.moveActiveWordLeft,
              moveWordRight: wordboard.moveActiveWordRight
            })
          );
        }

        break;
      case 'START':
        startSequence.draw();
        break;
      case 'PLAYING':
        // actual game loop
        const currentTime = Date.now();
        const wordboardList = boardState.getWordBoard();
        if (currentTime >= lastMoveDown + FALL_SPEED) {
          boardState.moveWordsDown();
          wordboard.moveWordsDown();
          connection.sendBoard(wordboardList);
          lastMoveDown = currentTime;
        }

        const { added, completed } = boardState.getCompletedRows();

        if (completed.length > lastCompleted.length) {
          boardState.clearDroppingWords();
          const newRows = completed.slice(
            lastCompleted.length,
            completed.length
          );

          const rowsToSend = wordboardList.filter((row, i) =>
            newRows.includes(i)
          );

          connection.sendRows(rowsToSend);

          helper.completeRows(newRows);

          lastCompleted = [...completed];
        }
        board.draw(wordboardList, { completed, added });
        wordboard.draw();
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
