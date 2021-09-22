export const isLastAttemptBeforeLock = (lockingConfigurationSummary?: any): boolean => {
  if (!lockingConfigurationSummary) {
    return false;
  }
  const { locksIfSubmittedBefore } = lockingConfigurationSummary;
  const currentTime = Date.now();
  return locksIfSubmittedBefore > currentTime;
};

// this function is used to get the locked timed left when the quiz is not currently locked
export const getLockedTimeLeft = (lockingConfigurationSummary?: any): number | null => {
  if (!lockingConfigurationSummary) {
    return null;
  }
  const {
    allowedSubmissionsPerInterval,
    allowedSubmissionsInterval,
    locksIfSubmittedBefore,
  } = lockingConfigurationSummary;
  const currentTime = Date.now();
  const durationFromNow = locksIfSubmittedBefore - currentTime;

  return allowedSubmissionsPerInterval === 1 ? allowedSubmissionsInterval : durationFromNow;
};

// this function is used to get the locked timed left when the quiz is locked out
// if it returns null, it means it is not locked out
const getLockedTimeDuration = (lockingConfigurationSummary?: any): number | null => {
  if (!lockingConfigurationSummary) {
    return null;
  }
  const { nextPossibleSessionCreationTime } = lockingConfigurationSummary;
  const currentTime = Date.now();
  if (nextPossibleSessionCreationTime - currentTime <= 0) {
    return null;
  }
  return getLockedTimeLeft(lockingConfigurationSummary);
};

export default getLockedTimeDuration;
