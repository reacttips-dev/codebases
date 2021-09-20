import { TrelloStorage } from '@trello/storage';

export const RETRY_THRESHOLD = 86400000; // ONE DAY
export const LAST_API_ERROR_KEY = 'mando-pt-cache-last-api-error';

export const getLastApiError = (): number =>
  (TrelloStorage.get(LAST_API_ERROR_KEY) as number) ?? 0;

export const setLastApiError = () =>
  TrelloStorage.set(LAST_API_ERROR_KEY, Date.now());

export const isReadyToRetryApiCall = (): boolean =>
  Date.now() - getLastApiError() > RETRY_THRESHOLD;
