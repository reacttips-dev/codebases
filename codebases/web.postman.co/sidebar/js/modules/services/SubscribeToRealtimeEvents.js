import { filter } from 'rxjs/operators';
import { getRealtimeMessagesObservable } from '../sync-timeline-helpers/RealtimeSyncMessagesService';

/**
 * Get realtime events for a particular subscription ID. This will get all incoming realtime
 * events and then filter out the events according to the current subscription ID.
 *
 * Returns an Observable that consumers can subscribe to for getting the events for a
 * particular subscription ID.
 *
 * @param {String} subscriptionId - The subscription ID for which we need the realtime events
 */
export function realtimeEventsForSubscription (subscriptionId) {
  return getRealtimeMessagesObservable()
    .pipe(filter((realtimeMessage) => {
      let subIdFromEvent = _.get(realtimeMessage, 'data.subscription.id');

      return subIdFromEvent === subscriptionId;
    }));
}
