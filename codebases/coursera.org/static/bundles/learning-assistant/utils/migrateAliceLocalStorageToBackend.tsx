import AliceLocalStorage from 'bundles/alice/utils/AliceLocalStorage';
import { markAsSentAndSeen } from 'bundles/learning-assistant/api/messagesSent';

/**
 * If AliceLocalStorage has previously marked the AliceMessageId as seen before,
 * we make make an API call to learningAssistanceMessagesSent.v1 to mark it there as well.
 * We remove these values from local storage after the migration call is successful.

 * BE will not send a message to FE if learningAssistanceMessagesSent.v1 already has a record
 * of a message being sent.
 *
 * FE Alice Components should continue to use AliceLocalStorage as a fallback
 * to determine if we should hide or show an AliceMessage.
 */
function migrateAliceLocalStorageToBackend() {
  /**
   * TODO: Remove this after June 1, 2020
   * https://coursera.atlassian.net/browse/FLEX-24835
   * Any FE clients who haven't logged into Coursera
   * between launch of LearningAssistant (March 2020) to June 1, 2020
   * probably aren't regular users and it's not worth keeping this
   * tech debt here to accommodate for them not seeing previously sent
   * AliceMessages.
   */
  const alreadyMigrated = AliceLocalStorage.haveAllDismissedOndemandAliceMessageKeysBeenMigrated();
  if (!alreadyMigrated) {
    const potentialAliceMessageIdsToMigrate = AliceLocalStorage.getAllDismissedOndemandAliceMessageKeys();
    markAsSentAndSeen(potentialAliceMessageIdsToMigrate).then(
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      AliceLocalStorage.markAllDismissedOndemandAliceMessageKeysAsMigrated()
    );
  }
}

export default migrateAliceLocalStorageToBackend;
