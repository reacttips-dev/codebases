import { isDesktop, isTouch, isCypress } from '@trello/browser';
import { featureFlagClient } from '@trello/feature-flag-client';
import { MemberModel } from 'app/gamma/src/types/models';

const MANDO_PT_FLAG = 'growth.trello-jsw-crossflow-push-touchpoints-experiment';
const CACHE_INVALIDATION_FLAG =
  'growth.trello-switcher-nudge-cache-invalidation-control';

export enum PT_COHORTS {
  CONTROL = 'control',
  NOT_ENROLLED = 'not-enrolled',
  VARIATION = 'variation',
}

export const isCacheInvalidationEnabled = () =>
  featureFlagClient.get<boolean>(CACHE_INVALIDATION_FLAG, false);

/** Just gets the current cohort */
export const getPtCohort = () =>
  featureFlagClient.get<PT_COHORTS>(MANDO_PT_FLAG, PT_COHORTS.NOT_ENROLLED);

/** Returns true if any of the provided cohorts matches */
export const isPushTouchpointsCohort = (...cohorts: PT_COHORTS[]) =>
  cohorts.some((cohort) => getPtCohort() === cohort);

/** Enabled if device and cohort both match */
export const isPushTouchpointsEnrolled = (member: MemberModel | undefined) =>
  Boolean(
    member?.id &&
      member?.isAaMastered &&
      !isTouch() &&
      !isDesktop() &&
      !isCypress() &&
      isPushTouchpointsCohort(PT_COHORTS.VARIATION),
  );
