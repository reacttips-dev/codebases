import * as equal from 'fast-deep-equal';
import is from 'is-lite';
import { CompareValuesOptions, Data, Key, Options, ValidTypes, Value } from './types';

export function canHaveLength(...args: any): boolean {
  return args.every((d: unknown) => is.string(d) || is.array(d) || is.plainObject(d));
}

export function checkEquality(left: Data, right: Data, value: Value) {
  if (!isSameType(left, right)) {
    return false;
  }

  if ([left, right].every(is.array)) {
    return !left.some(hasValue(value)) && right.some(hasValue(value));
  }

  /* istanbul ignore else */
  if ([left, right].every(is.plainObject)) {
    return (
      !Object.entries(left).some(hasEntry(value)) && Object.entries(right).some(hasEntry(value))
    );
  }

  return right === value;
}

export function compareNumbers<K = Key>(
  previousData: Data,
  data: Data,
  options: Options<K>,
): boolean {
  const { actual, key, previous, type } = options;
  const left = nested(previousData, key);
  const right = nested(data, key);

  let changed =
    [left, right].every(is.number) && (type === 'increased' ? left < right : left > right);

  if (!is.undefined(actual)) {
    changed = changed && right === actual;
  }

  if (!is.undefined(previous)) {
    changed = changed && left === previous;
  }

  return changed;
}

export function compareValues<K = Key>(
  previousData: Data,
  data: Data,
  options: CompareValuesOptions<K>,
) {
  const { key, type, value } = options;

  const left = nested(previousData, key);
  const right = nested(data, key);
  const primary = type === 'added' ? left : right;
  const secondary = type === 'added' ? right : left;

  // console.log({ primary, secondary });

  if (!is.nullOrUndefined(value)) {
    if (is.defined(primary)) {
      // check if nested data matches
      if (is.array(primary) || is.plainObject(primary)) {
        return checkEquality(primary, secondary, value);
      }
    } else {
      return equal(secondary, value);
    }

    return false;
  }

  if ([left, right].every(is.array)) {
    return !secondary.every(isEqualPredicate(primary));
  }

  if ([left, right].every(is.plainObject)) {
    return hasExtraKeys(Object.keys(primary), Object.keys(secondary));
  }

  return (
    ![left, right].every(d => is.primitive(d) && is.defined(d)) &&
    (type === 'added'
      ? !is.defined(left) && is.defined(right)
      : is.defined(left) && !is.defined(right))
  );
}

export function getIterables<K = Key>(previousData: Data, data: Data, { key }: Options<K> = {}) {
  let left = nested(previousData, key);
  let right = nested(data, key);

  if (!isSameType(left, right)) {
    throw new TypeError('Inputs have different types');
  }

  if (!canHaveLength(left, right)) {
    throw new TypeError("Inputs don't have length");
  }

  if ([left, right].every(is.plainObject)) {
    left = Object.keys(left);
    right = Object.keys(right);
  }

  return [left, right];
}

export function hasEntry(input: Value) {
  return ([key, value]: [string, Value]) => {
    if (is.array(input)) {
      return (
        equal(input, value) ||
        input.some(d => equal(d, value) || (is.array(value) && isEqualPredicate(value)(d)))
      );
    }

    /* istanbul ignore else */
    if (is.plainObject(input) && input[key]) {
      return !!input[key] && equal(input[key], value);
    }

    return equal(input, value);
  };
}

export function hasExtraKeys(left: string[], right: string[]): boolean {
  return right.some(d => left.indexOf(d) < 0);
}

export function hasValue(input: Value) {
  return (value: Value) => {
    if (is.array(input)) {
      return input.some(d => equal(d, value) || (is.array(value) && isEqualPredicate(value)(d)));
    }

    return equal(input, value);
  };
}

export function includesOrEqualsTo<T>(previousValue: T | T[], value: T): boolean {
  return is.array(previousValue)
    ? previousValue.some(d => equal(d, value))
    : equal(previousValue, value);
}

export function isEqualPredicate(data: unknown[]) {
  return (value: unknown) => !!data.find(d => equal(d, value));
}

export function isSameType(...args: ValidTypes[]): boolean {
  return (
    args.every(is.array) ||
    args.every(is.number) ||
    args.every(is.plainObject) ||
    args.every(is.string)
  );
}

export function nested<T extends Data, K = Key>(data: T, property?: K) {
  /* istanbul ignore else */
  if (is.plainObject(data) || is.array(data)) {
    /* istanbul ignore else */
    if (is.string(property)) {
      const props: Array<any> = property.split('.');

      return props.reduce((acc, d) => acc && acc[d], data);
    }

    /* istanbul ignore else */
    if (is.number(property)) {
      return data[property];
    }

    return data;
  }

  return data;
}
