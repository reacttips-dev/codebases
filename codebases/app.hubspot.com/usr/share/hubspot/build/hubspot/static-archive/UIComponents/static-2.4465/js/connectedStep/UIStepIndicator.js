'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { isValidElement, PureComponent } from 'react';
import classNames from 'classnames';
import devLogger from 'react-utils/devLogger';
import { toPx } from '../utils/Styles';
import UIClickable from '../button/UIClickable';
import UIIconCircle from '../icon/UIIconCircle';
import { ICON_SIZES } from '../icon/IconConstants';
import { LORAX, OLAF } from 'HubStyleTokens/colors';
import { BASE_LINE_HEIGHT } from 'HubStyleTokens/sizes';

var DefaultStepIconComponent = function DefaultStepIconComponent(_ref) {
  var defaultIcon = _ref.defaultIcon;
  return defaultIcon;
};

var getCircleSize = function getCircleSize(size) {
  return ICON_SIZES[size] || size;
};

var getKeyFromStep = function getKeyFromStep(stepElement) {
  if (! /*#__PURE__*/isValidElement(stepElement)) return stepElement;
  var key = stepElement.key;

  if (process.env.NODE_ENV !== 'production' && typeof key !== 'string') {
    devLogger.warn({
      message: 'UIStepIndicator: stepName elements must have a `key`',
      key: 'UIStepIndicator-stepName-key'
    });
  }

  return key;
};

var renderStep = function renderStep(step, circleSize, direction) {
  var lineHeightOffset = parseInt(BASE_LINE_HEIGHT, 10) / 2;
  var labelSeparationX = 10;
  var itemOffsetX = direction === 'vertical' ? toPx(getCircleSize(circleSize) * 2 + labelSeparationX) : null;
  var itemOffsetY = direction === 'vertical' ? toPx(getCircleSize(circleSize) - lineHeightOffset) : null;
  return /*#__PURE__*/_jsx("div", {
    className: "private-step-indicator__item",
    style: {
      marginLeft: itemOffsetX,
      marginTop: itemOffsetY
    },
    children: /*#__PURE__*/_jsx("span", {
      className: "private-step-indicator__text",
      children: step
    })
  });
};

var renderSteps = function renderSteps(circleSize, direction, onStepClick, stepIndex, stepNames, StepIconComponent) {
  var stepStatus = 'incomplete';
  return stepNames.map(function (stepName, index) {
    if (index < stepIndex && stepIndex > 0) {
      stepStatus = 'complete';
    } else if (index === stepIndex) {
      stepStatus = 'active';
    } else if (stepStatus === 'active') {
      // If stepStatus is "active", then all subsequent steps are incomplete
      stepStatus = 'incomplete';
    }

    var clickableClass = onStepClick && index !== stepIndex ? 'private-step-indicator__clickable' : undefined;
    var classes = classNames("private-step-indicator__section private-step-indicator__section--" + stepStatus, clickableClass);

    var stepIcon = /*#__PURE__*/_jsx(UIIconCircle, {
      legacy: true,
      color: stepStatus === 'complete' ? OLAF : LORAX,
      backgroundColor: stepStatus === 'complete' ? LORAX : OLAF,
      borderColor: "currentColor",
      borderWidth: 2,
      className: "private-step-indicator__point",
      name: stepStatus === 'complete' ? 'success' : 'blank',
      size: getCircleSize(circleSize)
    });

    var StepIndicatorWrapper = onStepClick && index !== stepIndex ? UIClickable : 'div';
    return /*#__PURE__*/_jsxs(StepIndicatorWrapper, {
      "aria-current": stepStatus === 'active' ? 'step' : false,
      className: classes,
      onClick: onStepClick && index !== stepIndex ? function () {
        return onStepClick(index);
      } : undefined,
      children: [/*#__PURE__*/_jsx("div", {
        className: "private-step-indicator__line",
        children: /*#__PURE__*/_jsx("span", {
          className: "private-step-indicator__point",
          children: /*#__PURE__*/_jsx(StepIconComponent, {
            stepIndex: stepIndex,
            stepStatus: stepStatus,
            index: index,
            circleSize: circleSize,
            defaultIcon: stepIcon
          })
        })
      }), renderStep(stepName, circleSize, direction)]
    }, getKeyFromStep(stepName));
  });
};

