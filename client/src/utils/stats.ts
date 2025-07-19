

export const calculateWPM = (charsTyped: number, timeInMinutes: number): number => {
  if (timeInMinutes <= 0 || charsTyped <= 0) return 0;
  return Math.round((charsTyped / 5) / timeInMinutes);
};

export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 0;
  return Math.round((correctChars / totalChars) * 100);
};
