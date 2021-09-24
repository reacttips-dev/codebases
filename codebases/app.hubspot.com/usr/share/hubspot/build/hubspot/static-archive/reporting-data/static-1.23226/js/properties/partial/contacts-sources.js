'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import prefix from '../../lib/prefix';
var translate = prefix('reporting-data.properties.sessions');
export default (function () {
  return List([ImmutableMap({
    value: 'ORGANIC_SEARCH',
    type: 'string',
    label: translate('organic')
  }), ImmutableMap({
    value: 'PAID_SEARCH',
    type: 'string',
    label: translate('paid')
  }), ImmutableMap({
    value: 'EMAIL_MARKETING',
    type: 'string',
    label: translate('email')
  }), ImmutableMap({
    value: 'SOCIAL_MEDIA',
    type: 'string',
    label: translate('social')
  }), ImmutableMap({
    value: 'REFERRALS',
    type: 'string',
    label: translate('referrals')
  }), ImmutableMap({
    value: 'OTHER_CAMPAIGNS',
    type: 'string',
    label: translate('other')
  }), ImmutableMap({
    value: 'DIRECT_TRAFFIC',
    type: 'string',
    label: translate('direct')
  }), ImmutableMap({
    value: 'OFFLINE',
    type: 'string',
    label: translate('offline')
  }), ImmutableMap({
    value: 'PAID_SOCIAL',
    type: 'string',
    label: translate('paid-social')
  })]);
});