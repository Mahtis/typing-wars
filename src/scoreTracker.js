const scoreTracker = () => {
  const streakFactor = 0.1;
  let score = 0;
  let streak = 0;
  let highestStreak = 0;

  const updateScore = (correct, word) => {
    if (correct) {
      score += word.length + word.length * streakFactor * streak;

      streak += 1;

      if (streak > highestStreak) {
        highestStreak = streak;
      }
    } else {
      streak = 0;
    }
  };

  const getScore = () => Math.floor(score);

  const getStreak = () => streak;

  const getHighestStreak = () => highestStreak;

  return { updateScore, getScore, getStreak, getHighestStreak };
};

export default scoreTracker;
