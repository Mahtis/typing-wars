/**
 *
 * @param {[{sprite, duration}]} animationFrames
 */

const Animation = animationFrames => {
  let currentFrame = 0;
  let animationDone = false;
  let lastTime = Date.now();

  const draw = (ctx, x, y) => {
    if (animationDone) return;
    
    ctx.drawImage(animationFrames[currentFrame].sprite, x, y);

    const currentTime = Date.now();

    if (currentTime > lastTime + animationFrames[currentFrame].duration) {
      currentFrame++;
      lastTime = currentTime;
    }

    if (currentFrame >= animationFrames.length) {
      currentFrame = 0;
      animationDone = true;
    }
  };

  const isAnimationDone = () => animationDone;

  return {
    draw,
    isAnimationDone
  };
};

export default Animation;
