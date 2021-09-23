'use es6'; // eslint-disable-next-line

var GLOBAL_THIS = self;
export var between = function between() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var leftIndex = str.indexOf(left);
  var rightIndex = str.indexOf(right);
  return str.substr(leftIndex + left.length, rightIndex - leftIndex - right.length);
};
/*
 * Naive approach warning:
 *   An exhaustive debounce function is not needed by the tracker.
 *   Please do not copy + paste this function :)
 */

export var debounce = function debounce(fn, wait) {
  var timeout;
  var result;

  var debounced = function debounced() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      timeout = null;
      result = fn.apply(null, args);
    }, wait);
    return result;
  };

  return debounced;
};
export var defaults = function defaults() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var blueprint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var withDefaults = Object.keys(blueprint).reduce(function (accumulator, key) {
    var value = source[key];

    if (value === undefined) {
      accumulator[key] = blueprint[key];
    }

    return accumulator;
  }, {});
  return Object.assign({}, source, {}, withDefaults);
};
export var isArray = function isArray(thing) {
  if (Array.hasOwnProperty('isArray')) {
    return Array.isArray(thing);
  }

  return Object.prototype.toString.call(thing) === '[object Array]';
};
export var makeUuid = function makeUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var v;
    var r = Math.random() * 16 | 0;

    if (c === 'x') {
      v = r;
    } else {
      v = r & 0x3 | 0x8;
    }

    return v.toString(16);
  });
};
export var mapObject = function mapObject() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var iteratee = arguments.length > 1 ? arguments[1] : undefined;
  return Object.keys(source).reduce(function (accumulator, key) {
    accumulator[key] = iteratee(key, source[key]);
    return accumulator;
  }, {});
};
export var omit = function omit() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var blacklistMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return Object.keys(source).reduce(function (accumulator, key) {
    var includes = list.indexOf(key) !== -1;
    var shouldOmit = blacklistMode ? includes : !includes;

    if (!shouldOmit) {
      accumulator[key] = source[key];
    }

    return accumulator;
  }, {});
};
export var once = function once(fn) {
  var isCached;
  var result;
  return function () {
    if (!isCached) {
      isCached = true;
      result = fn.apply(void 0, arguments);
    }

    return result;
  };
};
export var pluck = function pluck(subject, collection) {
  var intMode = isArray(collection);
  var base = intMode ? [] : {};
  return Object.keys(collection).reduce(function (accumulator, key) {
    var parsedKey = intMode ? parseInt(key, 10) : key;
    var entry = collection[parsedKey];
    accumulator[parsedKey] = entry[subject];
    return accumulator;
  }, base);
};
export var trim = function trim() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var outer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (typeof str.trim === 'function') {
    str = str.trim();
  } else {
    // IE8 doesn't support String.trim()
    str = str.replace(/^\s+|\s+$/g, '');
  }

  if (str.indexOf(outer) === 0) {
    str = str.substr(outer.length);
  }

  if (str.indexOf(outer) === str.length - outer.length) {
    str = str.substr(0, str.indexOf(outer));
  }

  return str;
};
export var shallowCopy = function shallowCopy() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(source).reduce(function (accumulator, key) {
    accumulator[key] = source[key];
    return accumulator;
  }, {});
};
export var truncate = function truncate() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 256;
  var truncated = str;

  if (truncated.length > limit) {
    truncated = truncated.substr(0, limit);
    truncated = truncated + "[..]";
  }

  return truncated;
};
export var cleanUrl = function cleanUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var cleaned = url;

  try {
    // remove query strings & anchors
    cleaned = cleaned.split('?')[0].split('#')[0]; // replace all ids & guids used as route params

    var parts = cleaned.split('/');

    if (parts.length > 4) {
      var rootParts = parts.slice(0, 4);
      var routeParts = parts.slice(4, parts.length).map(function (route) {
        if (/\d/.test(route)) {
          return '*';
        }

        return route;
      });
      cleaned = rootParts.join('/') + "/" + routeParts.join('/');
    } // remove trailing slashes


    if (cleaned.charAt(cleaned.length - 1) === '/') {
      cleaned = cleaned.substr(0, cleaned.length - 1);
    } // truncate lengthy urls


    cleaned = truncate(cleaned, 256);
  } catch (err) {
    cleaned = 'parsing error';
  }

  return cleaned;
};
export var resolveAsyncProperties = function resolveAsyncProperties() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var onError = arguments.length > 1 ? arguments[1] : undefined;
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  var resolved = {};
  var propertyKeys = Object.keys(properties);
  var propertiesLength = propertyKeys.length;
  var deferred = propertyKeys.reduce(function (accumulator, key) {
    var value = properties[key];

    if (value && typeof value === 'function') {
      value = value();

      if (value && typeof value.then === 'function') {
        accumulator.push({
          key: key,
          promise: value
        });
      } else {
        resolved[key] = value;
      }
    } else {
      resolved[key] = value;
    }

    return accumulator;
  }, []);

  var check = function check() {
    if (Object.keys(resolved).length === propertiesLength) {
      callback(resolved);
    }
  };

  if (deferred.length) {
    deferred.forEach(function (_ref) {
      var key = _ref.key,
          promise = _ref.promise;
      promise.then(function (value) {
        resolved[key] = value;
        check();
      }).catch(function (err) {
        resolved[key] = undefined;
        onError(err);
        check();
      });
    });
  } else {
    callback(resolved);
  }
};
export var createQueue = function createQueue() {
  var queue = [];
  return {
    enqueue: function enqueue(event) {
      return queue.unshift(event);
    },
    dequeue: function dequeue() {
      return queue.shift();
    },
    peek: function peek() {
      return queue[0];
    }
  };
};
export var safeGetOrDefault = function safeGetOrDefault() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GLOBAL_THIS;
  return path.reduce(function (last, cur, index) {
    var hasNode = last && cur && typeof last[cur] !== 'undefined';
    var isLeaf = index === path.length - 1;

    if (hasNode) {
      return last[cur];
    }

    if (isLeaf) {
      return def;
    }

    return {};
  }, root);
};