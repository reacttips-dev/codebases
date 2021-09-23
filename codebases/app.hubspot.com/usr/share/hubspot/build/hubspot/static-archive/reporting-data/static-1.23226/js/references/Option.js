'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import invariant from '../lib/invariant';
export var Option = /*#__PURE__*/function (_Record) {
  _inherits(Option, _Record);

  function Option(_ref) {
    var value = _ref.value,
        _ref$label = _ref.label,
        label = _ref$label === void 0 ? value : _ref$label,
        url = _ref.url;

    _classCallCheck(this, Option);

    invariant(value != null, 'expected valid `key` to be supplied, but got none');
    return _possibleConstructorReturn(this, _getPrototypeOf(Option).call(this, {
      value: String(value),
      label: String(label),
      url: url
    }));
  }

  return Option;
}(Record({
  value: null,
  label: null,
  url: null
}));
export var makeOption = function makeOption(value, label) {
  return new Option({
    value: value,
    label: label
  });
};