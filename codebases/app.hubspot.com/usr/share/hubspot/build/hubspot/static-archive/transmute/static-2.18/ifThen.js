'use es6';

import curry from './curry';
import identity from './identity';
import ifElse from './ifElse';
var ifElseOp = ifElse.operation;

function ifThen(predicate, affirmative, subject) {
  return ifElseOp(predicate, affirmative, identity, subject);
}
/**
 * Applies `affirmative` to `subject` if `predicate(subject)` is truthy.
 * Otherwise returns `subject`.
 *
 * @example
 * import ifThen from 'transmute/ifThen';
 *
 * const toJS = ifThen(
 *   subject => typeof subject.toJS === 'function',
 *   subject => subject.toJS
 * );
 *
 * toJS(List.of(1, 2, 3)) //=> [1, 2, 3]
 * toJS([1, 2, 3]) //=> [1, 2, 3]
 *
 * @param {Function} predicate
 * @param {Function} affirmative
 * @param {any} subject
 * @return {any}
 */


export default curry(ifThen);