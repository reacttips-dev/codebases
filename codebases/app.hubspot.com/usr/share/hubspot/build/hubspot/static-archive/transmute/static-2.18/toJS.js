'use es6';
/**
 * Converts an Iterable to a native JS structure.
 *
 * @param  {Iterable} subject to convert.
 * @return {Array|Object} native JS requivalent of `subject`.
 */

export default function toJS(subject) {
  if (typeof subject !== 'object' || !subject) {
    return subject;
  }

  if (typeof subject.toJS === 'function') {
    return subject.toJS();
  }

  if (typeof subject.toJSON === 'function') {
    return subject.toJSON();
  }

  return subject;
}