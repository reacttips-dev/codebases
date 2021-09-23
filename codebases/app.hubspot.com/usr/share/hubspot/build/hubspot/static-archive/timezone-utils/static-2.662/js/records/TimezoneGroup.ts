import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record as ImmutableRecord, List } from 'immutable';

var TimezoneGroup = /*#__PURE__*/function (_ImmutableRecord) {
  _inherits(TimezoneGroup, _ImmutableRecord);

  function TimezoneGroup() {
    _classCallCheck(this, TimezoneGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(TimezoneGroup).apply(this, arguments));
  }

  _createClass(TimezoneGroup, [{
    key: "timezoneForMomentTimezone",
    value: function timezoneForMomentTimezone(timezone) {
      return this.timezones.find(function (tz) {
        return tz.momentTimezones.includes(timezone);
      });
    }
  }]);

  return TimezoneGroup;
}(ImmutableRecord({
  groupName: '',
  timezones: List()
}));

export default TimezoneGroup;