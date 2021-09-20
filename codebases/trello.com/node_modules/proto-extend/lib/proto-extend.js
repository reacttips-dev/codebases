var hasOwnProperty = Object.prototype.hasOwnProperty;

var extend = function(){
  var base = arguments[0];
  var extensions = Array.prototype.slice.call(arguments, 1);

  // Object prototype may only be an Object or null
  if (typeof base !== 'object') {
    base = null;
  }

  return extensions.reduce(function(base, object){
    if (typeof object !== 'object' || object === null) {
      return base;
    }
    return Object.create(base, getOwnPropertyDescriptorMap(object));
  }, base);
};

var getOwnPropertyDescriptorMap = function(object){
  var properties = Object.getOwnPropertyNames(object);

  return properties.reduce(function(map, property) {
    map[property] = Object.getOwnPropertyDescriptor(object, property);
    return map;
  }, Object.create(null));
};

var flatten = function(object, base){
  if (typeof base === 'undefined') {
    base = Object.prototype;
  }
  return _flatten(object, base, {});
}

var _flatten = function(object, base, descriptors){
  merge(descriptors, getOwnPropertyDescriptorMap(object));

  var proto = Object.getPrototypeOf(object);
  if (proto === base || proto === null) {
    return Object.create(proto, descriptors);
  }
  return _flatten(proto, base, descriptors);
};

var merge = function(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (!hasOwnProperty.call(dest, key)) {
      dest[key] = source[key];
    }
  });
  return;
};

module.exports = extend;
module.exports.getOwnPropertyDescriptorMap = getOwnPropertyDescriptorMap;
module.exports.flatten = flatten;
