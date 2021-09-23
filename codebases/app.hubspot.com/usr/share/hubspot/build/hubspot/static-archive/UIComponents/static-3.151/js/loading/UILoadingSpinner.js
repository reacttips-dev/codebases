'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { OLAF } from 'HubStyleTokens/colors';
import { BASE_ICON_SPACING_X } from 'HubStyleTokens/sizes';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import styled, { css, keyframes } from 'styled-components';
import UIIconHolder from '../icon/UIIconHolder';
import { isIE11 } from '../utils/BrowserTest';
import lazyEval from '../utils/lazyEval';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import { ICON_COLOR_MAP, ICON_SIZE_MAP, SIZE_OPTIONS, USES, USE_COLORS, USE_INDICATOR_COLORS } from './LoadingConstants';

var getSpinnerSize = function getSpinnerSize(sizeName) {
  return SIZE_OPTIONS[sizeName] || SIZE_OPTIONS['sm'];
};

var privateSpin = keyframes(["100%{transform:rotate(360deg)}"]);
var privateDash = keyframes(["0%{stroke-dasharray:1,150;stroke-dashoffset:0;}50%{stroke-dasharray:90,150;stroke-dashoffset:-50;}100%{stroke-dasharray:90,150;stroke-dashoffset:-140;}"]);
var SpinnerOuter = styled.div.withConfig({
  displayName: "UILoadingSpinner__SpinnerOuter",
  componentId: "sc-16kig5k-0"
})(["position:relative;align-items:center;color:", ";display:flex;flex-direction:", ";justify-content:", ";", ";"], function (props) {
  return props.use === 'on-dark' ? OLAF : 'currentColor';
}, function (props) {
  return props.layout === 'centered' && 'column';
}, function (props) {
  return props.layout === 'centered' && 'center';
}, function (props) {
  return props.grow ? "width: 100%; height: 100%;" : 'margin: 8px';
});
var SpinnerInner = styled.div.withConfig({
  displayName: "UILoadingSpinner__SpinnerInner",
  componentId: "sc-16kig5k-1"
})(["align-items:center;display:flex;height:", ";justify-content:center;width:", ";"], function (props) {
  return getSpinnerSize(props.size);
}, function (props) {
  return getSpinnerSize(props.size);
});
var SpinnerLabel = styled.span.withConfig({
  displayName: "UILoadingSpinner__SpinnerLabel",
  componentId: "sc-16kig5k-2"
})(["margin-top:", ";&:not(:empty){margin-left:", ";margin-right:", ";}"], function (props) {
  return props.layout === 'centered' && BASE_ICON_SPACING_X;
}, BASE_ICON_SPACING_X, BASE_ICON_SPACING_X);
var ResultSpinner = styled.div.withConfig({
  displayName: "UILoadingSpinner__ResultSpinner",
  componentId: "sc-16kig5k-3"
})(["align-items:center;display:flex;justify-content:center;opacity:0;position:absolute;transform:scale(0.7);transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1) 0.1s,transform 0.3s cubic-bezier(0.2,0.9,0.3,2) 0.1s;", ""], function (_ref) {
  var showResult = _ref.showResult;
  return showResult && "opacity: 1;\n    position: relative;\n    transform: scale(1);\n  ";
});
var SpinnerWrapper = styled.div.withConfig({
  displayName: "UILoadingSpinner__SpinnerWrapper",
  componentId: "sc-16kig5k-4"
})(["opacity:1;transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1),transform 0.2s cubic-bezier(0.89,0.03,0.68,0.22);", " ", ""], isIE11() && css(["animation:", " 2s linear infinite;"], privateSpin), function (_ref2) {
  var showResult = _ref2.showResult;
  return showResult && "margin-left: -1px;\n    opacity: 0;\n    transform: scale(.7);\n    width: 1px;\n  ";
});
var Ring = styled.svg.withConfig({
  displayName: "UILoadingSpinner__Ring",
  componentId: "sc-16kig5k-5"
})(["display:block;max-width:100%;"]);
var RingPath = styled.circle.withConfig({
  displayName: "UILoadingSpinner__RingPath",
  componentId: "sc-16kig5k-6"
})(["animation:", " 2s cubic-bezier(0.42,0,0.58,1) infinite,", " 2s linear infinite;stroke-dasharray:none;stroke-dashoffset:0;stroke-linecap:round;transform-origin:center;", ""], privateDash, privateSpin, isIE11() && "stroke-dasharray: 50, 150;");

var getComputedStyle = function getComputedStyle(style, grow, minHeight) {
  if (minHeight) {
    var computedStyle = Object.assign({}, style, {
      minHeight: minHeight
    });
    if (!grow) computedStyle.height = '1rem';
    return computedStyle;
  }

  return style;
};

