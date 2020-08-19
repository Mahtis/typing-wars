import { loadImage } from './drawHelper';
import Animation from './Animation';

const GAMEBOARD_TILE_WIDTH = 20;
const CHAR_TILE_X_OFFSET = 6;
const CHAR_TILE_Y_OFFSET = 16;
const CHAR_TILE_FONT = 'VCR OSD Mono';
const CHAR_TILE_FONT_SIZE = 15.5;

const wordBoardDrawer = (boardRows, boardCols, drawSprite, scale = 1) => {
  const rows = boardRows + 2;
  const cols = boardCols + 2;
  const tileSize = GAMEBOARD_TILE_WIDTH * scale;

  const canvas = document.createElement('canvas');
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;

  const characterCanvas = document.createElement('canvas');
  characterCanvas.width = boardCols * tileSize;
  characterCanvas.height = boardRows * tileSize;

  const ctx = canvas.getContext('2d');
  const characterCtx = characterCanvas.getContext('2d');

  let activeAnimations = [];

  const drawRow = (rowIndex, startTile, middleTile, endTile) => {
    drawSprite(startTile, 0, rowIndex * tileSize, scale, ctx);

    for (let col = 1; col < cols; col++) {
      drawSprite(middleTile, col * tileSize, rowIndex * tileSize, scale, ctx);
    }

    drawSprite(endTile, (cols - 1) * tileSize, rowIndex * tileSize, scale, ctx);
  };

  // Top row
  drawRow(0, 'boardFrameTopLeft', 'boardFrameHorizontal', 'boardFrameTopRight');

  // All middle rows
  for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
    drawRow(
      rowIndex,
      'boardFrameVertical',
      'bgBoardTile',
      'boardFrameVertical'
    );
  }

  // Bottom row
  drawRow(
    rows - 1,
    'boardFrameBottomLeft',
    'boardFrameHorizontal',
    'boardFrameBottomRight'
  );

  const addRowAnimations = (animation, rowIndexes) => {
    rowIndexes.forEach(rowIndex => activeAnimations.push({ animation, rowIndex }));
  };

  const drawAnimations = () => {
    activeAnimations.forEach(animObject => {
      const { animation, rowIndex } = animObject;

      for (let x = 0; x < boardCols; x++) {
        animation.draw(characterCtx, x * tileSize, rowIndex * tileSize);
      }
    });

    activeAnimations = activeAnimations.filter(
      obj => !obj.animation.isAnimationDone()
    );
  };

  const highlightRowWithColor = (rowIndex, color) => {
    const origFill = characterCtx.fillStyle;
    characterCtx.fillStyle = color;

    characterCtx.fillRect(
      0,
      rowIndex * tileSize,
      tileSize * boardCols,
      tileSize
    );

    characterCtx.fillStyle = origFill;
  };

  const drawCharTile = (char, x, y) => {
    drawSprite('charBoardTile', x, y, scale, characterCtx);

    if (char) {
      const origFont = characterCtx.font;
      const origFill = characterCtx.fillStyle;

      characterCtx.font = CHAR_TILE_FONT_SIZE * scale + 'px ' + CHAR_TILE_FONT;
      characterCtx.fillStyle = '#2c2626';
      // 6 and 16 pixels to set the letter in the middle of the tile
      characterCtx.fillText(
        char,
        CHAR_TILE_X_OFFSET * scale + x,
        CHAR_TILE_Y_OFFSET * scale + y
      );

      characterCtx.font = origFont;
      characterCtx.fillStyle = origFill;
    }
  };

  const drawBoardCharacterTiles = (words, completedRows) => {
    characterCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
    words.forEach((row, i) => {
      [...row].forEach((char, j) => {
        if (char !== ' ') {
          drawCharTile(char, j * tileSize, i * tileSize, scale);
        }
      });

      if (completedRows.completed.includes(i)) {
        highlightRowWithColor(i, 'rgba(35, 168, 168, 0.125)');
      }

      if (completedRows.added.includes(i)) {
        highlightRowWithColor(i, 'rgba(36, 36, 36, 0.7)');
      }
    });
  };

  const draw = (drawCtx, x, y, words, completedRows) => {
    drawBoardCharacterTiles(words, completedRows);
    drawAnimations();

    drawCtx.drawImage(canvas, x, y);

    drawCtx.drawImage(characterCanvas, x + tileSize, y + tileSize);
  };

  return { addRowAnimations, draw };
};

export default wordBoardDrawer;
