const interpolationRegex = /[#!]\{([^}]+?)\}/g;

/**
 * Generate a translation function from a translations mapping loaded by the
 * i18n module.
 * (dictionary) -> (key[, interpolationHash]) -> String
 * @param  {Object} dictionary  key => translation mapping
 * @return {Function}           translation function
 */
function generateTranslationFunction(_dictionary) {
  const dictionary = _dictionary || {};

  /**
   * Translation Function that takes a key and returns the translation it maps
   * to. For strings with interpolations (see interpolationRegex for format),
   * pass a hash of interpolations => interpolated values. The function also
   * performs translation lookups on the interpolated values, with the value
   * and interpolation key as fallbacks
   * @param  {String} key               Key string used for translation lookup
   * @param  {Object} interpolationHash Hash used for performing interpolations
   * @return {String}                   Translated string
   */
  const f = function (key, interpolationHash) {
    const value = dictionary[key] || key;
    if (typeof interpolationHash === 'object' && interpolationHash) {
      return value.replace(interpolationRegex, function (match, interpKey) {
        const interpolation = interpolationHash[interpKey];
        const fallback = interpolation === undefined ? interpKey : interpolation;
        return dictionary[interpolation] || fallback;
      });
    } else {
      return value;
    }
  };

  // save for dictionary merge function below
  f.dictionary = dictionary;

  /**
   * Merge other translation functions by combining dictionaries. If the
   * dictionaries have collisions, only the first value is kept
   * @return {Function} Translated function with combined dictionaries
   */
  f.merge = function () {
    const _ts = Array.prototype.slice.call(arguments, 0);
    let i;
    let _source;
    let key;
    for (i = 0; i < _ts.length; i += 1) {
      _source = _ts[i] && _ts[i].dictionary;
      if (_source) {
        for (key in _source) {
          if (!(key in dictionary)) {
            dictionary[key] = _source[key];
          }
        }
      }
    }
    return f;
  };

  return f;
}

export default generateTranslationFunction;
