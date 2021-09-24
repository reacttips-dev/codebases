'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import invariant from 'react-utils/invariant';
import { callIfPossible } from 'UIComponents/core/Functions';
import UIButton from 'UIComponents/button/UIButton';
export default createReactClass({
  displayName: "UIRouterButtonLink",
  propTypes: Object.assign({
    activeClassName: PropTypes.string.isRequired,
    activeStyle: PropTypes.object,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onlyActiveOnIndex: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
      hash: PropTypes.string,
      state: PropTypes.object
    })])
  }, UIButton.propTypes),
  contextTypes: {
    router: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return Object.assign({
      activeClassName: 'private-router-link--active',
      onlyActiveOnIndex: false,
      style: {}
    }, UIButton.defaultProps);
  },
  isActive: function isActive(_ref) {
    var onlyActiveOnIndex = _ref.onlyActiveOnIndex,
        to = _ref.to;
    return this.context.router.isActive(to, onlyActiveOnIndex);
  },
  handleClick: function handleClick(e) {
    var onClick = this.props.onClick;
    callIfPossible(onClick, e);

    if (e.defaultPrevented) {
      return;
    }

    invariant(this.context.router, '<UIRouterButtonLink>s rendered outside of a router context cannot navigate.');

    if (e && !e.metaKey) {
      e.preventDefault();
      this.context.router.push(this.props.to);
    }
  },
  render: function render() {
    var _this$props = this.props,
        activeClassName = _this$props.activeClassName,
        activeStyle = _this$props.activeStyle,
        children = _this$props.children,
        className = _this$props.className,
        onlyActiveOnIndex = _this$props.onlyActiveOnIndex,
        style = _this$props.style,
        to = _this$props.to,
        rest = _objectWithoutProperties(_this$props, ["activeClassName", "activeStyle", "children", "className", "onlyActiveOnIndex", "style", "to"]);

    var isActive = this.isActive({
      onlyActiveOnIndex: onlyActiveOnIndex,
      to: to
    });
    var classes = classNames(className, 'private-router-link', isActive && activeClassName);
    return /*#__PURE__*/_jsx(UIButton, Object.assign({}, rest, {
      className: classes,
      href: this.context.router.createHref(to),
      onClick: this.handleClick,
      style: Object.assign({}, style, {}, isActive ? activeStyle : null),
      children: children
    }));
  }
});