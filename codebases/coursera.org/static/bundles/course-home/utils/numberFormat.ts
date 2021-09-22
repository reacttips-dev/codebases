/**
 * Function handles for returning grades as a percentage value and rounds it's decimal to 2 digits.
 */
export function roundGradeValue(num: number): string {
  const rounded = (Math.floor(num * 10000) / 10000) * 100;

  if (rounded.toString().split('.')[1]?.length > 0) {
    return rounded.toFixed(2);
  }

  return rounded.toString();
}
