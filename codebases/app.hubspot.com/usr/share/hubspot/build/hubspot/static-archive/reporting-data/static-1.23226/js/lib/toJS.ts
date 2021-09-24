import { Iterable } from 'immutable';
/**
 * Converts an Iterable to a native JS structure.
 *
 * @param  {Iterable} subject to convert.
 * @return {Array|Object} native JS requivalent of `subject`.
 */

export default function toJS(subject) {
  if (!Iterable.isIterable(subject)) {
    return subject;
  }

  return subject.toJS();
}