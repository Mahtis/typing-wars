import Word, { dependencies } from './Word';

jest.mock('../drawing/SpriteProvider');

describe('Word', () => {
  describe('creating a word', () => {
    let word;
    let collisionDetectorStub;
    let wordDrawerStub;
    let drawMock;

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
      drawMock = jest.fn();
      wordDrawerStub = () => ({ draw: drawMock });
      dependencies.wordDrawer = wordDrawerStub;
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

    it('by default initialises WordDrawer with type "NORMAL"', () => {
      const wordDrawerMock = jest.fn();
      dependencies.wordDrawer = wordDrawerMock;

      Word('test', 1, 1, '1', () => {});

      expect(wordDrawerMock).toHaveBeenCalledWith('test', 'NORMAL');
    });

    it('if word is NORMAL type, first draw is called with no state', () => {
      word.draw({});
      expect(drawMock).toHaveBeenCalledWith(
        {},
        { x: 40, y: 80 },
        'HORIZONTAL',
        ''
      );
    });

    it('given word is not type NORMAL, first draw is called with no state', () => {
      const receivedWord = Word('test', 9, 0, '1', () => {}, 'RECEIVED');

      receivedWord.draw({});

      expect(drawMock).toHaveBeenCalledWith(
        {},
        { x: 0, y: 180 },
        'HORIZONTAL',
        ''
      );
    });

    it('orientation is initially HORIZONTAL', () => {
      expect(word.getOrientation()).toEqual('HORIZONTAL');
    });

    it('knows own row location based on first character', () => {
      expect(word.getRow()).toBe(4);
    });

    it('knows own location as array of rows', () => {
      expect(word.getRows()).toEqual([4]);
    });

    it('knows own col location based on first character', () => {
      expect(word.getCol()).toBe(2);
    });

    it('knows own location as array of columns', () => {
      expect(word.getCols()).toEqual([2, 3, 4, 5]);
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

      it('calls word drawer with bumpLeft on next draw', () => {
        word.draw({});
        expect(drawMock).toHaveBeenCalledWith(
          {},
          { x: 40, y: 80 },
          'HORIZONTAL',
          'bumpLeft'
        );
      });

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
        collisionDetectorStub.checkCollision.mockReturnValue([
          { some: 'object' }
        ]);
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

      it('calls word drawer with bumpRight on next draw', () => {
        word.draw({});
        expect(drawMock).toHaveBeenCalledWith(
          {},
          { x: 40, y: 80 },
          'HORIZONTAL',
          'bumpRight'
        );
      });
    });

    describe('moving word up', () => {
      beforeEach(() => {
        word.moveUp();
      });

      it('moves word up', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 60 });
      });
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
        collisionDetectorStub.checkCollision.mockReturnValue([
          { some: 'object' }
        ]);
        word.moveDown();
      });

      it('does not move word down', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 80 });
      });

      testOutOfBounds({ startX: 40, endX: 120, startY: 100, endY: 120 });

      testCollision(
        { startX: 40, endX: 120, startY: 100, endY: 120 },
        'some-id'
      );

      it('calls word drawer with bumpDown on next draw', () => {
        word.draw({});
        expect(drawMock).toHaveBeenCalledWith(
          {},
          { x: 40, y: 80 },
          'HORIZONTAL',
          'bumpDown'
        );
      });
    });

    describe('dropping the word without collisions on the way down', () => {
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

      it('drops the word until it is outside board', () => {
        expect(collisionDetectorStub.isOutsideBoard.mock.calls.length).toBe(5);
      });

      it('word location should be correct', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 160 });
      });
    });

    describe('dropping the word with collision before last row', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision
          .mockReturnValueOnce([])
          .mockReturnValueOnce([])
          .mockReturnValueOnce([])
          .mockReturnValueOnce([{ some: 'object' }]);
        word.drop();
      });

      it('drops the word until it hits something', () => {
        expect(collisionDetectorStub.isOutsideBoard.mock.calls.length).toBe(4);
      });

      it('drops the word until it hits something', () => {
        expect(collisionDetectorStub.checkCollision.mock.calls.length).toBe(4);
      });

      testCollision(
        { startX: 40, endX: 120, startY: 100, endY: 120 },
        'some-id'
      );

      testCollision(
        { startX: 40, endX: 120, startY: 120, endY: 140 },
        'some-id'
      );

      testCollision(
        { startX: 40, endX: 120, startY: 140, endY: 160 },
        'some-id'
      );

      testCollision(
        { startX: 40, endX: 120, startY: 160, endY: 180 },
        'some-id'
      );

      it('word location should be correct', () => {
        expect(word.getLocation()).toEqual({ x: 40, y: 140 });
      });
    });

    describe('checking left', () => {
      let collisions;

      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue([
          { some: 'object' },
          { some: 'other-object' }
        ]);

        collisions = word.checkLeft();
      });

      it('returns array of objects the word would collide with if it was moved left', () => {
        expect(collisions).toEqual([
          { some: 'object' },
          { some: 'other-object' }
        ]);
      });

      testCollision(
        { startX: 20, endX: 100, startY: 80, endY: 100 },
        'some-id'
      );
    });

    describe('checking right', () => {
      let collisions;

      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue([
          { some: 'object' },
          { some: 'other-object' }
        ]);

        collisions = word.checkRight();
      });

      it('returns array of objects the word would collide with if it was moved right', () => {
        expect(collisions).toEqual([
          { some: 'object' },
          { some: 'other-object' }
        ]);
      });

      testCollision(
        { startX: 60, endX: 140, startY: 80, endY: 100 },
        'some-id'
      );
    });

    describe('checking down', () => {
      let collisions;

      beforeEach(() => {
        collisionDetectorStub.checkCollision.mockReturnValue([
          { some: 'object' },
          { some: 'other-object' }
        ]);

        collisions = word.checkDown();
      });

      it('returns array of objects the word would collide with if it was moved down', () => {
        expect(collisions).toEqual([
          { some: 'object' },
          { some: 'other-object' }
        ]);
      });

      testCollision(
        { startX: 40, endX: 120, startY: 100, endY: 120 },
        'some-id'
      );
    });

    describe('rotating word without collision or out of bounds', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([]);
        word.rotate();
      });

      testCollision({ startX: 40, endX: 60, startY: 20, endY: 100 }, 'some-id');

      testOutOfBounds({ startX: 40, endX: 60, startY: 20, endY: 100 });

      it('changes word orientation to VERTICAL', () => {
        expect(word.getOrientation()).toBe('VERTICAL');
      });

      it('rotating again changes orientation back to HORIZONTAL', () => {
        word.rotate();

        expect(word.getOrientation()).toBe('HORIZONTAL');
      });

      it('getting rows returns correctly the based on where first character is located on', () => {
        expect(word.getRows()).toEqual([4, 3, 2, 1]);
      });

      it('getting cols returns only one col', () => {
        expect(word.getCols()).toEqual([2]);
      });
    });

    describe('rotating word with collision', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([
          { some: 'object' }
        ]);
        word.rotate();
      });

      testCollision({ startX: 40, endX: 60, startY: 20, endY: 100 }, 'some-id');

      testOutOfBounds({ startX: 40, endX: 60, startY: 20, endY: 100 });

      it('does not change word orientation', () => {
        expect(word.getOrientation()).toBe('HORIZONTAL');
      });
    });

    describe('rotating word with out of bounds', () => {
      beforeEach(() => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(true);
        collisionDetectorStub.checkCollision.mockReturnValue([]);
        word.rotate();
      });

      testOutOfBounds({ startX: 40, endX: 60, startY: 20, endY: 100 });

      it('does not change word orientation', () => {
        expect(word.getOrientation()).toBe('HORIZONTAL');
      });
    });

    // it('destroying a word sets it as destroyed', () => {
    //   word.destroy();

    //   expect(word.getStatus()).toEqual('DESTROYED');
    // });

    describe('splitting the word on a row', () => {
      let splitWords;

      describe('given the word is horizontally oriented', () => {
        beforeEach(() => {
          splitWords = word.splitOnRow(4);
        });

        it('returns an object with the current word and its details', () => {
          expect(splitWords).toEqual([
            {
              word: 'word',
              row: 4,
              col: 2,
              orientation: 'HORIZONTAL'
            }
          ]);
        });
      });

      describe('given the word is vertically oriented', () => {
        beforeEach(() => {
          collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
          collisionDetectorStub.checkCollision.mockReturnValue([]);
          word.rotate();
        });

        it('if splitting at the top most character, returns two words', () => {
          splitWords = word.splitOnRow(1);

          expect(splitWords).toEqual([
            {
              word: 'd',
              row: 1,
              col: 2,
              orientation: 'VERTICAL'
            },
            {
              word: 'wor',
              row: 4,
              col: 2,
              orientation: 'VERTICAL'
            }
          ]);
        });

        it('if splitting at a middle character, returns three words', () => {
          splitWords = word.splitOnRow(3);
          expect(splitWords).toEqual([
            {
              word: 'rd',
              row: 2,
              col: 2,
              orientation: 'VERTICAL'
            },
            {
              word: 'o',
              row: 3,
              col: 2,
              orientation: 'VERTICAL'
            },
            {
              word: 'w',
              row: 4,
              col: 2,
              orientation: 'VERTICAL'
            }
          ]);
        });

        it('if splitting at the bottom most character, returns two words', () => {
          splitWords = word.splitOnRow(4);
          expect(splitWords).toEqual([
            {
              word: 'ord',
              row: 3,
              col: 2,
              orientation: 'VERTICAL'
            },
            {
              word: 'w',
              row: 4,
              col: 2,
              orientation: 'VERTICAL'
            }
          ]);
        });
      });
    });

    describe('splitting a word by rows', () => {
      it('should return an array with the word, if there word is horizontally oriented', () => {
        expect(word.splitToWordsByRows()).toEqual([
          { word: 'word', row: 4, col: 2 }
        ]);
      });

      it('should return array of each letter, if the word is vertically oriented', () => {
        collisionDetectorStub.isOutsideBoard.mockReturnValue(false);
        collisionDetectorStub.checkCollision.mockReturnValue([]);
        word.rotate();

        expect(word.splitToWordsByRows()).toEqual([
          { word: 'w', row: 4, col: 2 },
          { word: 'o', row: 3, col: 2 },
          { word: 'r', row: 2, col: 2 },
          { word: 'd', row: 1, col: 2 }
        ]);
      });
    });
  });
});
