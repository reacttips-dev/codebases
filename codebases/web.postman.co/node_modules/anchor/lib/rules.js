/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var validator = require('validator');

/**
 * Type rules
 */

var rules = {

  //  ┬┌─┐┌┐┌┌─┐┬─┐┌─┐  ┌┐┌┬ ┬┬  ┬
  //  ││ ┬││││ │├┬┘├┤   ││││ ││  │
  //  ┴└─┘┘└┘└─┘┴└─└─┘  ┘└┘└─┘┴─┘┴─┘
  'isBoolean': {
    fn: function(x) {
      return typeof x === 'boolean';
    },
    defaultErrorMessage: function(x) { return 'Value ('+util.inspect(x)+') was not a boolean.'; },
    expectedTypes: ['json', 'ref']
  },
  'isNotEmptyString': {
    fn: function(x) {
      return x !== '';
    },
    defaultErrorMessage: function(x) { return 'Value ('+util.inspect(x)+') was an empty string.'; },
    expectedTypes: ['json', 'ref', 'string']
  },
  'isInteger': {
    fn: function(x) {
      return typeof x === 'number' && (parseInt(x) === x);
    },
    defaultErrorMessage: function(x) { return 'Value ('+util.inspect(x)+') was not an integer.'; },
    expectedTypes: ['json', 'ref', 'number']
  },
  'isNumber': {
    fn: function(x) {
      return typeof x === 'number';
    },
    defaultErrorMessage: function(x) { return 'Value ('+util.inspect(x)+') was not a number.'; },
    expectedTypes: ['json', 'ref']
  },
  'isString': {
    fn: function(x) {
      return typeof x === 'string';
    },
    defaultErrorMessage: function(x) { return 'Value ('+util.inspect(x)+') was not a string.'; },
    expectedTypes: ['json', 'ref']
  },
  'max': {
    fn: function(x, maximum) {
      if (typeof x !== 'number') { throw new Error ('Value was not a number.'); }
      return x <= maximum;
    },
    defaultErrorMessage: function(x, maximum) { return 'Value ('+util.inspect(x)+') was greater than the configured maximum (' + maximum + ')'; },
    expectedTypes: ['json', 'ref', 'number'],
    checkConfig: function(constraint) {
      if (typeof constraint !== 'number') {
        return 'Maximum must be specified as a number; instead got `' + util.inspect(constraint) + '`.';
      }
      return false;
    }
  },
  'min': {
    fn: function(x, minimum) {
      if (typeof x !== 'number') { throw new Error ('Value was not a number.'); }
      return x >= minimum;
    },
    defaultErrorMessage: function(x, minimum) { return 'Value ('+util.inspect(x)+') was less than the configured minimum (' + minimum + ')'; },
    expectedTypes: ['json', 'ref', 'number'],
    checkConfig: function(constraint) {
      if (typeof constraint !== 'number') {
        return 'Minimum must be specified as a number; instead got `' + util.inspect(constraint) + '`.';
      }
      return false;
    }
  },


  //  ┬┌─┐┌┐┌┌─┐┬─┐┌─┐  ┌┐┌┬ ┬┬  ┬    ┌─┐┌┐┌┌┬┐  ┌─┐┌┬┐┌─┐┌┬┐┬ ┬  ┌─┐┌┬┐┬─┐┬┌┐┌┌─┐
  //  ││ ┬││││ │├┬┘├┤   ││││ ││  │    ├─┤│││ ││  ├┤ │││├─┘ │ └┬┘  └─┐ │ ├┬┘│││││ ┬
  //  ┴└─┘┘└┘└─┘┴└─└─┘  ┘└┘└─┘┴─┘┴─┘  ┴ ┴┘└┘─┴┘  └─┘┴ ┴┴   ┴  ┴   └─┘ ┴ ┴└─┴┘└┘└─┘
  'isAfter': {
    fn: function(x, constraint) {

      var normalizedX;
      if (_.isNumber(x)) {
        normalizedX = new Date(x).getTime();
      } else if (_.isDate(x)) {
        normalizedX = x.getTime();
      } else {
        normalizedX = Date.parse(x);
      }

      var normalizedConstraint;
      if (_.isNumber(constraint)) {
        normalizedConstraint = new Date(constraint).getTime();
      } else if (_.isDate(constraint)) {
        normalizedConstraint = constraint.getTime();
      } else {
        normalizedConstraint = Date.parse(constraint);
      }

      return normalizedX > normalizedConstraint;
    },
    expectedTypes: ['json', 'ref', 'string', 'number'],
    defaultErrorMessage: function(x, constraint) { return 'Value ('+util.inspect(x)+') was before the configured time (' + constraint + ')'; },
    ignoreEmptyString: true,
    checkConfig: function(constraint) {
      var isValidConstraint = (_.isNumber(constraint) || _.isDate(constraint) || (_.isString(constraint) && _.isNull(validator.toDate(constraint))));
      if (!isValidConstraint) {
        return 'Validation rule must be specified as a JS timestamp (number of ms since epoch), a natively-parseable date string, or a JavaScript Date instance; instead got `' + util.inspect(constraint) + '`.';
      } else {
        return false;
      }
    }

  },
  'isBefore': {
    fn: function(x, constraint) {

      var normalizedX;
      if (_.isNumber(x)) {
        normalizedX = new Date(x).getTime();
      } else if (_.isDate(x)) {
        normalizedX = x.getTime();
      } else {
        normalizedX = Date.parse(x);
      }

      var normalizedConstraint;
      if (_.isNumber(constraint)) {
        normalizedConstraint = new Date(constraint).getTime();
      } else if (_.isDate(constraint)) {
        normalizedConstraint = constraint.getTime();
      } else {
        normalizedConstraint = Date.parse(constraint);
      }

      return normalizedX < normalizedConstraint;
    },
    expectedTypes: ['json', 'ref', 'string', 'number'],
    defaultErrorMessage: function(x, constraint) { return 'Value ('+util.inspect(x)+') was after the configured time (' + constraint + ')'; },
    ignoreEmptyString: true,
    checkConfig: function(constraint) {
      var isValidConstraint = (_.isNumber(constraint) || _.isDate(constraint) || (_.isString(constraint) && _.isNull(validator.toDate(constraint))));
      if (!isValidConstraint) {
        return 'Validation rule must be specified as a JS timestamp (number of ms since epoch), a natively-parseable date string, or a JavaScript Date instance; instead got `' + util.inspect(constraint) + '`.';
      } else {
        return false;
      }
    }
  },
  'isCreditCard': {
    fn: function(x) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return validator.isCreditCard(x);
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function () { return 'Value was not a valid credit card.'; },
    ignoreEmptyString: true
  },
  'isEmail': {
    fn: function(x) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return validator.isEmail(x);
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function (x) { return 'Value ('+util.inspect(x)+') was not a valid email address.'; },
    ignoreEmptyString: true
  },
  'isHexColor': {
    fn: function(x) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return validator.isHexColor(x);
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function (x) { return 'Value ('+util.inspect(x)+') was not a valid hex color.'; },
    ignoreEmptyString: true
  },
  'isIn': {
    fn: function(x, constraint) {
      return _.contains(constraint, x);
    },
    expectedTypes: ['json', 'ref', 'string', 'number'],
    defaultErrorMessage: function(x, whitelist) { return 'Value ('+util.inspect(x)+') was not in the configured whitelist (' + whitelist.join(', ') + ')'; },
    ignoreEmptyString: true,
    checkConfig: function(constraint) {
      if (!_.isArray(constraint)) {
        return 'Allowable values must be specified as an array; instead got `' + util.inspect(constraint) + '`.';
      }
      return false;
    }

  },
  'isIP': {
    fn: function(x) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return validator.isIP(x);
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function (x) { return 'Value ('+util.inspect(x)+') was not a valid IP address.'; },
    ignoreEmptyString: true
  },
  'isNotIn': {
    fn: function(x, constraint) {
      return !_.contains(constraint, x);
    },
    expectedTypes: ['json', 'ref', 'string', 'number'],
    defaultErrorMessage: function(x, blacklist) { return 'Value ('+util.inspect(x)+') was in the configured blacklist (' + blacklist.join(', ') + ')'; },
    ignoreEmptyString: true,
    checkConfig: function(constraint) {
      if (!_.isArray(constraint)) {
        return 'Blacklisted values must be specified as an array; instead got `' + util.inspect(constraint) + '`.';
      }
      return false;
    }
  },
  'isURL': {
    fn: function(x, opt) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return validator.isURL(x, opt === true ? undefined : opt);
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function (x) { return 'Value ('+util.inspect(x)+') was not a valid URL.'; },
    ignoreEmptyString: true
  },
  'isUUID': {
    fn: function(x) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return validator.isUUID(x);
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function (x) { return 'Value ('+util.inspect(x)+') was not a valid UUID.'; },
    ignoreEmptyString: true
  },

  'minLength': {
    fn: function(x, minLength) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return x.length >= minLength;
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function(x, minLength) { return 'Value ('+util.inspect(x)+') was shorter than the configured minimum length (' + minLength + ')'; },
    ignoreEmptyString: true,
    checkConfig: function(constraint) {
      if (typeof constraint !== 'number' && parseInt(constraint) !== constraint) {
        return 'Minimum length must be specified as an integer; instead got `' + util.inspect(constraint) + '`.';
      }
      return false;
    }
  },
  'maxLength': {
    fn: function(x, maxLength) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return x.length <= maxLength;
    },
    expectedTypes: ['json', 'ref', 'string'],
    defaultErrorMessage: function(x, maxLength) { return 'Value was '+(maxLength-x.length)+' character'+((maxLength-x.length !== 1) ? 's' : '')+' longer than the configured maximum length (' + maxLength + ')'; },
    ignoreEmptyString: true,
    checkConfig: function(constraint) {
      if (typeof constraint !== 'number' && parseInt(constraint) !== constraint) {
        return 'Maximum length must be specified as an integer; instead got `' + util.inspect(constraint) + '`.';
      }
      return false;
    }
  },

  'regex': {
    fn: function(x, regex) {
      if (typeof x !== 'string') { throw new Error ('Value was not a string.'); }
      return validator.matches(x, regex);
    },
    defaultErrorMessage: function(x, regex) { return 'Value ('+util.inspect(x)+') did not match the configured regular expression (' + regex + ')'; },
    expectedTypes: ['json', 'ref', 'string'],
    ignoreEmptyString: true,
    checkConfig: function(constraint) {
      if (!_.isRegExp(constraint)) {
        return 'Expected a regular expression as the constraint; instead got `' + util.inspect(constraint) + '`.';
      }
      return false;
    }

  },

  //  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐
  //  │  │ │└─┐ │ │ ││││
  //  └─┘└─┘└─┘ ┴ └─┘┴ ┴
  // Custom rule function.
  'custom': {
    fn: function(x, customFn) {
      return customFn(x);
    },
    expectedTypes: ['json', 'ref', 'string', 'number', 'boolean'],
    defaultErrorMessage: function (x) { return 'Value ('+util.inspect(x)+') failed custom validation.'; },
    checkConfig: function(constraint) {
      if (!_.isFunction(constraint)) {
        return 'Expected a function as the constraint; instead got `' + util.inspect(constraint) + '`.  Please return `true` to indicate success, or otherwise return `false` or throw to indicate failure';
      }
      if (constraint.constructor.name === 'AsyncFunction') {
        return 'Custom validation function cannot be an `async function` -- please use synchronous logic and return `true` to indicate success, or otherwise return `false` or throw to indicate failure.';
      }
      return false;
    }

  }

};

