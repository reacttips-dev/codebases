'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import { useCallback } from 'react';
import { withFlowEditorContext } from '../FlowEditorContext';
import { getExtensionInstanceFieldValue, setExtensionInstanceFieldValue } from '../../lib/Actions';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import { registerQuery, useQuery } from 'data-fetching-client';
import { fetchEnrollActionOptionsSender } from 'SequencesUI/api/SequenceWorkflowManagementApi';
var GET_AUTOMATION_ACTION_SENDER_OPTIONS = registerQuery({
  fieldName: 'automationActionSender',
  fetcher: fetchEnrollActionOptionsSender
});

var updateSenderUserId = function updateSenderUserId(stagedAction, userId) {
  var action = setExtensionInstanceFieldValue(stagedAction, 'userId', userId);
  action = setExtensionInstanceFieldValue(action, 'fromAndInboxAddress', null);
  return action;
};

export var SenderSelect = function SenderSelect(_ref) {
  var stagedAction = _ref.stagedAction,
      setStagedAction = _ref.setStagedAction;
  var handleSenderChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setStagedAction(updateSenderUserId(stagedAction, value));
  }, [stagedAction, setStagedAction]);

  var _useQuery = useQuery(GET_AUTOMATION_ACTION_SENDER_OPTIONS),
      loading = _useQuery.loading,
      error = _useQuery.error,
      data = _useQuery.data;

  var options = loading || error ? [] : data.automationActionSender.options;
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesAutomation.action.enroll.actionConfig.sender.label"
    }),
    help: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesAutomation.action.enroll.actionConfig.sender.help"
    }),
    children: /*#__PURE__*/_jsx(UISelect, {
      placeholder: I18n.text('sequencesAutomation.action.enroll.actionConfig.sender.placeholder'),
      readOnly: !canEditSequencesContextualWorkflows(),
      onChange: handleSenderChange,
      value: getExtensionInstanceFieldValue(stagedAction, 'userId'),
      options: options
    })
  });
};
SenderSelect.propTypes = {
  stagedAction: PropTypes.object.isRequired,
  setStagedAction: PropTypes.func.isRequired
};
export default withFlowEditorContext(SenderSelect);