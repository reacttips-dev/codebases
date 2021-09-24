'use es6';

import { fromJS } from 'immutable';
import invariant from 'react-utils/invariant';
import { COMPANY } from 'customer-data-objects/constants/ObjectTypes';
import { decorateQueryResult } from 'crm_data/crmSearch/esAdapter';
var DEFAULT_QUERY = fromJS({
  offset: 0,
  count: 10,
  filterGroups: [],
  sorts: []
});
var DEFAULT_SORT = fromJS({
  property: 'name',
  order: 'ASC'
});
var CompaniesSearchAPIQuery = {
  associatedWithContact: function associatedWithContact(contactId, query) {
    if (query == null) {
      query = DEFAULT_QUERY;
    }

    invariant(typeof contactId === 'number', 'expected contactId to be a number but got "%s" instead', contactId);
    return query.merge(fromJS({
      filterGroups: {
        filters: [{
          operator: 'EQ',
          property: 'associations.contact',
          value: contactId
        }]
      }
    }));
  },
  associatedWithChidren: function associatedWithChidren(subjectId, count, query) {
    return fromJS({
      filterGroups: [{
        filters: [{
          operator: 'EQ',
          property: 'hs_parent_company_id',
          value: subjectId
        }]
      }],
      count: count,
      query: query
    });
  },
  default: function _default(query) {
    var result = DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
      return sorts.push(DEFAULT_SORT);
    });
    return decorateQueryResult({
      objectType: COMPANY,
      query: result
    });
  }
};
export default CompaniesSearchAPIQuery;