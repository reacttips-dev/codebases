'use es6';

import { Record } from 'immutable';
var CallingAdminSettings = Record({
  createdAt: null,
  hubSpotCallingEnabled: true,
  lastUpdatedBy: null,
  portalId: null,
  updatedAt: null
}, 'CallingAdminSettings');
export default CallingAdminSettings;