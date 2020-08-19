import { BACKEND_URL } from '../util';
import { loadSprites, loadAnimationSprites } from './drawHelper';
import wordBoardDrawer from './wordBoardDrawer';
import Animation from './Animation';
import tilemapData from './tilemapData.json';
import animationSpriteData from './animationSpriteData.json';

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

  const tileset = await loadTileset();

  const sprites = await loadSprites(tileset, tilemapData);

  const animationSprites = await loadAnimationSprites(
    tileset,
    animationSpriteData
  );

  // const animations = createAnimations(animationSprites);

  const background = await loadBackground();

  const drawSprite = (spriteName, x, y, scale = 1, drawCtx = ctx) => {
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
  };

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

  const addRows = (rowIndexes) => {
    wordboard.addRowAnimations(Animation(animationSprites.explosion), rowIndexes);
  };

  const completeRows = (rowIndexes) => {
    wordboard.addRowAnimations(Animation(animationSprites.shine), rowIndexes)
  };

  const drawWordboard = (x, y, words, completedRows) => {
    wordboard.draw(ctx, x, y, words, completedRows);
  };

  const drawOpponentBoard = (
    x,
    y,
    words,
    completedRows = { completed: [], added: [] }
  ) => {
    opponentBoard.draw(ctx, x, y, words, completedRows);
  };

  return {
    addRows,
    completeRows,
    drawBackground,
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

  return tileset;
};

const loadBackground = async () => {
  const bg = new Image();
  bg.src = BACKEND_URL + '/' + BACKGROUND_IMG;
  await bg.decode();
  return bg;
};

const createAnimations = animationSprites => {
  return Object.keys(animationSprites).reduce(
    (allAnimations, currAnimation) => {
      allAnimations[currAnimation] = Animation(animationSprites[currAnimation]);
      return allAnimations;
    },
    {}
  );
};

export default drawerHelper;
