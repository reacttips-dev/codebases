'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { EXTRA_SMALL, SMALL, MEDIUM } from '../constants/sizes';
import { LOADING_SPINNER_SIZES } from './constants/LoadingSpinnerSizes';
import themePropType from '../utils/themePropType';
import { getLoadingSpinnerColor, getSecondaryLoadingSpinnerColor } from './theme/loadingSpinnerOperators';
import * as SpinnerUses from './constants/SpinnerUses';
var privateSpin = keyframes(["100%{transform:rotate(360deg)}"]);
var SpinnerOuter = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__SpinnerOuter",
  componentId: "sc-161a6fu-0"
})(["position:relative;align-items:center;display:flex;margin:8px;", ";"], function (_ref) {
  var grow = _ref.grow;
  return grow && css(["flex-directions:column;justify-content:center;width:100%;height:100%;margin:0;"]);
});
var SpinnerInner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__SpinnerInner",
  componentId: "sc-161a6fu-1"
})(["position:relative;align-items:center;display:flex;justify-content:center;width:", ";height:", ";color:", ";"], function (_ref2) {
  var size = _ref2.size;
  return size + "px";
}, function (_ref3) {
  var size = _ref3.size;
  return size + "px";
}, function (_ref4) {
  var theme = _ref4.theme,
      use = _ref4.use;
  return use === SpinnerUses.PRIMARY ? getLoadingSpinnerColor(theme) : getSecondaryLoadingSpinnerColor(theme);
});
var ResultSpinner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__ResultSpinner",
  componentId: "sc-161a6fu-2"
})(["align-items:center;display:flex;justify-content:center;opacity:", ";position:absolute;transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1) 0.1s,transform 0.2s cubic-bezier(0.2,0.9,0.3,2) 0.1s;transform:scale(1);"], function (_ref5) {
  var showResult = _ref5.showResult;
  return showResult ? '1' : '0';
});
var Spinner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__Spinner",
  componentId: "sc-161a6fu-3"
})(["transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1),transform 0.2s cubic-bezier(0.89,0.03,0.68,0.22);opacity:", ";position:absolute;display:block;width:100%;height:100%;&::after{position:relative;box-sizing:border-box;content:'';width:100%;height:100%;display:inline-block;border:2px solid currentColor;border-bottom-color:transparent;border-left-color:transparent;border-radius:100%;background:transparent;animation:", " 0.75s linear infinite;}"], function (_ref6) {
  var showResult = _ref6.showResult;
  return showResult ? '0' : '1';
}, privateSpin);

var VizExLoadingSpinner = function VizExLoadingSpinner(props) {
  var children = props.children,
      grow = props.grow,
      onResultDisplayFinish = props.onResultDisplayFinish,
      resultAnimationDuration = props.resultAnimationDuration,
      showResult = props.showResult,
      size = props.size,
      theme = props.theme,
      use = props.use,
      rest = _objectWithoutProperties(props, ["children", "grow", "onResultDisplayFinish", "resultAnimationDuration", "showResult", "size", "theme", "use"]);

  var resultDisplayTimeoutRef = useRef(null);
  useEffect(function () {
    if (!showResult) return undefined;
    resultDisplayTimeoutRef.current = setTimeout(onResultDisplayFinish, resultAnimationDuration);
    return function () {
      clearTimeout(resultDisplayTimeoutRef.current);
    };
  }, [onResultDisplayFinish, resultAnimationDuration, showResult]);
  var spinnerSizePx = LOADING_SPINNER_SIZES[size];
  return /*#__PURE__*/_jsx(SpinnerOuter, Object.assign({}, rest, {
    grow: grow,
    children: /*#__PURE__*/_jsxs(SpinnerInner, {
      size: spinnerSizePx,
      theme: theme,
      use: use,
      children: [/*#__PURE__*/_jsx(Spinner, {
        showResult: showResult
      }), /*#__PURE__*/_jsx(ResultSpinner, {
        showResult: showResult,
        children: children
      })]
    })
  }));
};

VizExLoadingSpinner.propTypes = {
  children: PropTypes.node,
  grow: PropTypes.bool,
  onResultDisplayFinish: PropTypes.func,
  resultAnimationDuration: PropTypes.number.isRequired,
  role: PropTypes.string,
  showResult: PropTypes.bool,
  size: PropTypes.oneOf([EXTRA_SMALL, SMALL, MEDIUM]),
  style: PropTypes.object,
  theme: themePropType,
  use: PropTypes.oneOf(Object.values(SpinnerUses))
};
VizExLoadingSpinner.defaultProps = {
  grow: false,
  showResult: false,
  resultAnimationDuration: 1500,
  onResultDisplayFinish: function onResultDisplayFinish() {},
  role: 'status',
  size: 'sm',
  use: SpinnerUses.PRIMARY
};
VizExLoadingSpinner.displayName = 'VizExLoadingSpinner';
export default VizExLoadingSpinner;