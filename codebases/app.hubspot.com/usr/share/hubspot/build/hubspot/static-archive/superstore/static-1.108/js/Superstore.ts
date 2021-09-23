import PortalIdParser from 'PortalIdParser';
import { NAMESPACE_PREFIX } from './constants';
import SuperstoreIDB from './indexeddb';
import SuperstoreLocal from './localstorage';
var defaultOpts = {
  async: true
};

function validateOptions(opts) {
  if (!opts || !opts.namespace) {
    throw new Error('Configuration error: Superstore must be instantiated with a namespace.');
  } else {
    if (typeof opts.namespace !== 'string') {
      throw new Error('Configuration error: `namespace` must be of type string.');
    }

    opts.namespace = NAMESPACE_PREFIX + "." + opts.namespace;
  }

  if (opts.global) {
    if (opts.partition) {
      throw new Error('Configuration error: `partition` and `global` are mutually exclusive.');
    }
  } else {
    var partitionFn;

    if (opts.partition) {
      if (typeof opts.partition !== 'function') {
        throw new Error('Configuration error: `partition` must be a function.');
      } else {
        partitionFn = opts.partition;
      }
    } else {
      partitionFn = function partitionFn() {
        return PortalIdParser.get();
      };
    }

    var partitionVal = partitionFn();

    if (partitionVal) {
      partitionVal = "." + partitionVal;
    } else {
      partitionVal = '';
    }

    opts.namespace = "" + opts.namespace + partitionVal;
  }
}
/**
 * Interface for creating a Superstore instance. Most interesting things happen in the backends,
 * this class is mostly just for parameters validation.
 *
 *```js
 * import Superstore, { LocalStorage } from 'superstore';
 *
 * const store = new Superstore({
 *   backend: LocalStorage,
 *   namespace: 'foo'
 * });
 *```
 */


var Superstore = function Superstore(opts) {
  if (!opts || !opts.backend) {
    throw new Error('Configuration error: Superstore must be instantiated with a backend.');
  }

  validateOptions(opts);
  return opts.backend(Object.assign({}, Superstore._defaultOpts, {}, opts));
};

Superstore._defaultOpts = defaultOpts;
export default Superstore;
export function createAsyncLocalSuperstore(opts) {
  validateOptions(opts);
  return SuperstoreLocal(Object.assign({}, opts, {
    async: true
  }));
}
export function createSyncLocalSuperstore(opts) {
  validateOptions(opts);
  return SuperstoreLocal(Object.assign({}, opts, {
    async: false
  }));
}
export function createIndexedDBSuperstore(opts) {
  validateOptions(opts);
  return SuperstoreIDB(Object.assign({}, opts, {
    async: true
  }));
}