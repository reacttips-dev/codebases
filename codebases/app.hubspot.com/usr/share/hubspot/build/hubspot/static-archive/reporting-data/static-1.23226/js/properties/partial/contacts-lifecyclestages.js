'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import prefix from '../../lib/prefix';
var translate = prefix('reporting-data.lifecyclestage');
export default (function () {
  return List([ImmutableMap({
    value: 'create',
    type: 'string',
    label: translate('create'),
    displayOrder: -1
  }), ImmutableMap({
    value: 'subscriber',
    type: 'string',
    label: translate('subscriber'),
    displayOrder: 0
  }), ImmutableMap({
    value: 'lead',
    type: 'string',
    label: translate('lead'),
    displayOrder: 1
  }), ImmutableMap({
    value: 'marketingqualifiedlead',
    type: 'string',
    label: translate('marketingqualifiedlead'),
    displayOrder: 2
  }), ImmutableMap({
    value: 'salesqualifiedlead',
    type: 'string',
    label: translate('salesqualifiedlead'),
    displayOrder: 3
  }), ImmutableMap({
    value: 'opportunity',
    type: 'string',
    label: translate('opportunity'),
    displayOrder: 4
  }), ImmutableMap({
    value: 'customer',
    type: 'string',
    label: translate('customer'),
    displayOrder: 5
  }), ImmutableMap({
    value: 'evangelist',
    type: 'string',
    label: translate('evangelist'),
    displayOrder: 6
  }), ImmutableMap({
    value: 'other',
    type: 'string',
    label: translate('other'),
    displayOrder: 7
  })]);
});