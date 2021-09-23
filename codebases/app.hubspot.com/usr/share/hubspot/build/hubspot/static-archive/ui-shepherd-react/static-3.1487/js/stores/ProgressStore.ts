import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import invariant from 'react-utils/invariant';
import { NOT_STARTED, DONE } from '../constants/TourStates';

var ProgressStore = /*#__PURE__*/function () {
  function ProgressStore() {
    _classCallCheck(this, ProgressStore);

    this.subscriptions = [];
    this.progress = [];
  }

  _createClass(ProgressStore, [{
    key: "subscribe",
    value: function subscribe(callback) {
      var _this = this;

      this.subscriptions.push(callback);
      return function () {
        return _this.unsubscribe(callback);
      };
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(callback) {
      this.subscriptions = this.subscriptions.filter(function (value) {
        return value !== callback;
      });
    }
  }, {
    key: "activateTour",
    value: function activateTour(tour) {
      var _this2 = this;

      this.subscriptions.forEach(function (callback) {
        callback(_this2.getStep(), tour);
      });
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.subscriptions.forEach(function (callback) {
        callback(null, null);
      });
    }
  }, {
    key: "updateProgress",
    value: function updateProgress(step, tour) {
      this.progress.push(step);
      this.subscriptions.forEach(function (callback) {
        callback(step, tour);
      });

      if (step === DONE) {
        this.progress = [];
      }

      return step;
    }
  }, {
    key: "getStep",
    value: function getStep() {
      return this.progress[this.progress.length - 1] || NOT_STARTED;
    }
  }, {
    key: "canGoBack",
    value: function canGoBack() {
      return this.progress.length > 1;
    }
  }, {
    key: "goBack",
    value: function goBack(tour) {
      var poppedPoint = this.progress.pop();
      invariant(typeof poppedPoint !== 'undefined', 'can not go back with no history');
      var lastStep = this.progress[this.progress.length - 1];
      this.subscriptions.forEach(function (callback) {
        callback(lastStep, tour);
      });
      return lastStep;
    }
  }]);

  return ProgressStore;
}();

export { ProgressStore as default };