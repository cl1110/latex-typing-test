


export const calculateNewRating = (
  currentRating: number,
  opponentRating: number,
  didWin: boolean
): number => {
  const kFactor = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
  const actualScore = didWin ? 1 : 0;

  const newRating = currentRating + kFactor * (actualScore - expectedScore);
  return Math.round(newRating);
};
