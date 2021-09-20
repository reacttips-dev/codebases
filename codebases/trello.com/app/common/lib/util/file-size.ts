/* eslint-disable @trello/disallow-filenames */
export function bytes(numBytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let count = numBytes;
  for (let i = 0; i < units.length; i++) {
    if (count < 1024 || i === units.length - 1) {
      numBytes = Math.round(count * 100) / 100;
      return `${numBytes} ${units[i]}`;
    }
    count /= 1024;
  }

  return 'unknown';
}
