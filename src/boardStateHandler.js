// Creates an array from to, including to
// To make things confusing, it cuts out negative values
// becuase in this case those are outside the board (i.e. above it)
const range = (from, to) =>
  Array(to + 1 - from)
    .fill(from)
    .map((fromValue, i) => fromValue + i)
    .filter((value) => value >= 0);

const boardStateHandler = (rows, cols, endMatchCallback, matchEndrow = 0) => {
  const rowWidth = cols;
  let wordBoard = [];
  wordBoard.length = rows;
  wordBoard.fill(' '.repeat(cols));

  let droppingWords = [];

  const addWord = (word) => {
    const newWord = {
      word,
      orientation: 'HORIZONTAL',
      char: 0,
      row: -1,
    };
    droppingWords.push(newWord);
    moveWordsDown();
  };

  const getActiveWord = () => {
    return droppingWords[0];
  };

  const removeWordFromDroppingWords = (removableWord) => {
    const removeIndex = droppingWords.findIndex(
      (word) => word === removableWord
    );
    droppingWords.splice(removeIndex, 1);
  };

  const createNewRowForWord = (word, pos, row) => {
    const startOfRow = row.substring(0, pos);
    const endOfRow = row.substring(pos + word.length);
    return startOfRow + word + endOfRow;
  };

  // for vertical words, rows have to be remade for every character
  const createRowsForVerticalWord = (word, board) => {
    const rows = [...word.word].map((char, i) => {
      const currentRow = word.row - i;
      if (currentRow >= 0) {
        const newRow = createNewRowForWord(char, word.char, board[currentRow]);
        return { index: currentRow, row: newRow };
      }
    });
    return rows.filter((row) => row !== undefined);
  };

  // Name this createRowsForBoard
  const addWordToBoard = (word, board) => {
    let newRows = [];
    if (word.orientation === 'VERTICAL') {
      newRows = createRowsForVerticalWord(word, board);
    } else {
      const newRow = createNewRowForWord(word.word, word.char, board[word.row]);
      newRows.push({ index: word.row, row: newRow });
    }
    // TODO: Just return the newRows, let caller handle the rest
    newRows.forEach((newRow) => (board[newRow.index] = newRow.row));
  };

  // TODO: update boards through this and return the newBoard
  const updateBoardWithRows = (board, newRows) => {
    const newBoard = [];
    return;
  };

  // TODO: Dont know if this is necessary, but maybe
  const updateWordBoard = (board) => {
    return true;
  };

  const checkWordEndsGame = word => {
    if (word.orientation === 'HORIZONTAL') {
      return word.row <= matchEndrow;
    }
    // Vertical word reaches (row - length + 1) rows above current row
    return word.row - word.word.length + 1 <= matchEndrow;
  }

  const moveWordsDown = () => {
    // Maybe if part of the word is on top of another word and part is not
    // -> make the first part into locked word and create a new word from the latter part?
    // but what if the word would break into two new words?
    // would need to push completely new word to the array and do array shifting :S
    const newDroppingWords = [];
    for (let i = 0; i < droppingWords.length; i += 1) {
      const word = droppingWords[i];
      if (isBelowWordEmpty(word, wordBoard[word.row + 1])) {
        word.row += 1;
        newDroppingWords.push(word);
      } else {
        const wordToAddToBoard = droppingWords[i];
        if (checkWordEndsGame(wordToAddToBoard)) {
          endMatchCallback();
        }
        addWordToBoard(wordToAddToBoard, wordBoard);
      }
    }

    droppingWords = newDroppingWords;
  };

  const dropWord = () => {
    const droppingWord = getActiveWord();
    let currentRow = droppingWord.row;
    let shouldKeepDropping = isBelowWordEmpty(
      droppingWord,
      wordBoard[currentRow + 1]
    );
    while (shouldKeepDropping === true) {
      currentRow += 1;
      droppingWord.row += 1;
      shouldKeepDropping = isBelowWordEmpty(
        droppingWord,
        wordBoard[currentRow + 1]
      );
    }
    if (checkWordEndsGame(droppingWord)) {
      endMatchCallback();
    }
    removeWordFromDroppingWords(droppingWord);
    addWordToBoard(droppingWord, wordBoard);
  };

  const isBelowWordEmpty = (word, nextRow) => {
    // if there is no next row, we are at the bottom of the board
    if (!nextRow) {
      return false;
    }
    // need to take into account also vertical words
    const areaLength = word.orientation === 'HORIZONTAL' ? word.word.length : 1;
    const rowArea = nextRow.slice(word.char, word.char + areaLength);
    // check is the below area empty
    return rowArea === ' '.repeat(rowArea.length);
  };

  // checks whether given columns on specified rows is empty
  const isSpotFree = (chars, rows) =>
    rows.every((row) =>
      chars.every(
        (char) =>
          wordBoard[row][char] === ' ' &&
          wordBoard[row][char] >= 0 &&
          wordBoard[row][char] <= rowWidth
      )
    );

  const rotateWord = () => {
    const rotatingWord = getActiveWord();

    if (rotatingWord.orientation === 'VERTICAL') {
      rotateVerticalWord(rotatingWord);
    } else {
      rotatingWord.orientation = 'VERTICAL';
    }
  };

  // Considers whether there is something on the right side of the word
  // so that it would not fit there horizontally and does not rotate it if so
  const rotateVerticalWord = (word) => {
    const cols = range(word.char, word.char + word.word.length - 1);
    if (isSpotFree(cols, [word.row])) {
      word.orientation = 'HORIZONTAL';
    }
  };

  const moveWordLeft = () => {
    const movingWord = getActiveWord();

    const charAfterMoving = movingWord.char - 1;

    if (isSpotFree([charAfterMoving], [movingWord.row])) {
      movingWord.char -= 1;
    }
  };

  const moveWordRight = () => {
    const movingWord = getActiveWord();

    if (movingWord.orientation === 'VERTICAL') {
      const charAfterMoving = movingWord.char + 1;
      const rows = range(
        movingWord.row - movingWord.word.length,
        movingWord.row
      );
      if (isSpotFree([charAfterMoving], rows)) {
        movingWord.char += 1;
      }
    } else {
      // char + word length equals the location of the word after moving it
      const charAfterMoving = movingWord.char + movingWord.word.length;
      if (isSpotFree([charAfterMoving], [movingWord.row])) {
        movingWord.char += 1;
      }
    }
  };

  const addDroppingWordsToBoard = (originalBoard) => {
    const board = [...originalBoard];
    [...droppingWords].reverse().forEach((word) => addWordToBoard(word, board));
    return board;
  };

  const getWordBoard = () => {
    const filledBoard = addDroppingWordsToBoard(wordBoard);
    return filledBoard;
  };

  const setWordBoard = (newBoard, newDroppingWords) => {
    wordBoard = [...newBoard];
    droppingWords = [...newDroppingWords];
  };

  return {
    addWord,
    getWordBoard,
    setWordBoard,
    moveWordsDown,
    moveWordLeft,
    moveWordRight,
    rotateWord,
    dropWord,
  };
};

export default boardStateHandler;
