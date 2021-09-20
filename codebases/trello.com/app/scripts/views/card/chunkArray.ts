/**
 * Breaks an array into chunks of a specific size
 *
 * chunk([1, 2, 3, 4, 5, 6, 7], 3) -> [[1, 2, 3], [4, 5, 6], [7]]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function chunkArray(array: any[], size: number) {
  if (!array.length || size < 1) {
    return [];
  }
  const result = new Array(Math.ceil(array.length / size));
  for (let idx = 0; idx < result.length; idx++) {
    result[idx] = array.slice(idx * size, idx * size + size);
  }

  return result;
}
