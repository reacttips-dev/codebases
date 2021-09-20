import { observable, action } from 'mobx';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import PermissionController from '@postman-app-monolith/renderer/js/modules/controllers/PermissionController';
import CollectionSidebarModel from './CollectionSidebarModel';
import CollectionModelEventsAdapter from '../datastores/adapters/CollectionModelEventsAdapter';
import FolderModelEventsAdapter from '../../folder/datastores/adapters/FolderModelEventsAdapter';
import RequestModelEventsAdapter from '../../request-http/datastores/adapters/RequestModelEventsAdapter';
import ResponseModelEventsAdapter from '../../example/datastores/adapters/ResponseModelEventsAdapter';
import CollectionListingAPIAdapter from '../datastores/adapters/CollectionListingAPIAdapter';
import {
  READY,
  LOADING,
  ERROR
} from '../../_common/WorkbenchStatusConstants';
import { decomposeUID, RemoteSyncRequestService } from '../../../onboarding/src/common/dependencies';
import { COLLECTION_LIST } from '../../_common/SyncEndpoints';

// eslint-disable-next-line no-magic-numbers
const REQUEST_TIMEOUT = 30 * 1000; // 30 seconds

/**
 * Populates the Stores with Collection attributes
 *
 * @param {Array} collectionList List of collections in the current workspace
 */
function _populateStoresWithAttributes (collectionList) {
  if (_.isEmpty(collectionList)) {
    return;
  }

  const favoritedCollections = [],
    sharedCollections = [],
    publicCollections = [],
    archivedCollections = [];

  collectionList.forEach((collection) => {
    const isFavorite = _.get(collection, 'attributes.flags.isFavorite'),
      isShared = _.get(collection, 'attributes.permissions.teamCanView'),
      isPublic = _.get(collection, 'attributes.permissions.anybodyCanView'),
      isArchived = _.get(collection, 'attributes.flags.isArchived'),
      collectionModelId = decomposeUID(collection.id).modelId,
      itemToPopulate = { id: collectionModelId };

    isFavorite && favoritedCollections.push(itemToPopulate);
    isShared && sharedCollections.push(itemToPopulate);
    isPublic && publicCollections.push({ id: collection.id });
    isArchived && archivedCollections.push({
      model: 'collection',
      modelId: collectionModelId
    });
  });

  !_.isEmpty(favoritedCollections) && getStore('FavoritedCollectionStore').add(favoritedCollections);
  !_.isEmpty(sharedCollections) && getStore('SharedCollectionsStore').add(sharedCollections);
  !_.isEmpty(publicCollections) && getStore('PublicEntityStore').add(publicCollections);
  !_.isEmpty(archivedCollections) && getStore('ArchivedResourceStore').add(archivedCollections);
}

export default class CollectionSidebarController {
  model = null;
  _adapters = [];

  // Sidebar Status
  @observable status = LOADING;

  /**
   * @lifecycle
   */
  async didCreate () {
    this.model = new CollectionSidebarModel();

    // For browser, use listing API only
    if (window.SDK_PLATFORM === 'browser') {
      try {
        await this._loadFromListingAPIAdapter();
      } catch (err) {
        pm.logger.error('CollectionSidebarController~didCreate: Error in loading collection list from listing API', err);

        return this.setSidebarStatus(ERROR);
      }

      return this.setSidebarStatus(READY);
    }

    // Additional step for integrating listing API for online app
    //
    // Try to load the sidebar in one-shot using the listing API. We'll
    // switch over to model events after this completes.
    try {
      await this._loadFromListingAPI();

      // Set sidebar ready after loading the collection list
      this.setSidebarStatus(READY);
    } catch (e) {
      pm.logger.error('CollectionSidebarController~didCreate: Failed to fetch collection list:', e);

      // Throwing here would make the sidebar show error state.
      // Instead, let the model events adapter hydrate the sidebar as a
      // failover.
    }

    try {
      await this._loadFromModelEventsAdapter();
    } catch (err) {
      pm.logger.error('CollectionSidebarController~didCreate: Error in loading collections from model events', err);

      return this.setSidebarStatus(ERROR);
    }

    return this.setSidebarStatus(READY);
  }