var resultIconStyles = {
  lineHeight: 'inherit',
  verticalAlign: 'middle'
};
var UILoadingSpinner = memoWithDisplayName('UILoadingSpinner', function (props) {
  var dataLoading = props['data-loading'],
      className = props.className,
      failed = props.failed,
      grow = props.grow,
      label = props.label,
      labelCompletedText = props.labelCompletedText,
      layout = props.layout,
      minHeight = props.minHeight,
      onResultDisplayFinish = props.onResultDisplayFinish,
      resultAnimationDuration = props.resultAnimationDuration,
      resultIcon = props.resultIcon,
      showLabel = props.showLabel,
      showResult = props.showResult,
      size = props.size,
      style = props.style,
      use = props.use,
      rest = _objectWithoutProperties(props, ["data-loading", "className", "failed", "grow", "label", "labelCompletedText", "layout", "minHeight", "onResultDisplayFinish", "resultAnimationDuration", "resultIcon", "showLabel", "showResult", "size", "style", "use"]);

  var resultDisplayTimeoutRef = useRef(null);
  useEffect(function () {
    if (!showResult) return undefined;
    resultDisplayTimeoutRef.current = setTimeout(onResultDisplayFinish, resultAnimationDuration);
    return function () {
      clearTimeout(resultDisplayTimeoutRef.current);
    };
  }, [onResultDisplayFinish, resultAnimationDuration, showResult]);
  var computedLayout = layout || (grow ? 'centered' : 'inline');
  var computedLabelText = showResult && !failed ? lazyEval(labelCompletedText) : lazyEval(label);
  var RenderedLabel = showLabel ? SpinnerLabel : 'span';
  var renderedLabelProps = {
    children: computedLabelText
  };

  if (showLabel) {
    renderedLabelProps.layout = computedLayout;
  } else {
    renderedLabelProps.className = 'sr-only';
  }

  var shorthandSize = toShorthandSize(size);
  var spinnerSizePx = parseInt(getSpinnerSize(shorthandSize), 10);
  return /*#__PURE__*/_jsxs(SpinnerOuter, Object.assign({}, rest, {
    className: classNames('private-spinner', className),
    style: getComputedStyle(style, grow, minHeight),
    "data-loading": dataLoading !== undefined ? dataLoading : !showResult,
    layout: computedLayout,
    grow: grow,
    use: use,
    children: [/*#__PURE__*/_jsxs(SpinnerInner, {
      size: shorthandSize,
      children: [/*#__PURE__*/_jsx(SpinnerWrapper, {
        showResult: showResult,
        children: /*#__PURE__*/_jsxs(Ring, {
          height: spinnerSizePx,
          width: spinnerSizePx,
          viewBox: "0 0 50 50",
          stroke: USE_COLORS[use],
          children: [/*#__PURE__*/_jsx("circle", {
            cx: "25",
            cy: "25",
            r: "22.5",
            fill: "none",
            strokeWidth: "5"
          }), /*#__PURE__*/_jsx(RingPath, {
            cx: "25",
            cy: "25",
            r: "22.5",
            fill: "none",
            stroke: USE_INDICATOR_COLORS[use],
            strokeWidth: "5"
          })]
        })
      }), resultIcon && !failed && /*#__PURE__*/_jsx(ResultSpinner, {
        showResult: showResult,
        children: /*#__PURE__*/_jsx(UIIconHolder, {
          innerStyles: resultIconStyles,
          name: resultIcon,
          color: ICON_COLOR_MAP[use],
          size: ICON_SIZE_MAP[shorthandSize] || ICON_SIZE_MAP['sm']
        })
      })]
    }), /*#__PURE__*/_jsx(RenderedLabel, Object.assign({}, renderedLabelProps))]
  }));
});
UILoadingSpinner.propTypes = {
  'data-loading': PropTypes.bool,
  failed: PropTypes.bool,
  showResult: PropTypes.bool,
  label: createLazyPropType(PropTypes.node).isRequired,
  labelCompletedText: createLazyPropType(PropTypes.node).isRequired,
  layout: PropTypes.oneOf(['inline', 'centered']),
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  grow: PropTypes.bool,
  resultAnimationDuration: PropTypes.number.isRequired,
  resultIcon: PropTypes.string,
  use: PropTypes.oneOf(USES),
  showLabel: PropTypes.bool.isRequired,
  size: propTypeForSizes(['xs', 'sm', 'md']),
  onResultDisplayFinish: PropTypes.func
};
UILoadingSpinner.defaultProps = {
  failed: false,
  grow: false,
  label: function label() {
    return I18n.text('ui.UILoadingSpinner.busyText');
  },
  labelCompletedText: function labelCompletedText() {
    return I18n.text('ui.UILoadingSpinner.completedText');
  },
  showResult: false,
  resultAnimationDuration: 1500,
  resultIcon: 'success',
  role: 'status',
  onResultDisplayFinish: emptyFunction,
  showLabel: false,
  size: 'sm',
  use: 'link'
};
export default UILoadingSpinner;