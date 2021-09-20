
import { getSocketConnectionObservable } from '@postman-app-monolith/renderer/js/modules/sync-helpers/SocketEventsService';
import RemoteSyncRequestService from '@postman-app-monolith/renderer/js/modules/services/RemoteSyncRequestService';
import { realtimeEventsForSubscription } from '@postman-app-monolith/renderer/js/modules/services/SubscribeToRealtimeEvents';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import BaseModelAdapter from './BaseModelAdapter';

// eslint-disable-next-line no-magic-numbers
const REQUEST_TIMEOUT = 30 * 1000; // 30 seconds

/**
 * Adapter for Listing API
 *
 * Entities which use this adapter are expected to extend this class and
 * implement the `getListAPIEndpoint` and `getListAndSubscribeAPIEndpoint`
 * methods.
 *
 * The model which uses this adapter should have these methods:
 *   - hydrate (entities)
 *   - add (entities)
 *   - remove (ids)
 */
export default class ListingAPIAdapter extends BaseModelAdapter {
  /**
   * This should return the API endpoint for listing and change subscription
   * for the entitiy.
   *
   * It should be implemented by the entity's listing api adapter.
   *
   * @abstract
   * @return {String} API endpoint for the entity
   */
  getListAndSubscribeAPIEndpoint () {
    throw new Error(`${this.constructor.name}~getListAndSubscribeAPIEndpoint: not implemented`);
  }

  /**
   * This should return the API endpoint for bulk fetching the entities.
   *
   * It should be implemented by the entity's listing api adapter.
   *
   * @abstract
   * @return {String} API endpoint for the entity
   */
  getListAPIEndpoint () {
    throw new Error(`${this.constructor.name}~getListAPIEndpoint: not implemented`);
  }

  /**
   * Fetches data and hydrates the model
   *
   * @override
   *
   * @param {Boolean} [subscribe = true] - If `true`, the model will subscribe
   *    to realtime changes
   *
   * @return {Promise} - A promise that resolves on hydration
   */
  hydrate (subscribe = true) {
    return new Promise((resolve, reject) => {
      this._connection_subscription = getSocketConnectionObservable().subscribe((event) => {
        // If the event is not of connect then bailout
        if (event !== 'connect') {
          // Don't resolve the promise yet because we're waiting for the
          // connect event
          return;
        }

        // Fetch the entities from remote. Pass the subscribe option as true so that we get
        // realtime events for any subsequent updates that happen
        return this._getAPIResponse()
          .then((response) => {
            const list = _.get(response, 'body.data', []),

              // Get the subscription ID from the response. This is to listen to
              // any updates that happen so that we can refresh the model.
              realtimeSubscriptionId = _.get(response, 'body.subscription.id');

            // Hydrate the model with the entities
            this._hydrateEntities(list);

            if (!subscribe) {
              return;
            }

            // Subscribe to realtime events. As soon as we get an update, we
            // refetch the entities list
            (realtimeSubscriptionId) && this._subscribeToChangeEvents(realtimeSubscriptionId);
          })

          // Even though this subscribe event might be called a lot of times, the Promise is only
          // resolved the first time it is successfully hydrated.
          .then(() => resolve())
          .catch((err) => {
            pm.logger.warn('ListingAPIAdapter~hydrate: Failed to hydrate entities', err);

            return reject(err);
          });
      });
    });
  }

  /**
   * Clean up
   */
  dispose () {
    super.dispose();

    this._connection_subscription && this._connection_subscription.unsubscribe();
    this._realtime_subscription && this._realtime_subscription.unsubscribe();
  }

  /**
   * Hydrates the entities in the model
   *
   * @param {Array<Entity>} Array of entity objects
   */
  _hydrateEntities (list) {
    // This method should call hydrate even when list is empty to ensure that
    // the model can perform actions list turning off loading state if no
    // entities were found
    this.model.hydrate && this.model.hydrate(list);
  }

  /**
   * Removes the entities in the model
   *
   * @param {Array<Entity>} Array of entity objects
   */
  _removeEntities (ids) {
    if (_.isEmpty(ids)) {
      return;
    }

    this.model.remove && this.model.remove(ids);
  }

  /**
   * Hydrates the entities in the model
   *
   * @param {Array<Entity>} Array of entity objects
   */
  _addEntities (entities) {
    if (_.isEmpty(entities)) {
      return;
    }

    // Update the entity tree with the new entities
    this.model.add && this.model.add(entities);
  }

  /**
   * Fetches entities from the Listing endpoint and hydrates the model
   *
   * @private
   * @return {Promise<Array<Object>>} - A promise that resolves with an array
   *    of entities fetched from the API
   */
  async _getAPIResponse () {
    // Wait for sync to connect
    await getStore('SyncStatusStore').onSyncAvailable();

    return RemoteSyncRequestService.request(this.getListAndSubscribeAPIEndpoint(), {
      method: 'POST',
      timeout: REQUEST_TIMEOUT
    });
  }

  /**
   * Subscribes to the change events on the given subscription ID and
   * adds/removes the changes from the model
   *
   * @private
   * @param {String} realtimeSubscriptionId - The ID for the subscription
   */
  _subscribeToChangeEvents (realtimeSubscriptionId) {
    // If there was a pre-existing subscription then clear it off
    if (this._realtime_subscription) {
      this._realtime_subscription.unsubscribe();
    }

    this._realtime_subscription = realtimeEventsForSubscription(realtimeSubscriptionId)
      .subscribe((event) => {
        // We have all the models that got created/updated/deleted
        const models = _.get(event, 'data.data', []),

          // Filter out all the models that are either create or update
          createOrUpdateIds = models
            .filter(({ action }) => ['create', 'update'].includes(action))
            .map(({ id }) => id),

          // Filter out all the models that are delete
          removeIds = models
            .filter(({ action }) => action === 'delete')
            .map(({ id }) => id);

        this._removeEntities(removeIds);
        this._createOrUpdateEntities(createOrUpdateIds);
      });
  }

  /**
   * Fetches and adds the entity to the model if it was created or updated
   *
   * @private
   * @param {Array<String>} ids - The IDs that were added or updated
   */
  async _createOrUpdateEntities (ids) {
    // Nothing to do if no ids were changed
    if (_.isEmpty(ids)) {
      return;
    }

    // Wait for sync to connect
    await getStore('SyncStatusStore').onSyncAvailable();

    // Make the listing call with the IDs to be created/updated
    const entityList = await RemoteSyncRequestService.request(this.getListAPIEndpoint(), {
        method: 'POST',
        data: { ids },
        timeout: REQUEST_TIMEOUT
      }),

      // Extract the entities
      entities = _.get(entityList, 'body.data', []);

    this._addEntities(entities);
  }
}
