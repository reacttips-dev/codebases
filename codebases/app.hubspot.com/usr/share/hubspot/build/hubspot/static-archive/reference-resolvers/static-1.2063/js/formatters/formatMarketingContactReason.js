'use es6';

import { List, Map as ImmutableMap } from 'immutable';
import ReferenceRecord from '../schema/ReferenceRecord';

var formatMarketingContactReason = function formatMarketingContactReason(response) {
  return ImmutableMap(response).reduce(function (acc, _ref, key) {
    var url = _ref.url,
        label = _ref.label;
    return acc.push(ReferenceRecord({
      description: url,
      label: label || '',
      id: key
    }));
  }, List());
};

export default formatMarketingContactReason;