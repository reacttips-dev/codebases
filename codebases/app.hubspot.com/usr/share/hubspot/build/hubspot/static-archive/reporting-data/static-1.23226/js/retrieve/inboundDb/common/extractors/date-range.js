'use es6';

import { Map as ImmutableMap } from 'immutable';
import extractor from '../../../../config/extractor';

var getDateRange = function getDateRange(config, missing) {
  return config.getIn(['filters', 'dateRange']) || missing;
};

export default (function () {
  return extractor(getDateRange, ImmutableMap({
    value: ImmutableMap({
      rangeType: 'ALL'
    })
  }));
});