import { useState, useEffect } from 'react';
import { TrelloStorage } from '@trello/storage';
import {
  resolveAttemptedValue,
  TrelloStorageKey,
  TrelloStorageValue,
} from './resolveAttemptedValue';

export interface StorageTestErrorParams {
  message: Error['message'];
  details?: {
    testKey?: TrelloStorageKey;
    testValue?: TrelloStorageValue;
    attemptedValue: string;
    storedValue: unknown;
  };
}

export type StorageTestErrorHandlerParams = StorageTestErrorParams & {
  name?: Error['name'];
  stack?: Error['stack'];
};

export type StorageTestErrorHandler = (
  params: StorageTestErrorHandlerParams,
) => void;

export class StorageTestError extends Error {
  details: StorageTestErrorParams['details'];

  constructor({ message, details }: StorageTestErrorParams) {
    super(message);
    this.details = details;
  }
}

export interface UseIsLocalStorageEnabledConfig {
  skip?: boolean;
  testKey?: TrelloStorageKey;
  testValue?: TrelloStorageValue;
  onStorageTestError?: StorageTestErrorHandler;
}

export type UseIsLocalStorageEnabledType = (
  config?: UseIsLocalStorageEnabledConfig,
) => boolean;

export const STORAGE_TEST_KEY = `local-storage-test-key`;

export const useIsLocalStorageEnabled: UseIsLocalStorageEnabledType = (
  config = {},
) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { testKey, testValue, skip, onStorageTestError } = config;

  useEffect(() => {
    if (!skip && TrelloStorage.isEnabled()) {
      try {
        const disableFeature = () => setIsEnabled(false);
        TrelloStorage.addErrorListener(disableFeature);

        const attemptedValue = resolveAttemptedValue(testKey, testValue);
        TrelloStorage.set(STORAGE_TEST_KEY, attemptedValue);
        const storedValue = TrelloStorage.get(STORAGE_TEST_KEY);

        if (attemptedValue !== storedValue) {
          throw new StorageTestError({
            message: 'Storage Error',
            details: {
              attemptedValue,
              storedValue,
              testKey,
              testValue,
            },
          });
        }

        setIsEnabled(true);
      } catch (e) {
        if (e instanceof Error) {
          onStorageTestError?.({
            name: e?.name,
            message: e?.message,
            stack: e?.stack,
            details: e instanceof StorageTestError ? e.details : undefined,
          });
        }

        setIsEnabled(false);
      } finally {
        TrelloStorage.unset(STORAGE_TEST_KEY);
      }
    }
  }, [skip, testKey, testValue, onStorageTestError]);

  return isEnabled;
};
