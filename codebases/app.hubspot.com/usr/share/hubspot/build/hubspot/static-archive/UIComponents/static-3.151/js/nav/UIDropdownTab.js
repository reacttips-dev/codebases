'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import UIDropdown from '../dropdown/UIDropdown';
import PropTypes from 'prop-types';
import UITab from './UITab';

var Link = function Link(props) {
  var buttonRef = props.buttonRef,
      __useNativeButton = props._useNativeButton,
      rest = _objectWithoutProperties(props, ["buttonRef", "_useNativeButton"]);

  return /*#__PURE__*/_jsx(UITab.defaultProps.Link, Object.assign({
    linkRef: buttonRef
  }, rest));
};

var DropdownLink = function DropdownLink(props) {
  var children = props.children,
      use = props.use,
      rest = _objectWithoutProperties(props, ["children", "use"]);

  return /*#__PURE__*/_jsx(UIDropdown, Object.assign({
    Button: Link,
    buttonText: children,
    buttonUse: use
  }, rest));
};

var UIDropdownTab = /*#__PURE__*/function (_Component) {
  _inherits(UIDropdownTab, _Component);

  function UIDropdownTab() {
    _classCallCheck(this, UIDropdownTab);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIDropdownTab).apply(this, arguments));
  }

  _createClass(UIDropdownTab, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          active = _this$props.active,
          DropdownContent = _this$props.DropdownContent,
          rest = _objectWithoutProperties(_this$props, ["active", "DropdownContent"]);

      var dropdownProps = active ? {
        Link: DropdownLink,
        Content: DropdownContent
      } : undefined;
      return /*#__PURE__*/_jsx(UITab, Object.assign({}, rest, {}, dropdownProps, {
        active: active
      }));
    }
  }]);

  return UIDropdownTab;
}(Component);

export { UIDropdownTab as default };
UIDropdownTab.propTypes = Object.assign({}, UITab.propTypes, {
  DropdownContent: PropTypes.elementType.isRequired
});
UIDropdownTab.defaultProps = Object.assign({}, UITab.defaultProps);
UIDropdownTab.displayName = 'UIDropdownTab';