'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PortalIdParser from 'PortalIdParser';
import Alerts from '../../utils/alerts';
import SurveysSidebar from './SurveysSidebar';
import { scheduleSendingSurveyForContacts, cancelSendingSurveyForContacts } from '../../api/SurveyMonkeyIntegrationClient';
var thisPortalId = PortalIdParser.get();

var SurveysSidebarContainer = /*#__PURE__*/function (_Component) {
  _inherits(SurveysSidebarContainer, _Component);

  function SurveysSidebarContainer(props) {
    var _this;

    _classCallCheck(this, SurveysSidebarContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SurveysSidebarContainer).call(this, props));
    _this.scheduleSending = _this.scheduleSending.bind(_assertThisInitialized(_this));
    _this.cancelSending = _this.cancelSending.bind(_assertThisInitialized(_this));
    _this.closeSidebar = _this.closeSidebar.bind(_assertThisInitialized(_this));
    _this.onSelectedSurveyChange = _this.onSelectedSurveyChange.bind(_assertThisInitialized(_this));
    _this.state = {
      selectedSurveyId: null,
      selectedSurveyTitle: null,
      portalId: thisPortalId,
      contactVids: _this.props.contactVids,
      lastSentSurveyId: null
    };
    return _this;
  }

  _createClass(SurveysSidebarContainer, [{
    key: "scheduleSending",
    value: function scheduleSending() {
      scheduleSendingSurveyForContacts(this.state.portalId, this.state.selectedSurveyId, this.state.contactVids);
      Alerts.displaySuccessSendingSurveyAlert(this.state.selectedSurveyTitle, this.cancelSending, this.state.contactVids.length > 1);
      this.closeSidebar();
    }
  }, {
    key: "cancelSending",
    value: function cancelSending() {
      cancelSendingSurveyForContacts(this.state.portalId, this.state.lastSentSurveyId, this.state.contactVids);
      Alerts.displaySuccessUndoSendingSurveyAlert(this.state.selectedSurveyTitle, this.state.contactVids.length > 1);
    }
  }, {
    key: "closeSidebar",
    value: function closeSidebar() {
      this.props.closeSidebar();
      this.setState({
        lastSentSurveyId: this.state.selectedSurveyId,
        selectedSurveyId: null
      });
    }
  }, {
    key: "onSelectedSurveyChange",
    value: function onSelectedSurveyChange(message) {
      var _message$payload = message.payload,
          surveyId = _message$payload.surveyId,
          surveyTitle = _message$payload.surveyTitle;
      this.setState({
        selectedSurveyId: surveyId,
        selectedSurveyTitle: surveyTitle
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onClick = _this$props.onClick,
          sidebarOpen = _this$props.sidebarOpen;
      return sidebarOpen ? /*#__PURE__*/_jsx(SurveysSidebar, {
        onClick: onClick,
        selectedSurveyId: this.state.selectedSurveyId,
        selectedManyContacts: this.state.contactVids.length > 1,
        closeSidebar: this.closeSidebar,
        scheduleSending: this.scheduleSending,
        onSelectedSurveyChange: this.onSelectedSurveyChange
      }) : null;
    }
  }]);

  return SurveysSidebarContainer;
}(Component);

export default SurveysSidebarContainer;