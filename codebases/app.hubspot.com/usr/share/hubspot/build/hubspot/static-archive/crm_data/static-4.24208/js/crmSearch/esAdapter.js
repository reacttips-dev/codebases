'use es6';

import get from 'transmute/get';
import isEmpty from 'transmute/isEmpty';
import PortalIdParser from 'PortalIdParser';
import { Map as ImmutableMap } from 'immutable';
import { isEligible } from './isEligible'; // Follow the comments in this file for a ContactsSearch > CrmSearch migration. All comments are in that context.

var defaultRequestOptions = ImmutableMap({
  allPropertiesFetchMode: 'latest_version',
  includeAllValues: true
}); // Add 'decorateQueryResult' to the 'default' function in the {objectType}SearchAPIQuery file.

/* This example is for companies, just change the object type for your type (Deals or Contacts are left)

  default(query) {
    const result = DEFAULT_QUERY.merge(fromJS(query)).updateIn(
      ['sorts'],
      sorts => sorts.push(DEFAULT_SORT)
    );

    return decorateQueryResult({
      objectType: COMPANY,
      query: result,
    });
  },
 */

export var decorateQueryResult = function decorateQueryResult(_ref) {
  var isCrmObject = _ref.isCrmObject,
      objectType = _ref.objectType,
      query = _ref.query;
  return !isEligible(objectType, isCrmObject) ? query : query.withMutations(function (draft) {
    return draft.update('requestOptions', function () {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRequestOptions;
      var propertyList = get('properties', query);

      if (!isEmpty(propertyList)) {
        return val.delete('allPropertiesFetchMode').delete('includeAllValues').set('properties', propertyList);
      }

      return val;
    }).delete('properties').update('objectTypeId', function () {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : objectType;
      return val;
    }).update('portalId', function () {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PortalIdParser.get();
      return val;
    });
  });
};