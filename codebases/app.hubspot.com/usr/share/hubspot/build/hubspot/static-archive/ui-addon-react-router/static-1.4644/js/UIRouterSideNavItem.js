'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Children } from 'react';
import UISideNavItem from 'UIComponents/nav/UISideNavItem';
import UIRouterLink from './UIRouterLink';

var pickSideNavItemProps = function pickSideNavItemProps(props) {
  var sideNavProps = Object.keys(UISideNavItem.propTypes);
  return sideNavProps.reduce(function (prev, propName) {
    return Object.assign({}, prev, _defineProperty({}, propName, props[propName]));
  }, {});
};

var UIRouterSideNavItem = createReactClass({
  displayName: "UIRouterSideNavItem",
  contextTypes: {
    router: PropTypes.object
  },
  getInitialState: function getInitialState() {
    return {
      hasActiveChild: false
    };
  },
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    var _this = this;

    if (this.props.to == null && this.props.children) {
      Children.forEach(this.props.children, function (child) {
        if (_this.context.router.isActive(child.props ? child.props.to : {}, false)) {
          _this.setState({
            hasActiveChild: true
          });
        }
      });
    }
  },
  render: function render() {
    if (this.props.to == null) {
      var defaultOpen = this.props.defaultOpen == null ? this.state.hasActiveChild : this.props.defaultOpen;
      return /*#__PURE__*/_jsx(UISideNavItem, Object.assign({}, pickSideNavItemProps(this.props), {
        defaultOpen: defaultOpen
      }));
    }

    return /*#__PURE__*/_jsx(UISideNavItem, Object.assign({}, this.props, {
      onlyActiveOnIndex: this.props.onlyActiveOnIndex,
      activeClassName: "private-nav-item--active",
      linkComponent: UIRouterLink
    }));
  }
});
UIRouterSideNavItem.propTypes = Object.assign({}, UIRouterLink.propTypes, {}, UISideNavItem.propTypes);
UIRouterSideNavItem.defaultProps = Object.assign({}, UIRouterLink.defaultProps, {}, UISideNavItem.defaultProps, {
  defaultOpen: undefined,
  onlyActiveOnIndex: true
});
export default UIRouterSideNavItem;