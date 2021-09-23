'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { removeAllFromList } from 'crm_data/lists/ListsAPI';
import BulkRemoveFromListDialog from '../../dialog/grid/BulkRemoveFromListDialog';
import { clearSelected, temporarilyExcludeIds } from '../../flux/grid/GridUIActions';
import { bulkRemoveFromList } from '../../flux/lists/ListsActions';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { addError, addSuccess } from 'customer-data-ui-utilities/alerts/Alerts';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import Promptable from 'UIComponents/decorators/Promptable';

var _bulkRemoveFromListPrompt = Promptable(BulkRemoveFromListDialog);

var _errorMessage = function _errorMessage() {
  addError('bulkActions.removeFromList.error', {}, _defineProperty({}, 'data-selenium-test', 'remove-from-list-error'));
};

var _callback = function _callback(listId, params) {
  var bulkActionProps = params.bulkActionProps;
  var checked = bulkActionProps.get('checked');
  var searchQuery = bulkActionProps.get('query');
  var allSelected = bulkActionProps.get('allSelected');
  var clearSelection = bulkActionProps.get('clearSelection');
  var ids = checked ? checked.toArray() : [];
  CrmLogger.log('use-bulk-remove-from-list');

  if (allSelected) {
    removeAllFromList(listId, searchQuery).then(function () {
      temporarilyExcludeIds(ids);
      if (clearSelection) clearSelection();
      addSuccess('bulkActions.removeFromList.removeAllSuccess', {}, _defineProperty({}, 'data-selenium-test', 'remove-from-list-success'));
    }).catch(_errorMessage);
  } else {
    bulkRemoveFromList(ids, listId).then(function (response) {
      temporarilyExcludeIds(ids);
      if (clearSelection) clearSelection();
      addSuccess('bulkActions.removeFromList.removeIdsSuccess', {
        count: response.size || 0
      }, _defineProperty({}, 'data-selenium-test', 'remove-from-list-success'));
    }).catch(_errorMessage);
  }

  clearSelected();
};

var BulkRemoveFromListPrompt = function BulkRemoveFromListPrompt(params) {
  var prompt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _bulkRemoveFromListPrompt;
  prompt(params).then(function (_ref) {
    var listId = _ref.listId;

    _callback(listId, params);
  }, rethrowError).done();
};

export default BulkRemoveFromListPrompt;