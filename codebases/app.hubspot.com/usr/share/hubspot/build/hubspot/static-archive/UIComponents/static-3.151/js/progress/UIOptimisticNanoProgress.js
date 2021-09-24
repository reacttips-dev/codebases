'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import omit from '../utils/underscore/omit';
import UIAbstractProgress from './UIAbstractProgress';
import UINanoProgress from './UINanoProgress';

var UIOptimisticNanoProgress = /*#__PURE__*/function (_Component) {
  _inherits(UIOptimisticNanoProgress, _Component);

  function UIOptimisticNanoProgress() {
    _classCallCheck(this, UIOptimisticNanoProgress);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIOptimisticNanoProgress).apply(this, arguments));
  }

  _createClass(UIOptimisticNanoProgress, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          initialValue = _this$props.initialValue,
          optimismFactor = _this$props.optimismFactor,
          optimismIncrement = _this$props.optimismIncrement,
          animateOnComplete = _this$props.animateOnComplete,
          completionLinger = _this$props.completionLinger,
          _value = _this$props.value,
          rest = _objectWithoutProperties(_this$props, ["className", "initialValue", "optimismFactor", "optimismIncrement", "animateOnComplete", "completionLinger", "value"]);

      return /*#__PURE__*/_jsx(UIAbstractProgress, {
        value: _value,
        initialValue: initialValue,
        incrementFactor: optimismFactor,
        incrementInterval: optimismIncrement,
        completionLingerTime: completionLinger,
        render: function render(_ref) {
          var done = _ref.done,
              value = _ref.value;

          if (value === null || done && animateOnComplete) {
            return null;
          }

          return /*#__PURE__*/_jsx(UINanoProgress, Object.assign({}, rest, {
            animateOnComplete: animateOnComplete,
            className: className,
            value: value
          }));
        }
      });
    }
  }]);

  return UIOptimisticNanoProgress;
}(Component);

export { UIOptimisticNanoProgress as default };
UIOptimisticNanoProgress.displayName = 'UIOptimisticNanoProgress';
UIOptimisticNanoProgress.propTypes = Object.assign({}, UINanoProgress.propTypes, {
  // Time to start the progress bar at to be super optimistic
  initialValue: PropTypes.number,
  // Percentage to optimistically creep the bar on each increment
  optimismFactor: PropTypes.number,
  // Time interval to make optimisitc creeps
  optimismIncrement: PropTypes.number
});
UIOptimisticNanoProgress.defaultProps = Object.assign({}, omit(UINanoProgress.defaultProps, ['value']), {
  initialValue: 0,
  completionLinger: 500,
  optimismFactor: 0.25,
  optimismIncrement: 150,
  animateOnComplete: false
});