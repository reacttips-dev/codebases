/**
 * normalizing rounding logic for the svg construction.
 *
 * This is to keep rendering mostly sane without a lot of rechecking and comparisons.
 */
function clampValues(value: number | undefined, maximum: number, step: number, precision = 100): number {
  //
  // treat undefined as zero
  //
  if (value === undefined) {
    return 0;
  }

  //
  // don't want results greater than 100% for rendering.
  //
  if (value >= maximum) {
    return 1.0;
  }

  //
  // using ceiling to always indicate the best possible result
  //
  // otherwise; 1/500 might look like it has no progress even though there is progress.
  //
  return (Math.ceil(((value / maximum) * precision) / step) * step) / precision;
}

export default clampValues;
