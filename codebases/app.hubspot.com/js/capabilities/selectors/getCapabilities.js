'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
export var getCapabilities = get('capabilities');
export var hasCustomAssociationsCapability = createSelector([getCapabilities], get('customAssociations'));
export var hasCalloutcomesCapability = createSelector([getCapabilities], get('callOutcomes'));
export var hasCallTypesCapability = createSelector([getCapabilities], get('callTypes'));
export var hasCallingProvidersCapability = createSelector([getCapabilities], get('callingProviders'));
export var hasFollowupTasksCapability = createSelector([getCapabilities], get('followupTasks'));