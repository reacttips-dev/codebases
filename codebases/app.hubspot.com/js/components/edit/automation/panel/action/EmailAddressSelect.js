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
import { fetchEnrollActionOptionsEmailAddress } from 'SequencesUI/api/SequenceWorkflowManagementApi';
export var GET_AUTOMATION_ACTION_EMAIL_ADDRESS_OPTIONS = registerQuery({
  fieldName: 'automationActionFromAndInboxAddress',
  args: ['senderUserId'],
  fetcher: fetchEnrollActionOptionsEmailAddress
});
export var EmailAddressSelect = function EmailAddressSelect(_ref) {
  var stagedAction = _ref.stagedAction,
      setStagedAction = _ref.setStagedAction;
  var handleSenderEmailChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setStagedAction(setExtensionInstanceFieldValue(stagedAction, 'fromAndInboxAddress', value));
  }, [stagedAction, setStagedAction]);
  var senderUserId = getExtensionInstanceFieldValue(stagedAction, 'userId');

  var _useQuery = useQuery(GET_AUTOMATION_ACTION_EMAIL_ADDRESS_OPTIONS, {
    variables: {
      senderUserId: senderUserId
    }
  }),
      loading = _useQuery.loading,
      error = _useQuery.error,
      data = _useQuery.data;

  var options = loading || error ? [] : data.automationActionFromAndInboxAddress.options;
  var userDoesntHaveConnectedEmail = !loading && !error && options.length === 0;
  var optionalProps = userDoesntHaveConnectedEmail ? {
    noResultsText: I18n.text('sequencesAutomation.action.enroll.actionConfig.email.noConnectedEmail')
  } : {};
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesAutomation.action.enroll.actionConfig.email.label"
    }),
    labelTooltip: !senderUserId && /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesAutomation.action.enroll.actionConfig.email.tooltip"
    }),
    children: /*#__PURE__*/_jsx(UISelect, Object.assign({
      readOnly: !senderUserId || !canEditSequencesContextualWorkflows(),
      placeholder: I18n.text('sequencesAutomation.action.enroll.actionConfig.email.placeholder'),
      onChange: handleSenderEmailChange,
      value: getExtensionInstanceFieldValue(stagedAction, 'fromAndInboxAddress'),
      options: options
    }, optionalProps))
  });
};
EmailAddressSelect.propTypes = {
  stagedAction: PropTypes.object.isRequired,
  setStagedAction: PropTypes.func.isRequired
};
export default withFlowEditorContext(EmailAddressSelect);