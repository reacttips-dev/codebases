const { toString, hasOwnProperty } = Object.prototype;
const previousComparisons = new Map<object, Set<object>>();

/**
 * Performs a deep equality check on two JavaScript values, tolerating cycles.
 */
export function equal(a: any, b: any): boolean {
  try {
    return check(a, b);
  } finally {
    previousComparisons.clear();
  }
}

// Allow default imports as well.
export default equal;

function check(a: any, b: any): boolean {
  // If the two values are strictly equal, our job is easy.
  if (a === b) {
    return true;
  }

  // Object.prototype.toString returns a representation of the runtime type of
  // the given value that is considerably more precise than typeof.
  const aTag = toString.call(a);
  const bTag = toString.call(b);

  // If the runtime types of a and b are different, they could maybe be equal
  // under some interpretation of equality, but for simplicity and performance
  // we just return false instead.
  if (aTag !== bTag) {
    return false;
  }

  switch (aTag) {
    case '[object Array]':
      // Arrays are a lot like other objects, but we can cheaply compare their
      // lengths as a short-cut before comparing their elements.
      if (a.length !== b.length) return false;
      // Fall through to object case...
    case '[object Object]': {
      if (previouslyCompared(a, b)) return true;

      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);

      // If `a` and `b` have a different number of enumerable keys, they
      // must be different.
      const keyCount = aKeys.length;
      if (keyCount !== bKeys.length) return false;

      // Now make sure they have the same keys.
      for (let k = 0; k < keyCount; ++k) {
        if (!hasOwnProperty.call(b, aKeys[k])) {
          return false;
        }
      }

      // Finally, check deep equality of all child properties.
      for (let k = 0; k < keyCount; ++k) {
        const key = aKeys[k];
        if (!check(a[key], b[key])) {
          return false;
        }
      }

      return true;
    }

    case '[object Error]':
      return a.name === b.name && a.message === b.message;

    case '[object Number]':
      // Handle NaN, which is !== itself.
      if (a !== a) return b !== b;
      // Fall through to shared +a === +b case...
    case '[object Boolean]':
    case '[object Date]':
      return +a === +b;

    case '[object RegExp]':
    case '[object String]':
      return a == `${b}`;

    case '[object Map]':
    case '[object Set]': {
      if (a.size !== b.size) return false;
      if (previouslyCompared(a, b)) return true;

      const aIterator = a.entries();
      const isMap = aTag === '[object Map]';

      while (true) {
        const info = aIterator.next();
        if (info.done) break;

        // If a instanceof Set, aValue === aKey.
        const [aKey, aValue] = info.value;

        // So this works the same way for both Set and Map.
        if (!b.has(aKey)) {
          return false;
        }

        // However, we care about deep equality of values only when dealing
        // with Map structures.
        if (isMap && !check(aValue, b.get(aKey))) {
          return false;
        }
      }

      return true;
    }
  }

  // Otherwise the values are not equal.
  return false;
}

function previouslyCompared(a: object, b: object): boolean {
  // Though cyclic references can make an object graph appear infinite from the
  // perspective of a depth-first traversal, the graph still contains a finite
  // number of distinct object references. We use the previousComparisons cache
  // to avoid comparing the same pair of object references more than once, which
  // guarantees termination (even if we end up comparing every object in one
  // graph to every object in the other graph, which is extremely unlikely),
  // while still allowing weird isomorphic structures (like rings with different
  // lengths) a chance to pass the equality test.
  let bSet = previousComparisons.get(a);
  if (bSet) {
    // Return true here because we can be sure false will be returned somewhere
    // else if the objects are not equivalent.
    if (bSet.has(b)) return true;
  } else {
    previousComparisons.set(a, bSet = new Set);
  }
  bSet.add(b);
  return false;
}
