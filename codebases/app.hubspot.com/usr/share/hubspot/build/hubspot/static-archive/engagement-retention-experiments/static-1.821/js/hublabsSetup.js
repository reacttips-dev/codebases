'use es6';

import labSetupTools from 'hublabs-experiments/setup/setupTools';
import { setPrimaryTracker } from 'usage-tracker-container';
export default function setup(portalId, tracker) {
  labSetupTools.registerUser(portalId);
  setPrimaryTracker(tracker);
}