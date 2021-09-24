import React from 'react';
import debug from 'debug';

const log = debug('LocalStorageProvider');

class LocalStorageProvider {
  constructor(namespace, version) {
    this.namespace = namespace;
    this.version = version;
  }

  buildKey(key) {
    return [this.namespace, `v${this.version}`, key].join('.');
  }

  removeItem(key) {
    const _key = this.buildKey(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      log('removeItem', _key);
      window.localStorage.removeItem(_key);
    }
  }

  getItem(key) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const _key = this.buildKey(key);
      const _value = window.localStorage.getItem(_key);
      log('getItem', _key, _value);
      return _value;
    }
    return undefined;
  }

  setItem(key, value) {
    const _key = this.buildKey(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      const _value = String(value);
      log('setItem', _key, _value);
      window.localStorage.setItem(_key, _value);
    }
  }

  setObject(key, obj) {
    this.setItem(key, JSON.stringify(obj));
  }

  getBoolean(key) {
    return Boolean(this.getItem(key));
  }

  getObject(key) {
    const value = this.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return value;
  }

  getNumber(key) {
    const value = parseFloat(this.getItem(key));
    return isNaN(value) ? 0 : value;
  }

  increment(key) {
    let value = this.getNumber(key);
    if (isNaN(value)) {
      value = 0;
    }
    const newValue = value + 1;
    this.setItem(key, newValue);
    return newValue;
  }
}

export function withLocalStorage(namespace, version) {
  if (typeof namespace !== 'string') {
    throw new Error('Invalid namespace for LocalStorage enhancer');
  }
  if (typeof version !== 'string') {
    throw new Error('Invalid version for LocalStorage enhancer');
  }
  return function(Component) {
    return function LocalStorageConsumer(props) {
      return (
        <Component storageProvider={new LocalStorageProvider(namespace, version)} {...props} />
      );
    };
  };
}

export const StorageStub = {
  getItem: () => null,
  setItem: () => null,
  getBoolean: () => null,
  getNumber: () => null,
  increment: () => null
};
