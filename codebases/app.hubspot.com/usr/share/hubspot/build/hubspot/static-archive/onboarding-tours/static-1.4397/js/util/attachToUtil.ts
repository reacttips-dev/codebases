import { doesElementExist } from './elementUtil';
/**
 * Get an element query for the attachTo config object.
 *
 * @param attachTo - consisting of an 'elementQuery' and optional 'fallbackElementQuery'
 * @returns {String|undefined} - the most likely-to-exist element query
 */

export var getAttachToElementQuery = function getAttachToElementQuery(attachTo) {
  if (!attachTo || typeof attachTo.elementQuery !== 'string') {
    return undefined;
  }

  var elementQuery = attachTo.elementQuery,
      fallbackElementQuery = attachTo.fallbackElementQuery; // Use the fallback element option if it is available

  if (!doesElementExist(elementQuery) && fallbackElementQuery) {
    return fallbackElementQuery;
  }

  return elementQuery;
};