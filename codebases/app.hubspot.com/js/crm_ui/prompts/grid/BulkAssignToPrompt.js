'use es6';

import BatchMutateAPI from 'crm_data/batch/BatchMutateAPI';
import ObjectsActions from 'crm_data/objects/ObjectsActions';
import BulkAssignToDialog from '../../dialog/grid/BulkAssignToDialog';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import { Map as ImmutableMap } from 'immutable';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import Promptable from 'UIComponents/decorators/Promptable';
import emptyFunction from 'react-utils/emptyFunction';
import I18n from 'I18n';

var _assignPrompt = Promptable(BulkAssignToDialog);

var _errorMessage = function _errorMessage(objectTypeLabel) {
  Alerts.addError('bulkActions.bulkAssignError', {
    objectTypeLabel: objectTypeLabel || I18n.text('customerDataObjects.objectNames.unknownNumber.default')
  });
};

var _assignCallback = function _assignCallback(selectedOwner, applyToAll, email, params) {
  var _params$bulkActionPro = params.bulkActionProps,
      isSelectionGreaterThanView = _params$bulkActionPro.isSelectionGreaterThanView,
      objectType = _params$bulkActionPro.objectType,
      selectionCount = _params$bulkActionPro.selectionCount,
      checked = _params$bulkActionPro.checked,
      objectTypeLabel = _params$bulkActionPro.objectTypeLabel,
      _query = _params$bulkActionPro.query,
      _params$onSuccess = params.onSuccess,
      onSuccess = _params$onSuccess === void 0 ? emptyFunction : _params$onSuccess,
      _params$isIKEA = params.isIKEA,
      isIKEA = _params$isIKEA === void 0 ? false : _params$isIKEA;
  var query = isSelectionGreaterThanView ? _query : checked.toArray();
  var changes = [{
    name: 'hubspot_owner_id',
    value: selectedOwner
  }];
  var propertyChanges = ImmutableMap({
    hubspot_owner_id: selectedOwner
  });
  return BatchMutateAPI.update({
    email: email,
    query: query,
    properties: changes,
    objectType: objectType,
    applyToAll: applyToAll,
    selectedCount: selectionCount
  }).then(function () {
    // If we are in the rewrite, we do not want to optimistically update
    // the object stores because that can result in partial object records.
    // This entire file should be removed when we're refactoring bulk actions
    // away from the legacy patterns.
    if (!isIKEA) {
      ObjectsActions.bulkUpdateStoresLocal(objectType, checked, propertyChanges);
    }

    Alerts.addSuccess("bulkActions.bulkActionSuccess." + objectType, {
      count: selectionCount
    });
    onSuccess(changes);
  }, function () {
    return _errorMessage(objectTypeLabel);
  });
};

export default function (params) {
  var prompt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _assignPrompt;
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _assignCallback;
  prompt(params).then(function (_ref) {
    var email = _ref.email,
        selectedOwner = _ref.selectedOwner,
        applyToAll = _ref.applyToAll;
    return callback(selectedOwner, applyToAll, email, params);
  }, rethrowError).done();
}
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;