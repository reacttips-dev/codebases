/* eslint no-console: 0 */
'use es6'; // BasePatternFactory
// ---
// Standardize pattern structure and provide free invariant checking.

var REQUIRED_PROPERTIES_CHECK = function REQUIRED_PROPERTIES_CHECK(name, validator) {
  if (!name || typeof name !== 'string') {
    console.error("Required \"name\" string property not provider for pattern. Provided: " + typeof name);
  }

  if (!validator || typeof validator !== 'function') {
    console.error("Required \"validator\" callback not provider for \"" + name + " pattern\". Provided: " + typeof validator);
  }
};

var TYPE_INVARIANT = function TYPE_INVARIANT(name, method, input, requiredInputType) {
  var actualInputType = typeof input;

  if (actualInputType !== requiredInputType) {
    console.error("Invariant error in " + name + " pattern. Pattern." + method + "() method can only be passed a " + requiredInputType + ". Provided: " + actualInputType);
    return true;
  }

  return false;
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? '' : _ref$name,
      _ref$inputType = _ref.inputType,
      inputType = _ref$inputType === void 0 ? 'string' : _ref$inputType,
      _ref$validator = _ref.validator,
      validator = _ref$validator === void 0 ? null : _ref$validator,
      _ref$rules = _ref.rules,
      rules = _ref$rules === void 0 ? null : _ref$rules,
      _ref$matcher = _ref.matcher,
      matcher = _ref$matcher === void 0 ? null : _ref$matcher;

  if (rules) {
    validator = function validator(input) {
      return Object.keys(rules).every(function (key) {
        return rules[key].test(input);
      });
    };
  }

  REQUIRED_PROPERTIES_CHECK(name, validator);
  var Pattern = {
    name: name,
    inputType: inputType,
    test: function test(input) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (inputType && TYPE_INVARIANT(name, 'test', input, inputType)) {
        return false;
      }

      return validator(input, options);
    }
  };

  if (matcher && typeof matcher === 'function') {
    Pattern.match = function (input) {
      if (inputType && TYPE_INVARIANT(name, 'match', input, inputType)) {
        return false;
      }

      return matcher(input);
    };
  }

  if (rules) {
    Pattern.testRules = function (input) {
      return Object.keys(rules).map(function (key) {
        return {
          rule: key,
          valid: rules[key].test(input)
        };
      });
    };
  }

  return Pattern;
});