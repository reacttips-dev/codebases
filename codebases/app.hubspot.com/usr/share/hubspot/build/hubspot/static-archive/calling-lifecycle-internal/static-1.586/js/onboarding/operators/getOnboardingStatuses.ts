import * as Statuses from '../constants/onboardingStatuses';
export var getIsOnboardingFailed = function getIsOnboardingFailed(status) {
  return status === Statuses.FAILED;
};
export var getIsOnboardingLoading = function getIsOnboardingLoading(status) {
  return status === Statuses.LOADING;
};
export var getIsOnboardingComplete = function getIsOnboardingComplete(status) {
  return status === Statuses.COMPLETE;
};
export var getIsCallingNotEnabled = function getIsCallingNotEnabled(status) {
  return status === Statuses.NO_ACCOUNT;
};
export var getIsCallingNumberNotRegistered = function getIsCallingNumberNotRegistered(status) {
  return status === Statuses.REGISTER_NUMBER;
};