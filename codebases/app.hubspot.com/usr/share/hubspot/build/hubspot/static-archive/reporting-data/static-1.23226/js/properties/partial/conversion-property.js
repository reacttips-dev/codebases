'use es6';

import { Map as ImmutableMap } from 'immutable';
import prefix from '../../lib/prefix';
var translate = prefix('reporting-data.properties.common');
export default (function () {
  return ImmutableMap({
    'funnel.conversion': ImmutableMap({
      name: 'funnel.conversion',
      type: 'percent',
      label: translate('conversion')
    }),
    'funnel.stepwiseConversion': ImmutableMap({
      name: 'funnel.stepwiseConversion',
      type: 'percent',
      label: translate('stepwiseConversion')
    }),
    'funnel.cumulativeConversion': ImmutableMap({
      name: 'funnel.cumulativeConversion',
      type: 'percent',
      label: translate('cumulativeConversion')
    })
  });
});