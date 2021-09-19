import { Class, PlainObject, Primitive } from './types';

const DOM_PROPERTIES_TO_CHECK: Array<keyof HTMLElement> = [
  'innerHTML',
  'ownerDocument',
  'style',
  'attributes',
  'nodeValue',
];

const objectTypes = [
  'Array',
  'ArrayBuffer',
  'AsyncFunction',
  'AsyncGenerator',
  'AsyncGeneratorFunction',
  'Date',
  'Error',
  'Function',
  'Generator',
  'GeneratorFunction',
  'HTMLElement',
  'Map',
  'Object',
  'Promise',
  'RegExp',
  'Set',
  'WeakMap',
  'WeakSet',
] as const;

const primitiveTypes = [
  'bigint',
  'boolean',
  'null',
  'number',
  'string',
  'symbol',
  'undefined',
] as const;

export type ObjectTypes = typeof objectTypes[number];

export type PrimitiveTypes = typeof primitiveTypes[number];

export type TypeName = ObjectTypes | PrimitiveTypes;

export function getObjectType(value: unknown): ObjectTypes | undefined {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);

  if (/HTML\w+Element/.test(objectTypeName)) {
    return 'HTMLElement';
  }

  if (isObjectType(objectTypeName)) {
    return objectTypeName;
  }

  return undefined;
}

function isObjectOfType<T>(type: string) {
  return (value: unknown): value is T => getObjectType(value) === type;
}

function isObjectType(name: unknown): name is ObjectTypes {
  return objectTypes.includes(name as ObjectTypes);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function isOfType<T extends Primitive | Function>(type: string) {
  return (value: unknown): value is T => typeof value === type;
}

function isPrimitiveType(name: unknown): name is PrimitiveTypes {
  return primitiveTypes.includes(name as PrimitiveTypes);
}

function is(value: unknown): TypeName {
  if (value === null) {
    return 'null';
  }

  switch (typeof value) {
    case 'bigint':
      return 'bigint';
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'symbol':
      return 'symbol';
    case 'undefined':
      return 'undefined';
    default:
  }

  if (is.array(value)) {
    return 'Array';
  }

  if (is.plainFunction(value)) {
    return 'Function';
  }

  const tagType = getObjectType(value);
  /* istanbul ignore else */
  if (tagType) {
    return tagType;
  }

  /* istanbul ignore next */
  return 'Object';
}

is.array = Array.isArray;

is.arrayOf = (target: unknown[], predicate: (v: unknown) => boolean): boolean => {
  if (!is.array(target) && !is.function(predicate)) {
    return false;
  }

  return target.every(d => predicate(d));
};

is.asyncGeneratorFunction = (value: unknown): value is (...args: any[]) => Promise<unknown> =>
  getObjectType(value) === 'AsyncGeneratorFunction';

// eslint-disable-next-line @typescript-eslint/ban-types
is.asyncFunction = isObjectOfType<Function>('AsyncFunction');

is.bigint = isOfType<bigint>('bigint');

is.boolean = (value: unknown): value is boolean => {
  return value === true || value === false;
};

is.date = isObjectOfType<Date>('Date');

is.defined = (value: unknown): boolean => !is.undefined(value);

is.domElement = (value: unknown): value is HTMLElement => {
  return (
    is.object(value) &&
    !is.plainObject(value) &&
    (value as HTMLElement).nodeType === 1 &&
    is.string((value as HTMLElement).nodeName) &&
    DOM_PROPERTIES_TO_CHECK.every(property => property in (value as HTMLElement))
  );
};

is.empty = (value: unknown): boolean => {
  return (
    (is.string(value) && value.length === 0) ||
    (is.array(value) && value.length === 0) ||
    (is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0) ||
    (is.set(value) && value.size === 0) ||
    (is.map(value) && value.size === 0)
  );
};

is.error = isObjectOfType<Error>('Error');

// eslint-disable-next-line @typescript-eslint/ban-types
is.function = isOfType<Function>('function');

is.generator = (value: unknown): value is Generator => {
  return (
    is.iterable(value) &&
    is.function((value as IterableIterator<unknown>).next) &&
    is.function((value as IterableIterator<unknown>).throw)
  );
};

is.generatorFunction = isObjectOfType<GeneratorFunction>('GeneratorFunction');

is.instanceOf = <T>(instance: unknown, class_: Class<T>): instance is T => {
  if (!instance || !(class_ as Class<T>)) {
    return false;
  }

  return Object.getPrototypeOf(instance) === class_.prototype;
};

is.iterable = (value: unknown): value is IterableIterator<unknown> => {
  return (
    !is.nullOrUndefined(value) && is.function((value as IterableIterator<unknown>)[Symbol.iterator])
  );
};

is.map = isObjectOfType<Map<unknown, unknown>>('Map');

is.nan = (value: unknown): boolean => {
  return Number.isNaN(value as number);
};

is.null = (value: unknown): value is null => {
  return value === null;
};

is.nullOrUndefined = (value: unknown): value is null | undefined => {
  return is.null(value) || is.undefined(value);
};

is.number = (value: unknown): value is number => {
  return isOfType<number>('number')(value) && !is.nan(value);
};

is.numericString = (value: unknown): value is string => {
  return is.string(value) && (value as string).length > 0 && !Number.isNaN(Number(value));
};

// eslint-disable-next-line @typescript-eslint/ban-types
is.object = (value: unknown): value is object => {
  return !is.nullOrUndefined(value) && (is.function(value) || typeof value === 'object');
};

is.oneOf = (target: unknown[], value: any): boolean => {
  if (!is.array(target)) {
    return false;
  }

  return target.indexOf(value) > -1;
};

// eslint-disable-next-line @typescript-eslint/ban-types
is.plainFunction = isObjectOfType<Function>('Function');

is.plainObject = (value: unknown): value is PlainObject => {
  if (getObjectType(value) !== 'Object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === null || prototype === Object.getPrototypeOf({});
};

is.primitive = (value: unknown): value is Primitive =>
  is.null(value) || isPrimitiveType(typeof value);

is.promise = isObjectOfType<Promise<unknown>>('Promise');

is.propertyOf = (
  target: PlainObject,
  key: string,
  predicate?: (v: unknown) => boolean,
): boolean => {
  if (!is.object(target) || !key) {
    return false;
  }

  const value = target[key];

  if (is.function(predicate)) {
    return predicate(value);
  }

  return is.defined(value);
};

is.regexp = isObjectOfType<RegExp>('RegExp');

is.set = isObjectOfType<Set<PlainObject>>('Set');

is.string = isOfType<string>('string');

is.symbol = isOfType<symbol>('symbol');

is.undefined = isOfType<undefined>('undefined');

is.weakMap = isObjectOfType<WeakMap<PlainObject, unknown>>('WeakMap');

is.weakSet = isObjectOfType<WeakSet<PlainObject>>('WeakSet');

export * from './types';

export default is;
