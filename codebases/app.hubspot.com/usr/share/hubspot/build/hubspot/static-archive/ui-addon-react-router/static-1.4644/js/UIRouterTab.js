'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import invariant from 'react-utils/invariant';
import { callIfPossible } from 'UIComponents/core/Functions';
import UITab from 'UIComponents/nav/UITab';
export default createReactClass({
  displayName: "UIRouterTab",
  propTypes: Object.assign({
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
      hash: PropTypes.string,
      state: PropTypes.object
    })])
  }, UITab.propTypes),
  contextTypes: {
    router: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return UITab.defaultProps;
  },
  handleClick: function handleClick(syntheticEvt) {
    var onClick = this.props.onClick;
    callIfPossible(onClick, syntheticEvt);

    if (syntheticEvt.source && syntheticEvt.source.defaultPrevented) {
      return;
    }

    invariant(this.context.router, '<UIRouterTab>s rendered outside of a router context cannot navigate.');

    if (syntheticEvt.source && !syntheticEvt.source.metaKey) {
      syntheticEvt.source.preventDefault();
      this.context.router.push(this.props.to);
    }
  },
  render: function render() {
    var _this$props = this.props,
        children = _this$props.children,
        className = _this$props.className,
        to = _this$props.to,
        rest = _objectWithoutProperties(_this$props, ["children", "className", "to"]);

    var classes = classNames(className, 'private-router-tab');
    return /*#__PURE__*/_jsx(UITab, Object.assign({}, rest, {
      className: classes,
      onClick: this.handleClick,
      href: this.context.router.createHref(to),
      children: children
    }));
  }
});