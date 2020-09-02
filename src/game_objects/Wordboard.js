import CollisionDetector from '../logic/CollisionDetector';
import Word from './Word';

const tileSize = 20;

const Wordboard = (cols, rows, x, y) => {
  const droppingWords = [];
  const stationaryWords = [];
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
    droppingWords.forEach(word => word.moveDown());
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

    stationaryWords.push(word);
    collisionDetector.addCollisionObject(word);
  };

  const addRow = () => {};

  const getWords = () => words;

  const setWords = wordSet => {
    wordSet.forEach((word, i) => {
      const createdWord = Word(word.word, word.row, word.col, i, collisionDetector);
      words.push(createdWord);
      droppingWords.push(createdWord);
    });
  };

  return {
    addWord,
    moveWordsDown,
    moveActiveWordRight,
    moveActiveWordLeft,
    dropActiveWord,
    getWords,
    setWords
  };
};

export default Wordboard;