// Wrap a rule in a function that handles nulls and empty strings as requested,
// and adds an `expectedTypes` array that users of the rule can check to see
// if their value is of a type that the rule is designed to handle.  Note that
// this list of types is not necessarily validated in the rule itself; that is,
// just because it lists "json, ref, string" doesn't necessarily mean that it
// will automatically kick out numbers (it might stringify them).  It's up to
// you to decide whether to run the validation based on its `expectedTypes`.
module.exports = _.reduce(rules, function createRule(memo, rule, ruleName) {

  // Wrap the original rule in a function that kicks out null and empty string if necessary.
  var wrappedRule = function(x) {

    // Never allow null or undefined.
    if (_.isNull(x) || _.isUndefined(x)) {
      return 'Got invalid value `' + x + '`!';
    }

    // Allow empty strings if we're explicitly ignoring them.
    if (x === '' && rule.ignoreEmptyString) {
      return false;
    }

    var passed;
    // Run the original rule function.
    try {
      passed = rule.fn.apply(rule, arguments);
    } catch (e) {
      // console.error('ERROR:',e);
      if (_.isError(e)) {
        return e.message;
      } else {
        return String(e);
      }
    }

    if (passed) { return false; }
    return _.isFunction(rule.defaultErrorMessage) ? rule.defaultErrorMessage.apply(rule, arguments) : rule.defaultErrorMessage;

  };//ƒ

  // If the rule doesn't declare its own config-checker, assume that the constraint is supposed to be `true`.
  // This is the case for most of the `is` rules like `isBoolean`, `isCreditCard`, `isEmail`, etc.
  if (_.isUndefined(rule.checkConfig)) {
    wrappedRule.checkConfig = function (constraint) {
      if (constraint !== true) {
        return 'This validation only accepts `true` as a constraint.  Instead, saw `' + constraint + '`.';
      }
      return false;
    };
  } else {
    wrappedRule.checkConfig = rule.checkConfig;
  }

  // Set the `expectedTypes` property of the wrapped function.
  wrappedRule.expectedTypes = rule.expectedTypes;

  // Return the wrapped function.
  memo[ruleName] = wrappedRule;

  return memo;

}, {});
