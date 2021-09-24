'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { objectAssign } from '../util/Objects';
import Severity from '../constants/Severity';
import EventGroups from '../constants/EventGroups';
var DEFAULT_CTA_TEXT = 'View status page';

var Alarm = /*#__PURE__*/function () {
  function Alarm(alarmData, dom, storage, events, date) {
    _classCallCheck(this, Alarm);

    objectAssign(this, alarmData);
    this.dom = dom;
    this.storage = storage;
    this.events = events;
    this.date = date || Date;
    this.severity = Severity.getByKey(alarmData.severity);
    var id = this.id || this.uuid;
    this.alarmId = "alarm." + id + ".revision." + this.revisionNumber;
    this.className = 'Alarm';
    this.storageKey = "firealarm.dismiss." + this.alarmId;
    this.analyticsKey = "firealarm.analytics." + this.alarmId;
    this.domElement = null;
    this.alarmElementId = "firealarm-" + (this.id || this.date.now());
    this.alarmDismissButtonId = this.alarmElementId + "-dismiss";
  }

  _createClass(Alarm, [{
    key: "dismiss",
    value: function dismiss() {
      this.storage.setItem(this.storageKey, "true");

      if (this.domElement) {
        var parent = this.domElement.parentNode;
        parent.removeChild(this.domElement);

        if (!parent.hasChildNodes()) {
          parent.parentNode.removeChild(parent);
        }
      }

      this.events.runEvents(EventGroups.ON_DISMISS_ALARM, this);
    }
  }, {
    key: "getDomElement",
    value: function getDomElement() {
      if (!this.domElement) {
        var ctaText = this.callToAction && this.callToAction.ctaText || DEFAULT_CTA_TEXT;
        this.domElement = this.dom.createElementFromHtml("<div\n          id=\"" + this.alarmElementId + "\"\n          class=\"fire-alarm_alarm fire-alarm_" + this.severity.key.toLowerCase() + "\"\n          role=\"alert\"\n          aria-live=\"assertive\"\n          aria-atomic=\"true\" >\n            <div class=\"fire-alarm_alarm-inner\">\n              <div class=\"fire-alarm_alarm-body\">\n                <h2>" + this.title + "</h2>\n                <p>" + this.message + "</p>\n              </div>\n            </div>\n        </div>");

        if (this.callToAction) {
          var callToActionLink = this.dom.createElementFromHtml("<a class=\"fire-alarm_alarm-status-page-link\" href=\"" + this.callToAction.url + "\" target=\"_blank\">" + ctaText + "</a>");
          this.domElement.appendChild(callToActionLink);
        }

        if (this.dismissible !== false) {
          this.renderDismissButton();
        }
      }

      return this.domElement;
    }
  }, {
    key: "renderDismissButton",
    value: function renderDismissButton() {
      var _this = this;

      var dismissButton = this.dom.createElementFromHtml("<button id=" + this.alarmDismissButtonId + " type=\"button\" data-action=\"close\" class=\"fire-alarm_alarm-close-button\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\" class=\"alarm-close-icon\">\n            <path transform=\"translate(-1 -1)\" d=\"M14.5,1.5l-13,13m0-13,13,13\"></path>\n          </svg>\n          <span class=\"fire-alarm_alarm-button-text\">Close</span>\n        </button>");
      this.domElement.appendChild(dismissButton); // wire up dismiss button
      // This should handle click and touch events

      if (dismissButton) {
        var onDismissButton = function onDismissButton(event) {
          event.preventDefault();

          _this.dismiss();
        };

        dismissButton.addEventListener('touchend', onDismissButton);
        dismissButton.addEventListener('click', onDismissButton);
      }
    }
  }, {
    key: "isDismissed",
    value: function isDismissed() {
      return this.storage.getItem(this.storageKey) === "true";
    }
  }]);

  return Alarm;
}();

export default Alarm;