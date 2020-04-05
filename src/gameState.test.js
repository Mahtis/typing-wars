import _gameState from './gameState';

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

describe('gameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = _gameState();
  });

  it('initially word board is an empty 10 x 20 string array', () => {
    expect(gameState.getWordBoard()).toEqual(EMPTY_BOARD);
  });

  it('adding a new word spawns it at the top of the board', () => {
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

  it('moving words down moves the dropping words down one row', () => {
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

  describe('dropping a word down', () => {
    beforeEach(() => {
      gameState.setWordBoard(EMPTY_BOARD, [
        { word: 'FirstWord', orientation: 'HORIZONTAL', char: 10, row: 6 },
        { word: 'SecondWord', orientation: 'HORIZONTAL', char: 4, row: 4 },
        { word: 'ThirdWord', orientation: 'HORIZONTAL', char: 0, row: 3 },
        { word: 'FourthWord', orientation: 'HORIZONTAL', char: 0, row: 1 },
        { word: 'FifthWord', orientation: 'HORIZONTAL', char: 0, row: 0 }
      ]);

      gameState.dropWord()
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
    })
  });
});
