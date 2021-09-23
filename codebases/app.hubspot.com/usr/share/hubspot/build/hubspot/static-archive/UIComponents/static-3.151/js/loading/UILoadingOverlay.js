'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import UILoadingDots from './UILoadingDots';
import UILoadingSpinner from './UILoadingSpinner';
import UIOverlay from '../overlay/UIOverlay';
import memoizeOne from 'react-utils/memoizeOne';
import { toPx } from '../utils/Styles';
import { notRequired, hidden } from '../utils/propTypes/decorators';
import { wrapPropTypes } from '../utils/propTypes/wrapPropTypes';
var OverlayInnerWrapper = styled(UIOverlay.defaultProps.Inner).withConfig({
  displayName: "UILoadingOverlay__OverlayInnerWrapper",
  componentId: "sc-1uzv16i-0"
})(["display:flex;justify-content:center;align-items:center;height:100%;"]);
var DEFAULT_USE = 'spinner';
var USE_VARIANTS = {
  dots: {
    Component: function Component(_ref) {
      var label = _ref.label,
          rest = _objectWithoutProperties(_ref, ["label"]);

      return /*#__PURE__*/_jsx(UILoadingDots, Object.assign({}, rest, {
        title: label
      }));
    }
  },
  spinner: {
    Component: function Component(_ref2) {
      var label = _ref2.label,
          rest = _objectWithoutProperties(_ref2, ["label"]);

      return /*#__PURE__*/_jsx(UILoadingSpinner, Object.assign({}, rest, {
        label: label
      }));
    }
  }
};

function getOverlayStyles(minHeight) {
  if (minHeight == null) return undefined;
  return {
    minHeight: toPx(minHeight)
  };
}

var UILoadingOverlay = /*#__PURE__*/function (_Component) {
  _inherits(UILoadingOverlay, _Component);

  function UILoadingOverlay(props) {
    var _this;

    _classCallCheck(this, UILoadingOverlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UILoadingOverlay).call(this, props));
    _this._getOverlayStyles = memoizeOne(getOverlayStyles);
    return _this;
  }

  _createClass(UILoadingOverlay, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          contextual = _this$props.contextual,
          use = _this$props.use,
          minHeight = _this$props.minHeight,
          label = _this$props.label,
          title = _this$props.title,
          rest = _objectWithoutProperties(_this$props, ["contextual", "use", "minHeight", "label", "title"]);

      var Loader = (USE_VARIANTS[use] || USE_VARIANTS[DEFAULT_USE]).Component;
      return /*#__PURE__*/_jsx(UIOverlay, {
        centerContent: false,
        contextual: contextual,
        Inner: OverlayInnerWrapper,
        use: "light",
        width: 100,
        style: this._getOverlayStyles(minHeight),
        children: /*#__PURE__*/_jsx(Loader, Object.assign({}, rest, {
          label: label || title
        }))
      });
    }
  }]);

  return UILoadingOverlay;
}(Component);

export { UILoadingOverlay as default };
UILoadingOverlay.displayName = 'UILoadingOverlay';
UILoadingOverlay.propTypes = Object.assign({}, wrapPropTypes({
  propTypes: UILoadingSpinner.propTypes,
  defaultProps: UILoadingSpinner.defaultProps
}), {}, wrapPropTypes({
  propTypes: UILoadingDots.propTypes,
  defaultProps: UILoadingDots.defaultProps
}), {
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: hidden(notRequired(UILoadingDots.propTypes.title)),
  contextual: UIOverlay.propTypes.contextual,
  use: PropTypes.oneOf(Object.keys(USE_VARIANTS)),
  label: notRequired(UILoadingSpinner.propTypes.label)
});
UILoadingOverlay.defaultProps = {
  use: DEFAULT_USE,
  contextual: false,
  showLabel: false
};