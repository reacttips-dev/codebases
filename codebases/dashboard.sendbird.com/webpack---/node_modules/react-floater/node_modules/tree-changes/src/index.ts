import { diff } from 'deep-diff';
// @ts-ignore
import { get as nested } from 'nested-property';

interface IPlainObject {
  [key: string]: any;
}

export type TypeInput =
  | string
  | boolean
  | number
  | IPlainObject
  | Array<string | boolean | number | IPlainObject>;

export type IData = IPlainObject | IPlainObject[];

export interface ITreeChanges {
  changed: (key?: string | number) => boolean;
  changedFrom: (key: string | number, previous: TypeInput, actual?: TypeInput) => boolean;
  changedTo: (key: string | number, actual: TypeInput) => boolean;
  increased: (key: string | number) => boolean;
  decreased: (key: string | number) => boolean;
}

function isPlainObj(...args: any): boolean {
  return args.every((d: any) => {
    if (!d) {
      return false;
    }
    const prototype = Object.getPrototypeOf(d);

    return (
      Object.prototype.toString.call(d).slice(8, -1) === 'Object' &&
      (prototype === null || prototype === Object.getPrototypeOf({}))
    );
  });
}

function isArray(...args: any): boolean {
  return args.every(Array.isArray);
}

function isNumber(...args: any): boolean {
  return args.every((d: any) => typeof d === 'number');
}

export default function treeChanges(data: IData, nextData: IData): ITreeChanges {
  if (!data || !nextData) {
    throw new Error('Missing required parameters');
  }

  return {
    changed(key?: string | number): boolean {
      const left = nested(data, key);
      const right = nested(nextData, key);

      if (isArray(left, right) || isPlainObj(left, right)) {
        return !!diff(left, right);
      }

      return left !== right;
    },
    changedFrom(key: string | number, previous: TypeInput, actual?: TypeInput): boolean {
      if (typeof key === 'undefined') {
        throw new Error('Key parameter is required');
      }

      const useActual = typeof previous !== 'undefined' && typeof actual !== 'undefined';
      const left = nested(data, key);
      const right = nested(nextData, key);
      const leftComparator = Array.isArray(previous)
        ? previous.indexOf(left) >= 0
        : left === previous;
      const rightComparator = Array.isArray(actual) ? actual.indexOf(right) >= 0 : right === actual;

      return leftComparator && (useActual ? rightComparator : !useActual);
    },
    changedTo(key: string | number, actual: TypeInput): boolean {
      if (typeof key === 'undefined') {
        throw new Error('Key parameter is required');
      }

      const left = nested(data, key);
      const right = nested(nextData, key);

      const leftComparator = Array.isArray(actual) ? actual.indexOf(left) < 0 : left !== actual;
      const rightComparator = Array.isArray(actual) ? actual.indexOf(right) >= 0 : right === actual;

      return leftComparator && rightComparator;
    },
    increased(key: string | number): boolean {
      if (typeof key === 'undefined') {
        throw new Error('Key parameter is required');
      }

      return (
        isNumber(nested(data, key), nested(nextData, key)) &&
        nested(data, key) < nested(nextData, key)
      );
    },
    decreased(key: string | number): boolean {
      if (typeof key === 'undefined') {
        throw new Error('Key parameter is required');
      }

      return (
        isNumber(nested(data, key), nested(nextData, key)) &&
        nested(data, key) > nested(nextData, key)
      );
    },
  };
}
