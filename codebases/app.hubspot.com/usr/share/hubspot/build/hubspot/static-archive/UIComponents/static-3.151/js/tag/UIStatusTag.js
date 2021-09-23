'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { EERIE } from 'HubStyleTokens/colors';
import { TAG_HEIGHT } from 'HubStyleTokens/sizes';
import UITag from './UITag';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import { FONT_FAMILIES, toPx } from '../utils/Styles';
import UIStatusDot from './UIStatusDot';
var UnenclosedTag = styled(UITag).withConfig({
  displayName: "UIStatusTag__UnenclosedTag",
  componentId: "sc-1p2l6au-0"
})(["", " background-color:transparent;border-color:transparent;color:", ";line-height:normal;padding-left:0;vertical-align:middle;"], FONT_FAMILIES.default, EERIE);
var Text = styled.span.withConfig({
  displayName: "UIStatusTag__Text",
  componentId: "sc-1p2l6au-1"
})(["line-height:", ";"], toPx(parseInt(TAG_HEIGHT, 10) - 2));
var StatusFlexWrapper = styled.span.withConfig({
  displayName: "UIStatusTag__StatusFlexWrapper",
  componentId: "sc-1p2l6au-2"
})(["margin-top:-4px;margin-bottom:-4px;"]);
export default function UIStatusTag(_ref) {
  var children = _ref.children,
      className = _ref.className,
      color = _ref.color,
      hollow = _ref.hollow,
      StatusDot = _ref.StatusDot,
      use = _ref.use,
      multiline = _ref.multiline,
      rest = _objectWithoutProperties(_ref, ["children", "className", "color", "hollow", "StatusDot", "use", "multiline"]);

  return /*#__PURE__*/_jsx(UnenclosedTag, Object.assign({
    use: use,
    multiline: children === undefined || multiline
  }, rest, {
    className: classNames('private-tag--unenclosed', className, hollow && 'private-tag--hollow'),
    _flexWrapperProps: {
      as: StatusFlexWrapper
    },
    children: /*#__PURE__*/_jsxs(Text, {
      className: "private-tag--unenclosed__text",
      children: [/*#__PURE__*/_jsx(StatusDot, {
        color: color,
        hollow: hollow,
        use: use
      }), children]
    })
  }));
}
UIStatusTag.propTypes = Object.assign({}, UITag.propTypes, {
  color: PropTypes.string,
  hollow: PropTypes.bool.isRequired,
  StatusDot: getComponentPropType(UIStatusDot).isRequired
});
UIStatusTag.defaultProps = Object.assign({}, UITag.defaultProps, {
  hollow: false,
  StatusDot: UIStatusDot,
  use: 'info'
});
UIStatusTag.displayName = 'UIStatusTag';