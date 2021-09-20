export default {
  /**
   * Check if the keyboard event key name
   * is ArrowUp, or Up in older versions of IE/Edge
   *
   * @param {String} key - KeyboardEvent.key
   * @returns {boolean} - true if key is ArrowUp/Up
   */
  isArrowUpEvent (key) {
    return key === 'ArrowUp' || key === 'Up';
  },

  /**
   * Check if the keyboard event key name
   * is ArrowRight, or Right in older versions of IE/Edge
   *
   * @param {String} key - KeyboardEvent.key
   * @returns {boolean} - true if key is ArrowRight/Right
   */
  isArrowRightEvent (key) {
    return key === 'ArrowRight' || key === 'Right';
  },

  /**
   * Check if the keyboard event key name
   * is ArrowLeft, or Left in older versions of IE/Edge
   *
   * @param {String} key - KeyboardEvent.key
   * @returns {boolean} - true if key is ArrowLeft/Left
   */
  isArrowLeftEvent (key) {
    return key === 'ArrowLeft' || key === 'Left';
  },

  /**
   * Check if the keyboard event key name
   * is ArrowDown, or Down in older versions of IE/Edge
   *
   * @param {String} key - KeyboardEvent.key
   * @returns {boolean} - true if key is ArrowDown/Down
   */
  isArrowDownEvent (key) {
    return key === 'ArrowDown' || key === 'Down';
  },

  /**
   * Check if the keyboard event key name is Enter
   * also labelled as Return in few keyboards
   *
   * @param {String} key - KeyboardEvent.key
   * @returns {boolean} - true if key is Enter
   */
  isEnterEvent (key) {
    return key === 'Enter';
  },

  /**
   * Check if the keyboard event key name is Backspace
   *
   * @param {String} key - KeyboardEvent.key
   * @returns {boolean} - true if key is Backspace
   */
  isBackspaceEvent (key) {
    return key === 'Backspace';
  },

  /**
   * Check if the keyboard event key name is Escape
   * also labelled as Esc in keyboards
   *
   * @param {String} key - KeyboardEvent.key
   * @returns {boolean} - true if key is Escape
   */
  isEscapeEvent (key) {
    return key === 'Escape';
  },

  sanitizeNumber (string) {
    let number = Number(string);

    if (number < 0) {
      return 0;
    }

    return number;
  },

  roundOffToNearestPlaceValue (number) {
    let stringifiedNumber = number.toString();

    return this.sanitizeNumber(stringifiedNumber[0]) * Math.pow(10, stringifiedNumber.length - 1);
  },

  /**
   * This util function can be used to convert the metrics to be displayed in
   * a more user friendly format. (Eg: 50+, 100+, 2k+ etc)
   *
   * @param {*} number - Number to be converted
   */
  convertToUserFriendlyMetric (number) {
    let sanitizedNumber = this.sanitizeNumber(number),
        limits = [10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 20000];

    if (sanitizedNumber <= limits[0]) {
      return sanitizedNumber;
    }

    // Rounding off the number so that the number can be cached making it faster
    // eslint-disable-next-line one-var
    let roundedOffNumber = this.roundOffToNearestPlaceValue(sanitizedNumber),

      // memoizing _.sortedIndex function to cache values and make binary search (insert) faster
        memoizedSortedIndex = _.memoize(_.sortedIndex),

      // The limits we want to show to the user in a sorted array

      // Performs a binary search and returns the position where the number can be inserted. This will help us
      // in showing the user friendly metric
        insertPosition = memoizedSortedIndex(limits, roundedOffNumber),

      // We now fetch the number to the left of the inserted position
      // (if limit does not exist in the array) to calculate the approximate metric or the same position
      // if limit exists in the array
      // eslint-disable-next-line one-var
        displayNumber = limits.includes(roundedOffNumber) ? limits[insertPosition] : limits[insertPosition - 1],
        suffixCharacter = 'k';

    if (displayNumber < 1000) {
      return `${displayNumber}+`;
    }

    return `${displayNumber / 1000}${suffixCharacter}+`;
  },

  /**
   * This util function can be used to can be used to wait until a condition becomes true
   *
   * @param {*} conditionFunction - function which check checks the condition
   * @param {*} waitTime - Period to wait for (in ms) before rechecking the condition
   */
  waitFor (conditionFunction, waitTime) {
    const poll = (resolve) => {
      if (conditionFunction()) resolve();
      else setTimeout((_) => poll(resolve), waitTime);
    };

    return new Promise(poll);
  }
};
