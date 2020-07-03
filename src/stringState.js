const TERMINATORS = ['Enter', ' '];

// instead of wordlist, object with wordsets
// When string terminated, compare to last word on every individual word set
// when string matches, send the name of set and actual word
// instead of socket, use clientConnection and add there necessary functions

const stringState = (initialWords, connection, scoreUpdater) => {
  let currentString = '';
  const wordList = initialWords;
  
  const completedWords = [];

  const updateString = key => {
    if (TERMINATORS.includes(key)) {
      if (wordList[wordList.length - 1] === currentString) {
        const completedWord = wordList.pop();
        completedWords.push(completedWord);
        connection.sendMessage(completedWord);
        scoreUpdater(true, currentString);
      } else {
        scoreUpdater(false);
      }

      currentString = '';
    } else if (key === 'Backspace') {
      currentString = currentString.slice(0, -1);
    } else {
      currentString += key;
    }
    console.log(currentString)
  };

  const getCurrentString = () => currentString;

  const getWordList = () => [...wordList];

  const getCompletedWords = () => completedWords;

  return {
    getCurrentString,
    updateString,
    getWordList,
    getCompletedWords
  };
};

export default stringState;
