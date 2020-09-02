import SpriteProvider from '../drawing/SpriteProvider';
import { range } from '../util';
import Hitbox from '../logic/Hitbox';

const CHAR_SPRITE = 'charBoardTile';
const tileSize = 20;

const Word = (word, initialRow, initialCol, id, collisionDetector) => {
  const sprite = SpriteProvider.getSprite(CHAR_SPRITE);

  let cols = range(initialCol, initialCol + word.length - 1);
  let rows = [initialRow];

  const location = { x: initialCol * tileSize, y: initialRow * tileSize };

  const hitbox = Hitbox(location, tileSize * word.length, tileSize);

  let status = 'MOVING';

  const move = ({ cols: newCols, rows: newRows }) => {
    cols = newCols;
    rows = newRows;
  };

  const getId = () => id;

  const getWord = () => word;

  const getHitbox = () => hitbox.getHitboxLocation();

  const isObjectColliding = hitboxLocation => hitbox.isObjectIntersecting(hitboxLocation);

  const moveTo = (newX, newY) => {
    const newLocation = hitbox.getHitboxForNewLocation(newX, newY);

    const collision = collisionDetector.checkCollision(newLocation, id);

    if (!collision) {
      location.x = newLocation.startX;
      location.y = newLocation.startY
    }

    return !collision;
  }

  const moveUp = () => {};

  const moveDown = () => {
    const newX = location.x;
    const newY = location.y + tileSize;
    
    return moveTo(newX, newY);
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
    
    return moveTo(newX, newY);
  };

  const moveRight = () => {
    const newX = location.x + tileSize;
    const newY = location.y;
    
    return moveTo(newX, newY);
  };

  const getStatus = () => status;

  const getLocation = () => location;

  const destroy = () => {
    status = 'DESTROYED';
  };

  return {
    move,
    moveUp,
    getId,
    getWord,
    getHitbox,
    isObjectColliding,
    moveDown,
    drop,
    moveLeft,
    moveRight,
    getStatus,
    getLocation,
    destroy
  };
};

export default Word;

/**
 * general states: moving, stationary, (destroyed, destructing)
 *
 * additional effect states: completed, added, creating, dropping, moving
 */
