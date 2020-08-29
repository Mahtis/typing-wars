import Word from './Word';

describe('Word', () => {
  describe('creating a word', () => {
    let word;

    beforeEach(() => {
      word = Word('word', 4, 2, 'some-id');
    });

    it('creates a word with proper hitbox', () => {
      expect(word.getHitbox().getHitboxCoordinates()).toEqual({
        startX: 40,
        endX: 120,
        startY: 80,
        endY: 100
      });
    });

    it('should have an id', () => {
      expect(word.getId()).toBe('some-id');
    });

    it('creates word in correct rows and cols', () => {
      expect(word.getLocation()).toEqual({ rows: [4], cols: [2, 3, 4, 5] });
    });

    it('status of word is initially "MOVING"', () => {
      expect(word.getStatus()).toEqual('MOVING');
    });

    it('move, moves the word to given location', () => {
      word.move({ rows: [6], cols: [3, 4, 5, 6] });

      expect(word.getLocation()).toEqual({ rows: [6], cols: [3, 4, 5, 6] });
    });

    describe('moving the word left with no collision', () => {
      beforeEach(() => {
        word.moveLeft();
      });

      it('moves word left', () => {
        expect(word.getLocation()).toEqual({ cols: [1, 2, 3, 4], rows: [4] });
      });
    });

    describe('moving the word right with no collision', () => {
      beforeEach(() => {
        word.moveRight();
      });

      it('moves word right', () => {
        expect(word.getLocation()).toEqual({ cols: [3, 4, 5, 6], rows: [4] });
      });
    });

    it('moving word down, moves it down one row', () => {
      const moveDown = word.getMoveDown();

      expect(moveDown).toEqual({ cols: [2, 3, 4, 5], rows: [5] });
    });

    it('destroying a word sets it as destroyed', () => {
      word.destroy();

      expect(word.getStatus()).toEqual('DESTROYED');
    });
  });
});
