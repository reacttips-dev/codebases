'use es6';

import Superstore, { IndexedDB } from 'superstore';
import Raven from 'Raven';
var storeInstance;
export var getSuperStoreInstance = function getSuperStoreInstance() {
  if (!storeInstance) {
    try {
      storeInstance = new Superstore({
        namespace: 'crm-index-ui',
        backend: IndexedDB
      }).open();
    } catch (e) {
      Raven.captureException(e, {
        tags: {
          superstoreInit: true
        }
      });
      storeInstance = Promise.reject(e);
    }
  }

  return storeInstance;
};
/**
 * @deprecated
 * Only exported for testing purposes! Please do not use in real code.
 */

export var _clearInstance = function _clearInstance() {
  return storeInstance = undefined;
};