'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import classNames from 'classnames';
import { LOADING_DEFAULT_COLOR, LOADING_INACTIVE_COLOR } from 'HubStyleTokens/theme';
import lazyEval from '../utils/lazyEval';
import { isIE11 } from '../utils/BrowserTest';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
var loadingColorAnimation = keyframes(["25%{background-color:", ";}75%{background-color:", ";}"], LOADING_INACTIVE_COLOR, LOADING_INACTIVE_COLOR);
var loadingAnimation = keyframes(["0%,100%{transform:translateY(0);}25%{transform:translateY(.25em);}50%{transform:translateY(0);}75%{transform:translateY(-.25em);}"]);

if (isIE11()) {
  // Fix for #5734
  loadingAnimation = keyframes(["0%,100%{top:0;}25%{top:.25em;}50%{top:0}75%{top:-.25em;}"]);
}

var Dot = styled.div.withConfig({
  displayName: "UILoadingDots__Dot",
  componentId: "sc-1iq2wue-0"
})(["position:relative;background-color:currentColor;color:", ";border-radius:50%;height:1em;width:1em;animation:", ",", ";animation-duration:1s;animation-timing-function:linear;animation-iteration-count:infinite;&:not(:last-child){margin-right:0.75em;}&:nth-child(2){animation-delay:-0.66s;}&:nth-child(3){animation-delay:-0.33s;}"], LOADING_DEFAULT_COLOR, loadingAnimation, loadingColorAnimation);
var LoadingDots = styled.div.withConfig({
  displayName: "UILoadingDots__LoadingDots",
  componentId: "sc-1iq2wue-1"
})(["display:flex;align-items:center;justify-content:center;height:1.25em;width:4.5em;", ";"], function (props) {
  return props.grow && "width: 100%; height: 100%;";
});

var getTranslatedTitle = function getTranslatedTitle() {
  return I18n.text('salesUI.UILoading.title');
};

var getStyle = function getStyle(minHeight, style) {
  return minHeight ? Object.assign({}, style, {
    minHeight: minHeight
  }) : style;
};

export default function UILoadingDots(props) {
  var className = props.className,
      grow = props.grow,
      minHeight = props.minHeight,
      style = props.style,
      title = props.title,
      rest = _objectWithoutProperties(props, ["className", "grow", "minHeight", "style", "title"]);

  return /*#__PURE__*/_jsxs(LoadingDots, Object.assign({
    className: classNames(className, 'uiLoading', grow && 'uiLoading-grow'),
    "data-loading": true,
    style: getStyle(minHeight, style),
    title: lazyEval(title),
    grow: grow
  }, rest, {
    children: [/*#__PURE__*/_jsx(Dot, {
      className: "uiLoadingDot dot-1"
    }), /*#__PURE__*/_jsx(Dot, {
      className: "uiLoadingDot dot-2"
    }), /*#__PURE__*/_jsx(Dot, {
      className: "uiLoadingDot dot-3"
    })]
  }));
}
UILoadingDots.propTypes = {
  grow: PropTypes.bool.isRequired,
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: createLazyPropType(PropTypes.string).isRequired
};
UILoadingDots.defaultProps = {
  grow: true,
  title: getTranslatedTitle
};
UILoadingDots.displayName = 'UILoadingDots';