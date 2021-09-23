'use es6';

import { Map as ImmutableMap } from 'immutable';
import prefix from '../../lib/prefix';
var translate = prefix('reporting-data.properties.common');
export default (function () {
  return ImmutableMap({
    total: ImmutableMap({
      name: 'total',
      type: 'number',
      label: translate('total')
    })
  });
});