'use es6';

import { Map as ImmutableMap } from 'immutable';
import { FUNNEL } from '../../../../constants/configTypes';
import { summarize } from '../../../../dataset/summarize';
import * as conversions from './conversions';
export default (function (stages) {
  return function (config, response) {
    var configType = config.get('configType');
    var dimension = config.getIn(['dimensions', 0]);
    var data = summarize(ImmutableMap({
      dimension: ImmutableMap({
        property: dimension,
        buckets: response.map(function (breakdown, index) {
          return ImmutableMap({
            key: stages.get(index),
            metrics: ImmutableMap({
              count: ImmutableMap({
                SUM: breakdown.get('count')
              })
            })
          });
        })
      }),
      total: response.size
    }));
    return configType === FUNNEL ? conversions.calculate(data) : data;
  };
});