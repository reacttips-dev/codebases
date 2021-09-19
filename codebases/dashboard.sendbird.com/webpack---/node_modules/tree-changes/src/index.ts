import * as equal from 'fast-deep-equal';
import is from 'is-lite';
import { compareNumbers, compareValues, getIterables, includesOrEqualsTo, nested } from './helpers';

import { Data, KeyType, TreeChanges, Value } from './types';

export default function treeChanges<P extends Data, D extends Data, K = KeyType<P, D>>(
  previousData: P,
  data: D,
): TreeChanges<K> {
  if ([previousData, data].some(is.nullOrUndefined)) {
    throw new Error('Missing required parameters');
  }

  if (![previousData, data].every(d => is.plainObject(d) || is.array(d))) {
    throw new Error('Expected plain objects or array');
  }

  const added = (key?: K, value?: Value): boolean => {
    try {
      return compareValues<K>(previousData, data, { key, type: 'added', value });
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  const changed = (key?: K | string, actual?: Value, previous?: Value): boolean => {
    try {
      const left = nested(previousData, key);
      const right = nested(data, key);
      const hasActual = is.defined(actual);
      const hasPrevious = is.defined(previous);

      if (hasActual || hasPrevious) {
        const leftComparator = hasPrevious
          ? includesOrEqualsTo(previous, left)
          : !includesOrEqualsTo(actual, left);
        const rightComparator = includesOrEqualsTo(actual, right);

        return leftComparator && rightComparator;
      }

      if ([left, right].every(is.array) || [left, right].every(is.plainObject)) {
        return !equal(left, right);
      }

      return left !== right;
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  const changedFrom = (key: K | string, previous: Value, actual?: Value): boolean => {
    if (!is.defined(key)) {
      return false;
    }

    try {
      const left = nested(previousData, key);
      const right = nested(data, key);
      const hasActual = is.defined(actual);

      return (
        includesOrEqualsTo(previous, left) &&
        (hasActual ? includesOrEqualsTo(actual, right) : !hasActual)
      );
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  /**
   * @deprecated
   * Use "changed" instead
   */
  const changedTo = (key: K | string, actual: Value): boolean => {
    if (!is.defined(key)) {
      return false;
    }

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('`changedTo` is deprecated! Replace it with `change`');
    }

    return changed(key, actual);
  };

  const decreased = (key: K, actual?: Value, previous?: Value): boolean => {
    if (!is.defined(key)) {
      return false;
    }

    try {
      return compareNumbers<K>(previousData, data, { key, actual, previous, type: 'decreased' });
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  const emptied = (key?: K): boolean => {
    try {
      const [left, right] = getIterables(previousData, data, { key });

      return !!left.length && !right.length;
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  const filled = (key?: K): boolean => {
    try {
      const [left, right] = getIterables(previousData, data, { key });

      return !left.length && !!right.length;
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  const increased = (key: K, actual?: Value, previous?: Value): boolean => {
    if (!is.defined(key)) {
      return false;
    }

    try {
      return compareNumbers<K>(previousData, data, { key, actual, previous, type: 'increased' });
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  const removed = (key?: K, value?: Value): boolean => {
    try {
      return compareValues<K>(previousData, data, { key, type: 'removed', value });
    } catch {
      /* istanbul ignore next */
      return false;
    }
  };

  return { added, changed, changedFrom, changedTo, decreased, emptied, filled, increased, removed };
}
