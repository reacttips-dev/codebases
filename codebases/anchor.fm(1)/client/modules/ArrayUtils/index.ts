export const createRange = (
  start: number,
  end: number,
  step: number
): number[] => {
  const stepDecimalPlaces = step.toString().split('.')[1].length || 0;
  const numElements = Math.ceil((end - start) / step) + 1; // +1 for inclusive of "end"
  return (
    Array(numElements)
      .fill(start)
      // We don't have to do round down, but because JavaScript is bad at math, you often get wild values like 3.0000000001
      .map((x, y) => Number((x + y * step).toFixed(stepDecimalPlaces)))
      // To guard against any other weird JavaScript math
      .filter(v => v >= start && v <= end)
  );
};
