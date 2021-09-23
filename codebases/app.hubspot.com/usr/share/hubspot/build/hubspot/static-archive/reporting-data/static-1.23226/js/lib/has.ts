export var has = function has(object, property) {
  return Object.prototype.hasOwnProperty.call(object || {}, property);
};