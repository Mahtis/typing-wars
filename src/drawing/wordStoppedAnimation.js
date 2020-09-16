const wordStoopedAnimation = word => {
  const sizes = [
    { width: 2, height: 2 },
    { width: 4, height: 4 },
    { width: 8, height: 6 },
    { width: 4, height: 4 },
    { width: 2, height: 2 },
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

  const isAnimationDone = () => animationDone;

  return { draw, isAnimationDone };
};

export default wordStoopedAnimation;
