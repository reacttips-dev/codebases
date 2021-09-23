'use es6';

import planout from 'planout';
import * as LabSetup from 'hublabs-core/setup/LabSetup';
export default {
  getStoredLabsID: LabSetup.getUserId,
  registerUser: LabSetup.registerUser,
  setParam: planout.ExperimentSetup.registerExperimentInput
};