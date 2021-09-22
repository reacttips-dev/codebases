import _ from 'underscore';

/**
 * Concatenate a name object (that can contain prefix, first, middle, last,
 * and suffix) such that there aren't 2 spaces in the middle when there's no
 * middle name. Also handles prefex and suffix generation
 * @param  {Object} nameObj Name Object
 * @return {String}         Concatenated name
 */
function concatName(nameObj: $TSFixMe) {
  let full = _(['prefix', 'first', 'middle', 'last'])
    .chain()
    .map(function (key) {
      return nameObj[key];
    })
    .compact()
    .value()
    .join(' ');

  if (nameObj.suffix) {
    full += ', ' + nameObj.suffix;
  }
  return full;
}

export default concatName;
