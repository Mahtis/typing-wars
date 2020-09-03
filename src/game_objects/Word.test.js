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

    const testOutOfBounds = location => {
      it('checks for out of bounds', () => {
        expect(collisionDetectorStub.isOutsideBoard).toHaveBeenCalledWith(
          location
        );
      });
    };

    beforeEach(() => {
      collisionDetectorStub = {
        checkCollision: jest.fn(),
        isOutsideBoard: jest.fn()
      };

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

    describe('moving word left without collision', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([]);
        word.moveLeft();
      });

      testCollision(
        { startX: 20, endX: 100, startY: 80, endY: 100 },
        'some-id'
      );

      it('moves word left', () => {
        expect(word.getLocation()).toEqual({ x: 20, y: 80 });
      });

      it('moves word hitbox left', () => {
        expect(word.getHitbox()).toEqual({
          startX: 20,
          endX: 100,
          startY: 80,
          endY: 100
        });
      });
    });

    describe('moving word left with collision', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([
          { some: 'object' }
        ]);
        word.moveLeft();
      });

      testOutOfBounds({ startX: 20, endX: 100, startY: 80, endY: 100 });

      testCollision(
        { startX: 20, endX: 100, startY: 80, endY: 100 },
        'some-id'
      );

      it('does not move word left', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 80 });
      });
    });

    describe('moving the word right with no collision', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([]);
        word.moveRight();
      });

      it('moves word right', () => {
        expect(word.getLocation()).toEqual({ x: 60, y: 80 });
      });

      testOutOfBounds({ startX: 60, endX: 140, startY: 80, endY: 100 });

      testCollision(
        { startX: 60, endX: 140, startY: 80, endY: 100 },
        'some-id'
      );
    });

    describe('moving the word right with collision', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([{some: 'object'}]);
        word.moveRight();
      });

      it('does not move word right', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 80 });
      });

      testOutOfBounds({ startX: 60, endX: 140, startY: 80, endY: 100 });

      testCollision(
        { startX: 60, endX: 140, startY: 80, endY: 100 },
        'some-id'
      );
    });

    describe('moving word down with no collision', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([]);
        word.moveDown();
      });

      it('moves word down', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 100 });
      });

      testOutOfBounds({ startX: 40, endX: 120, startY: 100, endY: 120 });

      testCollision(
        { startX: 40, endX: 120, startY: 100, endY: 120 },
        'some-id'
      );
    });

    describe('moving the word down with collision', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([{some: 'object'}]);
        word.moveDown();
      });

      it('does not move word down', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 80 });
      });

      testOutOfBounds(
        { startX: 40, endX: 120, startY: 100, endY: 120 },
      );

      testCollision(
        { startX: 40, endX: 120, startY: 100, endY: 120 },
        'some-id'
      );
    });

    describe('dropping the word', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
        collisionDetectorStub.checkCollision.mockReturnValue([]);
        word.drop();
      });

      it('drops the word until it is outside board with something', () => {
        expect(collisionDetectorStub.isOutsideBoard.mock.calls.length).toBe(5);
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
