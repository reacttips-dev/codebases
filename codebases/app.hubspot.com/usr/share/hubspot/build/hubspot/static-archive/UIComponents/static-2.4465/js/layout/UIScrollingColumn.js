'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styled from 'styled-components';
import ShareScrollElement from '../decorators/ShareScrollElement';
import UIScrollContainer from '../scroll/UIScrollContainer';
import refObject from '../utils/propTypes/refObject';
import UIBox from './UIBox';
var AutoHeightScrollContainer = styled(UIScrollContainer.defaultProps.ScrollContainer).withConfig({
  displayName: "UIScrollingColumn__AutoHeightScrollContainer",
  componentId: "uispmk-0"
})(["height:auto;"]);
var UIScrollingColumn = /*#__PURE__*/forwardRef(function (props, ref) {
  var className = props.className,
      children = props.children,
      flexBasis = props.flexBasis,
      flexGrow = props.flexGrow,
      flexShrink = props.flexShrink,
      footerClassName = props.footerClassName,
      footerContent = props.footerContent,
      headerClassName = props.headerClassName,
      headerContent = props.headerContent,
      maxHeight = props.maxHeight,
      Overhang = props.Overhang,
      scrollDirection = props.scrollDirection,
      scrollElementRef = props.scrollElementRef,
      rest = _objectWithoutProperties(props, ["className", "children", "flexBasis", "flexGrow", "flexShrink", "footerClassName", "footerContent", "headerClassName", "headerContent", "maxHeight", "Overhang", "scrollDirection", "scrollElementRef"]);

  return /*#__PURE__*/_jsx(UIBox, Object.assign({}, rest, {
    basis: flexBasis,
    className: classNames('private-scroll-columns__column', className),
    grow: flexGrow,
    shrink: flexShrink,
    ref: ref,
    children: /*#__PURE__*/_jsxs("div", {
      className: "private-scroll-columns__inner",
      style: {
        maxHeight: maxHeight
      },
      children: [headerContent && /*#__PURE__*/_jsx("header", {
        className: classNames("private-scroll-columns__header has--vertical-spacing", headerClassName),
        children: headerContent
      }), /*#__PURE__*/_jsx(UIScrollContainer, {
        className: "private-scroll-columns__column--stretch",
        Overhang: Overhang,
        scrollDirection: scrollDirection,
        scrollElementRef: scrollElementRef,
        ScrollContainer: AutoHeightScrollContainer,
        children: children
      }), footerContent && /*#__PURE__*/_jsx("footer", {
        className: classNames("private-scroll-columns__footer has--vertical-spacing", footerClassName),
        children: footerContent
      })]
    })
  }));
});
UIScrollingColumn.propTypes = {
  children: PropTypes.node,
  flexBasis: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flexGrow: PropTypes.number,
  flexShrink: PropTypes.number,
  footerClassName: PropTypes.string,
  footerContent: PropTypes.node,
  headerClassName: PropTypes.string,
  headerContent: PropTypes.node,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  Overhang: UIScrollContainer.propTypes.Overhang,
  scrollDirection: UIScrollContainer.propTypes.scrollDirection,
  scrollElementRef: refObject.isRequired
};
UIScrollingColumn.defaultProps = {
  scrollDirection: 'vertical'
};
UIScrollingColumn.displayName = 'UIScrollingColumn';
export default ShareScrollElement(UIScrollingColumn);