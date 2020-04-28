
const DEFAULT_COLOUR = '#000000'

const gameBoard = (canvas, stringState, boardStateHandler) => {
  let opponentBoard = [];

  const initBoard = () => {
    canvas.width = 800
    canvas.height = 1500
    const ctx = canvas.getContext('2d')
    drawGameArea(ctx)
    drawText(ctx)
  }

  const updateOpponentBoard = board => {
    opponentBoard = board;
  }

  const drawGameArea = ctx => {
    // ctx.beginPath();
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.stroke();
    // ctx.closePath();
    ctx.fillStyle = DEFAULT_COLOUR
  }

  const drawWordBoard = ctx => {
    ctx.font = "20px Courier"
    const wordBoard = boardStateHandler.getWordBoard()
    wordBoard.forEach((row, i) => {
      ctx.strokeStyle = "rgba(0, 0, 255, 0.1)";
      [...row].forEach((char, j) => {
        ctx.strokeRect(100 + j * 12, 100 + i * 13, 12, 13);
      })
      ctx.strokeStyle = DEFAULT_COLOUR;
      ctx.fillText(row, 100, 100 + i * 13)
    })
  }

  const drawOpponentBoard = ctx => {
    ctx.font = "20px Courier"
    opponentBoard.forEach((row, i) => {
      ctx.strokeStyle = "rgba(0, 0, 255, 0.1)";
      ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
      [...row].forEach((char, j) => {
        if (char !== ' ') {
          ctx.fillRect(500 + j * 12, 500 + i * 13, 12, 13);
        } else {
          ctx.strokeRect(500 + j * 12, 500 + i * 13, 12, 13);
        }
      })
      ctx.strokeStyle = DEFAULT_COLOUR;
      ctx.fillStyle = DEFAULT_COLOUR;
    })
  }

  const drawText = ctx => {
    ctx.font = "30px Arial"
    ctx.fillText(stringState.getCurrentString(), 400, 400)
    ctx.font = "16px Arial"
    const wordString = stringState.getWordList().reverse().join(' ')
    ctx.fillText(wordString, 400, 500)
  }
  
  const draw = () => {
    const ctx = canvas.getContext('2d')
    drawGameArea(ctx)
    drawWordBoard(ctx)
    drawOpponentBoard(ctx)
    drawText(ctx)
  }

  return {
    initBoard,
    updateOpponentBoard,
    draw
  }
}

export default gameBoard
