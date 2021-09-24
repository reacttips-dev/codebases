'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import styled from 'styled-components';
import UINavListItem from './UINavListItem';
import UIIcon from '../icon/UIIcon';
import classNames from 'classnames';
import { CALYPSO } from 'HubStyleTokens/colors';
import { NAV_ITEM_PADDING_RIGHT } from 'HubStyleTokens/sizes';
var NavListItem = styled(UINavListItem).withConfig({
  displayName: "UIFolderNavItem__NavListItem",
  componentId: "jmq8mx-0"
})(["left:0;padding:8px;padding-right:", ";width:100%;&.private-folder-nav-item.private-nav-item{font-size:14px;}.private-icon{max-width:15px;margin-right:0.5em;}"], NAV_ITEM_PADDING_RIGHT);
export default createReactClass({
  displayName: 'UIFolderNavItem',
  propTypes: Object.assign({}, UINavListItem.propTypes),
  getDefaultProps: function getDefaultProps() {
    return Object.assign({}, UINavListItem.defaultProps);
  },
  getIcon: function getIcon() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        children = _ref.children,
        className = _ref.className,
        open = _ref.open,
        size = _ref.size;

    var icon = 'file';

    if (children != null) {
      icon = open ? 'folderOpen' : 'folder';
    }

    return /*#__PURE__*/_jsx(UIIcon, {
      className: classNames('private-folder-nav-item__icon', className),
      name: icon,
      size: size,
      color: CALYPSO
    });
  },
  render: function render() {
    var _this$props = this.props,
        children = _this$props.children,
        className = _this$props.className,
        rest = _objectWithoutProperties(_this$props, ["children", "className"]);

    return /*#__PURE__*/_jsx(NavListItem, Object.assign({
      className: classNames('private-folder-nav-item', className),
      iconLeft: this.getIcon,
      hasChildren: children != null
    }, rest, {
      children: children
    }));
  }
});