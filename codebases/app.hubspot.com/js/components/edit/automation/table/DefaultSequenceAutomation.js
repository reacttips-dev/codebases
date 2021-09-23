'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from 'react';
import { canWrite } from 'SequencesUI/lib/permissions';
import { useSelector, useDispatch } from 'react-redux';
import { sequenceSettingsSelector } from 'SequencesUI/selectors/sequenceDataSelectors';
import { updateSettings } from 'SequencesUI/actions/SequenceEditorActions';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import * as SellingStrategyTypes from 'SequencesUI/constants/SellingStrategyTypes';
import DefaultSequenceAutomationTableRow from './DefaultSequenceAutomationTableRow';

var DefaultSequenceAutomation = function DefaultSequenceAutomation() {
  var readOnly = !canWrite();
  var dispatch = useDispatch();
  var sequenceSettings = useSelector(sequenceSettingsSelector);
  var handleSellingStrategyChange = useCallback(function (_ref) {
    var checked = _ref.target.checked;
    var value = checked ? SellingStrategyTypes.ACCOUNT_BASED : SellingStrategyTypes.LEAD_BASED;
    var updatedSettings = sequenceSettings.set('sellingStrategy', value);
    dispatch(updateSettings(updatedSettings));
  }, [sequenceSettings, dispatch]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("tr", {
      children: /*#__PURE__*/_jsx(DefaultSequenceAutomationTableRow, {
        triggerLabel: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sequencesAutomation.trigger.emailReply.cellLabel.any"
        }),
        actionLabel: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sequencesAutomation.action.unenroll.cellLabel.contact"
        }),
        forDisplayPurposesOnly: true,
        id: "email-reply-unenroll"
      })
    }), /*#__PURE__*/_jsx("tr", {
      children: /*#__PURE__*/_jsx(DefaultSequenceAutomationTableRow, {
        triggerLabel: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sequencesAutomation.trigger.emailReply.cellLabel.any"
        }),
        actionLabel: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sequencesAutomation.action.unenroll.cellLabel.company"
        }),
        readOnly: readOnly,
        checked: sequenceSettings.get('sellingStrategy') === SellingStrategyTypes.ACCOUNT_BASED,
        onChange: handleSellingStrategyChange,
        id: "account-based-unenroll"
      })
    }), /*#__PURE__*/_jsx("tr", {
      children: /*#__PURE__*/_jsx(DefaultSequenceAutomationTableRow, {
        triggerLabel: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sequencesAutomation.trigger.meetingBooked.cellLabel.any"
        }),
        actionLabel: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sequencesAutomation.action.unenroll.cellLabel.contact"
        }),
        forDisplayPurposesOnly: true,
        id: "schedule-meeting-unenroll"
      })
    })]
  });
};

DefaultSequenceAutomation.propTypes = {};
export default DefaultSequenceAutomation;