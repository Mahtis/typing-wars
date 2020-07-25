import { loadImage } from './drawHelper';

const GAMEBOARD_TILE_WIDTH = 20;

const wordBoardDrawer = (boardRows, boardCols, drawSprite, scale = 1) => {
  const rows = boardRows + 2;
  const cols = boardCols + 2;
  const canvas = document.createElement('canvas');
  const tileSize = GAMEBOARD_TILE_WIDTH * scale;
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;

  const ctx = canvas.getContext('2d');

  const drawRow = (rowIndex, startTile, middleTile, endTile) => {
    drawSprite(startTile, 0, rowIndex * tileSize, scale, ctx);

    for (let col = 1; col < cols; col++) {
      drawSprite(
        middleTile,
        col * tileSize,
        rowIndex * tileSize,
        scale,
        ctx
      );
    }

    drawSprite(
      endTile,
      (cols - 1) * tileSize,
      rowIndex * tileSize,
      scale,
      ctx
    );
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

  return loadImage(canvas);
};

export default wordBoardDrawer;
