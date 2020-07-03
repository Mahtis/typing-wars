export default ctx => {
  const { height, width } = ctx.canvas;

  const draw = () => {
    const origFill = ctx.fillStyle;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    ctx.fillText(
      "Waiting for opponent to connect...",
      width / 2,
      height / 2
    );    
    ctx.fillStyle = origFill;
  };

  return { draw };
};
