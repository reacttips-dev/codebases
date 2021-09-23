import invariant from '../../lib/invariant';
export var stringIdInvariant = function stringIdInvariant(id) {
  invariant(typeof id === 'string', 'Expected id to be a string not a %s', typeof id);
};
export var stringIdInvariantWithName = function stringIdInvariantWithName(name) {
  return function (id) {
    invariant(typeof id === 'string', name + " Expected id to be a string not a %s", typeof id);
  };
};