const dependencies = {
  words: require('./data/words.json'),
};

const getRandomInt = max => Math.round(Math.random() * max);

const randomArray = (length, max) =>
  Array(length)
    .fill()
    .map(() => getRandomInt(max));

const apiService = () => {
  const { words } = dependencies;
  const { englishWords } = words;

  const getEnglishWords = (n, maxWordLength) => {
    const maxWordIndex = englishWords.length - 1
    const wordIndexes = randomArray(n, maxWordIndex)

    const returnWords = wordIndexes.map(i => {
      let word = englishWords[i]

      while (word.length > maxWordLength) {
        const newIndex = getRandomInt(maxWordIndex)
        word = englishWords[newIndex]
      }

      return word
    })
    return returnWords
  };

  return { getEnglishWords };
};

module.exports = { apiService, dependencies };
