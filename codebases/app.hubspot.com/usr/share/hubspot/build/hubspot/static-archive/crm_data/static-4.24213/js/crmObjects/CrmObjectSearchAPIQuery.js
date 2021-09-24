'use es6';

import { fromJS } from 'immutable';
import { decorateQueryResult } from 'crm_data/crmSearch/esAdapter';
var DEFAULT_QUERY = fromJS({
  count: 10,
  filterGroups: [],
  offset: 0,
  sorts: []
});
var DEFAULT_SORT = fromJS({
  order: 'DESC',
  property: 'hs_createdate'
});
var CrmObjectSearchAPIQuery = {
  default: function _default(objectTypeId, query) {
    var result = DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
      return sorts.push(DEFAULT_SORT);
    });
    return decorateQueryResult({
      isCrmObject: true,
      objectType: objectTypeId,
      query: result
    });
  }
};
export default CrmObjectSearchAPIQuery;