'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import extractor from '../../../../config/extractor';
import generateSearchFilter from '../../aggregate/generators/search-filter';

function convertToSearchFilter() {
  var dateRangeFilter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();

  if (dateRangeFilter.isEmpty()) {
    return dateRangeFilter;
  }

  var property = dateRangeFilter.get('property');
  var dateRange = dateRangeFilter.get('value');
  return generateSearchFilter(property, dateRange);
}

var getFilterGroups = function getFilterGroups(config) {
  var dateRangeFilter = config.getIn(['filters', 'dateRange']);
  var filters = config.getIn(['filters', 'custom'], List());
  /* There will likely be other shared filters to add here
     ex: Owner filter that spans non inbounddb filter styling
     Another thing to consider is the differences between
     owner regarding deal (hubspot_owner_id) and engagements
     (ownerId)
  */

  if (dateRangeFilter && !dateRangeFilter.isEmpty()) {
    filters = filters.push(convertToSearchFilter(dateRangeFilter));
  }

  return [{
    filters: filters.toJS()
  }];
};

export default (function () {
  return extractor(getFilterGroups, null);
});