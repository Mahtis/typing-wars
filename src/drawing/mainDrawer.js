import { BACKEND_URL } from '../util';

const TILESET_FILE = 'tileset.png';
export const GAMEBOARD_TILE_WIDTH = 20;
const BG_TILE_X = 20;
const BG_TILE_Y = 0;
const CHAR_TILE_X = 0;
const CHAR_TILE_Y = 0;
const CHAR_TILE_FONT = '15.5px VCR OSD Mono';

const drawerHelper = () => {
  const canvas = document.getElementById('game');

  const ctx = canvas.getContext('2d');

  const tileset = loadTileset();

  const drawBgTile = (x, y) => {
    ctx.drawImage(
      tileset,
      BG_TILE_X,
      BG_TILE_Y,
      GAMEBOARD_TILE_WIDTH,
      GAMEBOARD_TILE_WIDTH,
      x,
      y,
      GAMEBOARD_TILE_WIDTH,
      GAMEBOARD_TILE_WIDTH
    );
  };

  const drawCharTile = (char, x, y) => {
    ctx.drawImage(
      tileset,
      CHAR_TILE_X,
      CHAR_TILE_Y,
      GAMEBOARD_TILE_WIDTH,
      GAMEBOARD_TILE_WIDTH,
      x,
      y,
      GAMEBOARD_TILE_WIDTH,
      GAMEBOARD_TILE_WIDTH
    );

    const origFont = ctx.font;

    ctx.font = CHAR_TILE_FONT;
    // 6 and 16 pixels to set the letter in the middle of the tile
    ctx.fillText(char, 6 + x, 16 + y);

    ctx.font = origFont;
  };

  return {
    drawBgTile,
    drawCharTile
  };
};

const loadTileset = () => {
  const tileset = new Image();
  tileset.src = BACKEND_URL + '/' + TILESET_FILE;
  return tileset;
};


export default drawerHelper;