import { TrelloStorage } from '@trello/storage';

export const NO_SUCH_KEY = 'NO_SUCH_LOCAL_STORAGE_KEY';
export const DEFAULT_STORAGE_TEST_VALUE = `ls-default-test-value`;

export type TrelloStorageKey = Parameters<typeof TrelloStorage.set>[0];
export type TrelloStorageValue = Parameters<typeof TrelloStorage.set>[1];

export const resolveAttemptedValue = (
  testKey: TrelloStorageKey = NO_SUCH_KEY,
  testValue?: TrelloStorageValue,
): string => {
  const attemptedValue =
    TrelloStorage.get(testKey) ?? testValue ?? DEFAULT_STORAGE_TEST_VALUE;

  return typeof attemptedValue !== 'string'
    ? JSON.stringify(attemptedValue)
    : attemptedValue;
};
