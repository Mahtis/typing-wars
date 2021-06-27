import Word from '../game_objects/Word';
import CollisionDetector from "../logic/CollisionDetector";

export default ctx => {
  const { height, width } = ctx.canvas;
  const col = CollisionDetector(500, 500);
  const word = Word('abcdefgrmtkl', 10, 1, 'id-1', col);

  const draw = (playerReady, opponentReady) => {
    const origFill = ctx.fillStyle;
    const origFont = ctx.font;
    
    ctx.clearRect(0, 0, width, height);

    word.draw(ctx);

    ctx.fillStyle = 'black';
    ctx.fillText(
      "Press Enter or Space when you're ready to start",
      width / 2,
      height / 2
    );
    ctx.fillText(
      "YOU: ",
      width / 2,
      height / 2 + 20
    );
    ctx.fillStyle = playerReady ? 'green' : 'red'
    ctx.fillText(
      playerReady ? 'READY' : 'NOT READY',
      width / 2 + 50,
      height / 2 + 20
    );

    ctx.fillStyle = 'black';

    ctx.fillText(
      "OPPONENT: ",
      width / 2,
      height / 2 + 40
    );
    ctx.fillStyle = opponentReady ? 'green' : 'red'
    ctx.fillText(
      opponentReady ? 'READY' : 'NOT READY',
      width / 2 + 100,
      height / 2 + 40
    );
    
    ctx.fillStyle = origFill;
    ctx.font = origFont;
  };

  return { draw };
};
