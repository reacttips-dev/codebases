'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import Severity from '../constants/Severity';

var EventData = function EventData(alarms) {
  _classCallCheck(this, EventData);

  var aboveNav = [];
  var belowNav = [];
  this.alarms = alarms;
  this.groupedAlarms = alarms.reduce(function (map, alarm) {
    var alarmSeverity = alarm.severity.key;
    map[alarmSeverity] = map[alarmSeverity] || [];

    if (alarm.severity === Severity.CRITSIT) {
      aboveNav.push(alarm);
    } else {
      belowNav.push(alarm);
    }

    map[alarmSeverity].push(alarm);
    return map;
  }, {});
  this.placement = {
    aboveNav: aboveNav,
    belowNav: belowNav
  };
};

export default EventData;