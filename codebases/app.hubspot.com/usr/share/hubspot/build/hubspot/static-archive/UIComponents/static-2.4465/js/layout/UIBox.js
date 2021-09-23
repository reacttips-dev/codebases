'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { ALIGN_SELF_OPTIONS } from './BoxConstants';
import { toPx } from '../utils/Styles';
var Box = styled.div.withConfig({
  displayName: "UIBox__Box",
  componentId: "x14f9f-0"
})(["align-self:", ";flex-basis:", ";flex-grow:", ";flex-shrink:", ";order:", ";"], function (props) {
  return ALIGN_SELF_OPTIONS[props.alignSelf];
}, function (props) {
  return toPx(props.basis);
}, function (props) {
  return props.grow;
}, function (props) {
  return props.shrink;
}, function (props) {
  return props.order;
});
var UIBox = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(Box, Object.assign({}, rest, {
    className: cx('private-flex__child', className),
    ref: ref
  }));
});
UIBox.defaultProps = {
  alignSelf: 'auto',
  basis: 'auto',
  grow: 0,
  flexOrder: 0,
  shrink: 1
};
UIBox.propTypes = {
  alignSelf: PropTypes.oneOf(Object.keys(ALIGN_SELF_OPTIONS)),
  basis: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node,
  grow: PropTypes.number,
  shrink: PropTypes.number,
  order: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['inherit', 'initial', 'unset'])])
};
UIBox.displayName = 'UIBox';
export default UIBox;