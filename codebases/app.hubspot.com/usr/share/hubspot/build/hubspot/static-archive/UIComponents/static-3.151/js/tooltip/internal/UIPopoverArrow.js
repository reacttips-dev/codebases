'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { BATTLESHIP, OLAF, THUNDERDOME } from 'HubStyleTokens/colors';
import { getSide, getEdge } from '../utils/Placement';
import { USE_CLASSES } from '../utils/Use';
import { OpenPopupContext } from '../../context/internal/OpenPopupContext';
import { useSubscribe } from '../../hooks/pubSub';
import memoWithDisplayName from '../../utils/memoWithDisplayName';
import { toPx } from '../../utils/Styles';
var mediumArrowSize = 16;
var smallArrowSize = 12;

var isShepherdArrowWhite = function isShepherdArrowWhite(placement) {
  return getSide(placement) !== 'bottom' && getEdge(placement) !== 'bottom';
};

var getBackgroundColor = function getBackgroundColor(_ref) {
  var color = _ref.color,
      placement = _ref.placement,
      popoverUse = _ref.popoverUse;

  if (color) {
    return color;
  }

  if (popoverUse === 'shepherd') {
    return isShepherdArrowWhite(placement) ? OLAF : THUNDERDOME;
  }

  return 'inherit';
};

var getSideStyles = function getSideStyles(_ref2) {
  var placement = _ref2.placement,
      width = _ref2.width;

  switch (getSide(placement)) {
    case 'top':
      // Arrow points down
      return css(["transform:rotate(45deg);top:calc(100% - ", "px);"], width / 2);

    case 'right':
      // Arrow points left
      return css(["transform:rotate(135deg);left:-", "px;"], width / 2);

    case 'bottom':
      // Arrow points up
      return css(["transform:rotate(-135deg);top:-", "px;"], width / 2);

    case 'left':
      // Arrow points right
      return css(["transform:rotate(-45deg);left:calc(100% - ", "px);"], width / 2);

    default:
      return '';
  }
};

var getEdgeStyles = function getEdgeStyles(_ref3) {
  var inset = _ref3.inset,
      placement = _ref3.placement;

  switch (getEdge(placement)) {
    case 'top':
    case 'bottom':
    case 'middle':
      return css(["top:", "px;"], inset);

    case 'left':
    case 'right':
    case 'center':
      return css(["left:", "px;"], inset);

    default:
      return '';
  }
};

var getBorderUseStyles = function getBorderUseStyles(_ref4) {
  var placement = _ref4.placement,
      popoverUse = _ref4.popoverUse;

  if (popoverUse === 'default' || popoverUse === 'longform' || popoverUse === 'shepherd' && isShepherdArrowWhite(placement)) {
    return "1px solid " + BATTLESHIP;
  }

  return null;
};

var Arrow = styled.div.withConfig({
  displayName: "UIPopoverArrow__Arrow",
  componentId: "sc-1sfgfto-0"
})(["position:absolute;pointer-events:none;border:", ";clip-path:polygon(100% 100%,0 100%,100% 0);border-top-left-radius:100%;border-top-color:transparent !important;border-left-color:transparent !important;border-bottom-right-radius:", ";width:", ";height:", ";background-color:", ";", ";", ";.tether-pinned &{display:none;}"], getBorderUseStyles, function (_ref5) {
  var popoverUse = _ref5.popoverUse;
  return popoverUse.includes('tooltip') ? '3px' : null;
}, function (_ref6) {
  var width = _ref6.width;
  return toPx(width);
}, function (_ref7) {
  var width = _ref7.width;
  return toPx(width);
}, getBackgroundColor, getSideStyles, getEdgeStyles);
var UIPopoverArrow = memoWithDisplayName('UIPopoverArrow', function (_ref8) {
  var className = _ref8.className,
      width = _ref8.width,
      rest = _objectWithoutProperties(_ref8, ["className", "width"]);

  var _useContext = useContext(OpenPopupContext),
      positionChannel = _useContext.positionChannel;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      positionConfig = _useState2[0],
      setPositionConfig = _useState2[1];

  useSubscribe(positionChannel, function (positionUpdate) {
    setPositionConfig(positionUpdate);
  });
  if (!positionConfig) return null;
  var arrowInset = positionConfig.arrowInset,
      pinning = positionConfig.pinning,
      placement = positionConfig.placement;
  if (!!pinning || width === 0) return null;
  return /*#__PURE__*/_jsx(Arrow, Object.assign({}, rest, {
    className: classNames('uiPopoverArrow private-popover__arrow', className),
    "data-popover-arrow": true,
    inset: arrowInset,
    placement: placement,
    width: width
  }));
});

if (process.env.NODE_ENV !== 'production') {
  UIPopoverArrow.propTypes = {
    color: PropTypes.string,
    popoverUse: PropTypes.oneOf(Object.keys(USE_CLASSES)),
    width: PropTypes.number
  };
}

UIPopoverArrow.defaultProps = {
  width: 20
};
UIPopoverArrow.ARROW_SIZES = {
  none: {
    distance: 4,
    width: 0
  },
  medium: {
    distance: mediumArrowSize,
    width: 20
  },
  small: {
    distance: smallArrowSize,
    width: 16
  }
};
export default UIPopoverArrow;