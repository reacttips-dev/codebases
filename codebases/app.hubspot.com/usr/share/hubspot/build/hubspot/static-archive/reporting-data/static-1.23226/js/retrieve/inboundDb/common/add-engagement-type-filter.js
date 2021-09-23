'use es6';

import { List } from 'immutable';
import { Filter } from '../../../config/filters';
export default (function (config, engagementType) {
  return config.updateIn(['filters', 'custom'], List(), function (customFilters) {
    return customFilters.push(Filter({
      property: 'engagement.type',
      operator: 'IN',
      values: [engagementType]
    }));
  });
});