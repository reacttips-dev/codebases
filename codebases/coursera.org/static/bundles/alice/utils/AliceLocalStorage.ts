import user from 'js/lib/user';
import localStorageEx from 'bundles/common/utils/localStorageEx';

const getNamespace = () => `aliceMessages_${user.get().id}`;
const MIGRATION_KEY = 'hasMigratedAllNonContextualRecords';

class AliceLocalStorage {
  getIsDismissed(key: $TSFixMe) {
    const storeValue = localStorageEx.getItem(getNamespace(), JSON.parse, {});

    if (storeValue[key] === undefined) {
      return false;
    }

    return storeValue[key].isDismissed === true;
  }

  setIsDismissed(key: $TSFixMe) {
    const storeValue = localStorageEx.getItem(getNamespace(), JSON.parse, {});
    const newStoreValue = Object.assign(storeValue, {
      [key]: { isDismissed: true },
    });

    localStorageEx.setItem(getNamespace(), newStoreValue, JSON.stringify);
  }

  getAllDismissedOndemandAliceMessageKeys() {
    const storedMessages = localStorageEx.getItem(getNamespace(), JSON.parse, {});
    const storedKeys = Object.keys(storedMessages);

    const allDismissedNonContextualIds = storedKeys.reduce((accum, key) => {
      const value = storedMessages[key];
      if (!key.includes('contextual') && value.isDismissed) {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        accum.push(key);
      }
      return accum;
    }, []);

    return allDismissedNonContextualIds;
  }

  /**
   * Keys of the form: `item~eQJvsjn9EeWJaxK5AT4frw!~abcde!~ItemCompleteReminder!~ITEM_VIEW`  correspond to the alice instances within the `ondemand` app.
   * Keys of the form: `contextual~LOGGED_IN_DASHBOARD!~LOS_SURVEY!~PAGEVIEW` (containing the `contextual`) keyword correspond to alice instances outside of `ondemand`
   * Here, we only return keys corresponding to `ondemand` since they are being migrated to LearnerAssistant.
   * See https://docs.google.com/document/d/1_MKdlccvV8r0Y2d_4Cp6AJ9zufk_-70mzX1l1hv1C2U/edit# for more information
   */
  haveAllDismissedOndemandAliceMessageKeysBeenMigrated() {
    const storeValue = localStorageEx.getItem(getNamespace(), JSON.parse, {});
    if (storeValue[MIGRATION_KEY] === undefined) {
      return false;
    }
    return storeValue[MIGRATION_KEY].hasMigrated === true;
  }

  markAllDismissedOndemandAliceMessageKeysAsMigrated() {
    const storeValue = localStorageEx.getItem(getNamespace(), JSON.parse, {});
    const newStoreValue = Object.assign(storeValue, {
      [MIGRATION_KEY]: { hasMigrated: true },
    });
    localStorageEx.setItem(getNamespace(), newStoreValue, JSON.stringify);
  }
}

export default new AliceLocalStorage();
