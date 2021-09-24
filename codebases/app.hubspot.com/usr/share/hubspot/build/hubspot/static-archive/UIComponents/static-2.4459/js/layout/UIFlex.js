'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { ALIGN_OPTIONS, ALIGN_SELF_OPTIONS, DIRECTION_OPTIONS, JUSTIFY_OPTIONS, WRAP_OPTIONS } from './FlexConstants';
var StyledFlex = styled.div.withConfig({
  displayName: "UIFlex__StyledFlex",
  componentId: "sc-29xo40-0"
})(["display:flex;flex-grow:1;align-items:", ";align-self:", ";flex-direction:", ";justify-content:", ";flex-wrap:", ";max-width:100%;width:100%;& > .private-flex{width:auto;}"], function (props) {
  return ALIGN_OPTIONS[props.align];
}, function (props) {
  return ALIGN_SELF_OPTIONS[props.alignSelf];
}, function (props) {
  return DIRECTION_OPTIONS[props.direction];
}, function (props) {
  return JUSTIFY_OPTIONS[props.justify];
}, function (props) {
  return WRAP_OPTIONS[props.wrap];
});
var UIFlex = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(StyledFlex, Object.assign({}, rest, {
    className: cx('private-flex', className),
    ref: ref
  }));
});
UIFlex.propTypes = {
  align: PropTypes.oneOf(Object.keys(ALIGN_OPTIONS)),
  alignSelf: PropTypes.oneOf(Object.keys(ALIGN_SELF_OPTIONS)),
  children: PropTypes.node,
  direction: PropTypes.oneOf(Object.keys(DIRECTION_OPTIONS)),
  justify: PropTypes.oneOf(Object.keys(JUSTIFY_OPTIONS)),
  wrap: PropTypes.oneOf(Object.keys(WRAP_OPTIONS))
};
UIFlex.defaultProps = {
  align: 'start',
  direction: 'row',
  justify: 'start',
  wrap: 'nowrap'
};
UIFlex.displayName = 'UIFlex';
export default UIFlex;