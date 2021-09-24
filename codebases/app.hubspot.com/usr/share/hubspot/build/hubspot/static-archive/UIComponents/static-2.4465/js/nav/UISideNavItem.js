'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import UINavListItem from './UINavListItem';
export default createReactClass({
  displayName: 'UISideNavItem',
  propTypes: Object.assign({}, UINavListItem.propTypes),
  getDefaultProps: function getDefaultProps() {
    return Object.assign({}, UINavListItem.defaultProps);
  },
  render: function render() {
    var _this$props = this.props,
        children = _this$props.children,
        rest = _objectWithoutProperties(_this$props, ["children"]);

    return /*#__PURE__*/_jsx(UINavListItem, Object.assign({
      iconRight: children != null ? 'down' : null
    }, rest, {
      children: children
    }));
  }
});