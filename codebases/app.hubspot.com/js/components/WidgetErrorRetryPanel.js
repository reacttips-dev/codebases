'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import VisitorWidgetStyleWrapper from 'conversations-visitor-experience-components/presentation-components/VisitorWidgetStyleWrapper';
import styled from 'styled-components';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { WidgetLocationProp } from 'conversations-visitor-experience-components/visitor-widget/constants/WidgetLocations';
import VizExLink from 'visitor-ui-component-library/link/VizExLink';
import VizExCloseButton from 'visitor-ui-component-library/button/VizExCloseButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
export var WidgetBodyDiv = styled.div.withConfig({
  displayName: "WidgetErrorRetryPanel__WidgetBodyDiv",
  componentId: "juzt4x-0"
})(["display:flex;flex-direction:column;padding:40px;"]);

var WidgetErrorRetryPanel = /*#__PURE__*/function (_Component) {
  _inherits(WidgetErrorRetryPanel, _Component);

  function WidgetErrorRetryPanel() {
    _classCallCheck(this, WidgetErrorRetryPanel);

    return _possibleConstructorReturn(this, _getPrototypeOf(WidgetErrorRetryPanel).apply(this, arguments));
  }

  _createClass(WidgetErrorRetryPanel, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          inline = _this$props.inline,
          widgetLocation = _this$props.widgetLocation,
          mobile = _this$props.mobile,
          isOpen = _this$props.isOpen,
          onClose = _this$props.onClose;

      if (!isOpen) {
        return null;
      }

      return /*#__PURE__*/_jsx(VisitorWidgetStyleWrapper, {
        inline: inline,
        isOpen: true,
        mobile: mobile,
        widgetLocation: widgetLocation,
        browserWindowHeight: 0,
        children: /*#__PURE__*/_jsxs(WidgetBodyDiv, {
          children: [/*#__PURE__*/_jsx("h4", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "conversations-visitor-ui.widgetErrorRetryPanel.title"
            })
          }), /*#__PURE__*/_jsx(VizExCloseButton, {
            onClick: onClose
          }), /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "conversations-visitor-ui.widgetErrorRetryPanel.body_jsx",
            elements: {
              Link: VizExLink
            },
            options: {
              LinkProps: {
                use: 'on-bright',
                onClick: this.props.retry
              }
            }
          })]
        })
      });
    }
  }]);

  return WidgetErrorRetryPanel;
}(Component);

WidgetErrorRetryPanel.displayName = 'WidgetErrorRetryPanel';
WidgetErrorRetryPanel.propTypes = {
  inline: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool,
  mobile: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  retry: PropTypes.func.isRequired,
  widgetLocation: WidgetLocationProp
};
export default WidgetErrorRetryPanel;