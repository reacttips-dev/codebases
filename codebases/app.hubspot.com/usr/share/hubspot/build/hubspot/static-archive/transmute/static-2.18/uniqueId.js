'use es6';

var nextId = 0;
/**
 * Returns a unique integer string appended to `prefix`.
 *
 * @example
 * uniqueId('test-') === 'test-1';
 * uniqueId('other-') === 'other-2';
 * uniqueId('test-') === 'test-3';
 */

export default function uniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "" + prefix + nextId++;
}