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
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import UIProgress from './UIProgress';
import UIAbstractProgress from './UIAbstractProgress';
var COMPLETED_VALUE = 100;

var UIOptimisticProgress = /*#__PURE__*/function (_Component) {
  _inherits(UIOptimisticProgress, _Component);

  function UIOptimisticProgress() {
    _classCallCheck(this, UIOptimisticProgress);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIOptimisticProgress).apply(this, arguments));
  }

  _createClass(UIOptimisticProgress, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          rest = _objectWithoutProperties(_this$props, ["children"]);

      return /*#__PURE__*/_jsx(UIAbstractProgress, Object.assign({}, rest, {
        render: function render(props) {
          return CustomRenderer.render(children, props, {
            mergeType: 'aggressive'
          });
        }
      }));
    }
  }]);

  return UIOptimisticProgress;
}(Component);

export { UIOptimisticProgress as default };
UIOptimisticProgress.displayName = 'UIOptimisticProgress';
UIOptimisticProgress.propTypes = {
  // start on mount, or no?
  autoStart: PropTypes.bool,
  // element or function to render
  children: CustomRenderer.propType,
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
UIOptimisticProgress.defaultProps = {
  autoStart: true,
  children: UIProgress,
  completionLingerTime: 500,
  incrementFactor: 0.25,
  incrementInterval: 150,
  initialValue: 0,
  maximum: COMPLETED_VALUE
};