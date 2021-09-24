'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { BATTLESHIP, OLAF, THUNDERDOME } from 'HubStyleTokens/colors';
import { getSide, getEdge } from '../utils/Placement';
import { USE_CLASSES } from '../utils/Use';
import { PLACEMENTS } from '../PlacementConstants';
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
      placement = _ref3.placement,
      width = _ref3.width;
  // Magic calculation, haven't quite figured this out yet
  var adjustedInset = inset + 3;

  switch (getEdge(placement)) {
    case 'top':
      // Arrow is near the bottom of the left or right side
      return css(["bottom:", "px;"], adjustedInset);

    case 'middle':
      return css(["top:calc(50% - ", "px);"], width / 2);

    case 'bottom':
      // Arrow is near the top of the left or right side
      return css(["top:", "px;"], adjustedInset);

    case 'left':
      // Arrow is near the right of the top or bottom side
      return css(["right:", "px;"], adjustedInset);

    case 'center':
      return css(["left:calc(50% - ", "px);"], width / 2);

    case 'right':
      // Arrow is near the left of the top or bottom side
      return css(["left:", "px;"], adjustedInset);

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
  componentId: "sc-1d1ye9d-0"
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

  return width === 0 ? null : /*#__PURE__*/_jsx(Arrow, Object.assign({}, rest, {
    className: classNames('uiPopoverArrow private-popover__arrow', className),
    width: width
  }));
});

if (process.env.NODE_ENV !== 'production') {
  UIPopoverArrow.propTypes = {
    color: PropTypes.string,
    inset: PropTypes.number.isRequired,
    placement: PropTypes.oneOf(PLACEMENTS).isRequired,
    popoverUse: PropTypes.oneOf(Object.keys(USE_CLASSES)),
    width: PropTypes.number
  };
}

UIPopoverArrow.defaultProps = {
  inset: 0,
  placement: 'top',
  width: 20
};
UIPopoverArrow.ARROW_SIZES = {
  none: {
    distance: 4,
    inset: 0,
    width: 0
  },
  medium: {
    distance: mediumArrowSize,
    inset: mediumArrowSize - 2,
    width: 20
  },
  small: {
    distance: smallArrowSize,
    inset: smallArrowSize - 2,
    width: 16
  }
};
export default UIPopoverArrow;