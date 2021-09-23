'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, useContext } from 'react';
import styled, { css } from 'styled-components';
import { CardContext } from '../context/CardContext';
import { hidden } from '../utils/propTypes/decorators';
var scrollableMixin = css(["flex:1 1 auto;overflow:auto;&:last-child{margin-bottom:", ";}"], function (_ref) {
  var compact = _ref.compact;
  return compact ? '24px' : '40px';
});
var siblingPaddingMixin = css(["+ .private-card__section,+ * .private-card__section{padding-top:0;}"]);
var Section = styled.div.withConfig({
  displayName: "UICardSection__Section",
  componentId: "qwdbho-0"
})(["padding:", ";border-radius:inherit;", ";"], function (_ref2) {
  var compact = _ref2.compact,
      flush = _ref2.flush,
      isHeader = _ref2.isHeader,
      scrollable = _ref2.scrollable;
  var paddingTop = compact ? '24px' : '40px';
  var paddingBottom = isHeader || scrollable ? '0' : paddingTop;
  var paddingX = flush ? '0' : paddingTop;
  return paddingTop + " " + paddingX + " " + paddingBottom;
}, function (_ref3) {
  var scrollable = _ref3.scrollable;
  return scrollable ? scrollableMixin : siblingPaddingMixin;
});
var UICardSection = /*#__PURE__*/forwardRef(function (props, ref) {
  var className = props.className,
      rest = _objectWithoutProperties(props, ["className"]);

  var _useContext = useContext(CardContext),
      compact = _useContext.compact;

  return /*#__PURE__*/_jsx(Section, Object.assign({}, rest, {
    ref: ref,
    className: classNames("private-card__section has--vertical-spacing", className),
    compact: compact
  }));
});
UICardSection.defaultProps = {
  flush: false,
  isHeader: false,
  scrollable: false
};
UICardSection.propTypes = {
  children: PropTypes.node,
  flush: PropTypes.bool,
  isHeader: hidden(PropTypes.bool),
  scrollable: PropTypes.bool
};
UICardSection.displayName = 'UICardSection';
export default UICardSection;