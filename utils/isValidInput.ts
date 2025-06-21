export function isValidInput(userInput: string): boolean {
  const num = Number(userInput);
  return userInput === "" && (isNaN(num) || num >= 1);
}
