import Hitbox from '../logic/Hitbox';
import WordDrawer from '../drawing/WordDrawer';
import { range } from '../util';

export const dependencies = {
  wordDrawer: WordDrawer
};

const tileSize = 20;

const Word = (
  word,
  initialRow,
  initialCol,
  id,
  collisionDetector,
  type = 'NORMAL',
  initialState = ''
) => {
  const location = { x: initialCol * tileSize, y: initialRow * tileSize };

  const hitbox = Hitbox(location, tileSize * word.length, tileSize);

  const drawer = dependencies.wordDrawer(word, type);

  let state = initialState;

  const getId = () => id;

  const getWord = () => word;

  const getHitbox = () => hitbox.getHitboxLocation();

  const getOrientation = () =>
    hitbox.getHeight() > hitbox.getWidth() ? 'VERTICAL' : 'HORIZONTAL';

  const isObjectColliding = hitboxLocation =>
    hitbox.isObjectIntersecting(hitboxLocation);

  const moveTo = (newX, newY) => {
    const newLocation = hitbox.getHitboxForNewLocation(newX, newY);

    if (collisionDetector.isOutsideBoard(newLocation)) return false;

    const collisionObjects = collisionDetector.checkCollision(newLocation, id);

    if (collisionObjects.length === 0) {
      location.x = newX;
      location.y = newY;
    }

    return collisionObjects.length === 0;
  };

  const moveUp = () => {
    location.y = location.y - tileSize;
  };

  const moveDown = () => {
    const newX = location.x;
    const newY = location.y + tileSize;

    const success = moveTo(newX, newY);
    if (!success) {
      state = 'bumpDown';
    }
    return success;
  };

  const drop = () => {
    let moveSuccess = true;
    while (moveSuccess) {
      moveSuccess = moveDown();
    }
  };

  const moveLeft = () => {
    const newX = location.x - tileSize;
    const newY = location.y;

    const success = moveTo(newX, newY);
    if (!success) {
      state = 'bumpLeft';
    }
    return success;
  };

  const moveRight = () => {
    const newX = location.x + tileSize;
    const newY = location.y;

    const success = moveTo(newX, newY);
    if (!success) {
      state = 'bumpRight';
    }
    return success;
  };

  // Maybe a bit antipattern to do and undo a move
  // But it's simple and works, so for now it's good enough
  const rotate = (force = false) => {
    hitbox.rotate();

    if (
      !force &&
      (collisionDetector.isOutsideBoard(getHitbox()) ||
        collisionDetector.checkCollision(getHitbox(), id).length !== 0)
    ) {
      hitbox.rotate();
    }
  };

  const checkLocation = (x, y) => {
    const newLocation = hitbox.getHitboxForNewLocation(x, y);

    return collisionDetector.checkCollision(newLocation, id);
  };

  const checkLeft = () => {
    const newX = location.x - tileSize;
    const newY = location.y;

    return checkLocation(newX, newY);
  };

  const checkRight = () => {
    const newX = location.x + tileSize;
    const newY = location.y;

    return checkLocation(newX, newY);
  };

  const checkDown = () => {
    const newX = location.x;
    const newY = location.y + tileSize;

    return checkLocation(newX, newY);
  };

  const splitOnRow = splitRow => {
    const row = getRow();
    const col = getCol();

    if (getOrientation() === 'HORIZONTAL') {
      return [{ word, row, col, orientation: 'HORIZONTAL' }];
    } else {
      const wordRows = getRows(); // note this is in decending order
      const splitPos = wordRows.findIndex(row => row === splitRow);
      const newWords = [];

      // characters above split row (i.e. smaller row number)
      if (splitPos < wordRows.length - 1) {
        newWords.push({
          word: word.slice(splitPos + 1, word.length),
          row: wordRows[splitPos + 1],
          col,
          orientation: 'VERTICAL'
        });
      }
      // characters on the split row
      if (splitPos >= 0 && splitPos <= wordRows.length - 1) {
        newWords.push({
          word: word.slice(splitPos, splitPos + 1),
          row: wordRows[splitPos],
          col,
          orientation: 'VERTICAL'
        });
      }
      // characters on below split row
      if (splitPos > 0) {
        newWords.push({
          word: word.slice(0, splitPos),
          row,
          col,
          orientation: 'VERTICAL'
        });
      }

      return newWords;
    }
  };

  const splitToWordsByRows = () => {
    if (getOrientation() === 'HORIZONTAL') {
      return [
        {
          word,
          col: location.x / tileSize,
          row: location.y / tileSize
        }
      ];
    } else {
      return [...word].map((char, i) => {
        return {
          word: char,
          col: location.x / tileSize,
          row: location.y / tileSize - i
        };
      });
    }
  };

  const getLocation = () => location;

  const getCollisionDetector = () => collisionDetector;

  const getRow = () => location.y / tileSize;

  const getRows = () => {
    const startRow = location.y / tileSize;
    const endRow =
      getOrientation() === 'VERTICAL' ? startRow - word.length + 1 : startRow;
    return range(endRow, startRow).reverse();
  };

  const getCol = () => location.x / tileSize;

  const getCols = () => {
    const startCol = location.x / tileSize;
    const endCol =
      getOrientation() === 'HORIZONTAL' ? startCol + word.length - 1 : startCol;
    return range(startCol, endCol);
  };

  const destroy = () => {
    state = 'DESTROYED';
  };

  const draw = ctx => {
    drawer.draw(ctx, location, getOrientation(), state);
    // const l = hitbox.getHitboxLocation();
    // ctx.fillRect(l.startX, l.startY, l.endX - l.startX, l.endY - l.startY)
    if (state !== '') {
      state = '';
    }
  };

  return {
    moveUp,
    getId,
    getWord,
    getHitbox,
    getOrientation,
    isObjectColliding,
    moveDown,
    drop,
    moveLeft,
    moveRight,
    rotate,
    checkLeft,
    checkRight,
    checkDown,
    getLocation,
    getRow,
    getRows,
    getCol,
    getCols,
    splitToWordsByRows,
    splitOnRow,
    destroy,
    getCollisionDetector,
    draw
  };
};

export default Word;

/**
 * general states: moving, stationary, (destroyed, destructing)
 *
 * additional effect states: completed, added, creating, dropping, moving
 */
