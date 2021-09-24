'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { BASE_SPACING_X } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styled from 'styled-components';
import UIAccordionItem from '../accordion/UIAccordionItem';
import UICardSection from '../card/UICardSection';
import AbstractTextElement from '../elements/AbstractTextElement';
import UIFlex from '../layout/UIFlex';
import { allSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import omit from '../utils/underscore/omit';
var headingForSize = {
  xs: 'span',
  sm: 'h5',
  md: 'h4',
  lg: 'h2',
  xl: 'h1'
};
var Toolbar = styled.div.withConfig({
  displayName: "UICardHeader__Toolbar",
  componentId: "sc-1dlabol-0"
})(["flex:1 0 auto;text-align:right;margin-left:", ";"], BASE_SPACING_X);
var UICardHeader = /*#__PURE__*/forwardRef(function (props, ref) {
  var className = props.className,
      expanded = props.expanded,
      onExpandedChange = props.onExpandedChange,
      title = props.title,
      titleSize = props.titleSize,
      toolbar = props.toolbar,
      rest = _objectWithoutProperties(props, ["className", "expanded", "onExpandedChange", "title", "titleSize", "toolbar"]);

  var isExpander = typeof onExpandedChange === 'function';
  var shorthandSize = toShorthandSize(titleSize);
  var renderedTitle = isExpander ? /*#__PURE__*/_jsx(UIAccordionItem, {
    className: "private-card__title",
    flush: true,
    onOpenChange: onExpandedChange,
    open: expanded,
    title: title,
    size: shorthandSize
  }) : /*#__PURE__*/_jsx(AbstractTextElement, {
    className: "private-card__title",
    tagName: headingForSize[shorthandSize],
    children: title
  });
  return /*#__PURE__*/_jsx(UICardSection, Object.assign({}, rest, {
    ref: ref,
    className: classNames('private-card__header', className),
    isHeader: true,
    children: /*#__PURE__*/_jsxs(UIFlex, {
      align: "start",
      justify: "between",
      children: [renderedTitle, toolbar && expanded ? /*#__PURE__*/_jsx(Toolbar, {
        className: "private-card__toolbar private-card__title",
        children: toolbar
      }) : null]
    })
  }));
});
UICardHeader.propTypes = Object.assign({}, omit(UICardSection.propTypes, ['children']), {
  expanded: PropTypes.bool.isRequired,
  onExpandedChange: PropTypes.func,
  title: PropTypes.node,
  titleSize: allSizes,
  toolbar: PropTypes.node
});
UICardHeader.defaultProps = {
  expanded: true,
  titleSize: 'md'
};
UICardHeader.displayName = 'UICardHeader';
export default UICardHeader;