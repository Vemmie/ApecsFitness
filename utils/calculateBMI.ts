/**
 * calculateBMI takes in weight and height (Pounds and Inches)
 * @param {Number} weight
 * @param {Number} height
 * @returns BMI
 */

export const calculateBMI = (weight: number, height: number): number => {
  // Exception Catch
  if (weight <= 0 || height <= 0) {
    throw new Error("Weight and/or height must be positive Numbers.");
  }

  const bmi = (weight / (height * height)) * 703;

  return bmi;
};
