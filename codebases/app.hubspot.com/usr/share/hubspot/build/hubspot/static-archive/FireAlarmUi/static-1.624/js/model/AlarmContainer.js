'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { defaults } from '../util/Objects';
import Dom from '../util/Dom';
var NO_MARGIN_CLASS = 'fire-alarm_no-nav-margin-bottom';
var dom = new Dom(document);

var AlarmContainer = /*#__PURE__*/function () {
  function AlarmContainer() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AlarmContainer);

    this.config = defaults(config, {
      after: null,
      additionalClasses: [],
      before: null,
      parent: null
    });
    this.alarmElements = [];
  }

  _createClass(AlarmContainer, [{
    key: "addAlarm",
    value: function addAlarm(alarm) {
      if (!alarm.isDismissed()) {
        var alarmElement = alarm.getDomElement();

        if (this.alarmElements.indexOf(alarmElement) === -1) {
          this.alarmElements.push(alarmElement);
          this.getDomElement().appendChild(alarmElement);
        }
      }
    }
  }, {
    key: "removeAllAlarms",
    value: function removeAllAlarms() {
      if (this.domElement) {
        while (this.domElement.firstChild) {
          this.domElement.removeChild(this.domElement.firstChild);
        }

        this.alarmElements = [];
      }
    }
  }, {
    key: "getDomElement",
    value: function getDomElement() {
      if (this.domElement == null) {
        var additionalClasses = this.config.additionalClasses.join(' ');
        this.domElement = dom.createElement('div', {
          class: "fire-alarm_alarms " + additionalClasses
        });
      }

      return this.domElement;
    }
  }, {
    key: "addNoMarginClass",
    value: function addNoMarginClass() {
      if (!this.addedNoMarginClass) {
        this.getDomElement().classList.add(NO_MARGIN_CLASS);
        this.addedNoMarginClass = true;
      }
    }
  }, {
    key: "getParent",
    value: function getParent() {
      var _this$config = this.config,
          after = _this$config.after,
          before = _this$config.before,
          parent = _this$config.parent;

      if (!parent) {
        if (after) {
          this.config.parent = after.parentNode;
        } else if (before) {
          this.config.parent = before.parentNode;
        }
      }

      return this.config.parent;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$config2 = this.config,
          after = _this$config2.after,
          before = _this$config2.before;
      var parent = this.getParent();

      if (parent) {
        var container = this.getDomElement();

        if (after) {
          var afterBottomMargin = window.getComputedStyle(after).marginBottom; // Catch if the margin is 0, '0px' or undefined

          if (!parseInt(afterBottomMargin, 10)) {
            this.addNoMarginClass();
          }

          parent.insertBefore(container, after.nextSibling);
        } else if (before) {
          parent.insertBefore(container, before);
        } else {
          parent.appendChild(container);
        }
      }
    }
  }]);

  return AlarmContainer;
}();

export default AlarmContainer;