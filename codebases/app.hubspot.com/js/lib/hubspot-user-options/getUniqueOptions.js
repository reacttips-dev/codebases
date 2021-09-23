'use es6';

export default function getUniqueOptions(options) {
  var hasValue = {};
  return options.filter(function (_ref) {
    var value = _ref.value;

    if (hasValue[value]) {
      return false;
    }

    hasValue[value] = true;
    return true;
  });
}