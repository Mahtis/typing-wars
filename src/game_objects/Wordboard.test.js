import Wordboard from './Wordboard';
import Word from './Word';
import { range } from '../util';

describe('Wordboard', () => {
  let wordboard;

  beforeEach(() => {
    wordboard = Wordboard(20, 10);
  });

  it('creating a wordboard, creates an empty board', () => {
    expect(wordboard.getWords()).toEqual([]);
  });

  it('trying to move active word right does nothing', () => {
    expect(() => wordboard.moveActiveWordRight()).not.toThrow();
  });

  it('trying to move active word left does nothing', () => {
    expect(() => wordboard.moveActiveWordLeft()).not.toThrow();
  });

  describe('adding a word', () => {
    beforeEach(() => {
      wordboard.addWord('word');
    });

    it('adds only one word to board', () => {
      expect(wordboard.getWords().length).toBe(1);
    });

    it('creates a word object at the top of the board', () => {
      const word = wordboard.getWords()[0];

      expect(word.getLocation()).toEqual({ x: 0, y: 0 });
    });

    describe('adding other words', () => {
      beforeEach(() => {
        wordboard.addWord('otherWord');
        wordboard.addWord('third');
        wordboard.addWord('fourth');
      });

      it('adds the last word to the top of the board', () => {
        const lastWord = wordboard.getWords()[3];

        expect(lastWord.getLocation()).toEqual({ x: 0, y: 0 });
      });

      it('moves the first word down out of the way of new words', () => {
        const firstWord = wordboard.getWords()[0];

        expect(firstWord.getLocation()).toEqual({ x: 0, y: 20 * 3 });
      });

      describe('dropping word', () => {
        beforeEach(() => {
          wordboard.dropActiveWord();
        });

        it('drops the active/lowest word', () => {
          const firstWord = wordboard.getWords()[0];

          expect(firstWord.getLocation()).toEqual({ x: 0, y: 180 });
        });

        it('does not move the second word', () => {
          const secondWord = wordboard.getWords()[1];

          expect(secondWord.getLocation()).toEqual({ x: 0, y: 40 });
        });

        describe('dropping another word', () => {
          beforeEach(() => {
            wordboard.dropActiveWord();
          });

          it('does not move the previously dropped word', () => {
            const previouslyDroppedWord = wordboard.getWords()[0];

            expect(previouslyDroppedWord.getLocation()).toEqual({
              x: 0,
              y: 180
            });
          });

          it('drops the now active/lowest word on top of the previous word', () => {
            const activeWord = wordboard.getWords()[1];

            expect(activeWord.getLocation()).toEqual({ x: 0, y: 160 });
          });

          describe('moving the words down', () => {
            beforeEach(() => {
              wordboard.moveWordsDown();
            });

            it('moves both dropping words down one row', () => {
              const wordThree = wordboard.getWords()[2].getLocation();
              const wordFour = wordboard.getWords()[3].getLocation();
              const droppingWords = [wordThree, wordFour];

              expect(droppingWords).toEqual([
                { x: 0, y: 40 },
                { x: 0, y: 20 }
              ]);
            });

            it('does not move the stationary words', () => {
              const wordOne = wordboard.getWords()[0].getLocation();
              const wordTwo = wordboard.getWords()[1].getLocation();
              const droppingWords = [wordOne, wordTwo];

              expect(droppingWords).toEqual([
                { x: 0, y: 180 },
                { x: 0, y: 160 }
              ]);
            });

            describe('moving words down until they reach the stationary words', () => {
              beforeEach(() => {
                wordboard.moveWordsDown();
                wordboard.moveWordsDown();
                wordboard.moveWordsDown();
                wordboard.moveWordsDown();
                wordboard.moveWordsDown();
              });

              it('moves the dropping words accordingly', () => {
                const wordThree = wordboard.getWords()[2].getLocation();
                const wordFour = wordboard.getWords()[3].getLocation();
                const droppingWords = [wordThree, wordFour];

                expect(droppingWords).toEqual([
                  { x: 0, y: 140 },
                  { x: 0, y: 120 }
                ]);
              });

              it('moving words down still, does not move them further', () => {
                wordboard.moveWordsDown();

                const wordThree = wordboard.getWords()[2].getLocation();
                const wordFour = wordboard.getWords()[3].getLocation();
                const droppingWords = [wordThree, wordFour];

                expect(droppingWords).toEqual([
                  { x: 0, y: 140 },
                  { x: 0, y: 120 }
                ]);
              });
            });
          });
        });
      });
    });
  });

  it('should be able to set words for board', () => {
    wordboard.setWords([
      { word: 'one', row: 9, col: 0 },
      { word: 'two', row: 7, col: 3 },
      { word: 'three', row: 6, col: 10 }
    ]);

    expect(wordboard.getWords().length).toBe(3);
  });

  describe('board with a dropping word on left side', () => {
    beforeEach(() => {
      wordboard.setWords([
        { word: 'one', row: 6, col: 0 },
        { word: 'two', row: 4, col: 0 },
        { word: 'three', row: 3, col: 0 }
      ]);
    });

    it('moving the active word right, moves only it one column right', () => {
      wordboard.moveActiveWordRight();
      const locations = wordboard.getWords().map(word => word.getLocation());

      expect(locations).toEqual([
        { x: 20, y: 120 },
        { x: 0, y: 80 },
        { x: 0, y: 60 }
      ]);
    });

    it('moving the active word left does nothing', () => {
      wordboard.moveActiveWordLeft();
      const locations = wordboard.getWords().map(word => word.getLocation());

      expect(locations).toEqual([
        { x: 0, y: 120 },
        { x: 0, y: 80 },
        { x: 0, y: 60 }
      ]);
    });
  });

  describe('board with a dropping word on right side', () => {
    beforeEach(() => {
      wordboard.setWords([
        { word: 'one', row: 6, col: 17 },
        { word: 'two', row: 4, col: 0 },
        { word: 'three', row: 3, col: 0 }
      ]);
    });

    it('moving the active word right does nothing', () => {
      wordboard.moveActiveWordRight();
      const locations = wordboard.getWords().map(word => word.getLocation());

      expect(locations).toEqual([
        { x: 340, y: 120 },
        { x: 0, y: 80 },
        { x: 0, y: 60 }
      ]);
    });

    it('moving the active word left, moves only it one column left', () => {
      wordboard.moveActiveWordLeft();
      const locations = wordboard.getWords().map(word => word.getLocation());

      expect(locations).toEqual([
        { x: 320, y: 120 },
        { x: 0, y: 80 },
        { x: 0, y: 60 }
      ]);
    });
  });

  describe('board with a word on left and right side at bottom', () => {
    beforeEach(() => {
      wordboard.setWords([
        { word: 'word', row: 9, col: 16 },
        { word: 'lookatmy', row: 9, col: 0 },
        { word: 'verylong', row: 5, col: 8 }
      ]);
    });

    describe('moving words down and dropping middle word', () => {
      beforeEach(() => {
        wordboard.moveWordsDown();
        wordboard.dropActiveWord();
      });

      it('result in a board with a single word', () => {
        expect(wordboard.getWords().length).toBe(1);
      });

      it('produces a word that is a combination of all three words', () => {
        expect(wordboard.getWords()[0].getWord()).toBe('lookatmyverylongword');
      });
    });

    describe('moving words down until all are at the bottom', () => {
      beforeEach(() => {
        wordboard.moveWordsDown();
        wordboard.moveWordsDown();
        wordboard.moveWordsDown();
        wordboard.moveWordsDown();
        wordboard.moveWordsDown();
      });

      it('result in a board with a single word', () => {
        expect(wordboard.getWords().length).toBe(1);
      });

      it('produces a word that is a combination of all three words', () => {
        expect(wordboard.getWords()[0].getWord()).toBe('lookatmyverylongword');
      });
    });
  });

  describe('rotating a word', () => {
    beforeEach(() => {
      wordboard.setWords([
        { word: 'word', row: 1, col: 0 },
        { word: 'otherword', row: 0, col: 0 }
      ]);

      wordboard.rotateActiveWord();
    });

    it('should rotate the active word', () => {
      expect(wordboard.getWords()[0].getOrientation()).toBe('VERTICAL');
    });

    it('should not rotate other words', () => {
      expect(wordboard.getWords()[1].getOrientation()).toBe('HORIZONTAL');
    });

    it('roating vertical word too close to wall, does not rotate the word', () => {
      range(0, 17).forEach(() => wordboard.moveActiveWordRight());
      wordboard.rotateActiveWord();

      expect(wordboard.getActiveWord().getOrientation()).toBe('VERTICAL');
    });
  });
});
