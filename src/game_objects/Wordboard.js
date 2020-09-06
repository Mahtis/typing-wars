import CollisionDetector from '../logic/CollisionDetector';
import Word from './Word';

const tileSize = 20;

const Wordboard = (cols, rows, x, y) => {
  let droppingWords = [];
  let stationaryWords = [];
  let words = [];
  let currentId = 1;

  const collisionDetector = CollisionDetector(cols * tileSize, rows * tileSize);

  const createId = () => {
    const id = currentId;
    currentId += 1;

    return id;
  };

  const addWord = wordToAdd => {
    moveWordsDown();

    const word = Word(wordToAdd, 0, 0, createId(), collisionDetector);

    droppingWords.push(word);
    words.push(word);
  };

  const moveWordsDown = () => {
    let wordsToRemove = [];

    droppingWords.forEach((word, i) => {
      const wasMoved = word.moveDown();

      if (!wasMoved) {
        splitAndMergeWords(word);

        wordsToRemove.push(word.getId());
      }
    });

    droppingWords = droppingWords.filter(
      droppingWord => !wordsToRemove.includes(droppingWord.getId())
    );
  };

  const moveActiveWordRight = () => {
    droppingWords[0]?.moveRight();
  };

  const moveActiveWordLeft = () => {
    droppingWords[0]?.moveLeft();
  };

  const dropActiveWord = () => {
    const word = droppingWords.shift();
    word.drop();
    
    splitAndMergeWords(word);
  };

  const splitAndMergeWords = handledWord => {
    const newWords = handledWord.splitToWordsByRows();
    stationaryWords = stationaryWords.filter(w => w !== handledWord);
    collisionDetector.removeCollisionObject(handledWord);

    newWords.forEach(wordDetails => {
      const { word, col, row } = wordDetails;

      const newWord = Word(word, row, col, createId(), collisionDetector);

      const mergedWord = mergeWords(newWord);

      stationaryWords.push(mergedWord);

      collisionDetector.addCollisionObject(mergedWord);
    });
  };

  const mergeWords = word => {
    const toMerge = [...word.checkLeft(), word, ...word.checkRight()];

    const mergedWord = toMerge.reduce(
      (mergedWord, toMergeWord) => {
        mergedWord.word += toMergeWord.getWord();

        if (toMergeWord.getCol() < mergedWord.col) {
          mergedWord.col = toMergeWord.getCol();
        }

        collisionDetector.removeCollisionObject(toMergeWord);
        stationaryWords = stationaryWords.filter(w => w !== toMergeWord);

        return mergedWord;
      },
      { word: '', col: word.getCol(), row: word.getRow() }
    );

    return Word(
      mergedWord.word,
      mergedWord.row,
      mergedWord.col,
      createId(),
      collisionDetector
    );
  };

  const rotateActiveWord = () => {
    droppingWords[0].rotate();
  };

  const addRow = () => {};

  const getActiveWord = () => droppingWords[0]

  const getWords = () => [...stationaryWords, ...droppingWords];

  const setWords = wordSet => {
    wordSet.forEach((word, i) => {
      const createdWord = Word(
        word.word,
        word.row,
        word.col,
        createId(),
        collisionDetector
      );
      words.push(createdWord);
      droppingWords.push(createdWord);
    });
  };

  const draw = () => {};

  return {
    addWord,
    moveWordsDown,
    moveActiveWordRight,
    moveActiveWordLeft,
    dropActiveWord,
    rotateActiveWord,
    getActiveWord,
    getWords,
    setWords,
    draw
  };
};

export default Wordboard;
