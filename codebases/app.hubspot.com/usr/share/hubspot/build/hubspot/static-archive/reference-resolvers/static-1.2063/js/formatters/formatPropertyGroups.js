'use es6';

import get from 'transmute/get';
import indexBy from 'transmute/indexBy';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';

var formatPropertyGroups = function formatPropertyGroups(propertyGroupResponses) {
  var formattedPropertyGroupResponses = formatToReferencesList({
    getId: get('objectType'),
    getLabel: get('objectType')
  }, propertyGroupResponses);
  return indexBy(get('id'), formattedPropertyGroupResponses);
};

export default formatPropertyGroups;