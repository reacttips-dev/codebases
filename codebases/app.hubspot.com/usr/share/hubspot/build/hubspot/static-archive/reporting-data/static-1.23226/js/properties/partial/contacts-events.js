'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import prefix from '../../lib/prefix';
var translate = prefix('reporting-data.contactEvent');
export default (function () {
  return List([ImmutableMap({
    value: 'last_visit',
    type: 'string',
    label: translate('last_visit'),
    displayOrder: -1
  }), ImmutableMap({
    value: 'recent_conversion',
    type: 'string',
    label: translate('recent_conversion'),
    displayOrder: 0
  }), ImmutableMap({
    value: 'email_last_open',
    type: 'string',
    label: translate('email_last_open'),
    displayOrder: 1
  }), ImmutableMap({
    value: 'email_last_click',
    type: 'string',
    label: translate('email_last_click'),
    displayOrder: 2
  }), ImmutableMap({
    value: 'feedback_last_survey',
    type: 'string',
    label: translate('feedback_last_survey'),
    displayOrder: 2
  })]);
});