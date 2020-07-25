import { BACKEND_URL } from '../util';
import wordBoardDrawer from './wordBoardDrawer';
import tilemapData from './tilemapData.json';

const TILESET_FILE = 'tileset.png';
const BACKGROUND_IMG = 'background.png';
const BACKGROUND_WIDTH = 333;
const BACKGROUND_HEIGHT = 233;
export const GAMEBOARD_TILE_WIDTH = 20;
const CHAR_TILE_X_OFFSET = 6;
const CHAR_TILE_Y_OFFSET = 16;
const CHAR_TILE_FONT = 'VCR OSD Mono';
const CHAR_TILE_FONT_SIZE = 15.5;

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
    height = GAMEBOARD_TILE_WIDTH,
    drawCtx = ctx
  ) => {
    const img = tilemapData[tile];
    drawCtx.drawImage(
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

  const drawSprite = (
    spriteName,
    x,
    y,
    scale = 1,
    drawCtx = ctx
  ) => {
    const sprite = sprites[spriteName];
    drawCtx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      x,
      y,
      sprite.width * scale,
      sprite.height * scale
    );
  }

  const wordboard = await wordBoardDrawer(30, 20, drawSprite, 1);
  sprites.wordboard = wordboard;

  const opponentBoard = await wordBoardDrawer(30, 20, drawSprite, 0.3);
  sprites.opponentBoard = opponentBoard;

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
    );
  };

  const getSprite = sprite => sprites[sprite];

  const drawBgTile = (x, y) => {
    drawFromTilemap('bgBoardTile', x, y);
  };

  const drawCharTile = (char, x, y, scale = 1) => {
    drawSprite('charBoardTile', x, y, scale);

    if (char) {
      const origFont = ctx.font;
      const origFill = ctx.fillStyle;

      ctx.font = CHAR_TILE_FONT_SIZE * scale + 'px ' + CHAR_TILE_FONT;
      ctx.fillStyle = '#2c2626'
      // 6 and 16 pixels to set the letter in the middle of the tile
      ctx.fillText(char, CHAR_TILE_X_OFFSET * scale + x, CHAR_TILE_Y_OFFSET * scale + y);

      ctx.font = origFont;
      ctx.fillStyle = origFill;
    };
  };

  const drawWordboard = (x, y, words) => {
    drawSprite('wordboard', x, y);
    
    drawBoardCharacterTiles(words, x, y, 1)
  };

  const drawOpponentBoard = (x, y, words) => {
    drawSprite('opponentBoard', x, y);

    drawBoardCharacterTiles(words, x, y, 0.3);
  };

  const drawBoardCharacterTiles = (words, x, y, scale = 1) => {
    const tileSize = GAMEBOARD_TILE_WIDTH * scale
    const xOffset = x + tileSize;
    const yOffset = y + tileSize;

    words.forEach((row, i) => {
      [...row].forEach((char, j) => {
        if (char !== ' ') {
          drawCharTile(
            char,
            xOffset + j * tileSize,
            yOffset + i * tileSize,
            scale
          );
        }
      });
    });
  }

  return {
    drawBackground,
    drawBgTile,
    drawCharTile,
    getSprite,
    drawWordboard,
    drawOpponentBoard
  };
};

const loadTileset = async () => {
  const tileset = new Image();
  tileset.src = BACKEND_URL + '/' + TILESET_FILE;
  tileset.crossOrigin = 'Anonymous';
  await tileset.decode();

  const sprites = loadSprites(tileset, tilemapData);
  return sprites;
};

const loadSprites = async (tileset, tilemapData) => {
  const spriteArray = await Promise.all(
    Object.keys(tilemapData).map(async key => {
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
    })
  );

  const sprites = spriteArray.reduce(
    (obj, item) => ((obj[item.name] = item.sprite), obj),
    {}
  );

  return sprites;
};

const loadImage = canvas =>
  new Promise((resolve, reject) => {
    let sprite = new Image();
    sprite.onload = () => {
      resolve(sprite);
    };
    sprite.onerror = reject;
    sprite.src = canvas.toDataURL();
  });

const loadBackground = async () => {
  const bg = new Image();
  bg.src = BACKEND_URL + '/' + BACKGROUND_IMG;
  await bg.decode();
  return bg;
};

export default drawerHelper;
