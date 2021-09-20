/* eslint-disable @trello/disallow-filenames */
// Taken from https://davidwalsh.name/fill-array-javascript

export const arrayRange = (start: number, end: number) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, index) => start + index);
};
