import SpriteProvider from "./SpriteProvider";

const FRAME_TOP_LEFT = 'boardFrameTopLeft';
const FRAME_TOP_RIGHT = 'boardFrameTopRight';
const FRAME_BOTTOM_LEFT = 'boardFrameBottomLeft';
const FRAME_BOTTOM_RIGHT = 'boardFrameBottomRight';
const FRAME_VERTICAL = 'boardFrameVertical';
const FRAME_HORIZONTAL = 'boardFrameHorizontal';
const FRAME_BACKGROUND = 'bgBoardTile';

const tileSize = 20;

const getWordboardFrame = (boardRows, boardCols) => {
  const sprites = {
    topLeft: SpriteProvider.getSprite(FRAME_TOP_LEFT),
    topRight: SpriteProvider.getSprite(FRAME_TOP_RIGHT),
    bottomLeft: SpriteProvider.getSprite(FRAME_BOTTOM_LEFT),
    bottomRight: SpriteProvider.getSprite(FRAME_BOTTOM_RIGHT),
    vertical: SpriteProvider.getSprite(FRAME_VERTICAL),
    horizontal: SpriteProvider.getSprite(FRAME_HORIZONTAL),
    bg: SpriteProvider.getSprite(FRAME_BACKGROUND)
  };

  const rows = boardRows + 2;
  const cols = boardCols + 2;

  const canvas = document.createElement('canvas');
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;

  const ctx = canvas.getContext('2d');

  const drawRow = (rowIndex, startTile, middleTile, endTile) => {
    ctx.drawImage(startTile, 0, rowIndex * tileSize);

    for (let col = 1; col < cols; col++) {
      ctx.drawImage(middleTile, col * tileSize, rowIndex * tileSize);
    }

    ctx.drawImage(endTile, (cols - 1) * tileSize, rowIndex * tileSize);
  };

  // Top row
  drawRow(0, sprites.topLeft, sprites.horizontal, sprites.topRight);

  // All middle rows
  for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
    drawRow(
      rowIndex,
      sprites.vertical,
      sprites.bg,
      sprites.vertical
    );
  }

  // Bottom row
  drawRow(
    rows - 1,
    sprites.bottomLeft,
    sprites.horizontal,
    sprites.bottomRight
  );

  return canvas;
};

export default getWordboardFrame;
