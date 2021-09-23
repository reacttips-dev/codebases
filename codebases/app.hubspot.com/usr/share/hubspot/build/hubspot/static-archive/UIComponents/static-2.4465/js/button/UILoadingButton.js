'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import emptyFunction from 'react-utils/emptyFunction';
import UIButton from './UIButton';
import UILoadingSpinner from '../loading/UILoadingSpinner';
import { callIfPossible } from '../core/Functions';
import { USE_CLASSES } from '../button/ButtonConstants';

var UILoadingButton = /*#__PURE__*/function (_Component) {
  _inherits(UILoadingButton, _Component);

  function UILoadingButton(props) {
    var _this;

    _classCallCheck(this, UILoadingButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UILoadingButton).call(this, props));

    _this.UNSAFE_componentWillReceiveProps = function (nextProps) {
      var wasLoading = _this.props.loading;
      var failed = nextProps.failed,
          loading = nextProps.loading,
          resultIcon = nextProps.resultIcon;
      var hasResult = resultIcon != null && !failed;
      var shouldDisplayResult = hasResult && wasLoading && !loading;

      if (loading !== wasLoading) {
        _this.setState({
          isLoading: loading,
          displayResult: shouldDisplayResult
        });
      }
    };

    _this.UNSAFE_componentWillUpdate = function (nextProps, nextState) {
      var duration = nextProps.duration;
      var wasLoading = _this.state.isLoading;
      var isLoading = nextState.isLoading;
      var startedLoading = !wasLoading && isLoading;

      if (duration && startedLoading) {
        clearTimeout(_this.loadingTimeout);
        _this.loadingTimeout = setTimeout(_this.handleLoadingFinish, duration);
      }
    };

    _this.handleLoadingFinish = function () {
      var _this$props = _this.props,
          failed = _this$props.failed,
          resultIcon = _this$props.resultIcon;
      var hasResult = resultIcon != null && !failed;

      _this.setState({
        isLoading: false,
        displayResult: hasResult
      });

      if (!hasResult) {
        _this.setDisplayResult();
      }
    };

    _this.setDisplayResult = function () {
      var _this$props2 = _this.props,
          onLoadingFinish = _this$props2.onLoadingFinish,
          keepResultAfterFinish = _this$props2.keepResultAfterFinish;

      _this.setState({
        displayResult: keepResultAfterFinish
      });

      onLoadingFinish();
    };

    _this.handleClick = function (evt) {
      var _this$props3 = _this.props,
          duration = _this$props3.duration,
          onClick = _this$props3.onClick,
          preventClicksOnLoading = _this$props3.preventClicksOnLoading;
      var _this$state = _this.state,
          displayResult = _this$state.displayResult,
          isLoading = _this$state.isLoading;

      if (preventClicksOnLoading && (isLoading || displayResult)) {
        evt.preventDefault();
        return;
      }

      callIfPossible(onClick, evt);

      if (evt.defaultPrevented) {
        return;
      }

      if (!isLoading && duration) {
        _this.setState({
          isLoading: true
        });
      }
    };

    var _loading = props.loading;
    _this.state = {
      displayResult: false,
      isLoading: _loading || false
    };
    return _this;
  }

  _createClass(UILoadingButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var duration = this.props.duration;
      var isLoading = this.state.isLoading;

      if (duration && isLoading) {
        this.loadingTimeout = setTimeout(this.handleLoadingFinish, duration);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.loadingTimeout);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          children = _this$props4.children,
          className = _this$props4.className,
          disabled = _this$props4.disabled,
          __duration = _this$props4.duration,
          failed = _this$props4.failed,
          __loading = _this$props4.loading,
          __onClick = _this$props4.onClick,
          __onLoadingFinish = _this$props4.onLoadingFinish,
          __preventClicksOnLoading = _this$props4.preventClicksOnLoading,
          __keepResultAfterFinish = _this$props4.keepResultAfterFinish,
          resultIcon = _this$props4.resultIcon,
          size = _this$props4.size,
          spinnerProps = _this$props4.spinnerProps,
          truncateTooltip = _this$props4.truncateTooltip,
          use = _this$props4.use,
          rest = _objectWithoutProperties(_this$props4, ["children", "className", "disabled", "duration", "failed", "loading", "onClick", "onLoadingFinish", "preventClicksOnLoading", "keepResultAfterFinish", "resultIcon", "size", "spinnerProps", "truncateTooltip", "use"]);

      var _this$state2 = this.state,
          isLoading = _this$state2.isLoading,
          displayResult = _this$state2.displayResult;
      var disabledUnlessLoading = disabled && !isLoading && !displayResult;
      var loadingState = 'idle';

      if (isLoading) {
        loadingState = 'loading';
      }

      if (displayResult) {
        loadingState = 'success';
      }

      return /*#__PURE__*/_jsxs(UIButton, Object.assign({}, rest, {
        size: size,
        use: use,
        "data-loading": isLoading,
        "data-loading-state": loadingState,
        disabled: disabledUnlessLoading,
        className: classNames('private-loading-button', className, USE_CLASSES[use], (isLoading || displayResult) && 'loading private-loading-button--loading'),
        onClick: this.handleClick,
        truncateTooltip: truncateTooltip || children,
        children: [/*#__PURE__*/_jsx("span", {
          className: "private-loading-button__content private-button--internal-spacing",
          children: children
        }), /*#__PURE__*/_jsx(UILoadingSpinner, Object.assign({}, spinnerProps, {
          className: "private-loading-button__spinner",
          "data-loading": null,
          failed: failed,
          use: use,
          size: size,
          resultIcon: resultIcon,
          showResult: displayResult,
          onResultDisplayFinish: this.setDisplayResult // used to trigger an addition to the a11y tree and read out the initial loading state #8675
          ,
          hidden: !(isLoading || displayResult)
        }))]
      }));
    }
  }]);

  return UILoadingButton;
}(Component);

export { UILoadingButton as default };
UILoadingButton.propTypes = Object.assign({}, UIButton.propTypes, {
  failed: UILoadingSpinner.propTypes.failed,
  size: UILoadingSpinner.propTypes.size,
  use: UILoadingSpinner.propTypes.use,
  duration: PropTypes.number,
  loading: PropTypes.bool,
  resultIcon: UILoadingSpinner.propTypes.resultIcon,
  onLoadingFinish: PropTypes.func,
  spinnerProps: PropTypes.object,
  preventClicksOnLoading: PropTypes.bool,
  keepResultAfterFinish: PropTypes.bool
});
UILoadingButton.defaultProps = Object.assign({}, UIButton.defaultProps, {
  failed: UILoadingSpinner.defaultProps.failed,
  onLoadingFinish: emptyFunction,
  preventClicksOnLoading: true,
  keepResultAfterFinish: false,
  resultIcon: UILoadingSpinner.defaultProps.resultIcon,
  size: 'medium',
  use: 'secondary'
});
UILoadingButton.displayName = 'UILoadingButton';