var UIStepIndicator = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIStepIndicator, _PureComponent);

  function UIStepIndicator(props) {
    var _this;

    _classCallCheck(this, UIStepIndicator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIStepIndicator).call(this, props));

    _this.refCallback = function (ref) {
      _this._el = ref;

      _this.measureWidth();
    };

    _this.measureWidth = function () {
      var _this$props = _this.props,
          direction = _this$props.direction,
          responsiveBreakpoint = _this$props.responsiveBreakpoint,
          use = _this$props.use;
      if (use === 'compact' || direction !== 'horizontal' || !_this._el) return;

      if (_this.state.isWidthConstrained) {
        _this._el.classList.remove('private-step-indicator--compact');
      } // Measure width of wrapper and compare against threshold


      var isWidthConstrained = _this._el.clientWidth < responsiveBreakpoint;

      if (isWidthConstrained !== _this.state.isWidthConstrained) {
        _this.setState({
          isWidthConstrained: isWidthConstrained
        });
      }

      if (_this.state.isWidthConstrained) {
        _this._el.classList.add('private-step-indicator--compact');
      }
    };

    _this.state = {
      isWidthConstrained: false
    };
    addEventListener('resize', _this.measureWidth);
    return _this;
  }

  _createClass(UIStepIndicator, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // ⚠️ This condition prevents infinite loops! ⚠️
      if (prevState.isWidthConstrained === this.state.isWidthConstrained) {
        this.measureWidth();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      removeEventListener('resize', this.measureWidth);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          circleSize = _this$props2.circleSize,
          className = _this$props2.className,
          direction = _this$props2.direction,
          onStepClick = _this$props2.onStepClick,
          stepIndex = _this$props2.stepIndex,
          stepNames = _this$props2.stepNames,
          StepIconComponent = _this$props2.StepIconComponent,
          use = _this$props2.use;
      var isWidthConstrained = this.state.isWidthConstrained;
      var classes = classNames(className, 'private-step-indicator', (use === 'compact' || isWidthConstrained) && 'private-step-indicator--compact', StepIconComponent !== DefaultStepIconComponent && 'private-step-indicator--customized', {
        'horizontal': 'private-step-indicator--horizontal',
        'vertical': 'private-step-indicator--vertical'
      }[direction], use === 'flush' && 'private-step-indicator--flush private-step-indicator--compact');
      return /*#__PURE__*/_jsxs("div", {
        className: classes,
        direction: direction,
        ref: this.refCallback,
        children: [renderSteps(circleSize, direction, onStepClick, stepIndex, stepNames, StepIconComponent), direction === 'horizontal' ? /*#__PURE__*/_jsx("span", {
          "aria-hidden": true,
          className: "private-step-indicator__item private-step-indicator__status",
          children: stepNames[stepIndex]
        }) : null]
      });
    }
  }]);

  return UIStepIndicator;
}(PureComponent);

UIStepIndicator.propTypes = {
  circleSize: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(Object.keys(ICON_SIZES))]),
  direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  responsiveBreakpoint: PropTypes.number,
  onStepClick: PropTypes.func,
  stepIndex: PropTypes.number,
  stepNames: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
  StepIconComponent: PropTypes.elementType,
  use: PropTypes.oneOf(['default', 'compact', 'flush'])
};
UIStepIndicator.defaultProps = {
  circleSize: 10,
  direction: 'horizontal',
  responsiveBreakpoint: 500,
  StepIconComponent: DefaultStepIconComponent,
  use: 'default'
};
UIStepIndicator.displayName = 'UIStepIndicator';
export default UIStepIndicator;