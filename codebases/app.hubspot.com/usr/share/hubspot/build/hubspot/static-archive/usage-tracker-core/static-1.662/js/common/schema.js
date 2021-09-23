'use es6';

import { defaults, isArray, pluck, omit } from './helpers';
export var create = function create(name, createError, rules) {
  var omitExtras = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var getKeys = function getKeys() {
    return Object.keys(rules);
  };

  var mutate = function mutate(callback) {
    var updatedRules = callback(rules);
    return create(name, createError, updatedRules, omitExtras);
  };

  var validate = function validate(subject, caller, onError) {
    try {
      getKeys().forEach(function (key) {
        var _rules$key = rules[key],
            types = _rules$key.types,
            oneOf = _rules$key.oneOf,
            isOptional = _rules$key.isOptional;
        var entry = subject[key];
        var isDefined = entry !== undefined;
        var type = typeof entry;

        if (isArray(entry)) {
          type = 'array';
        }

        if (isOptional && !isDefined) {
          return;
        }

        if (!isDefined) {
          throw createError("Missing required " + name + " \"" + key + "\". " + caller + " requires that a value be passed for " + name + " \"" + key + "\". Received \"undefined\".");
        }

        if (type !== 'function' && isArray(oneOf) && oneOf.indexOf(entry) === -1) {
          throw createError("Invalid " + name + ". " + caller + " requires that the \"" + key + "\" " + name + " be one of [\"" + oneOf.join('", "') + "\"]. Received \"" + entry + "\".");
        }

        if (isArray(types) && types.indexOf(type) === -1) {
          throw createError("Invalid " + name + ". " + caller + " requires that the \"" + key + "\" " + name + " type be one of [\"" + types.join('", "') + "\"]. Received \"" + type + "\".");
        }
      });
    } catch (err) {
      if (onError && typeof onError === 'function') {
        onError(err);
      } else {
        throw err;
      }
    }
  };

  var validateEach = function validateEach(subject, caller, onError) {
    try {
      Object.keys(subject).forEach(function (key) {
        var entry = subject[key];
        validate(entry, caller);
      });
    } catch (err) {
      if (onError && typeof onError === 'function') {
        onError(err);
      } else {
        throw err;
      }
    }
  };

  var normalize = function normalize(subject) {
    var withDefaults = defaults(subject, pluck('default', rules));

    if (omitExtras) {
      return omit(withDefaults, getKeys(), false);
    }

    return withDefaults;
  };

  var normalizeEach = function normalizeEach(subject) {
    return Object.keys(subject).reduce(function (accumulator, key) {
      var entry = subject[key];
      accumulator[key] = normalize(entry);
      return accumulator;
    }, {});
  };

  return {
    getKeys: getKeys,
    mutate: mutate,
    normalize: normalize,
    normalizeEach: normalizeEach,
    validate: validate,
    validateEach: validateEach,
    _peek: function _peek() {
      return rules;
    }
  };
};