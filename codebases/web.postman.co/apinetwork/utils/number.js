export default {
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
    if (!number) {
      return 0;
    }

    let sanitizedNumber = this.sanitizeNumber(number),
      limits = [10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000,
        40000, 50000, 100000, 200000, 300000, 400000, 500000];

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
   * This util function can be used to convert the counts of categories in sidebar and Homepage
   * Eg: 1123->1.1K,    11234->11.2K,   112345->112.3K,  1123456->1.1M and so on..
   * @param {*} number - Number to be converted
   */
  convertToUserReadableCount (number) {
    if (!number) {
      return 0;
    }
    const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
    const sanitizedNumber = this.sanitizeNumber(number);

    // determines SI symbol
    const tier = Math.log10(Math.abs(sanitizedNumber)) / 3 | 0;

    // if 0 we return as is
    if (tier === 0) {
      return sanitizedNumber;
    }

    // get suffix and determine scale
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaledNumber = sanitizedNumber / scale;

    return scaledNumber.toFixed(1) + suffix;
  }
};
