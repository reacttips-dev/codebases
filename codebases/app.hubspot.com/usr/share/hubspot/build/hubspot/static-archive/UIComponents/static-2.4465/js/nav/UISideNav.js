'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import UINavList from './UINavList';
var UISideNav = createReactClass({
  displayName: 'UISideNav',
  propTypes: Object.assign({}, UINavList.propTypes, {
    divider: PropTypes.bool,
    headingText: PropTypes.node
  }),
  getDefaultProps: function getDefaultProps() {
    return Object.assign({}, UINavList.defaultProps, {
      divider: false,
      headingText: ''
    });
  },
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        rest = _objectWithoutProperties(_this$props, ["className"]);

    return /*#__PURE__*/_jsx(UINavList, Object.assign({}, rest, {
      className: className,
      _rootComponent: UISideNav
    }));
  }
});
export default UISideNav;