  /**
   * @lifecycle
   */
  beforeDestroy () {
    this._adapters && this._adapters.forEach((adapter) => {
      _.isFunction(adapter.dispose) && adapter.dispose();
    });

    this.model = null;
    this._adapters = [];
  }

  /**
   * Update status of the sidebar
   *
   * @param {String} value
   */
  @action
  setSidebarStatus (value) {
    this.status = value;
  }

  /**
   * Fetches collections from the Listing endpoint and hydrates the model
   *
   * @private
   * @return {Promise<Array<Object>>} - A promise that resolves with an array
   *    of collections fetched from the API
   */
  async _fetchCollections () {
    // Wait for sync to connect
    await getStore('SyncStatusStore').onSyncAvailable();

    const workspace = getStore('ActiveWorkspaceStore').id,

      collectionList = await RemoteSyncRequestService.request(COLLECTION_LIST`${workspace}`, {
        method: 'POST',
        timeout: REQUEST_TIMEOUT
      }),

      /**
        * Update the collection userCanUpdate attribute to manage the glitch on fixing
        * the rendering for lock icon appearing and disappearing.
        *
        * TODO: Fix this appropriately
        */

      // Also checks whether the permission exists for collections in `PermissionStore`
      data = _.forEach(
        _.get(collectionList, 'body.data', []), (collection) => {
          const criteria = {
              model: 'collection',
              modelId: collection.id,
              action: 'UPDATE_COLLECTION'
            },
            compositeKey = PermissionController.getCompositeKey(criteria),
            permissionPresent = getStore('PermissionStore').members.has(compositeKey);

          !permissionPresent && _.set(collection, 'attributes.permissions.userCanUpdate', true);
        }
      );

    this.model.hydrate && this.model.hydrate(data);

    return data;
  }

  /**
   * Loads the collection in a one-shot manner using the listing API.
   * Does not subscribe to changes
   */
  async _loadFromListingAPI () {
    // This is not applicable for scratchpad because we can't call the
    // listing API.
    if (pm.isScratchpad) {
      return;
    }

    const collectionList = await this._fetchCollections();

    // The listing endpoint contains the attributes for the collections
    // like forkInfo, isFavorite, etc. This information is not present in
    // the collection fetched from sync but is fetched in another call.
    // This causes the icons for these attributes to disappear when we
    // switch over to model events based data. To prevent that, we
    // populate the stores using the date fetched from listing endpoint
    // here.
    _populateStoresWithAttributes(collectionList);
  }

  /**
   * Loads the collection model using model events adapter
   */
  async _loadFromModelEventsAdapter () {
    const workspace = getStore('ActiveWorkspaceStore').id,

      collectionAdapter = new CollectionModelEventsAdapter(
        this.model.getCollectionAdapterModel(),
        {
          activeWorkspace: workspace,
          useUID: true
        }
      ),
      folderAdapter = new FolderModelEventsAdapter(
        this.model.getFolderAdapterModel()
      ),
      requestAdapter = new RequestModelEventsAdapter(
        this.model.getRequestAdapterModel()
      ),
      hydrateEntities = [
        collectionAdapter.hydrate(),
        folderAdapter.hydrate(),
        requestAdapter.hydrate()
      ];

    this._adapters.push(collectionAdapter, folderAdapter, requestAdapter);

    // We're hydrating the responses after the promise is resolved because
    // response needs the request to be hydrated in the sidebar model to
    // add references (requestModel.responses) to the responses. If response
    // is hydrated before its parent request, it cannot be linked to the
    // parent request and does not show up in the sidebar.
    await Promise.all(hydrateEntities);

    // At this point we have enough data to show in the sidebar. Set it as
    // ready and load the responses in the background.
    this.setSidebarStatus(READY);

    const responseAdapter = new ResponseModelEventsAdapter(
      this.model.getResponseAdapterModel()
    );

    this._adapters.push(responseAdapter);

    await responseAdapter.hydrate();
  }

  /**
   * Loads the collection model using listing API adapter
   */
  async _loadFromListingAPIAdapter () {
    const listingAPIAdapter = new CollectionListingAPIAdapter(
      this.model.getCollectionAdapterModel()
    );

    this._adapters.push(listingAPIAdapter);

    await listingAPIAdapter.hydrate();
  }
}
