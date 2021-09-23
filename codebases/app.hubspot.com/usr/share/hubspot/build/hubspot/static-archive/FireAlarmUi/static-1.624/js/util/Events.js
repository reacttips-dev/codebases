'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import EventGroups from '../constants/EventGroups';
var FIREALARM_PREOADED_EVENTS_KEY = '_preLoadEvents';

var Events = /*#__PURE__*/function () {
  function Events() {
    var _this = this;

    _classCallCheck(this, Events);

    this.events = {};
    this.eventMarkers = {};
    EventGroups.keys().forEach(function (key) {
      var group = EventGroups[key];
      _this.events[group] = [];
    });
  }

  _createClass(Events, [{
    key: "addEvent",
    value: function addEvent(group, callback) {
      this.events[group] = this.events[group] || [];
      this.events[group].push(callback);
    }
  }, {
    key: "addEventMarker",
    value: function addEventMarker(marker, data) {
      this.eventMarkers[marker] = this.eventMarkers[marker] || [];
      this.eventMarkers[marker].push(data);
    }
  }, {
    key: "extractPreloadEvents",
    value: function extractPreloadEvents(data) {
      var _this2 = this;

      var preloadEvents = data && data[FIREALARM_PREOADED_EVENTS_KEY] ? data[FIREALARM_PREOADED_EVENTS_KEY] : {};
      EventGroups.keys().forEach(function (key) {
        var group = EventGroups[key];

        if (preloadEvents[group] && Array.isArray(preloadEvents[group])) {
          preloadEvents[group].map(function (callback) {
            _this2.addEvent(group, callback);
          });
        }
      });
    }
  }, {
    key: "runEvents",
    value: function runEvents(eventGroup, data) {
      var eventData = {
        eventGroup: eventGroup,
        data: data
      };

      if (this.events[eventGroup]) {
        switch (eventGroup) {
          case EventGroups.eventGroups.CREATE_ALARM:
            {
              this.events[eventGroup].map(function (alarmData) {
                data.addAlarm(alarmData);
              });
              break;
            }

          default:
            {
              this.events[eventGroup].map(function (callback) {
                callback(eventData);
              });
            }
        }
      }

      this.addEventMarker(eventGroup, eventData);
    }
  }]);

  return Events;
}();

export default Events;