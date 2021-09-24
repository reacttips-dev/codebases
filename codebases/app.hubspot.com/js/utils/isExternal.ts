export var isExternal = function isExternal(string) {
  return !!(string && string.indexOf('http') === 0);
};