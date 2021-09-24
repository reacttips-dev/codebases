import invariant from '../../lib/invariant';
export var numberIdInvariant = function numberIdInvariant(id) {
  var parsed = parseInt(id, 10);
  invariant(typeof parsed === 'number' && !isNaN(parsed), 'Expected id to be parsable as a number not a %s', typeof id);
};