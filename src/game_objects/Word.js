import SpriteProvider from '../drawing/SpriteProvider';
import { range } from '../util';
import Hitbox from '../logic/Hitbox';

const CHAR_SPRITE = 'charBoardTile';
const tileSize = 20;

const Word = (word, initialRow, initialCol) => {
  const sprite = SpriteProvider.getSprite(CHAR_SPRITE);

  let cols = range(initialCol, initialCol + word.length - 1);
  let rows = [initialRow];

  let location = { x: initialCol * tileSize, y: initialRow * tileSize };
  let x = 0;
  let y = 0;

  const hitbox = Hitbox(location, tileSize * word.length, tileSize);

  let status = 'MOVING';

  const move = ({ cols: newCols, rows: newRows }) => {
    cols = newCols;
    rows = newRows;
  };

  const getHitbox = () => hitbox;

  const moveUp = () => {};

  const getMoveDown = () => ({ rows: rows.map(row => row + 1), cols });

  const moveLeft = () => {
    cols = cols.map(col => col - 1);
  };

  const moveRight = () => {
    cols = cols.map(col => col + 1);
  };

  const getStatus = () => status;

  const getLocation = () => ({ cols, rows });

  const destroy = () => {
    status = 'DESTROYED';
  };

  return {
    move,
    moveUp,
    getHitbox,
    getMoveDown,
    moveLeft,
    moveRight,
    getStatus,
    getLocation,
    destroy
  };
};

export default Word;
