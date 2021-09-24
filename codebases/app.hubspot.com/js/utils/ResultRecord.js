'use es6';

import { Record } from 'immutable';
import { isLoading, isResolved, isEmpty } from 'crm_data/flux/LoadingStatus';
export var ResultRecord = Record({
  isLoading: false,
  isResolved: false,
  isEmpty: false,
  isSettled: false,
  data: null
}); // Use status param when fetch status is separate from data access

ResultRecord.from = function (_ref) {
  var data = _ref.data,
      _ref$status = _ref.status,
      status = _ref$status === void 0 ? data : _ref$status;
  return ResultRecord({
    isLoading: isLoading(status),
    isResolved: isResolved(status),
    isEmpty: isEmpty(status),
    isSettled: isResolved(status) || isEmpty(status),
    data: data
  });
};