'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import memoize from 'react-utils/memoize';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import devLogger from 'react-utils/devLogger';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import { hidden } from '../utils/propTypes/decorators';
import { OLAF, SLINKY } from 'HubStyleTokens/colors';
import { BASE_LINE_HEIGHT, DRAG_HANDLE_WIDTH, DRAG_HANDLE_HEIGHT, DRAG_HANDLE_OFFSET_X, DRAG_HANDLE_OFFSET_Y } from 'HubStyleTokens/sizes';
import { setGrabCursor } from '../utils/Styles';
import { warnIfFragment } from '../utils/devWarnings';

var emptyBox = /*#__PURE__*/_jsx("span", {});

var maxHeightForSize = {
  sm: 10,
  md: 50,
  lg: 90
};
var getGrippieBackground = memoize(function (use) {
  var fill = use === 'on-dark' ? OLAF : SLINKY;
  var svgStr = "<svg width='" + DRAG_HANDLE_WIDTH + "' height='" + DRAG_HANDLE_HEIGHT + "' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + DRAG_HANDLE_WIDTH + " " + DRAG_HANDLE_HEIGHT + "'><path fill='" + fill + "' d='M0 0h2v2H0V0zm0 8h2v2H0V8zm0 8h2v2H0v-2zM0 4h2v2H0V4zm0 8h2v2H0v-2zm0 8h2v2H0v-2zM3 0h2v2H3V0zm0 8h2v2H3V8zm0 8h2v2H3v-2zM3 4h2v2H3V4zm0 8h2v2H3v-2zm0 8h2v2H3v-2z'/></svg>";
  return css(["background-image:url(\"data:image/svg+xml,", "\");"], encodeURIComponent(svgStr));
});

var grippieBackgroundMixin = function grippieBackgroundMixin(_ref) {
  var use = _ref.use;
  return getGrippieBackground(use);
};

var getGrippieOffset = memoize(function (offsetX) {
  return css(["background-position:", " calc(50% + 1px);background-repeat:no-repeat;"], offsetX);
});
var standaloneMixin = css(["display:inline-block;line-height:", ";min-width:", ";&::after{content:'.';visibility:hidden;}"], BASE_LINE_HEIGHT, DRAG_HANDLE_WIDTH);
var sizedMixin = css(["background-image:none !important;position:relative;&::before{content:' ';", ";background-repeat:repeat-y;position:absolute;", ":", ";top:0;width:", ";height:calc(100% - ", ");max-height:", "px;margin:", " 0;}"], grippieBackgroundMixin, function (_ref2) {
  var trailing = _ref2.trailing;
  return trailing ? 'right' : 'left';
}, DRAG_HANDLE_OFFSET_X, DRAG_HANDLE_WIDTH, DRAG_HANDLE_HEIGHT, function (_ref3) {
  var size = _ref3.size;
  return maxHeightForSize[size];
}, DRAG_HANDLE_OFFSET_Y);
var DragHandleChild = styled(function (_ref4) {
  var children = _ref4.children,
      className = _ref4.className,
      rest = _ref4.rest;
  return /*#__PURE__*/cloneElement(children, Object.assign({
    className: classNames(children.props.className, className)
  }, rest));
}).withConfig({
  displayName: "UIDragHandle__DragHandleChild",
  componentId: "a2dn93-0"
})(["", ";", ";", ";", ";", ""], setGrabCursor(), grippieBackgroundMixin, function (_ref5) {
  var standalone = _ref5.standalone,
      trailing = _ref5.trailing;
  var offsetX = DRAG_HANDLE_OFFSET_X;

  if (standalone && trailing) {
    offsetX = '0';
  } else if (standalone) {
    offsetX = '50%';
  }

  if (trailing) offsetX = "calc(100% - " + offsetX + ")";
  return getGrippieOffset(offsetX);
}, function (_ref6) {
  var standalone = _ref6.standalone;
  return standalone && standaloneMixin;
}, function (_ref7) {
  var size = _ref7.size;
  return size !== 'default' && sizedMixin;
});

function UIDragHandle(props, context) {
  var children = props.children,
      className = props.className,
      position = props.position,
      size = props.size,
      use = props.use,
      _wrappedWithDnd = props._wrappedWithDnd,
      rest = _objectWithoutProperties(props, ["children", "className", "position", "size", "use", "_wrappedWithDnd"]);

  var connectDragSource = context.connectDragSource;

  if (process.env.NODE_ENV !== 'production') {
    if (typeof connectDragSource === 'function' && !_wrappedWithDnd) {
      devLogger.warn({
        key: 'UIDragHandle: addon',
        message: 'Looks like you’re trying to use UIComponents’ `UIDragHandle` with ui-addon-draggable. Use `ui-addon-draggable/draggable/UIDragListHandle` instead.'
      });
    }
  }

  warnIfFragment(children, UIDragHandle.displayName);
  return /*#__PURE__*/_jsx(DragHandleChild, {
    className: classNames(className, 'is--draggable', size !== 'default' && 'is--draggable--sized'),
    rest: rest,
    size: toShorthandSize(size),
    standalone: children === emptyBox,
    trailing: position === 'end',
    use: use,
    children: children
  });
}

UIDragHandle.defaultProps = {
  children: emptyBox,
  position: 'start',
  size: 'default',
  use: 'default'
};
UIDragHandle.propTypes = {
  children: PropTypes.element.isRequired,
  position: PropTypes.oneOf(['start', 'end']).isRequired,
  size: PropTypes.oneOfType([propTypeForSizes(['sm', 'md', 'lg']), PropTypes.oneOf(['default'])]).isRequired,
  use: PropTypes.oneOf(['default', 'on-dark']).isRequired,
  _wrappedWithDnd: hidden(PropTypes.bool)
};
UIDragHandle.contextTypes = {
  connectDragSource: PropTypes.func
};
UIDragHandle.displayName = 'UIDragHandle';
export default UIDragHandle;