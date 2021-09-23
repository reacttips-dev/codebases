'use es6';

import standardAggregate from '../aggregate';
import addEngagementTypeFilter from '../../common/add-engagement-type-filter';
import { dataTypeToEngagementType } from '../../common/engagement-types';
export default function aggregateEngagementSubtype(config, properties) {
  var engagementType = dataTypeToEngagementType.get(config.get('dataType'));
  return standardAggregate(addEngagementTypeFilter(config, engagementType), properties);
}