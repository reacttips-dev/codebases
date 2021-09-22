// @ts-ignore TS7016
import store from 'store';
// @ts-ignore TS7016
import logger from 'js/app/loggerSingleton';

if (store.enabled) {
  store.setIfEnabled = store.set;
  const _serialize = store.serialize;
  const identity = function (value: string) {
    return value;
  };

  /**
   * Set values in local storage without serialization
   *
   * @param  {String} key   input key
   * @param  {String} value input value
   * @return {String}       serialized value
   */
  store.setUnserialized = function (key: string, value: string): string {
    store.serialize = identity;
    const returnValue = store.setIfEnabled(key, value);
    store.serialize = _serialize;
    return returnValue;
  };
} else {
  logger.warn('localStorage.set is disabled and some features may not work');
  store.setIfEnabled = function () {};
  store.setUnserialized = function () {};
}

export default store;
