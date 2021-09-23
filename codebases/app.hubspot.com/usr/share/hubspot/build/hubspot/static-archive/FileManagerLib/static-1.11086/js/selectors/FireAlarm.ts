import { RequestStatus } from 'FileManagerCore/Constants';
export var getShouldFetchFireAlarm = function getShouldFetchFireAlarm(state) {
  return state.fireAlarm.fetchStatus === RequestStatus.UNINITIALIZED;
};
export var getFireAlarm = function getFireAlarm(state) {
  return state.fireAlarm.data;
};