import Word from './Word';

describe('Word', () => {
  describe('creating a word', () => {
    let word;
    let collisionDetectorStub;

    const testCollision = (location, id) => {
      it('checks for collision', () => {
        expect(collisionDetectorStub.checkCollision).toHaveBeenCalledWith(
          location,
          id
        );
      });
    };

    beforeEach(() => {
      collisionDetectorStub = { checkCollision: jest.fn() };

      word = Word('word', 4, 2, 'some-id', collisionDetectorStub);
    });

    it('creates a word with proper hitbox', () => {
      expect(word.getHitbox()).toEqual({
        startX: 40,
        endX: 120,
        startY: 80,
        endY: 100
      });
    });

    it('should have an id', () => {
      expect(word.getId()).toBe('some-id');
    });

    it('should have correct word', () => {
      expect(word.getWord()).toBe('word');
    });

    it('creates word in correct rows and cols', () => {
      expect(word.getLocation()).toEqual({ x: 40, y: 80 });
    });

    it('status of word is initially "MOVING"', () => {
      expect(word.getStatus()).toEqual('MOVING');
    });

    // it('move, moves the word to given location', () => {
    //   word.move({ rows: [6], cols: [3, 4, 5, 6] });

    //   expect(word.getLocation()).toEqual({ rows: [6], cols: [3, 4, 5, 6] });
    // });

    describe('moving word left without collision', () => {
      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue(false);
        word.moveLeft();
      });

      testCollision({ startX: 20, endX: 100, startY: 80, endY: 100 }, 'some-id');

      it('moves word left', () => {
        expect(word.getLocation()).toEqual({ x: 20, y: 80 });
      });

      it('moves word hitbox left', () => {
        expect(word.getHitbox()).toEqual({ startX: 20, endX: 100, startY: 80, endY: 100 });
      });
    });

    describe('moving word left with collision', () => {
      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue(true);
        word.moveLeft();
      });

      testCollision({ startX: 20, endX: 100, startY: 80, endY: 100 }, 'some-id');

      it('does not move word left', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 80 });
      });
    });

    describe('moving the word right with no collision', () => {
      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue(false);
        word.moveRight();
      });

      it('moves word right', () => {
        expect(word.getLocation()).toEqual({ x: 60, y: 80 });
      });

      testCollision({ startX: 60, endX: 140, startY: 80, endY: 100 }, 'some-id');
    });

    describe('moving the word right with collision', () => {
      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue(true);
        word.moveRight();
      });

      it('does not move word right', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 80 });
      });

      testCollision({ startX: 60, endX: 140, startY: 80, endY: 100 }, 'some-id');
    });

    describe('moving word down with no collision', () => {
      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue(false);
        word.moveDown();
      });

      it('moves word down', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 100 });
      });

      testCollision({ startX: 40, endX: 120, startY: 100, endY: 120 }, 'some-id');
    });

    describe('moving the word down with collision', () => {
      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue(true);
        word.moveDown();
      });

      it('does not move word down', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 80 });
      });

      testCollision({ startX: 40, endX: 120, startY: 100, endY: 120 }, 'some-id');
    });

    describe('dropping the word', () => {
      beforeEach(() => {
        collisionDetectorStub.checkCollision
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true);
        word.drop();
      });

      it('drops the word until it collides with something', () => {
        expect(collisionDetectorStub.checkCollision.mock.calls.length).toBe(5);
      });

      it('word location should be correct', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 160 });
      });
    });

    it('destroying a word sets it as destroyed', () => {
      word.destroy();

      expect(word.getStatus()).toEqual('DESTROYED');
    });
  });
});
