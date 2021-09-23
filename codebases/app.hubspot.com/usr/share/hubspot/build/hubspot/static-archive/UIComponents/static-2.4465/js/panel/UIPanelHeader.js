'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { OLAF } from 'HubStyleTokens/colors';
import UIDialogHeader from '../dialog/UIDialogHeader';
import { callIfPossible } from '../core/Functions';
import { PanelNavigatorContext } from '../context/PanelNavigatorContext';
import { RegistersPanelHeader } from '../context/PanelComponentRegistrationContext';
var LeftContentWrapper = styled.div.withConfig({
  displayName: "UIPanelHeader__LeftContentWrapper",
  componentId: "sc-1dmjly5-0"
})(["position:relative;left:-12px;margin-right:28px;&::after{background-color:", ";content:'';height:32px;opacity:0.5;position:absolute;right:-21px;top:50%;transform:translateY(-50%);width:1px;}"], OLAF);

var UIPanelHeader = /*#__PURE__*/function (_Component) {
  _inherits(UIPanelHeader, _Component);

  function UIPanelHeader() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIPanelHeader);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIPanelHeader)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      currentPanel: null
    };
    return _this;
  }

  _createClass(UIPanelHeader, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var currentPanel = callIfPossible(this.context.getCurrentPanel);

      if (currentPanel) {
        this.setState({
          currentPanel: currentPanel
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          leftContent = _this$props.leftContent,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "leftContent"]);

      var currentPanel = this.state.currentPanel;
      var computedLeftContent = leftContent || callIfPossible(this.context.renderNavigation, currentPanel);
      var classes = classNames(className, 'private-panel__header');
      return /*#__PURE__*/_jsxs(UIDialogHeader, Object.assign({}, rest, {
        className: classes,
        children: [/*#__PURE__*/_jsx(RegistersPanelHeader, {}), computedLeftContent && /*#__PURE__*/_jsx(LeftContentWrapper, {
          children: computedLeftContent
        }), children]
      }));
    }
  }]);

  return UIPanelHeader;
}(Component);

export { UIPanelHeader as default };
UIPanelHeader.propTypes = UIDialogHeader.propTypes;
UIPanelHeader.defaultProps = UIDialogHeader.defaultProps;
UIPanelHeader.contextType = PanelNavigatorContext;
UIPanelHeader.displayName = 'UIPanelHeader';