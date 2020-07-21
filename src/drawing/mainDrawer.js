import { BACKEND_URL } from '../util';
import tilemapData from './tilemapData.json';

const TILESET_FILE = 'tileset.png';
const BACKGROUND_IMG = 'background.png';
const BACKGROUND_WIDTH = 333;
const BACKGROUND_HEIGHT = 233;
export const GAMEBOARD_TILE_WIDTH = 20;
const CHAR_TILE_FONT = '15.5px VCR OSD Mono';

const drawerHelper = async () => {
  const canvas = document.getElementById('game');

  const ctx = canvas.getContext('2d');

  const sprites = await loadTileset();

  const background = await loadBackground();

  const drawFromTilemap = (
    tile,
    x,
    y,
    width = GAMEBOARD_TILE_WIDTH,
    height = GAMEBOARD_TILE_WIDTH
  ) => {
    const img = tilemapData[tile];
    ctx.drawImage(
      sprites[tile],
      0,
      0,
      img.width,
      img.height,
      x,
      y,
      width,
      height
    );
  };

  const drawBackground = (width, height) => {
    ctx.drawImage(
      background,
      0,
      0,
      BACKGROUND_WIDTH,
      BACKGROUND_HEIGHT,
      0,
      0,
      width,
      height
    )
  }

  const getSprite = (sprite) => sprites[sprite]

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
    drawBackground,
    drawBgTile,
    drawCharTile,
    drawBoardFrame,
    getSprite
  };
};

const loadTileset = async () => {
  const tileset = new Image();
  tileset.src = BACKEND_URL + '/' + TILESET_FILE;
  tileset.crossOrigin = "Anonymous";
  await tileset.decode();
  
  const sprites = loadSprites(tileset, tilemapData);
  return sprites;
};

const loadSprites = async (tileset, tilemapData) => {
  const spriteArray = await Promise.all(Object.keys(tilemapData).map(async key => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = tilemapData[key];
    
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(
      tileset,
      img.x,
      img.y,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );

    const sprite = await loadImage(canvas);
    return { name: key, sprite };
  }));

  const sprites = spriteArray.reduce((obj, item) => (obj[item.name] = item.sprite, obj) ,{});

  return sprites;
}

const loadImage = (canvas) => new Promise((resolve, reject) => {
  let sprite = new Image();
  sprite.onload = () => {
    resolve(sprite);
  };
  sprite.onerror = reject;
  sprite.src = canvas.toDataURL();
})

const loadBackground = async () => {
  const bg = new Image();
  bg.src = BACKEND_URL + '/' + BACKGROUND_IMG;
  await bg.decode();
  return bg;
}

export default drawerHelper;
