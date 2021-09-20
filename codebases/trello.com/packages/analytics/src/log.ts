/* eslint-disable import/no-default-export */
// eslint-disable-next-line @trello/no-module-logic
const showTracking = /hound=1/.test(document.cookie);

export const log = function (event: {
  [key: string]: string | undefined;
}): void {
  if (showTracking) {
    let output = '\ud83d\udc63 ';
    const styling = [];

    for (const key in event) {
      // Still want to see value of 0 get tracked
      const value = event[key];
      if (![undefined, null, ''].includes(value)) {
        output += `%c${key[0].toUpperCase() + key.substr(1)}:%c ${value} `;
        styling.push(
          'color: #fff; font-weight: bold; background-color: #0079BF; border-radius: 2px; padding: 0 2px;',
        );
        styling.push('color: #444');
      }
    }
    // eslint-disable-next-line no-console
    console.log(output, ...styling);
  }
};
