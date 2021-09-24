'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
var COMPLETED_VALUE = 100;

function getInitialState(props) {
  // When value is undefined, default to 0 and start optimistically loading
  var value = props.value,
      initialValue = props.initialValue;
  var valueToUse;

  if (value === undefined) {
    valueToUse = initialValue;
  } else if (value === null) {
    valueToUse = null;
  } else {
    valueToUse = Math.max(initialValue, value);
  }

  return {
    running: false,
    value: valueToUse
  };
}

var UIAbstractProgress = /*#__PURE__*/function (_Component) {
  _inherits(UIAbstractProgress, _Component);

  function UIAbstractProgress(props) {
    var _this;

    _classCallCheck(this, UIAbstractProgress);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIAbstractProgress).call(this, props)); // Always keep track of setTimeout id so if the component is unmounted
    // we can cancel any previous timer.

    _this.timerId = null;
    _this.state = getInitialState(props);
    return _this;
  }

  _createClass(UIAbstractProgress, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var autoStart = this.props.autoStart;

      if (autoStart && !window.VISUAL_REGRESSION) {
        this.start();
      }
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this$props = this.props,
          autoStart = _this$props.autoStart,
          value = _this$props.value;

      if (!autoStart && nextProps.autoStart) {
        this.start();
        return;
      }

      if (value !== nextProps.value) {
        this.incrementProgress(nextProps.value);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var value = this.state.value;
      this.cancelNextUpdate();

      if (value === null || value >= COMPLETED_VALUE) {
        this.setState({
          value: null
        });
      }
    }
  }, {
    key: "schedule",
    value: function schedule(fn) {
      var increment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.incrementInterval;
      this.cancelNextUpdate();
      this.timerId = setTimeout(fn, increment);
    }
  }, {
    key: "scheduleNextUpdate",
    value: function scheduleNextUpdate() {
      var _this2 = this;

      var maximum = this.props.maximum;
      var value = this.state.value;

      if (value <= maximum) {
        this.schedule(function () {
          _this2.incrementProgress();
        });
      }
    }
  }, {
    key: "cancelNextUpdate",
    value: function cancelNextUpdate() {
      clearTimeout(this.timerId);
    }
  }, {
    key: "start",
    value: function start() {
      this.setState({
        running: true
      });
      this.scheduleNextUpdate();
    }
  }, {
    key: "incrementProgress",
    value: function incrementProgress(nextValue) {
      var _this$props2 = this.props,
          initialValue = _this$props2.initialValue,
          maximum = _this$props2.maximum,
          incrementFactor = _this$props2.incrementFactor;
      var currentValue = this.state.value;

      if (this.isComplete(currentValue, nextValue)) {
        this.completeProgress();
        return;
      }

      if (nextValue != null) {
        this.setState({
          value: Math.max(nextValue, initialValue)
        });
        this.scheduleNextUpdate();
      } else if (currentValue != null) {
        // Increment remaining progress by incrementFactor
        // The progress bar won't reach 100% until completeProgress is called
        this.setState({
          value: currentValue + (maximum - currentValue) * incrementFactor
        });
        this.scheduleNextUpdate();
      }
    }
  }, {
    key: "isComplete",
    value: function isComplete(currentValue, nextValue) {
      // if value prop indicates we're done, or we've been spinning
      // our wheels up against the limit, finish off the animation
      return nextValue >= COMPLETED_VALUE || currentValue > COMPLETED_VALUE - 0.5 && nextValue == null;
    }
  }, {
    key: "completeProgress",
    value: function completeProgress() {
      var _this3 = this;

      var completionLingerTime = this.props.completionLingerTime;
      this.schedule(function () {
        // Move progress bar to 100%, then allow time for transition effects
        // before finally re-rendering the function with the done === true
        _this3.setState({
          value: COMPLETED_VALUE
        });

        _this3.schedule(function () {
          return _this3.setState({
            running: false
          });
        }, completionLingerTime);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          ProgressComponent = _this$props3.Component,
          render = _this$props3.render;
      var _this$state = this.state,
          running = _this$state.running,
          value = _this$state.value;
      var done = !running && value >= COMPLETED_VALUE;
      var passedProps = {
        easing: 'linear',
        value: value,
        done: done
      };

      if (render) {
        return render(passedProps);
      }

      return /*#__PURE__*/_jsx(ProgressComponent, Object.assign({}, passedProps));
    }
  }]);

  return UIAbstractProgress;
}(Component);

export { UIAbstractProgress as default };
UIAbstractProgress.displayName = 'UIAbstractProgress';
UIAbstractProgress.propTypes = {
  // start on mount, or no?
  autoStart: PropTypes.bool,
  // Component to render
  Component: PropTypes.elementType,
  // Render prop
  render: PropTypes.func,
  // how long should component "linger" at 100% before
  // `done` is passed? This is helpful for CSS effects
  completionLingerTime: PropTypes.number,
  // Percentage to optimistically creep the bar on each increment
  incrementFactor: PropTypes.number,
  // Time interval to make optimistic creeps
  incrementInterval: PropTypes.number,
  // Time to start the progress bar at to be optimistic
  initialValue: PropTypes.number,
  // maximum percentage of progress via optimism alone
  maximum: PropTypes.number,
  // this is the "real" value of the operation, provided by app
  value: PropTypes.number
};
UIAbstractProgress.defaultProps = {
  autoStart: true,
  completionLingerTime: 500,
  incrementFactor: 0.25,
  incrementInterval: 150,
  initialValue: 0,
  maximum: COMPLETED_VALUE
};