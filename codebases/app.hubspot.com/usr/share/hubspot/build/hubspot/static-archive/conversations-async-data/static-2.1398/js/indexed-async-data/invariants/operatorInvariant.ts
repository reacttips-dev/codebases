import invariant from '../../lib/invariant';
export var operatorInvariant = function operatorInvariant(operator) {
  return invariant(typeof operator === 'function', 'Expected an operator to be a `function` not a `%s`', typeof operator);
};