import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record as ImmutableRecord, List } from 'immutable';

var Timezone = /*#__PURE__*/function (_ImmutableRecord) {
  _inherits(Timezone, _ImmutableRecord);

  function Timezone() {
    _classCallCheck(this, Timezone);

    return _possibleConstructorReturn(this, _getPrototypeOf(Timezone).apply(this, arguments));
  }

  _createClass(Timezone, [{
    key: "identifier",
    value: function identifier() {
      return this.momentTimezones.first();
    }
  }]);

  return Timezone;
}(ImmutableRecord({
  offset: '',
  name: '',
  momentTimezones: List()
}));

export { Timezone as default };