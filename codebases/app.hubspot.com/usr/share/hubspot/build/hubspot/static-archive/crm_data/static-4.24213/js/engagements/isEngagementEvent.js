'use es6';

import { EVENT_ENGAGEMENT } from 'crm_universal/timeline/TimelineConstants';
import { Map as ImmutableMap } from 'immutable';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
export var isEngagementEvent = function isEngagementEvent(event) {
  return ImmutableMap.isMap(event) ? event.get('etype') === EVENT_ENGAGEMENT && (ImmutableMap.isMap(getIn(['eventData', 'engagement'], event)) || ImmutableMap.isMap(get('engagement', event))) : false;
};