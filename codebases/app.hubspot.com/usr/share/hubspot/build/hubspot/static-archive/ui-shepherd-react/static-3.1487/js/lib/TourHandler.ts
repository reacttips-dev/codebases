import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import PropTypes from 'prop-types';
import emptyFunction from 'react-utils/emptyFunction';
import invariant from 'react-utils/invariant';
import check from './checkParams';
import { uniqueArray } from './customPropTypes';
import ProgressStore from '../stores/ProgressStore';
import { NOT_STARTED, DONE } from '../constants/TourStates';
import handleCallback from './handleCallback';
var paramTypes = {
  key: PropTypes.string.isRequired,
  config: PropTypes.shape({
    steps: uniqueArray,
    beforeExit: PropTypes.func,
    beforeEnter: PropTypes.func,
    beforeStart: PropTypes.func,
    beforeFinish: PropTypes.func
  }),
  progressStore: PropTypes.instanceOf(ProgressStore).isRequired
};

var DefaultTourHandler = /*#__PURE__*/function () {
  function DefaultTourHandler(params) {
    _classCallCheck(this, DefaultTourHandler);

    check(params, paramTypes);
    var key = params.key,
        _params$config = params.config;
    _params$config = _params$config === void 0 ? {} : _params$config;

    var _params$config$steps = _params$config.steps,
        steps = _params$config$steps === void 0 ? [] : _params$config$steps,
        _params$config$before = _params$config.beforeExit,
        beforeExit = _params$config$before === void 0 ? emptyFunction : _params$config$before,
        _params$config$before2 = _params$config.beforeEnter,
        beforeEnter = _params$config$before2 === void 0 ? emptyFunction : _params$config$before2,
        _params$config$before3 = _params$config.beforeStart,
        beforeStart = _params$config$before3 === void 0 ? emptyFunction : _params$config$before3,
        _params$config$before4 = _params$config.beforeFinish,
        beforeFinish = _params$config$before4 === void 0 ? emptyFunction : _params$config$before4,
        restConfigs = _objectWithoutProperties(_params$config, ["steps", "beforeExit", "beforeEnter", "beforeStart", "beforeFinish"]),
        progressStore = params.progressStore;

    this.tour = key;
    this.config = Object.assign({
      steps: steps,
      beforeExit: beforeExit,
      beforeEnter: beforeEnter,
      beforeStart: beforeStart,
      beforeFinish: beforeFinish
    }, restConfigs);
    this.isActive = false;
    this.progressStore = progressStore;
    this._deactivate = this._deactivate.bind(this);
  }

  _createClass(DefaultTourHandler, [{
    key: "_deactivate",
    value: function _deactivate(callback) {
      var _this = this;

      return handleCallback(this.config.beforeExit, function () {
        _this.isActive = false;

        if (typeof callback === 'function') {
          callback();
        }
      }, {
        tourKey: this.tour,
        stepKey: this.getStepKey()
      });
    }
  }, {
    key: "deactivate",
    value: function deactivate(callback) {
      var _this2 = this;

      return handleCallback(this._deactivate, function () {
        _this2.progressStore.deactivate();

        if (typeof callback === 'function') {
          callback();
        }
      }, undefined);
    }
  }, {
    key: "_activate",
    value: function _activate() {
      var _this3 = this;

      var afterEnter = function afterEnter() {
        _this3.isActive = true;

        _this3._broadcastActiveTour(_this3.tour);
      };

      return handleCallback(this.config.beforeEnter, afterEnter, {
        tourKey: this.tour,
        stepKey: this.getStepKey()
      });
    }
  }, {
    key: "_broadcastActiveTour",
    value: function _broadcastActiveTour(tourKey) {
      this.progressStore.activateTour(tourKey);
    }
  }, {
    key: "_tryAction",
    value: function _tryAction() {
      invariant(this.isActive, 'This tour is not active, so it cannot perform that action');
    }
  }, {
    key: "subscribeToUpdates",
    value: function subscribeToUpdates(callback) {
      return this.progressStore.subscribe(callback);
    }
  }, {
    key: "canGoBack",
    value: function canGoBack() {
      return this.progressStore.canGoBack();
    }
  }, {
    key: "goBack",
    value: function goBack() {
      this._tryAction();

      this.progressStore.goBack(this.tour);
    }
  }, {
    key: "getConfig",
    value: function getConfig() {
      return this.config;
    }
  }, {
    key: "getIndex",
    value: function getIndex() {
      var step = this.getStepKey();
      return this.config.steps.indexOf(step);
    }
  }, {
    key: "getStepKey",
    value: function getStepKey() {
      return this.progressStore.getStep();
    }
  }, {
    key: "updateStep",
    value: function updateStep(stepKey) {
      this._tryAction();

      this.progressStore.updateProgress(stepKey, this.tour);
    }
  }, {
    key: "startTour",
    value: function startTour(chainable) {
      var _this4 = this;

      this._tryAction();

      var _this$config = this.config,
          beforeStart = _this$config.beforeStart,
          beforeEnter = _this$config.beforeEnter,
          steps = _this$config.steps;
      var startStep = steps[0];

      var goToStartStep = function goToStartStep() {
        return _this4.updateStep(startStep);
      };

      return handleCallback([beforeStart, beforeEnter], goToStartStep, {
        tourKey: this.tour,
        stepKey: startStep
      }, chainable);
    }
  }, {
    key: "nextStep",
    value: function nextStep(stepKey) {
      this._tryAction();

      if (stepKey) {
        this.updateStep(stepKey);
      } else {
        var tourConfig = this.config;
        var currentStepKey = this.getStepKey();
        invariant(currentStepKey !== NOT_STARTED && currentStepKey !== DONE, 'tour.start() must be called before advancing the tour index');
        var index = tourConfig.steps.indexOf(currentStepKey);
        var nextStepKey = tourConfig.steps[index + 1];

        if (nextStepKey) {
          this.updateStep(nextStepKey);
        } else {
          this.finishTour();
        }
      }
    }
  }, {
    key: "finishTour",
    value: function finishTour(chainable) {
      var _this5 = this;

      this._tryAction();

      var _this$config2 = this.config,
          beforeFinish = _this$config2.beforeFinish,
          beforeExit = _this$config2.beforeExit;

      var finishTour = function finishTour() {
        return _this5.updateStep(DONE);
      };

      return handleCallback([beforeFinish, beforeExit], finishTour, {
        tourKey: this.tour,
        stepKey: this.getStepKey()
      }, chainable);
    }
  }]);

  return DefaultTourHandler;
}();

export { DefaultTourHandler as default };