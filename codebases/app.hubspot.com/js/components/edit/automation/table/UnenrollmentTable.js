'use es6'; // TODO Can be deleted after Sequences:EmbeddedAutomation is fully ungated

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { canWrite } from 'SequencesUI/lib/permissions';
import { useSelector, useDispatch } from 'react-redux';
import { sequenceSelector, sequenceSettingsSelector } from 'SequencesUI/selectors/sequenceDataSelectors';
import { updateSettings } from 'SequencesUI/actions/SequenceEditorActions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UITable from 'UIComponents/table/UITable';
import * as SellingStrategyTypes from 'SequencesUI/constants/SellingStrategyTypes';
import FakeWorkflowTriggerCell from './FakeWorkflowTriggerCell';

var UnenrollmentTable = function UnenrollmentTable() {
  var readOnly = !canWrite();
  var dispatch = useDispatch();
  var sequenceName = useSelector(sequenceSelector).get('name');
  var sequenceSettings = useSelector(sequenceSettingsSelector);
  var handleSellingStrategyChange = useCallback(function (_ref) {
    var checked = _ref.target.checked;
    var value = checked ? SellingStrategyTypes.ACCOUNT_BASED : SellingStrategyTypes.LEAD_BASED;
    var updatedSettings = sequenceSettings.set('sellingStrategy', value);
    dispatch(updateSettings(updatedSettings));
  }, [sequenceSettings, dispatch]);
  return /*#__PURE__*/_jsxs(UITable, {
    children: [/*#__PURE__*/_jsxs("colgroup", {
      children: [/*#__PURE__*/_jsx("col", {
        style: {
          width: '40%'
        }
      }), /*#__PURE__*/_jsx("col", {
        style: {
          width: '60%'
        }
      })]
    }), /*#__PURE__*/_jsx("thead", {
      children: /*#__PURE__*/_jsxs("tr", {
        children: [/*#__PURE__*/_jsx("th", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.automation.automationTableHeaders.trigger"
          })
        }), /*#__PURE__*/_jsx("th", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.automation.automationTableHeaders.action"
          })
        })]
      })
    }), /*#__PURE__*/_jsxs("tbody", {
      children: [/*#__PURE__*/_jsxs("tr", {
        children: [/*#__PURE__*/_jsx(FakeWorkflowTriggerCell, {
          labelNode: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.automation.unenroll.emailReply.trigger"
          }),
          forDisplayPurposesOnly: true,
          id: "email-reply-trigger"
        }), /*#__PURE__*/_jsx("td", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "edit.automation.unenroll.emailReply.actionSingle",
            options: {
              sequenceName: sequenceName
            }
          })
        })]
      }), /*#__PURE__*/_jsxs("tr", {
        children: [/*#__PURE__*/_jsx(FakeWorkflowTriggerCell, {
          labelNode: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.automation.unenroll.emailReply.trigger"
          }),
          readOnly: readOnly,
          checked: sequenceSettings.get('sellingStrategy') === SellingStrategyTypes.ACCOUNT_BASED,
          onChange: handleSellingStrategyChange,
          id: "account-based-trigger"
        }), /*#__PURE__*/_jsx("td", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "edit.automation.unenroll.emailReply.actionAccountBased",
            options: {
              sequenceName: sequenceName
            }
          })
        })]
      }), /*#__PURE__*/_jsxs("tr", {
        children: [/*#__PURE__*/_jsx(FakeWorkflowTriggerCell, {
          labelNode: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.automation.unenroll.scheduleMeeting.trigger"
          }),
          forDisplayPurposesOnly: true,
          id: "schedule-meeting-trigger"
        }), /*#__PURE__*/_jsx("td", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "edit.automation.unenroll.scheduleMeeting.action",
            options: {
              sequenceName: sequenceName
            }
          })
        })]
      })]
    })]
  });
};

export default UnenrollmentTable;