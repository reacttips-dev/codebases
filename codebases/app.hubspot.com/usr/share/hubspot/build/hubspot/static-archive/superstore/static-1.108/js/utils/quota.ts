import enviro from 'enviro';

var earlyResolve = function earlyResolve(error) {
  if (error) console.warn(error);
  return Promise.resolve();
};

var MIN_SIZE = 4; // You need at least 4 bytes to store anything useful in JS.

/**
 * @returns {Promise<Number|undefined>} - bytes of available storage, or undefined if quota can't be estimated
 * @private
 */

var getAvailable = function getAvailable() {
  if (window.navigator && window.navigator.storage && window.navigator.storage.estimate) {
    try {
      return window.navigator.storage.estimate().then(function (_ref) {
        var quota = _ref.quota,
            usage = _ref.usage;

        if (!quota || !usage) {
          throw new Error('Browser storage estimate APIs did not perform as expected');
        }

        return quota - usage;
      }).catch(earlyResolve);
    } catch (e) {
      return earlyResolve(e);
    }
  }

  return earlyResolve();
};
/**
 * The StorageManager API has no support in Edge, IE or Safari. This utility provides a best-estimate attempt at catching
 * the case when storage is too full to accomodate any more data. The function will **only** return true if storage quotas
 * are available and indicate storage is full. If storage quotas are unknown, a warning will be logged, but the function
 * will return false.
 * @returns {Promise<void>}
 * @private
 */


var testQuota = function testQuota() {
  return getAvailable().catch(earlyResolve).then(function (availableStorage) {
    if (!availableStorage) {
      if (enviro.getShort() !== 'prod') {
        console.warn('Support for making estimate of available storage is missing on this browser.');
      } // If we can't get an estimate, we're still going to *try* setting the data. Otherwise, Safari would never set anything.


      return Promise.resolve();
    }

    if (availableStorage < MIN_SIZE) {
      if (enviro.getShort() !== 'prod') {
        console.warn('IndexedDB capacity exceeded');
      }

      return Promise.reject();
    }

    return Promise.resolve();
  });
};

export default testQuota;