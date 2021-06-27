import getWordboardFrame from './getWordboardFrame';

const tileSize = 20;

const WordboardDrawer = (boardRows, boardCols, x, y, drawCtx) => {
  const boardFrame = getWordboardFrame(boardRows, boardCols);

  const characterCanvas = document.createElement('canvas');
  characterCanvas.width = boardCols * tileSize;
  characterCanvas.height = boardRows * tileSize;

  const characterCtx = characterCanvas.getContext('2d');

  const draw = words => {
    characterCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);

    words.forEach(word => {
      word.draw(characterCtx);
    });

    drawCtx.drawImage(boardFrame, x, y);

    drawCtx.drawImage(characterCanvas, x + tileSize, y + tileSize);
  };

  return { draw };
};

export default WordboardDrawer;
