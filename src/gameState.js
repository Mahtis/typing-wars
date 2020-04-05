
const gameState = () => {
  let wordBoard = [
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

  let droppingWords = [];

  const addWord = word => {
    droppingWords.push({ word, orientation: 'HORIZONTAL', char: 0, row: -1 });
    moveWordsDown();
  };

  const addWordToBoard = (word, board) => {
    if (word.orientation === 'VERTICAL') {
      [...word.word].forEach((char, i) => {
        if (word.row - i >= 0) {
          const startOfRow = board[word.row - i].substring(0, word.char)
          const endOfRow = board[word.row - i].substring(word.char + 1);
          const newRow = startOfRow + char + endOfRow;
          board[word.row - i] = newRow;
        }
      })
    } else {
      const startOfRow = board[word.row].substring(0, word.char)
      const endOfRow = board[word.row].substring(word.char + word.word.length);
      const newRow = startOfRow + word.word + endOfRow;
      board[word.row] = newRow;
    }
  }

  const moveWordsDown = () => {
    // this should handle checking whether the word is reaching the bottom
    // or if there is a locked word beneath it.
    // maybe if part of the word is on top of another word and part is not
    // -> make the first part into locked word and create a new word from the latter part?
    // but what if the word would break into two new words?
    // would need to push completely new word to the array and do array shifting :S
    droppingWords.forEach(word => word.row += 1);
  };

  const dropWord = () => {
    const droppinWord = droppingWords.shift();
    let currentRow = droppinWord.row
    let shouldKeepDropping = isBelowWordEmpty(droppinWord, wordBoard[currentRow + 1]);
    while (shouldKeepDropping === true) {
      currentRow += 1;
      droppinWord.row += 1;
      shouldKeepDropping = isBelowWordEmpty(droppinWord, wordBoard[currentRow + 1]);
    }
    addWordToBoard(droppinWord, wordBoard)
  };

  const isBelowWordEmpty = (word, nextRow) => {
    // if there is no next row, we are at the bottom of the board
    if (!nextRow) return false
    const areaLength = word.orientation === 'HORIZONTAL' ? word.length : 1;
    const rowArea = nextRow.slice(word.char, areaLength);
    // check is the below area empty
    return rowArea === (' '.repeat(rowArea.length))
  }

  const rotateWord = () => '';

  const moveWordLeft = () => '';

  const moveWordRight = () => '';

  const addDroppingWordsToBoard = (originalBoard) => {
    const board = [...originalBoard]
    droppingWords.reverse().forEach(word => {
      if (word.orientation === 'VERTICAL') {
        [...word.word].forEach((char, i) => {
          if (word.row - i >= 0) {
            const startOfRow = board[word.row - i].substring(0, word.char)
            const endOfRow = board[word.row - i].substring(word.char + 1);
            const newRow = startOfRow + char + endOfRow;
            board[word.row - i] = newRow;
          }
        })
      } else {
        const startOfRow = board[word.row].substring(0, word.char)
        const endOfRow = board[word.row].substring(word.char + word.word.length);
        const newRow = startOfRow + word.word + endOfRow;
        board[word.row] = newRow;
      }
    })
    return board;
  };

  const getWordBoard = () => {
    const filledBoard = addDroppingWordsToBoard(wordBoard);
    return filledBoard
  };

  const setWordBoard = (newBoard, newDroppingWords) => {
    wordBoard = [...newBoard]
    droppingWords = [...newDroppingWords]
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
