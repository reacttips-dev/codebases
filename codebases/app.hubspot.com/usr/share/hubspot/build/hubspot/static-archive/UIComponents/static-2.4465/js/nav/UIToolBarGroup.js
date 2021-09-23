'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { toPx } from '../utils/Styles';
var StyledToolBarGroup = styled.div.withConfig({
  displayName: "UIToolBarGroup__StyledToolBarGroup",
  componentId: "sc-8nqnjv-0"
})(["align-items:center;display:flex;flex-basis:", ";flex-grow:1;max-width:100%;white-space:nowrap;"], function (_ref) {
  var minimumWidth = _ref.minimumWidth;
  return minimumWidth ? toPx(minimumWidth) + " !important" : '0%';
});

var UIToolBarGroup = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIToolBarGroup, _PureComponent);

  function UIToolBarGroup() {
    _classCallCheck(this, UIToolBarGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIToolBarGroup).apply(this, arguments));
  }

  _createClass(UIToolBarGroup, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children,
          rest = _objectWithoutProperties(_this$props, ["className", "children"]);

      var computedClassName = classNames("private-tool-bar__group has--horizontal-spacing", className);
      return /*#__PURE__*/_jsx(StyledToolBarGroup, Object.assign({}, rest, {
        className: computedClassName,
        children: children
      }));
    }
  }]);

  return UIToolBarGroup;
}(PureComponent);

export { UIToolBarGroup as default };
UIToolBarGroup.propTypes = {
  children: PropTypes.node,
  minimumWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
UIToolBarGroup.displayName = 'UIToolBarGroup';