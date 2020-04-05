const gameState = (rows, cols) => {
  const rowWidth = cols;
  let wordBoard = [];
  wordBoard.length = rows;
  wordBoard.fill(' '.repeat(cols));

  let droppingWords = [];

  const addWord = word => {
    droppingWords.push({ word, orientation: 'HORIZONTAL', char: 0, row: -1 });
    moveWordsDown();
  };

  const createNewRowForWord = (word, pos, row) => {
    const startOfRow = row.substring(0, pos);
    const endOfRow = row.substring(pos + word.length);
    return startOfRow + word + endOfRow;
  }

  // for vertical words, rows have to be remade for every character
  const createRowsForVerticalWord = (word, board) => {
    const rows = [...word.word].map((char, i) => {
      const currentRow = word.row - i
      if (currentRow >= 0) {
        const newRow = createNewRowForWord(char, word.char, board[currentRow])
        return { index: currentRow, row: newRow};
      }
    });
    return rows.filter(row => row !== undefined)
  }

  const addWordToBoard = (word, board) => {
    let newRows = []
    if (word.orientation === 'VERTICAL') {
      newRows = createRowsForVerticalWord(word, board);
    } else {
      const newRow = createNewRowForWord(word.word, word.char, board[word.row]);
      newRows.push({ index: word.row, row: newRow });
    }
    newRows.forEach(newRow => board[newRow.index] = newRow.row)
  };

  const moveWordsDown = () => {
    // Maybe if part of the word is on top of another word and part is not
    // -> make the first part into locked word and create a new word from the latter part?
    // but what if the word would break into two new words?
    // would need to push completely new word to the array and do array shifting :S
    const newDroppingWords = [...droppingWords]
    droppingWords.forEach((word, i) => {
      if (isBelowWordEmpty(word, wordBoard[word.row + 1])) {
        word.row += 1;
      } else {
        const wordToAddToBoard = newDroppingWords.splice(i, 1)[0];
        addWordToBoard(wordToAddToBoard, wordBoard);
      }
    });
    droppingWords = newDroppingWords;
  };

  const dropWord = () => {
    const droppinWord = droppingWords.shift();
    let currentRow = droppinWord.row;
    let shouldKeepDropping = isBelowWordEmpty(
      droppinWord,
      wordBoard[currentRow + 1]
    );
    while (shouldKeepDropping === true) {
      currentRow += 1;
      droppinWord.row += 1;
      shouldKeepDropping = isBelowWordEmpty(
        droppinWord,
        wordBoard[currentRow + 1]
      );
    }
    addWordToBoard(droppinWord, wordBoard);
  };

  const isBelowWordEmpty = (word, nextRow) => {
    // if there is no next row, we are at the bottom of the board
    if (!nextRow) return false;
    const areaLength = word.orientation === 'HORIZONTAL' ? word.word.length : 1;
    const rowArea = nextRow.slice(word.char, word.char + areaLength);
    // check is the below area empty
    return rowArea === ' '.repeat(rowArea.length);
  };

  const rotateWord = () => {
    const rotatingWord = droppingWords[0];
    rotatingWord.orientation =
      rotatingWord.orientation === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL';
  };

  const moveWordLeft = () => {
    const movingWord = droppingWords[0];
    if (movingWord.char > 0) {
      movingWord.char -= 1;
    }
  };

  const moveWordRight = () => {
    const movingWord = droppingWords[0];
    // char + word length equals the location of the word after moving it
    if (movingWord.char + movingWord.word.length < rowWidth) {
      movingWord.char += 1;
    }
  };

  const addDroppingWordsToBoard = originalBoard => {
    const board = [...originalBoard];
    droppingWords.reverse().forEach(word => addWordToBoard(word, board));
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

export default gameState;
