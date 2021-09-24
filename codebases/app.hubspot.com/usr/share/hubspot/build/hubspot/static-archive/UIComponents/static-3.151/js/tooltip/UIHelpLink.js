'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Controllable from '../decorators/Controllable';
import SyntheticEvent from '../core/SyntheticEvent';
import UILink from '../link/UILink';
import UIControlledPopover from './UIControlledPopover';

var UIHelpLink = /*#__PURE__*/function (_Component) {
  _inherits(UIHelpLink, _Component);

  function UIHelpLink() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIHelpLink);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIHelpLink)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleLinkClick = function (evt) {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          onClick = _this$props.onClick,
          onOpenChange = _this$props.onOpenChange,
          open = _this$props.open;
      if (disabled) return;
      if (onClick) onClick(evt);

      if (!evt.defaultPrevented) {
        onOpenChange(SyntheticEvent(!open));
      }
    };

    return _this;
  }

  _createClass(UIHelpLink, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          className = _this$props2.className,
          disabled = _this$props2.disabled,
          href = _this$props2.href,
          __onClick = _this$props2.onClick,
          open = _this$props2.open,
          rest = _objectWithoutProperties(_this$props2, ["children", "className", "disabled", "href", "onClick", "open"]);

      return /*#__PURE__*/_jsx(UIControlledPopover, Object.assign({}, rest, {
        open: !disabled && open,
        use: "longform",
        children: /*#__PURE__*/_jsx(UILink, {
          className: className,
          href: href,
          onClick: this.handleLinkClick,
          disabled: disabled,
          children: children
        })
      }));
    }
  }]);

  return UIHelpLink;
}(Component);

UIHelpLink.propTypes = {
  children: UILink.propTypes.children,
  content: UIControlledPopover.propTypes.content,
  disabled: PropTypes.bool,
  href: UILink.propTypes.href,
  onOpenChange: UIControlledPopover.propTypes.onOpenChange,
  open: UIControlledPopover.propTypes.open,
  placement: UIControlledPopover.propTypes.placement,
  showCloseButton: UIControlledPopover.propTypes.showCloseButton
};
UIHelpLink.defaultProps = {
  disabled: false,
  open: false,
  placement: 'top',
  showCloseButton: false
};
UIHelpLink.displayName = 'UIHelpLink';
export default Controllable(UIHelpLink, ['open']);