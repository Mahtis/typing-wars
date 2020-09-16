const wordBumpAnimation = word => {
  const widths = [4, 8, 4, 0];
  const frameDuration = 10;
  let currentFrame = 0;
  let lastTime = Date.now();
  let animationDone = false;

  const draw = (ctx, word, x, y, bumpDirection) => {
      const width = widths[currentFrame];
      ctx.drawImage(
        word,
        bumpDirection === 'left'? x : x  - ((word.width - width - word.width)),
        y,
        word.width - width,
        word.height
      );

    if (animationDone) return;

    const currentTime = Date.now();
    if (currentTime > lastTime + frameDuration) {
      currentFrame++;
      lastTime = currentTime;
    }

    if (currentFrame >= widths.length - 1) {
      animationDone = true;
    }
  };

  const isAnimationDone = () => animationDone;

  return { draw, isAnimationDone };
};

export default wordBumpAnimation;
