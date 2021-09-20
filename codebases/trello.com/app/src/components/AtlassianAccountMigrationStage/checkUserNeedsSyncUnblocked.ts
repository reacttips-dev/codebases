import { getMilliseconds } from '@trello/time';

/* At the time of auto-governing, we don't want Atlassian -> Trello profile
 * syncing to begin right away for legal and DFTC reasons.
 *
 * aaBlockSyncUntil is set to a far-in-the-future date of May 11, 2083 at the
 * time of auto-governing. Once the user has completed onboarding and seen the
 * post-sync Trello profile preview, the field is set to 3 days ahead of the
 * current date. The 3 days is to allow users ample time to update their
 * Atlassian profile as they see fit before its attributes are synced to Trello.
 * A heartbeat in server picks up users whose aaBlockSyncUntil is less than the
 * current date, unsets the field, and prompts a profile sync.
 *
 * We can assume that all users with aaBlockSyncUntil set to a date greater
 * than 3 days ahead of the current date were auto-governed and need to complete
 * Atlassian account onboarding.
 */
export const checkUserNeedsSyncUnblocked = (
  aaBlockSyncUntil: string | null | undefined,
) => {
  if (!aaBlockSyncUntil) {
    return false;
  }
  return (
    new Date(aaBlockSyncUntil).getTime() - new Date().getTime() >
    getMilliseconds({ days: 3 })
  );
};
