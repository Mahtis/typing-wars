import drawerHelper, { GAMEBOARD_TILE_WIDTH } from './drawing/mainDrawer';

const DEFAULT_COLOUR = '#d2d3b2';

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

  const drawWordBoard = (wordboard, completedRows) => {
    drawHelper.drawWordboard(20, 20, wordboard, completedRows);
  };

  const drawOpponentBoard = ctx => {
    drawHelper.drawOpponentBoard(500, 330, opponentBoard);
  };

  const drawText = ctx => {
    ctx.font = '30px VCR OSD Mono';
    ctx.fillText(stringState.getCurrentString(), 500, 300);
    ctx.font = '16px VCR OSD Mono';
    const wordString = stringState.getWordList().reverse().join(' ');
    ctx.fillText(wordString, 500, 320);
    drawWordListInIcons(ctx, stringState.getSkipList(), 500, 600, drawHelper.getSprite('heart'));
  };

  const drawWordListInIcons = (ctx, list, x, y, icon) => {
    ctx.font = '16px VCR OSD Mono';
    list.reverse().forEach((word, i) => {
      const xPos = x + i * (50 + 7);
      ctx.drawImage(
        icon, 
        0,
        0,
        icon.width,
        icon.height,
        xPos,
        y,
        50,
        40
      );
      ctx.fillStyle = '#ab9c93';
      ctx.fillText(word, xPos + 6, y + 22);
      ctx.fillStyle = '#d3c1b5';
      ctx.fillText(word, xPos + 7, y + 22);
    });
  };

  const draw = (wordboard, completedRows) => {
    const ctx = canvas.getContext('2d');
    drawGameArea(ctx);
    drawWordBoard(wordboard, completedRows);
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
