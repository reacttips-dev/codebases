'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import UIForm from 'UIComponents/form/UIForm';
import UIButton from 'UIComponents/button/UIButton';
import UIIFrame from 'ui-addon-iframeable/host/UIIFrame';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import PortalIdParser from 'PortalIdParser';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SurveysSidebarHeader from './SurveysSidebarHeader';
import SelectSurveysMessage from './SelectSurveysMessage';
import { SELECTED_SURVEY_CHANGED_EVENT } from '../../utils/windowEventTypes';
var sidebarBodyWidth = 620;
var sidebarBodyHeight = 760;
var portalId = PortalIdParser.get();

var SurveysSidebar = /*#__PURE__*/function (_Component) {
  _inherits(SurveysSidebar, _Component);

  function SurveysSidebar(props) {
    var _this;

    _classCallCheck(this, SurveysSidebar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SurveysSidebar).call(this, props));
    _this.handleMessage = _this.handleMessage.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SurveysSidebar, [{
    key: "handleMessage",
    value: function handleMessage(message) {
      if (message.payload.type === SELECTED_SURVEY_CHANGED_EVENT) {
        this.props.onSelectedSurveyChange(message);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          closeSidebar = _this$props.closeSidebar,
          onClick = _this$props.onClick,
          scheduleSending = _this$props.scheduleSending,
          selectedManyContacts = _this$props.selectedManyContacts,
          selectedSurveyId = _this$props.selectedSurveyId;
      return /*#__PURE__*/_jsx(UIModalPanel, {
        onClick: onClick,
        children: /*#__PURE__*/_jsxs(UIForm, {
          children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
            children: [/*#__PURE__*/_jsx(SurveysSidebarHeader, {
              selectedManyContacts: selectedManyContacts
            }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
              onClick: closeSidebar
            })]
          }), /*#__PURE__*/_jsxs(UIDialogBody, {
            children: [/*#__PURE__*/_jsx(SelectSurveysMessage, {
              selectedManyContacts: selectedManyContacts
            }), /*#__PURE__*/_jsx(UIIFrame, {
              src: "/surveymonkey-integration-ui/" + portalId,
              width: sidebarBodyWidth,
              height: sidebarBodyHeight,
              style: {
                borderStyle: 'none'
              },
              onReady: function onReady() {},
              onMessage: this.handleMessage
            })]
          }), /*#__PURE__*/_jsxs(UIDialogFooter, {
            children: [/*#__PURE__*/_jsx(UIButton, {
              use: "primary",
              disabled: selectedSurveyId == null,
              onClick: scheduleSending,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "sidebar.sendButton"
              })
            }), /*#__PURE__*/_jsx(UIButton, {
              use: "secondary",
              onClick: closeSidebar,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "sidebar.cancelButton"
              })
            })]
          })]
        })
      });
    }
  }]);

  return SurveysSidebar;
}(Component);

export default SurveysSidebar;