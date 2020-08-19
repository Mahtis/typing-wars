import boardStateHandler from './boardStateHandler';

const EMPTY_BOARD = [
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    '
];

const BOARD_WITH_WORDS = [
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                    ',
  '                   p',
  '                   u',
  '   some  world     o',
  '      Hello        g'
];

describe('gameState', () => {
  let gameState;
  let endMatchMock;

  it('initializes a word board with given dimensions', () => {
    gameState = boardStateHandler(5, 10);

    expect(gameState.getWordBoard()).toEqual([
      '          ',
      '          ',
      '          ',
      '          ',
      '          '
    ]);
  });

  beforeEach(() => {
    endMatchMock = jest.fn();

    gameState = boardStateHandler(10, 20, endMatchMock, 3);
  });

  it('initially word board is an empty 10 x 20 string array', () => {
    expect(gameState.getWordBoard()).toEqual(EMPTY_BOARD);
  });

  describe('adding a new word', () => {
    it('spawns it at the top of the board', () => {
      gameState.addWord('word');

      expect(gameState.getWordBoard()).toEqual([
        'word                ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('if the word is the only word on board, it becomes the active word, i.e. moving word right moves it right', () => {
      gameState.addWord('word');
      gameState.moveWordRight();

      expect(gameState.getWordBoard()).toEqual([
        ' word               ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('if the word is not the only word on board, moving word right does not move the added word right', () => {
      gameState.addWord('first');
      gameState.addWord('second');
      gameState.moveWordRight();

      expect(gameState.getWordBoard()).toEqual([
        'second              ',
        ' first              ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('adding two words in a row moves moves the first one down first', () => {
      gameState.addWord('FirstWord');
      gameState.addWord('SecondWord');

      expect(gameState.getWordBoard()).toEqual([
        'SecondWord          ',
        'FirstWord           ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('all words not at the bottom move down a row when a new word is added', () => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'HORIZONTAL', char: 10, row: 6 },
        { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 4 },
        { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
        { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 1 },
        { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 0 }
      ]);
      gameState.addWord('SixthWord');

      expect(gameState.getWordBoard()).toEqual([
        'SixthWord           ',
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '    SecondWord      ',
        '                    ',
        '          FirstWord ',
        '                    ',
        '                    '
      ]);
    });
  });

  describe('moving words down', () => {
    it('moves the dropping words down one row', () => {
      gameState.addWord('myWord');
      gameState.moveWordsDown();

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        'myWord              ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('moves only words that have room to drop down', () => {
      gameState.setWordBoard(
        [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          'anotherWord         ',
          'bottomWord          '
        ],
        [
          { word: 'FirstWord', orientation: 'VERTICAL', char: 18, row: 9 },
          { word: 'SecondWord', orientation: 'HORIZONTAL', char: 2, row: 7 },
          { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 }
        ]
      );

      gameState.moveWordsDown();

      expect(gameState.getWordBoard()).toEqual([
        '                    ', // 0
        '                  d ', // 1
        '                  r ', // 2
        '                  o ', // 3
        'ThirdWord         W ', // 4
        '                  t ', // 5
        '                  s ', // 6
        '  SecondWord      r ', // 7
        'anotherWord       i ', // 8
        'bottomWord        F ' // 9
      ]);
    });

    it('all words not at the bottom move down a row when a new word is added', () => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'HORIZONTAL', char: 10, row: 9 },
        { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 8 },
        { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 7 },
        { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
        { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 2 }
      ]);
      gameState.moveWordsDown();
      gameState.moveWordsDown();
      gameState.moveWordsDown();

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        'FifthWord           ',
        'FourthWord          ',
        'ThirdWord           ',
        '    SecondWord      ',
        '          FirstWord '
      ]);
    });
  });

  it('a vertical word is drawn correctly and over all other words above', () => {
    gameState.setWordBoard(EMPTY_BOARD, [
      { word: 'FirstWord', orientation: 'VERTICAL', char: 10, row: 6 },
      { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 4 },
      { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
      { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 1 },
      { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 0 }
    ]);
    gameState.moveWordsDown();

    expect(gameState.getWordBoard()).toEqual([
      '          r         ',
      'FifthWord o         ',
      'FourthWordW         ',
      '          t         ',
      'ThirdWord s         ',
      '    Secondrord      ',
      '          i         ',
      '          F         ',
      '                    ',
      '                    '
    ]);
  });

  describe('rotating a word', () => {
    beforeEach(() => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'HORIZONTAL', char: 10, row: 6 },
        { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 4 },
        { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
        { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 1 },
        { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 0 }
      ]);
      gameState.rotateWord();
    });

    it('if the first dropping word is horizontal, rotates it to vertical', () => {
      expect(gameState.getWordBoard()).toEqual([
        'FifthWord o         ',
        'FourthWordW         ',
        '          t         ',
        'ThirdWord s         ',
        '    Secondrord      ',
        '          i         ',
        '          F         ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('if the first dropping word is vertical, rotates it to horizontal', () => {
      gameState.rotateWord();

      expect(gameState.getWordBoard()).toEqual([
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '    SecondWord      ',
        '                    ',
        '          FirstWord ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('if the active word is vertical and at the right edge of the board, does not rotate it', () => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'VERTICAL', char: 19, row: 6 }
      ]);

      gameState.rotateWord();

      expect(gameState.getWordBoard()).toEqual([
        '                   o',
        '                   W',
        '                   t',
        '                   s',
        '                   r',
        '                   i',
        '                   F',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('if the active word is vertical and on the right side there is a word that it would intercept if rotated, does not rotate it', () => {
      gameState.setWordBoard(
        [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '     Y              ',
          '     Y              ',
          '     Y              ',
          '     Y              ',
          '     Y              '
        ],
        [{ word: 'XXX', orientation: 'VERTICAL', char: 3, row: 6 }]
      );

      gameState.rotateWord();

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '   X                ',
        '   X Y              ',
        '   X Y              ',
        '     Y              ',
        '     Y              ',
        '     Y              '
      ]);
    });
  });

  describe('moving a word right', () => {
    beforeEach(() => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'HORIZONTAL', char: 10, row: 6 },
        { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 4 },
        { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
        { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 1 },
        { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 0 }
      ]);

      gameState.moveWordRight();
    });

    it('moves the first dropping word one space right', () => {
      expect(gameState.getWordBoard()).toEqual([
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '    SecondWord      ',
        '                    ',
        '           FirstWord',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('does not move the first dropping word if it is already at edge', () => {
      gameState.moveWordRight();

      expect(gameState.getWordBoard()).toEqual([
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '    SecondWord      ',
        '                    ',
        '           FirstWord',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('moves the active word right if it vertical', () => {
      gameState.rotateWord();
      gameState.moveWordRight();

      expect(gameState.getWordBoard()).toEqual([
        'FifthWord   o       ',
        'FourthWord  W       ',
        '            t       ',
        'ThirdWord   s       ',
        '    SecondWord      ',
        '            i       ',
        '            F       ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('does not move the active word right if there is a blocking word on the right side', () => {
      gameState.setWordBoard(
        [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '      wordOnRight   '
        ],
        [{ word: 'XX', orientation: 'HORIZONTAL', char: 4, row: 9 }]
      );

      gameState.moveWordRight();

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '    XXwordOnRight   '
      ]);
    });

    it('does not move a vertical active word right if there is a blocking word on the right side', () => {
      gameState.setWordBoard(
        [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          ' YYYYYYYYY          ',
          '      YYY           '
        ],
        [{ word: 'XX', orientation: 'VERTICAL', char: 0, row: 9 }]
      );

      gameState.moveWordRight();

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        'XYYYYYYYYY          ',
        'X     YYY           '
      ]);
    });
  });

  describe('moving a word left', () => {
    beforeEach(() => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'HORIZONTAL', char: 10, row: 6 },
        { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 4 },
        { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
        { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 1 },
        { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 0 }
      ]);

      gameState.moveWordLeft();
    });

    it('moves the first dropping word one space left', () => {
      expect(gameState.getWordBoard()).toEqual([
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '    SecondWord      ',
        '                    ',
        '         FirstWord  ',
        '                    ',
        '                    ',
        '                    '
      ]);
    });

    it('does not move the first dropping word if it is already at edge', () => {
      gameState.dropWord();
      gameState.dropWord();
      gameState.moveWordLeft();

      expect(gameState.getWordBoard()).toEqual([
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '    SecondWord      ',
        '         FirstWord  '
      ]);
    });

    it('does not move the active word left if there is a blocking word on the left side', () => {
      gameState.setWordBoard(
        [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          ' wordOnLeft         '
        ],
        [{ word: 'XX', orientation: 'HORIZONTAL', char: 11, row: 9 }]
      );

      gameState.moveWordLeft();

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        ' wordOnLeftXX       '
      ]);
    });
  });

  describe('dropping a word down', () => {
    beforeEach(() => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'HORIZONTAL', char: 10, row: 6 },
        { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 4 },
        { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
        { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 1 },
        { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 0 }
      ]);

      gameState.dropWord();
    });

    it('drops only the lowest word down', () => {
      expect(gameState.getWordBoard()).toEqual([
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '    SecondWord      ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '          FirstWord '
      ]);
    });

    it('if there is a word below the dropped one, drops on top of the below one', () => {
      gameState.dropWord();

      expect(gameState.getWordBoard()).toEqual([
        'FifthWord           ',
        'FourthWord          ',
        '                    ',
        'ThirdWord           ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '    SecondWord      ',
        '          FirstWord '
      ]);
    });

    it('if the word is vertical, drops correctly', () => {
      gameState.rotateWord();
      gameState.moveWordRight();
      gameState.moveWordRight();
      gameState.moveWordRight();
      gameState.moveWordRight();
      gameState.moveWordRight();
      gameState.moveWordRight();
      gameState.dropWord();

      expect(gameState.getWordBoard()).toEqual([
        'FifthWord r         ',
        'FourthWordo         ',
        '          W         ',
        'ThirdWord d         ',
        '          n         ',
        '          o         ',
        '          c         ',
        '          e         ',
        '          S         ',
        '          FirstWord '
      ]);
    });
  });

  describe('match end row', () => {
    describe('given a dropping word is at the match ending row', () => {
      beforeEach(() => {
        gameState.setWordBoard(
          [
            '                    ',
            '                    ',
            '                    ',
            '                    ',
            'YYY                 ',
            'YYY                 ',
            'YYY                 ',
            'YYYYY               ',
            ' YYYYYYYYY          ',
            '      YYY           '
          ],
          [
            { word: 'LongWord', orientation: 'HORIZONTAL', char: 10, row: 4 },
            { word: 'XX', orientation: 'HORIZONTAL', char: 0, row: 3 }
          ]
        );
      });

      it('does not call the match end function', () => {
        expect(endMatchMock).not.toHaveBeenCalled();
      });

      it('if the word turns from dropping to stationary, calls the match end function', () => {
        gameState.moveWordsDown();

        expect(endMatchMock).toHaveBeenCalled();
      });

      it('if a word is dropped and that puts it above the match end row, calls the match end function', () => {
        gameState.dropWord();
        gameState.dropWord();

        expect(endMatchMock).toHaveBeenCalled();
      });

      it('if a word is vertical and any part of it is above the match end row, calls the match end function', () => {
        gameState.rotateWord();
        gameState.dropWord();

        expect(endMatchMock).toHaveBeenCalled();
      });
    });
  });

  describe('clearing dropping words', () => {
    beforeEach(() => {
      gameState.setWordBoard(BOARD_WITH_WORDS, [
        { word: 'someword', orientation: 'HORIZONTAL', char: 0, row: 7 },
        { word: 'X', orientation: 'HORIZONTAL', char: 19, row: 5 },
        { word: 'otherword', orientation: 'HORIZONTAL', char: 3, row: 3 }
      ]);

      gameState.clearDroppingWords();
    });

    it('removes all dropping words from board only', () => {
      expect(gameState.getWordBoard()).toEqual(BOARD_WITH_WORDS);
    });
  });

  describe('adding rows', () => {
    it('adds the given row to the bottom of the board', () => {
      gameState.setWordBoard(EMPTY_BOARD, []);
      gameState.addRows(['12345678901234567890']);

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '12345678901234567890'
      ]);
    });

    it('moves all existing rows one row up', () => {
      gameState.setWordBoard(BOARD_WITH_WORDS, []);
      gameState.addRows(['12345678901234567890']);

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                   p',
        '                   u',
        '   some  world     o',
        '      Hello        g',
        '12345678901234567890'
      ]);
    });

    it('given the added row is too long, adds only part that fits on board', () => {
      gameState.setWordBoard(EMPTY_BOARD, []);
      gameState.addRows(['12345678901234567890toolong']);

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '12345678901234567890'
      ]);
    });

    it('given the added row is too short, adds enogugh xs to fit the board', () => {
      gameState.setWordBoard(EMPTY_BOARD, []);
      gameState.addRows(['12']);

      expect(gameState.getWordBoard()).toEqual([
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '                    ',
        '12xxxxxxxxxxxxxxxxxx'
      ]);
    });
  });

  describe('getting completed rows', () => {
    beforeEach(() => {
      gameState.setWordBoard(
        [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          ' yyyyyyyyyyyyyyyyyyy',
          ' xxxxxxxxxxxxxxxxxxx'
        ],
        [
          { word: 'y', orientation: 'HORIZONTAL', char: 0, row: 9 },
          { word: 'x', orientation: 'HORIZONTAL', char: 0, row: 7 }
        ]
      );
    });

    it('returns empty arrays when there are no completed rows', () => {
      expect(gameState.getCompletedRows()).toEqual({
        completed: [],
        added: []
      });
    });

    it('after words move down and a row gets completed, there is one completed row with correct row number', () => {
      gameState.moveWordsDown();

      expect(gameState.getCompletedRows()).toEqual({
        completed: [9],
        added: []
      });
    });

    it('when another row completes, returns two rows as completed', () => {
      gameState.moveWordsDown();
      gameState.moveWordsDown();

      expect(gameState.getCompletedRows()).toEqual({
        completed: [9, 8],
        added: []
      });
    });

    describe('when rows are added to board', () => {
      beforeEach(() => {
        gameState.moveWordsDown();
        gameState.moveWordsDown();

        gameState.addRows(['12345']);
      });

      it('returns one added and shifts completed rows correctly by one', () => {
        expect(gameState.getCompletedRows()).toEqual({
          completed: [8, 7],
          added: [9]
        });
      });

      describe('when additional rows are added', () => {
        beforeEach(() => {
          gameState.addRows(['somerow', 'otherrow']);
        });

        it('shifts the added rows as well by one', () => {
          expect(gameState.getCompletedRows()).toEqual({
            completed: [6, 5],
            added: [9, 8, 7]
          });
        });

        it('board is correctly formatted', () => {
          expect(gameState.getWordBoard()).toEqual([
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          'xyyyyyyyyyyyyyyyyyyy',
          'yxxxxxxxxxxxxxxxxxxx',
          '12345xxxxxxxxxxxxxxx',
          'somerowxxxxxxxxxxxxx',
          'otherrowxxxxxxxxxxxx'
          ]);
        });
      });
    });

    it('given multiple rows are completed at once, sets them all as completed', () => {
      gameState.setWordBoard(
        [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          ' zzzzzzzzzzzzzzzzzzz',
          ' yyyyyyyyyyyyyyyyyyy',
          ' xxxxxxxxxxxxxxxxxxx'
        ],
        [
          { word: 'y', orientation: 'HORIZONTAL', char: 0, row: 9 },
          { word: 'x', orientation: 'HORIZONTAL', char: 0, row: 8 },
          { word: 'z', orientation: 'HORIZONTAL', char: 0, row: 7 }
        ]
      );

      gameState.moveWordsDown();

      expect(gameState.getCompletedRows()).toEqual({
        completed: [9, 8, 7],
        added: []
      });
    });
  });
});
