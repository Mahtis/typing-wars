import { BACKEND_URL } from '../util';
import tilemapData from './tilemapData.json';

const TILESET_FILE = 'tileset.png';
export const GAMEBOARD_TILE_WIDTH = 20;
const CHAR_TILE_FONT = '15.5px VCR OSD Mono';

const drawerHelper = () => {
  const canvas = document.getElementById('game');

  const ctx = canvas.getContext('2d');

  const tileset = loadTileset();

  const drawFromTilemap = (
    tile,
    x,
    y,
    width = GAMEBOARD_TILE_WIDTH,
    height = GAMEBOARD_TILE_WIDTH
  ) => {
    const img = tilemapData[tile];
    ctx.drawImage(
      tileset,
      img.x,
      img.y,
      img.width,
      img.height,
      x,
      y,
      width,
      height
    );
  };

  const drawBgTile = (x, y) => {
    drawFromTilemap('bgBoardTile', x, y);
  };

  const drawCharTile = (char, x, y) => {
    drawFromTilemap('charBoardTile', x, y);

    const origFont = ctx.font;

    ctx.font = CHAR_TILE_FONT;
    // 6 and 16 pixels to set the letter in the middle of the tile
    ctx.fillText(char, 6 + x, 16 + y);

    ctx.font = origFont;
  };

  const drawBoardFrame = (rows, cols, startX, startY) => {
    drawBoardFrameTopRow(cols, startX, startY);

    drawBoardFrameMiddleRows(rows, startX, cols + 1, startY);

    drawBoardFrameBottomRow(cols, startX, startY, rows + 1);
  };

  const drawBoardFrameTopRow = (cols, startX, startY) => {
    const endX = cols + 1;

    drawFromTilemap('boardFrameTopLeft', startX, startY);

    for (let i = 1; i <= cols; i++) {
      drawFromTilemap(
        'boardFrameHorizontal',
        i * GAMEBOARD_TILE_WIDTH + startX,
        startY
      );
    }

    drawFromTilemap(
      'boardFrameTopRight',
      endX * GAMEBOARD_TILE_WIDTH + startX,
      startY
    );
  };

  const drawBoardFrameMiddleRows = (rows, startX, endX, startY) => {
    for (let i = 1; i <= rows; i++) {
      drawFromTilemap(
        'boardFrameVertical',
        startX,
        i * GAMEBOARD_TILE_WIDTH + startY
      );

      drawFromTilemap(
        'boardFrameVertical',
        endX * GAMEBOARD_TILE_WIDTH + startX,
        i * GAMEBOARD_TILE_WIDTH + startY
      );
    }
  };

  const drawBoardFrameBottomRow = (cols, startX, startY, endY) => {
    const endX = cols + 1;

    drawFromTilemap(
      'boardFrameBottomLeft',
      startX,
      endY * GAMEBOARD_TILE_WIDTH + startY
    );

    for (let i = 1; i <= cols; i++) {
      drawFromTilemap(
        'boardFrameHorizontal',
        i * GAMEBOARD_TILE_WIDTH + startX,
        endY * GAMEBOARD_TILE_WIDTH + startY
      );
    }

    drawFromTilemap(
      'boardFrameBottomRight',
      endX * GAMEBOARD_TILE_WIDTH + startX,
      endY * GAMEBOARD_TILE_WIDTH + startY
    );
  };

  return {
    drawBgTile,
    drawCharTile,
    drawBoardFrame
  };
};

const loadTileset = () => {
  const tileset = new Image();
  tileset.src = BACKEND_URL + '/' + TILESET_FILE;
  return tileset;
};

export default drawerHelper;
