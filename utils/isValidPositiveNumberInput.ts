export function isValidPositiveNumberInput(userInput: string): boolean {
  if (userInput === "") {
    return true; // Empty string is explicitly valid
  }

  const num = Number(userInput);
  return !isNaN(num) && num >= 1; // Otherwise, it must be a valid number >= 1
}
