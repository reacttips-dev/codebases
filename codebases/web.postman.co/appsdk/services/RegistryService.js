/**
 * A simple registry service, that allows you to add and remove items
 * and observe them.
 */
export class RegistryService {
  constructor () {
    this._store = new Map();
  }

  /**
   * Register a new item
   *
   * @param {*} key
   * @param {*} value
   */
  register (key, value) {
    this._store.set(key, value);
  }

  /**
   * Get an item by key
   * @param {*} key
   */
  resolve (key) {
    return this._store.get(key);
  }

  /**
   * De-register an item
   *
   * @param {*} key
   */
  deregister (key) {
    this._store.delete(key);
  }
}
