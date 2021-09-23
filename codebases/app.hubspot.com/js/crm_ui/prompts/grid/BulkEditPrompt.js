'use es6';

import BatchMutateAPI from 'crm_data/batch/BatchMutateAPI';
import ObjectsActions from 'crm_data/objects/ObjectsActions';
import BulkEditDialog from '../../dialog/grid/BulkEditDialog';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import { fromJS } from 'immutable';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import Promptable from 'UIComponents/decorators/Promptable';
import emptyFunction from 'react-utils/emptyFunction';

var _bulkEditorPrompt = Promptable(BulkEditDialog);

var _bulkErrorMessage = function _bulkErrorMessage() {
  return Alerts.addError('topbarContents.bulkEditModal.updateError');
};

var _bulkEditCallback = function _bulkEditCallback(params, propertyChanges, applyToAll, email) {
  if (!propertyChanges || Object.keys(propertyChanges).length === 0) {
    return;
  }

  var _params$bulkActionPro = params.bulkActionProps,
      searchQuery = _params$bulkActionPro.query,
      isSelectionGreaterThanView = _params$bulkActionPro.isSelectionGreaterThanView,
      checked = _params$bulkActionPro.checked,
      objectType = _params$bulkActionPro.objectType,
      objectTypeLabel = _params$bulkActionPro.objectTypeLabel,
      selectionCount = _params$bulkActionPro.selectionCount,
      _params$onSuccess = params.onSuccess,
      onSuccess = _params$onSuccess === void 0 ? emptyFunction : _params$onSuccess,
      _params$isIKEA = params.isIKEA,
      isIKEA = _params$isIKEA === void 0 ? false : _params$isIKEA;
  var query = isSelectionGreaterThanView ? searchQuery : checked.toArray();
  var changes = [];

  for (var propertyName in propertyChanges) {
    if (Object.prototype.hasOwnProperty.call(propertyChanges, propertyName)) {
      var propertyValue = propertyChanges[propertyName];
      changes.push({
        name: propertyName,
        value: propertyValue
      });
    }
  }

  BatchMutateAPI.update({
    email: email,
    query: query,
    properties: changes,
    objectType: objectType,
    applyToAll: applyToAll,
    selectedCount: selectionCount
  }).then(function () {
    onSuccess(changes); // If we are in the rewrite, we do not want to optimistically update
    // the object stores because that can result in partial object records.
    // This entire file should be removed when we're refactoring bulk actions
    // away from the legacy patterns.

    if (!isIKEA) {
      ObjectsActions.bulkUpdateStoresLocal(objectType, checked, fromJS(propertyChanges));
    }

    Alerts.addSuccess("bulkActions.bulkActionSucceeded", {
      count: selectionCount,
      objectTypeLabel: objectTypeLabel
    });
  }, _bulkErrorMessage);
};

export default function (params) {
  var prompt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _bulkEditorPrompt;
  prompt(params).then(function (_ref) {
    var propertyChanges = _ref.propertyChanges,
        applyToAll = _ref.applyToAll,
        email = _ref.email;
    return _bulkEditCallback(params, propertyChanges, applyToAll, email);
  }, rethrowError).done();
}