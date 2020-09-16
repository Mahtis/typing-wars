const wordCreatedAnimation = word => {
  const scales = [0.1, 0.5, 0.8, 1.3, 1.1, 1];
  const frameDuration = 10;
  let currentFrame = 0;
  let lastTime = Date.now();
  let animationDone = false;

  const draw = (ctx, word, x, y) => {
      const curScale = scales[currentFrame];
      ctx.drawImage(
        word,
        x - ((word.width * curScale - word.width) / 2),
        y - ((word.height * curScale - word.height) / 2),
        word.width * curScale,
        word.height * curScale
      );

    if (animationDone) return;

    const currentTime = Date.now();
    if (currentTime > lastTime + frameDuration) {
      currentFrame++;
      lastTime = currentTime;
    }

    if (currentFrame >= scales.length - 1) {
      animationDone = true;
    }
  };

  const isAnimationDone = () => animationDone;

  return { draw, isAnimationDone };
};

export default wordCreatedAnimation;
