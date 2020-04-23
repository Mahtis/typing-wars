const boardStateHandler = (rows, cols) => {
  const rowWidth = cols;
  let wordBoard = [];
  wordBoard.length = rows;
  wordBoard.fill(' '.repeat(cols));

  let droppingWords = [];

  const addWord = word => {
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
    return droppingWords[0]
  }

  const removeWordFromDroppingWords = removableWord => {
    const removeIndex = droppingWords.findIndex(word => word === removableWord);
    droppingWords.splice(removeIndex, 1);
  }

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
    return rows.filter(row => row !== undefined);
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
    newRows.forEach(newRow => (board[newRow.index] = newRow.row));
  };

  // TODO: update boards through this and return the newBoard
  const updateBoardWithRows = (board, newRows) => {
    const newBoard = [];
    return;
  };

  // TODO: Dont know if this is necessary, but maybe
  const updateWordBoard = board => {
    return true;
  };

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
        addWordToBoard(wordToAddToBoard, wordBoard);
      }
    }
    // droppingWords.forEach((word, i) => {
    //   if (isBelowWordEmpty(word, wordBoard[word.row + 1])) {
    //     word.row += 1;
    //     newDroppingWords.push(word)
    //   } else {
    //     const wordToAddToBoard = droppingWords[i];
    //     addWordToBoard(wordToAddToBoard, wordBoard);
    //   }
    // });

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
    removeWordFromDroppingWords(droppingWord)
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

  const rotateWord = () => {
    const rotatingWord = getActiveWord();
    rotatingWord.orientation =
      rotatingWord.orientation === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL';
  };

  const moveWordLeft = () => {
    const movingWord = getActiveWord();
    if (movingWord.char > 0) {
      movingWord.char -= 1;
    }
  };

  const moveWordRight = () => {
    const movingWord = getActiveWord();
    // char + word length equals the location of the word after moving it
    if (movingWord.char + movingWord.word.length < rowWidth) {
      movingWord.char += 1;
    }
  };

  const addDroppingWordsToBoard = originalBoard => {
    const board = [...originalBoard];
    [...droppingWords].reverse().forEach(word => addWordToBoard(word, board));
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
    dropWord
  };
};

export default boardStateHandler;
