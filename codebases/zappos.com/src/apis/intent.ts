import ExecutionEnvironment from 'exenv';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import marketplace from 'cfg/marketplace.json';
import timedFetch from 'middleware/timedFetch';
import { AppState } from 'types/app';
import { IntentEvent, IntentEventName } from 'types/intentEvent';
import { logError } from 'middleware/logger';

type IncompleteIntentEvent = Omit<IntentEvent, 'site_name' | 'visitor_id'>;

interface StoreSlice {
  cookies: { 'session-id': string };
  environmentConfig: {
    analytics: {
      intent: {
        events: { urlBase?: string };
      };
    };
  };
  holmes?: { directedId: string };
}

export function completeEventFromGlobals(
  incompleteEvent: IncompleteIntentEvent,
  store: StoreSlice,
  localMarketplace: { shortName: string } = marketplace
): IntentEvent {
  return {
    member_id: store.holmes?.directedId || '',
    site_country: 'US',
    site_currency: 'USD',
    site_language: 'EN',
    site_name: localMarketplace.shortName.toUpperCase(),
    visitor_id: store.cookies['session-id'] || '',
    ...incompleteEvent
  };
}

export function selectIntentApiUrlBase(urlBase: string | undefined, store: StoreSlice): string {
  if (urlBase) {
    return urlBase;
  }
  const ret = store.environmentConfig.analytics.intent.events.urlBase;
  if (typeof ret === 'undefined') {
    logError('Intent API URL base was undefined (this can happen if you try to send Intent events from a marketplace other than Zappos or 6PM)');
    return '';
  }
  return ret;
}

/**
 * fill in a partial Intent analytics event and send it to their API
 *
 * @param incompleteEvent `site_name` and `visitor_id` will be added from
 *                        the `marketplace` object and the redux store
 * @param urlBase this parameter can be used to override the Intent API URL
 *                base. it will default to an appropriate production or
 *                development URL otherwise.
 * @param localMarketplace this parameter can be used to override the
 *                         `marketplace` object.
 */
export function sendIntentEvent(
  eventName: IntentEventName,
  incompleteEvent: IncompleteIntentEvent,
  urlBase?: string,
  localMarketplace = marketplace,
  fetcher = timedFetch('sendIntentEvent')
): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (_dispatch, getState) => {
    if (!localMarketplace.analytics.intent.events.enabled) {
      return;
    }
    const store = getState();
    const event = completeEventFromGlobals(incompleteEvent, store, localMarketplace);
    const body = JSON.stringify(event);
    const opts: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    };
    if (ExecutionEnvironment.canUseDOM) {
      opts.mode = 'no-cors';
    }
    const selectedUrlBase = selectIntentApiUrlBase(urlBase, store);
    return fetcher(`${selectedUrlBase}/${eventName}`, opts);
  };
}
