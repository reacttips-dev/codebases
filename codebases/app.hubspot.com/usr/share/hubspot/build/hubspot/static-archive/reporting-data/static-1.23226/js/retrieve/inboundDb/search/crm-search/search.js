'use es6';

import { List } from 'immutable';
import { search } from '../dao';
import { generate } from '../generate';
import { transform } from '../transform';
import PortalIdParser from 'PortalIdParser';
import { convertToSearchProperties } from '../../common/mapToSearchProperties';
import { dataTypeToEngagementType } from '../../common/engagement-types';
import addEngagementTypeFilter from '../../common/add-engagement-type-filter';
export default (function (spec, config) {
  var dataType = spec.get('dataType');
  return generate(dataTypeToEngagementType.has(dataType) ? addEngagementTypeFilter(config, dataTypeToEngagementType.get(dataType)) : config, spec.properties.idProperty).then(function (payload) {
    return payload.set('objectTypeId', spec.get('objectTypeId')).set('portalId', PortalIdParser.get()).set('requestOptions', {
      properties: convertToSearchProperties(spec.getIn(['search', 'properties'], List()), dataType)
    }).set('associationPreviews', spec.get('associationPreviews'));
  }).then(function (payload) {
    return search(spec.search.url, payload);
  }).then(function (response) {
    return transform(config, spec, response);
  });
});