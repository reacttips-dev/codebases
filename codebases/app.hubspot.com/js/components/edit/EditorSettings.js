'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import { canWrite } from 'SequencesUI/lib/permissions';
import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import UISection from 'UIComponents/section/UISection';
import EligibleFollowUpDaysOption from './settings/EligibleFollowUpDaysOption';
import ThreadedFollowUpsOption from './settings/ThreadedFollowUpsOption';
import FollowUpEmailsTimeRangeOption from './settings/FollowUpEmailsTimeRangeOption';
import TaskReminderTimeOption from './settings/TaskReminderTimeOption';
var CenteredTabContent = styled.div.withConfig({
  displayName: "EditorSettings__CenteredTabContent",
  componentId: "kjcjn4-0"
})(["margin:20px auto 0;width:70%;max-width:800px;"]);
export default createReactClass({
  displayName: "EditorSettings",
  propTypes: {
    sequenceSettings: PropTypes.instanceOf(ImmutableMap).isRequired,
    updateSettings: PropTypes.func.isRequired
  },
  render: function render() {
    var sequenceSettings = this.props.sequenceSettings;
    var readOnly = !canWrite();
    return /*#__PURE__*/_jsxs(CenteredTabContent, {
      "data-test-id": "editor-settings",
      children: [/*#__PURE__*/_jsxs(UISection, {
        children: [/*#__PURE__*/_jsx(H4, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.settings.headers.general"
          })
        }), /*#__PURE__*/_jsx(EligibleFollowUpDaysOption, {
          sequenceSettings: sequenceSettings,
          handleUpdateSettings: this.props.updateSettings,
          readOnly: readOnly
        })]
      }), /*#__PURE__*/_jsxs(UISection, {
        use: "island",
        children: [/*#__PURE__*/_jsx(H4, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.settings.headers.followUpEmails"
          })
        }), /*#__PURE__*/_jsx(ThreadedFollowUpsOption, {
          sequenceSettings: sequenceSettings,
          handleUpdateSettings: this.props.updateSettings,
          readOnly: readOnly
        }), /*#__PURE__*/_jsx(FollowUpEmailsTimeRangeOption, {
          sequenceSettings: sequenceSettings,
          handleUpdateSettings: this.props.updateSettings,
          readOnly: readOnly
        })]
      }), /*#__PURE__*/_jsxs(UISection, {
        use: "island",
        children: [/*#__PURE__*/_jsx(H4, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.settings.headers.tasks"
          })
        }), /*#__PURE__*/_jsx(TaskReminderTimeOption, {
          sequenceSettings: sequenceSettings,
          handleUpdateSettings: this.props.updateSettings,
          readOnly: readOnly
        })]
      })]
    });
  }
});