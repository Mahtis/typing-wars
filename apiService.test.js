const api = require('./apiService');

describe('apiService', () => {
  let apiService;

  beforeEach(() => {
    api.dependencies.words = require('./data/testWords.json');

    apiService = api.apiService();
  });

  describe('given requesting for 5 English words with max length of 4 chars', () => {
    let englishWords;

    beforeEach(() => {
      englishWords = apiService.getEnglishWords(5, 4);
    });

    it('returns an array with 5 words', () => {
      expect(englishWords.length).toBe(5);
    });

    it('includes only words from the used dataset', () => {
      expect(
        englishWords.every((word) => api.dependencies.words.englishWords.includes(word))
      ).toBe(true);
    });

    it('does not include words that are too long', () => {
      const tooLongWords = [
        'words',
        'English',
        'repeating',
        'thisisaverylongwordthatshouldprobablybeexcluded',
      ];

      expect(englishWords.some((word) => tooLongWords.includes(word))).toBe(
        false
      );
    });
  });
});
