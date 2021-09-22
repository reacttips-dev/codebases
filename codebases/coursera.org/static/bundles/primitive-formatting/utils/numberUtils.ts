export function truncToPlace(number: number, precision: number) {
  // small value so that when we truncate to place we don't include any floating point error
  const epsilon = 10 ** -10;
  const floatingPointAdjustedNumber = number >= 0 ? number + epsilon : number - epsilon;
  const factor = 10 ** precision;
  return Math.floor(floatingPointAdjustedNumber * factor) / factor;
}
