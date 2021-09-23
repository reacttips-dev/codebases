'use es6';

import * as EmailActions from 'crm_data/email/EmailActions';
import BulkEditDoubleOptInDialog from '../../dialog/grid/BulkEditDoubleOptInDialog';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import Promptable from 'UIComponents/decorators/Promptable';

var _bulkEditDoubleOptInPrompt = Promptable(BulkEditDoubleOptInDialog);

var _callback = function _callback(_ref) {
  var isDoubleOptedIn = _ref.isDoubleOptedIn,
      criteria = _ref.criteria,
      objectCount = _ref.objectCount;
  return EmailActions.updateDoubleOptInStatus({
    isDoubleOptedIn: isDoubleOptedIn,
    criteria: criteria
  }).then(function (result) {
    Alerts.addSuccess('bulkActions.bulkEditDoubleOptInSuccess', {
      objectCount: objectCount
    });
    return result;
  }).catch(function () {
    Alerts.addError('bulkActions.bulkEditDoubleOptInError');
  });
};

export default function (params) {
  var prompt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _bulkEditDoubleOptInPrompt;
  prompt(params).then(function (value) {
    return _callback(value);
  }).catch(rethrowError).done();
}