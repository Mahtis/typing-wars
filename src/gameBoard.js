import drawerHelper, { GAMEBOARD_TILE_WIDTH } from './drawing/mainDrawer';

const DEFAULT_COLOUR = '#d2d3b2';
const OPPONENT_FONT = '16px Courier';
const OPPONENT_FONT_HEIGHT = 8;
const OPPONENT_FONT_WIDTH = 8;

const gameBoard = (canvas, stringState, boardStateHandler, drawHelper) => {
  let opponentBoard = [];

  let width = 1000;
  let height = 700;

  // const drawHelper = drawerHelper();

  const initBoard = () => {
    const {innerHeight, innerWidth} = window
    canvas.width = innerWidth > 1030 ? innerWidth - 30 : 1000;
    canvas.height = innerHeight > 730 ? innerHeight - 30 : 700;
    width = canvas.width;
    height = canvas.height;
    const ctx = canvas.getContext('2d');
    // disable smoothing
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    drawGameArea(ctx);
    drawText(ctx);
  };

  const updateOpponentBoard = board => {
    opponentBoard = board;
  };

  const drawGameArea = ctx => {
    drawHelper.drawBackground(width, height)
    // ctx.fillStyle = '#333333';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = DEFAULT_COLOUR;
  };

  const drawWordBoard = ctx => {
    const wordBoard = boardStateHandler.getWordBoard();
    drawHelper.drawBoardFrame(30, 20, 0, 10);
    wordBoard.forEach((row, i) => {
      ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
      [...row].forEach((char, j) => {
        if (char === ' ') {
          drawHelper.drawBgTile(
            20 + j * GAMEBOARD_TILE_WIDTH,
            30 + i * GAMEBOARD_TILE_WIDTH
          );
        } else {
          drawHelper.drawCharTile(
            char,
            20 + j * GAMEBOARD_TILE_WIDTH,
            30 + i * GAMEBOARD_TILE_WIDTH
          );
        }
      });
    });
  };

  const drawOpponentBoard = ctx => {
    ctx.font = OPPONENT_FONT;
    opponentBoard.forEach((row, i) => {
      ctx.strokeStyle = '#8e8f79';
      ctx.fillStyle = '#d3c1b5';
      [...row].forEach((char, j) => {
        if (char !== ' ') {
          ctx.fillRect(
            500 + j * OPPONENT_FONT_WIDTH,
            330 + i * OPPONENT_FONT_HEIGHT,
            OPPONENT_FONT_WIDTH,
            OPPONENT_FONT_HEIGHT
          );
        } else {
          ctx.strokeRect(
            500 + j * OPPONENT_FONT_WIDTH,
            330 + i * OPPONENT_FONT_HEIGHT,
            OPPONENT_FONT_WIDTH,
            OPPONENT_FONT_HEIGHT
          );
        }
      });
      ctx.strokeStyle = DEFAULT_COLOUR;
      ctx.fillStyle = DEFAULT_COLOUR;
    });
  };

  const drawText = ctx => {
    ctx.font = '30px Arial';
    ctx.fillText(stringState.getCurrentString(), 500, 300);
    ctx.font = '16px Arial';
    const wordString = stringState.getWordList().reverse().join(' ');
    ctx.fillText(wordString, 500, 320);
    drawWordListInIcons(ctx, stringState.getSkipList(), 500, 670, drawHelper.getSprite('heart'));
  };

  const drawWordListInIcons = (ctx, list, x, y, icon) => {
    ctx.font = '16px VCR OSD Mono';
    const wordString = list.reverse().join(' ');
    ctx.drawImage(
      icon, 
      0,
      0,
      icon.width,
      icon.height,
      x,
      y,
      50,
      40);
    ctx.fillText(wordString, x, y);
  };

  const draw = () => {
    const ctx = canvas.getContext('2d');
    drawGameArea(ctx);
    drawWordBoard(ctx);
    drawOpponentBoard(ctx);
    drawText(ctx);
  };

  const drawMatchEndScreen = result => {
    const ctx = canvas.getContext('2d');
    ctx.font = '30px Arial';
    ctx.fillText('YOU ' + result, 500, 300);
    ctx.font = '16px Arial';
  };

  return {
    initBoard,
    updateOpponentBoard,
    draw,
    drawMatchEndScreen
  };
};

export default gameBoard;
