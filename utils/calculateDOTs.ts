/**
 * calculateDots in gender and total weight to calculate DOTs
 * @param {String} gender
 * @param {Number} TotalWeight
 * @returns oneRepMax
 */

// Male Constants
enum MaleConstants {
  A = -307.75076,
  B = 24.0900756,
  C = -0.1918759221,
  D = 0.0007391293,
  E = -0.000001093,
}

// Female Constants
enum FemaleConstants {
  A = -57.96288,
  B = 13.6175032,
  C = -0.1126655495,
  D = 0.0005158568,
  E = -0.0000010706,
}

export const calculateDOTS = (
  gender: "male" | "female",
  bodyweight: number,
  totalLifted: number,
): number => {
  if (bodyweight <= 0 || totalLifted <= 0) {
    throw new Error("Bodyweight and total lifted must be positive numbers.");
  }

  const { A, B, C, D, E } = gender === "male" ? MaleConstants : FemaleConstants;

  const coefficient =
    A +
    B * bodyweight +
    C * Math.pow(bodyweight, 2) +
    D * Math.pow(bodyweight, 3) +
    E * Math.pow(bodyweight, 4);

  const dots = (500 * totalLifted) / coefficient;

  return parseFloat(dots.toFixed(2));
};
