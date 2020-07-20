const TERMINATORS = ['Enter', ' '];

// instead of wordlist, object with wordsets
// When string terminated, compare to last word on every individual word set
// when string matches, send the name of set and actual word
// instead of socket, use clientConnection and add there necessary functions

const initWordSets = (mainList = []) => ({
  mainList: {
    active: true,
    words: mainList,
    updateScore: true,
    sendMessage: true
  },
  skipList: {
    active: true,
    words: ['PASS', 'PASS', 'PASS'],
    updateScore: false,
    sendMessage: false
  },
  nonWordList: {
    active: false,
    words: [],
    updateScore: true,
    sendMessage: true
  }
});

const getLastWord = list => list[list.length - 1];

const stringState = (initialWords, connection, scoreUpdater) => {
  let currentString = '';
  const wordSets = initWordSets([...initialWords]);
  
  const completedWords = [];

  const updateString = key => {
    if (TERMINATORS.includes(key)) {
      handleStringMatching();

      currentString = '';
    } else if (key === 'Backspace') {
      currentString = currentString.slice(0, -1);
    } else {
      currentString += key;
    }
    console.log(currentString)
  };

  const handleStringMatching = () => {
    if (currentString === getLastWord(wordSets.mainList.words)) {
      const completedWord = wordSets.mainList.words.pop();
      
      completedWords.push(completedWord);
      
      connection.sendMessage(completedWord);

      scoreUpdater(true, currentString);
    } else if (currentString === getLastWord(wordSets.skipList.words)) {
      wordSets.mainList.words.pop();
      
      wordSets.skipList.words.pop();
      
      scoreUpdater(false);
    } else {
      scoreUpdater(false);
    }
  }

  const getCurrentString = () => currentString;

  const getWordList = () => [...wordSets.mainList.words];

  const getSkipList = () => [...wordSets.skipList.words];

  const getCompletedWords = () => completedWords;

  return {
    getCurrentString,
    updateString,
    getWordList,
    getSkipList,
    getCompletedWords
  };
};

export default stringState;
