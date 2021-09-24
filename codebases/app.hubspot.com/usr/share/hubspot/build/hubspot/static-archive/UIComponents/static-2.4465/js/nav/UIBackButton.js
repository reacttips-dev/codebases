'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import createReactClass from 'create-react-class';
import UIBreadcrumbs from '../nav/UIBreadcrumbs';
var UIBackButton = createReactClass({
  displayName: 'UIBackButton',
  propTypes: {
    children: PropTypes.element.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      role: 'navigation'
    };
  },
  getClassName: function getClassName(_ref) {
    var className = _ref.className;
    return classNames('private-back-button', className);
  },
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        children = _this$props.children,
        role = _this$props.role,
        rest = _objectWithoutProperties(_this$props, ["className", "children", "role"]);

    return /*#__PURE__*/_jsx(UIBreadcrumbs, Object.assign({}, rest, {
      className: this.getClassName({
        className: className
      }),
      role: role,
      children: children
    }));
  }
});
export default UIBackButton;