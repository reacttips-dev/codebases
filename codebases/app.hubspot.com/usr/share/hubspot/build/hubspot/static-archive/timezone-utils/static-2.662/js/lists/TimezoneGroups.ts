import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { List } from 'immutable';

var TimezoneGroups = /*#__PURE__*/function () {
  function TimezoneGroups(val) {
    _classCallCheck(this, TimezoneGroups);

    this.groups = List(val);
  }

  _createClass(TimezoneGroups, [{
    key: "groupForMomentTimezone",
    value: function groupForMomentTimezone(timezone) {
      return this.groups.find(function (g) {
        return g.timezones.some(function (tz) {
          return tz.momentTimezones.includes(timezone);
        });
      });
    }
  }, {
    key: "resolve",
    value: function resolve(timezone, defaultTz) {
      var groupForTimezone = this.groupForMomentTimezone(timezone);

      if (groupForTimezone === undefined && defaultTz) {
        groupForTimezone = this.groupForMomentTimezone(defaultTz);
        timezone = defaultTz;
      }

      return groupForTimezone.timezoneForMomentTimezone(timezone).identifier();
    }
  }]);

  return TimezoneGroups;
}();

export { TimezoneGroups as default };