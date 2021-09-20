import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { TrelloStorage, ErrorListenerArgs } from '@trello/storage';

interface KeySizeMap {
  [key: string]: number;
}

const EVENT_NUM_KEYS_TO_INCLUDE = 25;
const EVENT_KEY_TRIM_LENGTH = 80;

const storageEstimate = async (): Promise<StorageEstimate | null> => {
  if (navigator?.storage?.estimate) {
    const result = await navigator.storage.estimate();
    return result;
  }
  return null;
};

// only exported for testing purposes
export const keysWithLargestValues = ({
  storageKeys,
  count = EVENT_NUM_KEYS_TO_INCLUDE,
  trimLength = EVENT_KEY_TRIM_LENGTH,
}: {
  storageKeys: string[];
  count?: number;
  trimLength?: number;
}): KeySizeMap => {
  const initialValue: KeySizeMap = {};

  return storageKeys
    .map((key) => {
      const value = TrelloStorage.getRaw(key);
      return {
        key: key.substring(0, trimLength),
        size: window.TextEncoder
          ? new TextEncoder().encode(value || undefined).length
          : value
          ? value.length
          : 0,
      };
    })
    .sort((a, b) => {
      return b.size - a.size;
    })
    .slice(0, count)
    .reduce((accumulator, { key, size }) => {
      accumulator[key] = size;
      return accumulator;
    }, initialValue);
};

export const sendStorageError = async ({ key }: { key?: string }) => {
  const estimate = await storageEstimate();
  const storageKeys = TrelloStorage.getAllKeys();

  Analytics.sendOperationalEvent({
    action: 'errored',
    actionSubject: 'storage',
    source: getScreenFromUrl(),
    attributes: {
      erroredKey: key?.substring(0, EVENT_KEY_TRIM_LENGTH),
      keyCount: storageKeys.length,
      keysWithLargestValues: keysWithLargestValues({
        storageKeys,
        count: EVENT_NUM_KEYS_TO_INCLUDE,
        trimLength: EVENT_KEY_TRIM_LENGTH,
      }),
      storageQuota: estimate?.quota,
      storageUsage: estimate?.usage,
    },
  });
};

export const handleStorageError = async ({ key, error }: ErrorListenerArgs) => {
  if (
    ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(error.name)
  ) {
    await sendStorageError({ key });
  }
};
