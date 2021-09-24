import get from 'lodash/get'

class MemoryStore {
  static store = {};

  static setItem(key, value, callback) {
    this.store[key] = value
    if (callback) callback(null)
    return Promise.resolve(null)
  }

  static getItem(key, callback) {
    const item = get(this.store, key, null)
    if (callback) callback(null, item)
    return Promise.resolve(item)
  }

  static getAllKeys(callback) {
    const keys = Object.keys(this.store)
    if (callback) callback(null, keys)
    return Promise.resolve(keys)
  }

  static removeItem(key, callback) {
    delete this.store[key]
    if (callback) callback(null)
    return Promise.resolve(null)
  }

  static clear(callback) {
    try {
      Object.keys(this.store).forEach(key => delete this.store[key])
      if (callback) callback(null)
      return Promise.resolve(null)
    } catch (error) {
      callback(error)
      return Promise.reject(error)
    }
  }
}

export default MemoryStore
