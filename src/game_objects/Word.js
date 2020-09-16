import Hitbox from '../logic/Hitbox';
import WordDrawer from '../drawing/WordDrawer';

export const dependencies = {
  wordDrawer: WordDrawer
}

const tileSize = 20;

const Word = (word, initialRow, initialCol, id, collisionDetector, type = 'NORMAL') => {
  const location = { x: initialCol * tileSize, y: initialRow * tileSize };

  const hitbox = Hitbox(location, tileSize * word.length, tileSize);

  const drawer = dependencies.wordDrawer(word, type);

  let state = type === 'NORMAL' ? 'created' : '';

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
      location.x = newLocation.startX;
      location.y = newLocation.startY;
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
  const rotate = () => {
    hitbox.rotate();

    if (
      collisionDetector.isOutsideBoard(getHitbox()) ||
      collisionDetector.checkCollision(getHitbox(), id).length !== 0
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

  const getCol = () => location.x / tileSize;

  const destroy = () => {
    state = 'DESTROYED';
  };

  const draw = ctx => drawer.draw(ctx, location, getOrientation(), state);

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
    getCol,
    splitToWordsByRows,
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
