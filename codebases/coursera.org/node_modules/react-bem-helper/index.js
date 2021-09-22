var assign = require('object-assign');

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

function isString(string) {
  return typeof string === 'string';
}

function isFunction(func) {
  return typeof func === 'function';
}

function stringToArray(string) {
  return string.split(/\s+/g).filter(function(c) {return c.length !== 0});
}

function objectToArray(object) {
  return Object.keys(object).reduce(function(array, key) {
    var predicate = object[key];

    if (isFunction(predicate)) {
      predicate = predicate();
    }

    if (predicate) {
      return array.concat(stringToArray(key));
    } else {
      return array;
    }
  }, []);
}

function listToArray(list) {
  if (isString(list) && list !== '') {
    return stringToArray(list);
  } else if (list && list.length) {
    return list.reduce(function (array, string) {
      return !!string ? array.concat(stringToArray(string)) : array;
    }, []);
  } else if (isObject(list)) {
    return objectToArray(list);
  } else {
    return [];
  }
}

function withDefaults(defaults) {
  return function(options) {
    if (isString(options)) {
      options = { name: options };
    }

    var rootDefaults = {
      prefix: '',
      modifierDelimiter: '--',
      outputIsString: false,
    };

    // Copy options on top of defaults
    options = assign(rootDefaults, defaults, options);

    var blockName         = options.prefix + options.name;
    var modifierDelimiter = options.modifierDelimiter;
    var outputIsString    = options.outputIsString;

    return function(first, modifiers, extraClassNames) {
      var element;

      // This means the first parameter is not the element, but a configuration variable
      if (isObject(first)) {
        element = first.element;
        modifiers = first.modifiers || first.modifier;
        extraClassNames = first.extra;
      } else {
        element = first;
      }

      var rootName = element ? blockName + '__' + element : blockName;
      var className = [rootName]
        .concat(listToArray(modifiers).map(function(modifier) {
          return rootName + modifierDelimiter + modifier;
        }))
        .concat(listToArray(extraClassNames))
        .join(' ')
        .trim();

      if (outputIsString) {
        return className;
      } else {
        return { className: className };
      }
    };
  };
}

var BEMHelper = withDefaults({});

BEMHelper.withDefaults = withDefaults;
module.exports = BEMHelper;
