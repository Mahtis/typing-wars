import SpriteProvider from './SpriteProvider';
import wordCreatedAnimation from './wordCreatedAnimation';
import wordStoopedAnimation from './wordStoppedAnimation';
import wordBumpAnimation from './wordBumpAnimation';

const CHAR_SPRITE = 'charBoardTile';
const tileSize = 20;
const CHAR_TILE_X_OFFSET = 6;
const CHAR_TILE_Y_OFFSET = 16;
const CHAR_TILE_FONT = 'VCR OSD Mono';
const CHAR_TILE_FONT_SIZE = 15.5;

/**
 * word has types: default, received, completed
 * word has orientation: 'HORIZONTAL' | 'VERTICAL'
 * word has state:
 *    default (moving),
 *    created,
 *    bumpDown,
 *    bumpLeft,
 *    bumpRight,
 *    destroyed,
 *    active,
 * }
 */
const WordDrawer = (word, type) => {
  const sprite = SpriteProvider.getSprite(CHAR_SPRITE);

  const characters = createCharacterBaseSprites(word, sprite);

  const horWord = getHorizontalWord(characters);

  const verWord = getVerticalWord(characters);

  const createdDrawer = wordCreatedAnimation();
  const stoppedDrawer = wordStoopedAnimation();
  const bumpDrawer = wordBumpAnimation();
  let state = '';

  const draw = (ctx, location, orientation, newState) => {
    if (newState && newState !== '') {
      state = newState;
    }

    const wordToDraw = orientation === 'VERTICAL' ? verWord : horWord;
    // render the animation according to state
    // if the animation is done, render a static version
    if (state === 'created') {
      createdDrawer.draw(ctx, wordToDraw, location.x, location.y);
      if (createdDrawer.isAnimationDone()) {
        state = '';
      }
    } else if (state === 'bumpDown') {
      stoppedDrawer.draw(ctx, wordToDraw, location.x, location.y);
      if (stoppedDrawer.isAnimationDone()) {
        state = '';
      }
    } else if (state === 'bumpLeft') {
      bumpDrawer.draw(ctx, wordToDraw, location.x, location.y, 'left');
      if (bumpDrawer.isAnimationDone()) {
        state = '';
      }
    } else if (state === 'bumpRight') {
      bumpDrawer.draw(ctx, wordToDraw, location.x, location.y, 'right');
      if (bumpDrawer.isAnimationDone()) {
        state = '';
      }
    } else {
      ctx.drawImage(wordToDraw, location.x, location.y);
    }
  };

  return { draw };
};

const createCharacterBaseSprites = (word, sprite) =>
  [...word].map(char => {
    const canvas = document.createElement('canvas');
    canvas.width = tileSize;
    canvas.height = tileSize;

    const ctx = canvas.getContext('2d');

    ctx.font = CHAR_TILE_FONT_SIZE + 'px ' + CHAR_TILE_FONT;
    ctx.fillStyle = '#2c2626';
    // 6 and 16 pixels to set the letter in the middle of the tile
    ctx.drawImage(sprite, 0, 0);
    ctx.fillText(char, CHAR_TILE_X_OFFSET, CHAR_TILE_Y_OFFSET);
    return canvas;
  });

const getHorizontalWord = characters => {
  const canvas = document.createElement('canvas');
  canvas.width = tileSize * characters.length;
  canvas.height = tileSize;
  const ctx = canvas.getContext('2d');

  characters.forEach((char, i) => {
    ctx.drawImage(char, i * tileSize, 0);
  });

  return canvas;
};

const getVerticalWord = characters => {
  const canvas = document.createElement('canvas');
  canvas.width = tileSize;
  canvas.height = tileSize * characters.length;
  const ctx = canvas.getContext('2d');

  characters.forEach((char, i) => {
    ctx.drawImage(char, 0, i * tileSize);
  });

  return canvas;
};

export default WordDrawer;
