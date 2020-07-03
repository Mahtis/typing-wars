import scoreTracker from './scoreTracker';

describe('scoreTracker', () => {
  let tracker;

  beforeEach(() => {
    tracker = scoreTracker();
  });

  it('at start score is 0', () => {
    expect(tracker.getScore()).toBe(0);
  });

  it('at start streak is 0', () => {
    expect(tracker.getStreak()).toBe(0);
  });

  it('at start highest streak is 0', () => {
    expect(tracker.getHighestStreak()).toBe(0);
  });

  describe('if word was correct', () => {
    let correctWord;

    beforeEach(() => {
      correctWord = 'correctWord';
      tracker.updateScore(true, correctWord);
    });

    it('increases score by the number of letters in word', () => {
      expect(tracker.getScore()).toBe(correctWord.length);
    });

    it('should increase streak count by one', () => {
      expect(tracker.getStreak()).toBe(1);
    });

    it('streak of multiple corrects increases points awarded for correct responses', () => {
      tracker.updateScore(true, correctWord);

      // base score = word length (11) * 2 = 22
      // streak bonus = word length * 1 * 0.1, rounded down = 1
      expect(tracker.getScore()).toBe(23);
    });

    describe('incorrect answer after correct one', () => {
      beforeEach(() => {
        tracker.updateScore(false, 'incorrectWord');
      });

      it('resets streak count', () => {
        expect(tracker.getStreak()).toBe(0);
      });

      it('does not change score', () => {
        expect(tracker.getScore()).toBe(correctWord.length);
      });

      it('correct answer after incorrect one increases score correctly', () => {
        tracker.updateScore(true, correctWord);

        expect(tracker.getScore()).toBe(correctWord.length * 2);
      });
    });
  });

  describe('if word was false', () => {
    beforeEach(() => {
      tracker.updateScore(false, 'incorrectWord');
    });

    it('does not increase score', () => {
      expect(tracker.getScore()).toBe(0);
    });

    it('does not increase streak count', () => {
      expect(tracker.getStreak()).toBe(0);
    });
  });

  it('returns highest streak correctly', () => {
    tracker.updateScore(true, 'correctWord');
    tracker.updateScore(true, 'someWord');
    tracker.updateScore(true, 'correctWord');
    tracker.updateScore(true, 'correctWord');
    tracker.updateScore(true, 'correctWord');
    tracker.updateScore(false, 'incorrectWord');
    tracker.updateScore(true, 'correctWord');
    tracker.updateScore(true, 'correctWord');
    tracker.updateScore(true, 'correctWord');

    expect(tracker.getHighestStreak()).toBe(5);
  });
});
