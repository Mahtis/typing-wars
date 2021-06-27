const wordStoopedAnimation = word => {
  const sizes = [
    { width: 6, height: 2 },
    { width: 12, height: 4 },
    { width: 18, height: 6 },
    { width: 10, height: 4 },
    { width: 6, height: 2 },
    { width: 0, height: 0 }
  ];
  const frameDuration = 10;
  let currentFrame = 0;
  let lastTime = Date.now();
  let animationDone = false;

  const draw = (ctx, word, x, y) => {
    const { width, height } = sizes[currentFrame];
    ctx.drawImage(
      word,
      x - ((word.width + width - word.width) / 2),
      y - ((word.height - height - word.height)),
      word.width + width,
      word.height - height
    );

    if (animationDone) return;

    const currentTime = Date.now();
    if (currentTime > lastTime + frameDuration) {
      currentFrame++;
      lastTime = currentTime;
    }

    if (currentFrame >= sizes.length - 1) {
      animationDone = true;
    }
  };

  const start = () => {
    animationDone = false;
    currentFrame = 0;
  }

  const isAnimationDone = () => animationDone;

  return { draw, isAnimationDone, start };
};

export default wordStoopedAnimation;
