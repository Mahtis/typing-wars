
const gameBoard = (canvas, stringState) => {
  const initBoard = () => {
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')
    drawGameArea(ctx)
    drawText(ctx)
  }

  const drawGameArea = ctx => {
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = '#000000'
  }

  const drawText = ctx => {
    ctx.font = "30px Arial"
    ctx.fillText(stringState.getCurrentString(), 400, 400)
    ctx.font = "16px Arial"
    stringState.getWordList().forEach((word, i) => {
      ctx.fillText(word, 400 + i * 50, 500)
    })
    
  }
  
  const draw = () => {
    const ctx = canvas.getContext('2d')
    drawGameArea(ctx)
    drawText(ctx)
  }

  return {
    initBoard,
    draw
  }
}

export default gameBoard
