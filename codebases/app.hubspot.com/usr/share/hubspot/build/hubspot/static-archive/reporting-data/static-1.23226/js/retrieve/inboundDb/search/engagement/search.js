'use es6';

import addEngagementTypeFilter from '../../common/add-engagement-type-filter';
import { dataTypeToEngagementType } from '../../common/engagement-types';
import { search } from '../dao';
import { generate } from '../generate';
import { transform } from '../transform';
export default (function (spec, config) {
  var engagementType = dataTypeToEngagementType.get(spec.get('dataType'));
  return generate(addEngagementTypeFilter(config, engagementType), spec.properties.idProperty).then(function (payload) {
    return search(spec.search.url, payload);
  }).then(function (response) {
    return transform(config, spec, response);
  });
});