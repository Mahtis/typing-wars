export default (ctx, scoreTracker) => {
  const scoreLocation = { x: ctx.canvas.width - 100, y: 20 }
  const streakLocation = { x: ctx.canvas.width - 100, y: 40 }
  const draw = () => {
    ctx.fillText('score:' + scoreTracker.getScore(), scoreLocation.x, scoreLocation.y);
    ctx.fillText('streak:' + scoreTracker.getStreak(), streakLocation.x, streakLocation.y);
  };

  return { draw };
};