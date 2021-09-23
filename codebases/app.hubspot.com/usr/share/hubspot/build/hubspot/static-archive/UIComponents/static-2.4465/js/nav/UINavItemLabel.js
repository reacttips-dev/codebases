'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import createReactClass from 'create-react-class';
import styled from 'styled-components';
import { NAV_ITEM_INNER_SPACING_X } from 'HubStyleTokens/sizes';
import { isRenderable } from '../utils/propTypes/componentProp';
var NavItemLabel = styled.span.withConfig({
  displayName: "UINavItemLabel__NavItemLabel",
  componentId: "sc-101ejm1-0"
})(["align-items:center;display:flex;flex-grow:1;width:100%;"]);
var Count = styled.span.withConfig({
  displayName: "UINavItemLabel__Count",
  componentId: "sc-101ejm1-1"
})(["margin-left:auto;padding-left:", ";"], NAV_ITEM_INNER_SPACING_X);
export default createReactClass({
  displayName: 'UINavItemLabel',
  propTypes: {
    children: PropTypes.node,
    count: PropTypes.node
  },
  render: function render() {
    var _this$props = this.props,
        children = _this$props.children,
        className = _this$props.className,
        count = _this$props.count,
        rest = _objectWithoutProperties(_this$props, ["children", "className", "count"]);

    return /*#__PURE__*/_jsxs(NavItemLabel, Object.assign({}, rest, {
      className: className,
      children: [/*#__PURE__*/_jsx(Fragment, {
        children: children
      }), isRenderable(count) && /*#__PURE__*/_jsx(Count, {
        children: count
      })]
    }));
  }
});