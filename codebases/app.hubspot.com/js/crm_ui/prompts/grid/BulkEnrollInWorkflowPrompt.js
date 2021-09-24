'use es6';

import { addAllToWorkflow, bulkAddToWorkflow } from 'crm_data/workflows/WorkflowsAPI';
import BulkEnrollInWorkflowDialog from '../../dialog/grid/BulkEnrollInWorkflowDialog';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import Promptable from 'UIComponents/decorators/Promptable';

var _bulkEnrollInWorkflowPrompt = Promptable(BulkEnrollInWorkflowDialog);

var _errorMessage = function _errorMessage() {
  Alerts.addError('bulkActions.bulkAddToWorkflowError');
};

var _callback = function _callback(workflowId, params) {
  var _params$bulkActionPro = params.bulkActionProps,
      allSelected = _params$bulkActionPro.allSelected,
      listId = _params$bulkActionPro.listId,
      checked = _params$bulkActionPro.checked;

  if (allSelected && listId !== undefined) {
    return addAllToWorkflow(listId, workflowId).catch(_errorMessage);
  }

  return bulkAddToWorkflow({
    vids: checked.toArray(),
    workflowId: workflowId
  }).catch(_errorMessage);
};

export default function (params) {
  var prompt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _bulkEnrollInWorkflowPrompt;
  prompt(params).then(function (_ref) {
    var workflowId = _ref.workflowId;
    return _callback(workflowId, params);
  }, rethrowError).done();
}