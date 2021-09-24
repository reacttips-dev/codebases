'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import createReactClass from 'create-react-class';
import UINavList from './UINavList';
var UIFolderNav = createReactClass({
  displayName: 'UIFolderNav',
  propTypes: Object.assign({}, UINavList.propTypes),
  getDefaultProps: function getDefaultProps() {
    return Object.assign({}, UINavList.defaultProps);
  },
  render: function render() {
    var _this$props = this.props,
        children = _this$props.children,
        className = _this$props.className,
        rest = _objectWithoutProperties(_this$props, ["children", "className"]);

    return /*#__PURE__*/_jsx(UINavList, Object.assign({}, rest, {
      className: classNames(className, 'private-folder-nav'),
      _rootComponent: UIFolderNav,
      children: children
    }));
  }
});
export default UIFolderNav;