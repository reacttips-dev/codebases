'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { BASE_LINE_HEIGHT } from 'HubStyleTokens/sizes';
import { BASE_LINK_COLOR, BASE_LINK_HOVER_COLOR } from 'HubStyleTokens/theme';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import UIClickable from '../button/UIClickable';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import { CARET_HEIGHT, CARET_WIDTH } from '../icon/IconConstants';
import UICaret from '../icon/icons/UICaret';
import AccordionTransition from '../transitions/AccordionTransition';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import { allSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import { setUiTransition } from '../utils/Styles';
var indicatorCanvasStyle = {
  display: 'block',
  width: '100%',
  visibility: 'hidden'
};
var indicatorCaretStyle = {
  position: 'absolute',
  width: '100%',
  left: 0,
  top: 0
};
var indicatorCoordinatesForSize = {
  xs: 'top: 7px; width: 5px;',
  sm: 'top: 3px; width: 7px;',
  md: 'top: 4px; width: 8px;',
  lg: 'top: 3px; width: 11px;',
  xl: 'top: 10px; width: 11px;'
};
var Indicator = styled.div.withConfig({
  displayName: "UIAccordionItem__Indicator",
  componentId: "sc-1md9uai-0"
})(["stroke:", ";position:absolute;left:0;", ";transform:", ";", ";"], BASE_LINK_COLOR, function (_ref) {
  var size = _ref.size;
  return indicatorCoordinatesForSize[size];
}, function (_ref2) {
  var open = _ref2.open;
  return open && 'rotate(90deg)';
}, setUiTransition());
var ExtraSmallHeading = styled.div.withConfig({
  displayName: "UIAccordionItem__ExtraSmallHeading",
  componentId: "sc-1md9uai-1"
})(["margin-bottom:8px;"]);
var headingForSize = {
  xs: ExtraSmallHeading,
  sm: 'h5',
  md: 'h4',
  lg: 'h2',
  xl: 'h1'
};
var paddingLeftForSize = {
  xs: 17,
  sm: 23,
  md: 27,
  lg: 30,
  xl: 30
};
var paddingLeftMixin = css(["padding-left:", "px;"], function (_ref3) {
  var size = _ref3.size;
  return paddingLeftForSize[size];
});
var Clickable = styled(function (_ref4) {
  var __open = _ref4.open,
      __size = _ref4.size,
      rest = _objectWithoutProperties(_ref4, ["open", "size"]);

  return /*#__PURE__*/_jsx(UIClickable, Object.assign({}, rest));
}).withConfig({
  displayName: "UIAccordionItem__Clickable",
  componentId: "sc-1md9uai-2"
})(["display:block;position:relative;line-height:", ";", ";user-select:none;&:hover{color:", ";", "{color:currentColor;}}"], BASE_LINE_HEIGHT, paddingLeftMixin, BASE_LINK_HOVER_COLOR, Indicator);
var Transition = styled(function (_ref5) {
  var __size = _ref5.size,
      rest = _objectWithoutProperties(_ref5, ["size"]);

  return /*#__PURE__*/_jsx(AccordionTransition, Object.assign({}, rest));
}).withConfig({
  displayName: "UIAccordionItem__Transition",
  componentId: "sc-1md9uai-3"
})(["", ";"], paddingLeftMixin);
var UIAccordionItem = memoWithDisplayName('UIAccordionItem', function (props) {
  var animate = props.animate,
      children = props.children,
      Content = props.Content,
      renderContent = props.renderContent,
      contentClassName = props.contentClassName,
      disabled = props.disabled,
      flush = props.flush,
      onOpenChange = props.onOpenChange,
      open = props.open,
      size = props.size,
      title = props.title,
      titleClassName = props.titleClassName,
      rest = _objectWithoutProperties(props, ["animate", "children", "Content", "renderContent", "contentClassName", "disabled", "flush", "onOpenChange", "open", "size", "title", "titleClassName"]);

  var handleTitleClick = useCallback(function () {
    onOpenChange(SyntheticEvent(!open));
  }, [onOpenChange, open]);
  var shorthandSize = toShorthandSize(size);
  var computedTitleClassName = classNames(titleClassName, 'private-accordion');
  var Heading = headingForSize[shorthandSize];
  return /*#__PURE__*/_jsxs("div", Object.assign({}, rest, {
    children: [/*#__PURE__*/_jsx(Clickable, {
      "aria-expanded": open,
      className: computedTitleClassName,
      disabled: disabled,
      onClick: handleTitleClick,
      open: open,
      size: shorthandSize,
      children: /*#__PURE__*/_jsxs(Heading, {
        role: "presentation",
        className: flush ? 'm-bottom-0' : '',
        children: [/*#__PURE__*/_jsxs(Indicator, {
          open: open,
          size: shorthandSize,
          children: [/*#__PURE__*/_jsx("canvas", {
            width: CARET_WIDTH,
            height: CARET_HEIGHT,
            style: indicatorCanvasStyle
          }), /*#__PURE__*/_jsx(UICaret, {
            style: indicatorCaretStyle,
            viewBoxHeight: CARET_HEIGHT,
            viewBoxWidth: CARET_WIDTH,
            width: 12
          })]
        }), title]
      })
    }), /*#__PURE__*/_jsx(Transition, {
      Content: Content,
      renderContent: renderContent,
      duration: animate ? undefined : 0,
      className: classNames("UIAccordionItem-content private-accordion__content", contentClassName),
      open: open,
      size: shorthandSize,
      children: children
    })]
  }));
});
UIAccordionItem.propTypes = {
  animate: PropTypes.bool.isRequired,
  children: PropTypes.node,
  Content: PropTypes.elementType,
  renderContent: PropTypes.func,
  contentClassName: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  flush: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.node.isRequired,
  titleClassName: PropTypes.string,
  size: allSizes
};
UIAccordionItem.defaultProps = {
  animate: true,
  disabled: false,
  flush: false,
  open: false,
  size: 'xs'
};
export default Controllable(UIAccordionItem, ['open']);