/**
 * stringUniq (unique)
 * An optimized algorithm for removing duplicates from an array of strings that works in O(n) time instead of O(n^2)
 * time, with an overhead of O(n) space. Useful for heavy computation involving strings (in naptime, for making sure
 * fields are unique).
 */

export default (stringArr: Array<string>): Array<string> => {
  const map: Record<string, number> = {};

  stringArr.forEach((str) => {
    map[str] = 0;
  });

  return Object.keys(map);
};
