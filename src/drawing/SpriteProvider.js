import { BACKEND_URL } from '../util';
import { createCanvasWithSprite } from './drawHelper';
import tilemapData from './tilemapData.json';

const TILESET_FILE = 'tileset.png';

const loadTileset = async () => {
  const tileset = new Image();
  tileset.src = BACKEND_URL + '/' + TILESET_FILE;
  tileset.crossOrigin = 'Anonymous';
  await tileset.decode();

  return tileset;
};

/*
* Returns an object in the form of { <name of sprite>: <Image for sprite>, }
*/
const loadSprites = (tileset, tilemapData) => {
  const spriteArray = Object.keys(tilemapData).map(key => {
      const sprite = createCanvasWithSprite(tileset, tilemapData[key]);

      return { name: key, sprite };
    });

  const sprites = spriteArray.reduce(
    (obj, item) => ((obj[item.name] = item.sprite), obj),
    {}
  );

  return sprites;
};

/**
 * Isn't this a cool Singleton?
 * TODO: Improve this.
 */
const SpriteProvider = (() => {
  let sprites = {}
  
  const init = async () => {
    try {
      const tileset = await loadTileset();
  
      sprites = loadSprites(tileset, tilemapData);

      return true;
    } catch (e) {
      return false;
    }
  }

  const getSprite = sprite => sprites[sprite];

  return {
    init,
    getSprite
  }
})();

export default SpriteProvider;