export const BannerStateTypes = {
  PASSED: 'passed',
  FAILED: 'failed',
  FAILED_NO_ATTEMPT_LEFT: 'failed_no_attempt_left',
  FINISHED: 'finished',
} as const;

export type BannerStateType = typeof BannerStateTypes[keyof typeof BannerStateTypes];

export const getIsRemainingAttemptsZero = (remainingAttempts?: number) =>
  typeof remainingAttempts === 'number' && remainingAttempts === 0;

export const getBannerStateType = (
  isPassed: boolean | null | undefined,
  isCumulativeGraded?: boolean,
  remainingAttempts?: number
) => {
  if (!isPassed && !isCumulativeGraded) {
    if (getIsRemainingAttemptsZero(remainingAttempts)) {
      return BannerStateTypes.FAILED_NO_ATTEMPT_LEFT;
    }
    return BannerStateTypes.FAILED;
  } else if (isPassed && !isCumulativeGraded) {
    return BannerStateTypes.PASSED;
  }
  return BannerStateTypes.FINISHED;
};
