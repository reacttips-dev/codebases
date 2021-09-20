/**
 * `Object.freeze` has spotty performance. Fortunately, we can derive pretty
 * much all of its perks by simply typing an object with the `Readonly` utility.
 *
 * In dev environments, we can actually freeze our objects, but in other
 * environments the original object is probably more performant.
 */
export const freeze = <T>(obj: T): Readonly<T> =>
  process.env.NODE_ENV === 'development' ? Object.freeze(obj) : obj;
