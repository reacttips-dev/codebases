export var uniqueArray = function uniqueArray(props, propName) {
  var array = props[propName];

  if (new Set(array).size !== array.length) {
    return new Error("Invalid param " + propName + " supplied to function. Validation failed.");
  }

  return null;
};