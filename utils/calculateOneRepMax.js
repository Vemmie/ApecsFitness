/**
 * calculateOneRepMax takes in weight and reps to calculate oneRepMax
 * @param {Number} weight
 * @param {Number} reps
 * @returns oneRepMax
 */
export const calculateOneRepMax = (weight, reps) => {
  // Exception catch
  if (weight <= 0 || reps <= 0) {
    throw new Error("Weight and/or reps must be positive numbers.");
  }
  // No calculations needed at one rep
  if (reps === 1) return weight;

  const brzycki = weight / (1.0278 - 0.0278 * reps);
  const epley = weight * (1 + reps / 30);

  // Brzycki Formula
  if (reps < 9) {
    return brzycki;
  }
  // Epley Formula
  else if (reps > 10) {
    return epley;
  }
  // Blend of Brzycki and Epley via Avg
  else {
    const avg = (brzycki + epley) / 2;
    return avg;
  }
};
