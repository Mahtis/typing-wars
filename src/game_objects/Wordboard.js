import WordboardDrawer from '../drawing/newWordboardDrawer';
import CollisionDetector from '../logic/CollisionDetector';
import Word from './Word';

const tileSize = 20;

const Wordboard = (cols, rows, x, y, ctx) => {
  let droppingWords = [];
  let stationaryWords = [];
  let words = [];
  let currentId = 1;

  const drawer = WordboardDrawer(rows, cols, x, y, ctx);

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
        wordsToRemove.push(word.getId());
        stationaryWords.push(word);
        collisionDetector.addCollisionObject(word);
        // get the rows that word is located on
        const wordRows = word.getRows();
        // go through rows
        wordRows.forEach(wordRow => {
          // get all stationary words that are on the same row
          const wordsOnRow = stationaryWords.filter(word =>
            word.getRows().includes(wordRow)
          );

          // check if row is now complete
          if (isRowComplete(wordsOnRow)) {
            let completeRow = [];
            const wordsToCreate = [];

            wordsOnRow.forEach(wordOnRow => {
              // split the word around the given row
              const newWords = wordOnRow.splitOnRow(wordRow);

              newWords.forEach(newWord => {
                if (newWord.row === wordRow) {
                  // if processed part is on the wanted row, add it to the list of completed row
                  completeRow.push(newWord);
                } else {
                  // else a new word needs to be created from it
                  wordsToCreate.push(newWord);
                }
              });
            });

            // sort the words according to column so that the new row is in correct order
            completeRow.sort((a, b) => a.col - b.col);

            const completedWord = Word(
              completeRow.map(w => w.word).join(''),
              wordRow,
              0,
              createId(),
              collisionDetector,
              'COMPLETED',
              'completed'
            );

            words.push(completedWord);
            stationaryWords.push(completedWord);
            collisionDetector.addCollisionObject(completedWord);

            stationaryWords = stationaryWords.filter(
              word => !wordsOnRow.includes(word)
            );

            createStationaryWords(wordsToCreate);
          }
        });
      }
    });

    droppingWords = droppingWords.filter(
      droppingWord => !wordsToRemove.includes(droppingWord.getId())
    );
  };

  const dropActiveWord = () => {
    const word = droppingWords.shift();
    word.drop();

    stationaryWords.push(word);
    collisionDetector.addCollisionObject(word);
    const wordRow = word.getRow();

    const wordsOnRow = stationaryWords.filter(word =>
      word.getRows().includes(wordRow)
    );

    if (isRowComplete(wordsOnRow)) {
      let completeRow = [];
      const wordsToCreate = [];

      wordsOnRow.forEach(wordOnRow => {
        const newWords = wordOnRow.splitOnRow(wordRow);

        newWords.forEach(newWord => {
          if (newWord.row === wordRow) {
            completeRow.push(newWord);
          } else {
            wordsToCreate.push(newWord);
          }
        });

        collisionDetector.removeCollisionObject(wordOnRow);
      });

      completeRow.sort((a, b) => a.col - b.col);

      const completedWord = Word(
        completeRow.map(w => w.word).join(''),
        wordRow,
        0,
        createId(),
        collisionDetector,
        'COMPLETED',
        'completed'
      );

      words.push(completedWord);
      stationaryWords.push(completedWord);
      collisionDetector.addCollisionObject(completedWord);

      stationaryWords = stationaryWords.filter(
        word => !wordsOnRow.includes(word)
      );
      createStationaryWords(wordsToCreate);
    }
    // splitAndMergeWords(word);
  };

  const moveActiveWordRight = () => {
    droppingWords[0]?.moveRight();
  };

  const moveActiveWordLeft = () => {
    droppingWords[0]?.moveLeft();
  };

  const rotateActiveWord = () => {
    droppingWords[0]?.rotate();
  };

  const isRowComplete = wordsOnRow => {
    const colsCovered = wordsOnRow.reduce(
      (acc, cur) => acc + cur.getCols().length,
      0
    );
    return colsCovered === cols;
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

  const addRow = row => {
    droppingWords = droppingWords.filter(word => {
      if (word.checkDown().length !== 0) {
        stationaryWords.push(word);
        collisionDetector.addCollisionObject(word);
        return false;
      }
      return true;
    });

    stationaryWords.forEach(word => {
      word.moveUp();
    });

    const rowWord = Word(row, rows - 1, 0, createId(), collisionDetector);

    collisionDetector.addCollisionObject(rowWord);
    stationaryWords.unshift(rowWord);
  };

  const getActiveWord = () => droppingWords[0];

  const getWords = () => [...stationaryWords, ...droppingWords];

  const getSimpleWords = () => {};

  const getCollisionDetector = () => collisionDetector;

  const createStationaryWords = words => {
    words.forEach(word => {
      const createdWord = Word(
        word.word,
        word.row,
        word.col,
        createId(),
        collisionDetector
      );

      if (word.orientation === 'VERTICAL') {
        createdWord.rotate(true);
      }

      words.push(createdWord);
      stationaryWords.push(createdWord);
      collisionDetector.addCollisionObject(createdWord);
    });
  };

  const setWords = wordSet => {
    wordSet.forEach((word, i) => {
      const createdWord = Word(
        word.word,
        word.row,
        word.col,
        createId(),
        collisionDetector
      );

      if (word.orientation === 'VERTICAL') {
        createdWord.rotate(true);
      }

      words.push(createdWord);
      droppingWords.push(createdWord);
    });
  };

  const draw = () => {
    drawer.draw(getWords());
  };

  return {
    addWord,
    addRow,
    moveWordsDown,
    moveActiveWordRight,
    moveActiveWordLeft,
    dropActiveWord,
    rotateActiveWord,
    getActiveWord,
    getWords,
    setWords,
    getSimpleWords,
    getCollisionDetector,
    draw
  };
};

export default Wordboard;
