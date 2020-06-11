export default (ctx, moveOnCallback) => {
  let lastTime = Date.now();
  let currentTime = Date.now();
  const timeBetweenFrames = 1000;

  const { height, width } = ctx.canvas;

  const sequenceImages = [
    { draw: (ctx) => ctx.fillText('GO', width / 2, height / 2), n: 'go' },
    { draw: (ctx) => ctx.fillText('1', width / 2, height / 2), n: '1' },
    { draw: (ctx) => ctx.fillText('2', width / 2, height / 2), n: '2' },
    { draw: (ctx) => ctx.fillText('3', width / 2, height / 2), n: '3' }
  ];

  let currentFrame = sequenceImages.pop();

  const draw = () => {
    currentTime = Date.now();
    if (currentTime > lastTime + timeBetweenFrames) {
      currentFrame = sequenceImages.pop();
      lastTime = currentTime;
    }
    if (currentFrame) {
      ctx.clearRect(0, 0, width, height);
      currentFrame.draw(ctx);
    } else {
      moveOnCallback();
    }
  };

  return { draw };
};
