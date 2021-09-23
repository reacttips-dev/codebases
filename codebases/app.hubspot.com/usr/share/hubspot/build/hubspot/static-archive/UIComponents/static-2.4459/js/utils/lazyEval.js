'use es6'; // Similar to _.result, but with support for the single-arg case, e.g.
// `result(foo)` gives you `typeof foo === 'function' ? foo() : foo`.

export default function lazyEval(object, property) {
  var subject = property ? object[property] : object;
  return typeof subject === 'function' ? subject() : subject;
}