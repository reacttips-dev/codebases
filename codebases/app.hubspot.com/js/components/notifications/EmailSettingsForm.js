'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UISection from 'UIComponents/section/UISection';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import { NOTIFICATION_OPTION_TIME_DISPLAY } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
import { mapProp } from '../../lib/propTypes';
import { NavMarker } from 'react-rhumb';
var INBOX_EMAIL_OPTIONS = ['NONE', 'MORNING', 'MORNING_AFTERNOON', 'WEEKLY'];
var REPORT_EMAIL_OPTIONS = ['NONE', 'MONTHLY'];

var EmailSettingsForm = /*#__PURE__*/function (_Component) {
  _inherits(EmailSettingsForm, _Component);

  function EmailSettingsForm() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, EmailSettingsForm);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EmailSettingsForm)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onChangeInboxEmail = function (e) {
      _this.props.updateEmailSettings({
        inboxEmail: e.target.value
      });

      _this.props.saveEmailSettings();

      _this.context.trackInteraction("update inbox email - " + e.target.value);
    };

    _this.onChangeReportsEmail = function (e) {
      _this.props.updateEmailSettings({
        reportsEmail: e.target.value
      });

      _this.props.saveEmailSettings();

      _this.context.trackInteraction("update reports email - " + e.target.value);
    };

    _this.renderInboxOption = function (option) {
      var timeDisplay = NOTIFICATION_OPTION_TIME_DISPLAY[option] && NOTIFICATION_OPTION_TIME_DISPLAY[option]();
      return /*#__PURE__*/_jsx(UIRadioInput, {
        name: "inboxEmail",
        value: option,
        checked: _this.props.emailSettings.get('inboxEmail') === option,
        onChange: _this.onChangeInboxEmail,
        disabled: _this.props.changeDisabled,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sui.email.inbox.options." + option,
          options: {
            timeDisplay: timeDisplay
          }
        })
      }, option);
    };

    _this.renderReportOption = function (option) {
      return /*#__PURE__*/_jsx(UIRadioInput, {
        name: "reportsEmail",
        value: option,
        checked: _this.props.emailSettings.get('reportsEmail') === option,
        onChange: _this.onChangeReportsEmail,
        disabled: _this.props.changeDisabled,
        children: I18n.text("sui.email.report.options." + option)
      }, option);
    };

    return _this;
  }

  _createClass(EmailSettingsForm, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(NavMarker, {
        name: "EMAIL_NOTIFICATIONS_SETTINGS_LOADED",
        children: /*#__PURE__*/_jsxs("form", {
          className: "email-notifications",
          children: [/*#__PURE__*/_jsxs(UISection, {
            className: "inbox-options",
            children: [/*#__PURE__*/_jsx("h5", {
              children: I18n.text('sui.email.inbox.heading')
            }), /*#__PURE__*/_jsx("p", {
              children: I18n.text('sui.email.inbox.blurb')
            }), INBOX_EMAIL_OPTIONS.map(this.renderInboxOption)]
          }), /*#__PURE__*/_jsxs(UISection, {
            className: "report-options",
            children: [/*#__PURE__*/_jsx("h5", {
              children: I18n.text('sui.email.report.heading')
            }), /*#__PURE__*/_jsx("p", {
              children: I18n.text('sui.email.report.blurb')
            }), REPORT_EMAIL_OPTIONS.map(this.renderReportOption)]
          })]
        })
      });
    }
  }]);

  return EmailSettingsForm;
}(Component);

EmailSettingsForm.propTypes = {
  emailSettings: mapProp,
  updateEmailSettings: PropTypes.func,
  saveEmailSettings: PropTypes.func,
  changeDisabled: PropTypes.bool
};
EmailSettingsForm.contextType = SocialContext;
export { EmailSettingsForm as default };