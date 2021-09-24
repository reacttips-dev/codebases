'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getObjectId, getDispositionFromEngagement, getActivityTypeFromEngagement, getExternalIdFromEngagement } from 'calling-client-interface/records/engagement/getters';
export var getEngagementFromState = get('engagement');
export var getEngagementIdFromState = createSelector([getEngagementFromState], getObjectId);
export var getEngagementDispositionFromState = createSelector([getEngagementFromState], getDispositionFromEngagement);
export var getEngagementActivityTypeFromState = createSelector([getEngagementFromState], getActivityTypeFromEngagement);
export var getExternalIdFromState = createSelector([getEngagementFromState], getExternalIdFromEngagement);