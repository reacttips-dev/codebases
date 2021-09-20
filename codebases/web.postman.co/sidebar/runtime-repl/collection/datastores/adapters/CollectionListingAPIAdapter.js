import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { getEventData, getEventName, getEventNamespace } from '@postman-app-monolith/renderer/js/common/model-event';
import { composeUID } from '@postman-app-monolith/renderer/js/utils/uid-helper';
import {
  COLLECTION_LIST_AND_SUBSCRIBE,
  COLLECTION_LIST
} from '../../../_common/SyncEndpoints';
import ListingAPIAdapter from '../../../_common/datastores/adapters/ListingAPIAdapter';

/**
 * Adapter for Collection Listing API
 *
 * The model which uses this adapter should have these methods:
 *   - hydrate (entities)
 *   - add (entities)
 *   - remove (ids)
 *   - updateFavorite (id)
 */
export default class CollectionListingAPIAdapter extends ListingAPIAdapter {
  getListAndSubscribeAPIEndpoint () {
    const workspace = getStore('ActiveWorkspaceStore').id;

    return COLLECTION_LIST_AND_SUBSCRIBE`${workspace}`;
  }

  getListAPIEndpoint () {
    const workspace = getStore('ActiveWorkspaceStore').id;

    return COLLECTION_LIST`${workspace}`;
  }

  dispose () {
    super.dispose();

    this.unsubscribeModelEvents && this.unsubscribeModelEvents();
  }

  _subscribeToChangeEvents (realtimeSubscriptionId) {
    super._subscribeToChangeEvents(realtimeSubscriptionId);

    // Currently there are no real-time events for favorite/unfavorite in
    // Listing API, so we're using the model-events to create a bridge in the
    // Listing adapter.
    // See: RUNTIME-2780

    // If the subscription for favorite/unfavorite already exists, clear it
    this.unsubscribeModelEvents && this.unsubscribeModelEvents();
    this.unsubscribeModelEvents = null;

    this.unsubscribeModelEvents = pm.eventBus.channel('model-events').subscribe((event) => {
      if (getEventNamespace(event) !== 'collection') {
        return;
      }

      const eventName = getEventName(event);

      if (!['favorite', 'unfavorite'].includes(eventName)) {
        return;
      }

      const eventData = getEventData(event),
        collectionId = _.get(eventData, 'collection.id'),
        owner = _.get(eventData, 'collection.owner'),
        collectionUid = composeUID(collectionId, owner),
        isFavorite = (eventName === 'favorite');

      // To-do: remove this when RUNTIME-2780 completed
      this.model.updateFavorite && this.model.updateFavorite(collectionUid, isFavorite);
    });
  }
}
