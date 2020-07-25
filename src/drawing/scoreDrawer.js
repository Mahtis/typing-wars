export default (ctx, scoreTracker) => {
  const scoreLocation = { x: 500, y: 40 }
  const streakLocation = { x: 500, y: 60 }
  
  const draw = () => {
    const origFont = ctx.font;
    const origFill = ctx.fillStyle;
    
    ctx.fillStyle = '#d3c1b5';
    ctx.font = '20px VCR OSD Mono';
    ctx.fillText('score:' + scoreTracker.getScore(), scoreLocation.x, scoreLocation.y);
    ctx.fillText('streak:' + scoreTracker.getStreak(), streakLocation.x, streakLocation.y);
    ctx.fillStyle = '#ab9c93';
    ctx.fillText('score:' + scoreTracker.getScore(), scoreLocation.x + 2, scoreLocation.y);
    ctx.fillText('streak:' + scoreTracker.getStreak(), streakLocation.x + 2, streakLocation.y);

    ctx.font = origFont;
    ctx.fillStyle = origFill;
  };

  return { draw };
};