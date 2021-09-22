import _ from 'lodash';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import { Finder, GetAll, Get, MultiGet, LocalGet, LocalMultiGet } from 'bundles/naptimejs/client/index';
import generateUniqueId from 'bundles/naptimejs/util/generateUniqueId';
import initialRehydration from 'bundles/naptimejs/util/initialRehydration';
import Uri from 'jsuri';

const resourceTypeRegex = /.*api\/([a-zA-Z0-9]+[.]v[0-9]+).*/i;

class NaptimeStore extends BaseStore {
  static storeName = 'NaptimeStore';

  constructor(dispatcher) {
    super(dispatcher);
    this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods

    // Store references to clients so we can reference them.
    this.elementsToUrlMapping = {};

    // Empty queries might happen if a query returns an empty list, which
    // results in it not being tracked in elementsToUrlMapping, but then
    // _should_ be refreshed when refresh data is called.
    // TODO: Change the tracking behavior here in general so we don't have to
    // have two separate tracking storages.
    this.emptyQueries = [];

    // Track clients to promises. Used to de-dupe client data fetching.
    this.requestsInFlight = {};

    this.storage = {};

    this.fulfilledUrls = [];

    this.responseCache = {};

    this.pendingMutations = [];

    this.debouncedResourceChanges = {};

    this.elementKeyToListenerMapping = {};

    // Keep track of errored clients so the client doesn't fetch
    // them again. Also store the errors here so they can be
    // viewed at a later time.
    this.errors = {};

    if (initialRehydration) {
      this.rehydrate(initialRehydration);
    }
  }

  /**
   * BaseStore does not dehydrate unless a change has happened.
   * We just assume that NaptimeStore should always dehydrate.
   * @return {Boolean} always true
   */
  shouldDehydrate() {
    return true;
  }

  addRequestInFlight(url, promise) {
    this.requestsInFlight[url] = promise;
    return promise.then(
      () => {
        // this is a jquery promise;
        delete this.requestsInFlight[url];
      },
      () => {
        delete this.requestsInFlight[url];
      }
    );
  }

  getRequestInFlight(url) {
    return this.requestsInFlight[url];
  }

  eventKey(requestId) {
    return `REQUEST:${requestId}`;
  }

  addRequestListener(listener) {
    const requestId = generateUniqueId();
    this.on(this.eventKey(requestId), listener);
    return requestId;
  }

  removeRequestListener(requestId, listener) {
    this.off(this.eventKey(requestId), listener);
  }

  // Unique key used to listen to changes on a specific element
  elementKey(type, id) {
    return `ELEMENT:${type}:${id}`;
  }

  removeElementListener(type, id) {
    const key = this.elementKey(type, id);
    this.off(key, this.elementKeyToListenerMapping[key]);
  }

  // Allows a component to listen to changes on a specific element with a given type and id
  listenToElement(listener, type, id) {
    const key = this.elementKey(type, id);
    // setTimeout is crucial to free up thread to
    // do other things. Prevents jank and increases performance like crazy.
    this.elementKeyToListenerMapping[key] = () => setTimeout(listener, 0);
    this.on(key, this.elementKeyToListenerMapping[key]);
  }

  // Triggers an emit when a specific element is changed or added
  emitElementChange(type, id) {
    const key = this.elementKey(type, id);
    this.emit(key);
  }

  // Unique key used to listen to changes on any element of a specific resource type
  resourceKey(type) {
    return `RESOURCE:${type}`;
  }

  removeResourceListener(listener, type) {
    const key = this.resourceKey(type);
    this.off(key, listener);
  }

  // Allows a component to listen to changes on any element of a specific resource type
  listenToResource(listener, type) {
    const key = this.resourceKey(type);
    this.on(key, listener);
  }

  // Triggers an emit when any element of a specific resource type is changed or added
  emitResourceChange(type) {
    if (!this.debouncedResourceChanges[type]) {
      this.debouncedResourceChanges[type] = _.debounce((_type) => {
        const key = this.resourceKey(_type);
        this.emit(key);
      }, 300);
    }

    this.debouncedResourceChanges[type](type);
  }

  addResources(type, elements, url, client = null) {
    if (elements.length === 0) {
      // If this fetch failed to return any items this time around, it might
      // return things the next time around, so let's keep track of fetched
      // queries.
      this.emptyQueries.push(url);
    }

    if (this.storage[type] === undefined) {
      this.storage[type] = {};
    }

    if (client instanceof MultiGet) {
      if (client.ids.length !== elements.length) {
        // MultiGet for ids happened but not all of them returned. We need to
        // mark that as `null` to indicate its non-existence.
        const elementIds = elements.map((e) => e.id);
        const nonExistentElementIds = client.ids.filter((id) => !elementIds.includes(id));

        nonExistentElementIds.forEach((id) => {
          if (url) {
            const existing = this.elementsToUrlMapping[`${type}~${id}`];
            if (existing) {
              if (existing.indexOf(url) === -1) {
                this.elementsToUrlMapping[`${type}~${id}`].push(url);
              }
            } else {
              this.elementsToUrlMapping[`${type}~${id}`] = [url];
            }
          }

          if (this.storage[type][id] === undefined) {
            this.storage[type][id] = null;
          }

          this.emitElementChange(type, id);
        });
      }
    }

    elements
      .filter((element) => {
        // NOTE an empty element.id is valid (e.g. "")
        if (element.id === undefined) {
          throw new Error('Undefined id on element', element);
        } else {
          return true;
        }
      })
      .forEach((element) => {
        if (client && client.data && client.data.fields) {
          const nulledElement = client.getFields().reduce((memo, field) => {
            return {
              ...memo,
              [field]: null,
            };
          }, {});

          /* eslint-disable no-param-reassign */
          element = {
            ...nulledElement,
            ...element,
          };
          /* eslint-enable no-param-reassign */
        }

        if (url) {
          const existing = this.elementsToUrlMapping[`${type}~${element.id}`];
          if (existing) {
            if (existing.indexOf(url) === -1) {
              this.elementsToUrlMapping[`${type}~${element.id}`].push(url);
            }
          } else {
            this.elementsToUrlMapping[`${type}~${element.id}`] = [url];
          }
        }

        if (this.storage[type][element.id] !== undefined) {
          const existingElement = this.storage[type][element.id];
          this.storage[type][element.id] = Object.assign({}, existingElement, element);
        } else {
          this.storage[type][element.id] = element;
        }

        this.emitElementChange(type, element.id);
      });

    // In order to more efficiently update resource-level listeners, we'll update on this call rather than
    // emit on every single element change.
    this.emitResourceChange(type);
  }

  /**
   *  Callback function for the `RECEIVE_DATA` action, which is dispatched after data is loaded from the server.
   *
   *  This takes the data and a reference to the original client that was used to construct the request,
   *  and parses the resources into the Model Class corresponding with the resource type.
   *  So a `courses.v1` model that is returned will become an instantiation of the CoursesV1 class.
   *
   *  These classes are then added to the global `storage` object.
   *
   *  Additionally, the ids of the elements returned in the response are cached for Finders and GetAlls
   *  to avoid duplicate requests.
   */
  processData(requestId, responseData = []) {
    responseData.forEach(({ url, client, data: { elements = [], linked = {}, paging = null } }) => {
      let resourceType;
      try {
        resourceType = resourceTypeRegex.exec(url)[1];
      } catch (e) {
        console.error(`Error: Failed to parse resourceType out of url. ${url}`);
        throw e;
      }

      if (elements) {
        if (Finder.validateUrl(url) || GetAll.validateUrl(url)) {
          // We keep a cache of request resource / params -> returned elements to avoid making duplicate requests
          // (There's no way to go from a finder or getAll to a list of ids without hitting the server)
          const cacheUrl = new Uri(url).deleteQueryParam('fields').deleteQueryParam('includes');
          this.responseCache[cacheUrl.toString()] = {
            ids: elements.map((e) => e.id),
            paging,
          };
        }

        this.addResources(resourceType, elements, url, client);
      }

      if (linked) {
        Object.keys(linked).forEach((linkedResourceType) => {
          this.addResources(linkedResourceType, linked[linkedResourceType], url, client);
        });
      }

      if (this.fulfilledUrls.indexOf(url) === -1) {
        this.fulfilledUrls.push(url);
      }
    });

    this.emit(this.eventKey(requestId), requestId);
  }

  /**
   *  Given a "client" object (i.e. a Finder, GetAll, etc.), return the ids of the objects
   *  that the api call for the client fetched.
   *
   *  For example, a Finder('courses.v1', 'upcoming'), may return courses ['v1-1234', 'v1-8435']
   *
   *  // TODO(bryan): figure out a way to have multiget requests differentiate between
   *                  having no elements in a response and not having a response yet
   */
  getIdsForClient(client) {
    if (client instanceof Finder || client instanceof GetAll) {
      const cacheUrl = client.getUri().deleteQueryParam('fields').deleteQueryParam('includes').toString();
      const cachedResponse = this.responseCache[cacheUrl];
      return cachedResponse && cachedResponse.ids;
    } else if (client instanceof Get || client instanceof LocalGet) {
      return [client.id];
    } else if (client instanceof MultiGet || client instanceof LocalMultiGet) {
      return client.ids;
    } else {
      throw Error('Unknown client type found.');
    }
  }

  /**
   *  Given a "client" object (i.e. a Finder, GetAll, etc.), return whether the data for the client has loaded.
   *  This will be true if the API call has returned, or if the data has already been loaded through another method
   */
  clientDataIsLoaded(client) {
    if (this.getErrorForClient(client) !== undefined) {
      return true;
    }

    if (client instanceof LocalGet || client instanceof LocalMultiGet) {
      return true;
    } else {
      const ids = this.getIdsForClient(client);

      return (
        ids &&
        ids.every((id) => {
          return this.resourceIsLoaded(client.resourceName, id, client.getFields());
        })
      );
    }
  }

  markClientError(client, error) {
    const message = error.message ?? error.responseJSON?.message;
    this.errors[client.getClientIdentifier()] = message;
    if (client instanceof MultiGet) {
      client.getGetClients().forEach((c) => {
        this.errors[c.getClientIdentifier()] = message;
      });
    }
  }

  getErrorForClient(client) {
    return this.errors[client.getClientIdentifier()];
  }

  /**
   *  Given a "client" object (i.e. a Finder, GetAll, etc.), return the actual data objects associated with the resource
   */
  getDataForClient(client) {
    const ids = this.getIdsForClient(client);
    if (ids) {
      const resourcesOfType = this.storage[client.resourceName] || {};
      const resources = ids.map((id) => resourcesOfType[id]);
      if (client instanceof Get) {
        return client.processData(resources[0]);
      } else if (client instanceof LocalGet) {
        const resource = resources[0];
        // https://github.com/webedx-spark/web/blob/2e50f5bf8b5279267430eb8b876e4f5ae29c79f7/static/bundles/naptimejs/util/mergePropsWithLoadedData.js#L17
        // mergePropsWithLoadedData checks if the data is undefined, and if it is, tells createContainer
        // that the data isn't loaded. This is fine for clients where there is a guarantee the data is
        // to be fetched and is in the store, but this is not okay for local gets, where the data
        // may not be there. (note that for local MultiGets, we map over the data, so we don't have to
        // add this check).
        // Example is localGet on v2Details related to the course. Not all courses have v2Details.
        // Return null instead because (null !== undefined)
        if (resource === undefined) {
          return null;
        } else {
          return client.processData(resource);
        }
      } else {
        return client.processData(resources.filter((resource) => !!resource));
      }
    } else {
      return undefined;
    }
  }

  getOptimisticDataForClient(client) {
    const data = this.getDataForClient(client);
    return this.pendingMutations
      .filter((mutation) => client.resourceName === mutation.resourceName)
      .reduce((resources, mutation) => {
        if (Array.isArray(resources)) {
          return resources.map((resource) => {
            if (resource.id === mutation.id) {
              return Object.assign({}, resource, mutation.body);
            } else {
              return resource;
            }
          });
        } else if (resources && resources.id === mutation.id) {
          return Object.assign({}, resources, mutation.body);
        }

        return resources;
      }, data);
  }

  getPagingForClient(client) {
    if (
      (client instanceof GetAll || client instanceof Finder) &&
      this.responseCache[client.getUri().toString()] !== undefined
    ) {
      return this.responseCache[client.getUri().toString()].paging;
    } else {
      return {};
    }
  }

  resourceIsNonExistent(resourceType, id) {
    const resourcesOfType = this.storage[resourceType];
    if (resourcesOfType) {
      return resourcesOfType[id] === null;
    } else {
      return false;
    }
  }

  /**
   *  Returns whether a given resource identified by resourceType ('courses.v1'), id ('v1-1234'),
   *  and requested fields (['name', 'startDate']) is loaded and in the store.
   */
  resourceIsLoaded(resourceType, id, fields) {
    const resourcesOfType = this.storage[resourceType];
    if (resourcesOfType) {
      const resource = resourcesOfType[id];
      if (this.resourceIsNonExistent(resourceType, id)) {
        return true;
      }

      if (resource) {
        // TODO(bryan): somehow differentiate between data that hasn't loaded, and data that isn't available
        return (
          fields.length === 0 ||
          fields.every((field) => {
            return resource[field] !== undefined;
          })
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  performOptimisticUpdate(client) {
    this.pendingMutations.push(client);
    this.emitResourceChange(client.resourceName);
    if (client.id) {
      this.emitElementChange(client.resourceName, client.id);
    }
  }

  completeMutation(responseData) {
    const { client } = responseData;
    this.removePendingMutation(client);
    const resources = this.storage[client.resourceName] || {};
    let element = resources[client.id];
    if (element) {
      Object.assign(element, client.data.body);
    } else {
      element = client.data.body;
      this.storage[client.id] = element;

      // Clear out the finder / getall cache for updated resources
      Object.keys(this.responseCache).forEach((key) => {
        if (key.indexOf(client.resourceName) !== -1) {
          delete this.responseCache[key];
        }
      });
    }
    this.emitElementChange(client.resourceName, client.id);
    this.emitResourceChange(client.resourceName);
    return element;
  }

  rollBackMutation(responseData) {
    const { client } = responseData;
    this.removePendingMutation(client);
    return true;
  }

  removePendingMutation(mutationClient) {
    this.pendingMutations = this.pendingMutations.filter((mutation) => {
      return mutation.mutationId !== mutationClient.mutationId;
    });
  }

  removeEmptyQueries(queries = []) {
    this.emptyQueries = _.without(this.emptyQueries, queries);
  }

  // For sending state to the client
  dehydrate() {
    return {
      data: this.storage,
      responseCache: this.responseCache,
      elementsToUrlMapping: this.elementsToUrlMapping,
      emptyQueries: this.emptyQueries,
      errors: this.errors,
    };
  }

  // For rehydrating server state
  rehydrate({ data = {}, responseCache = {}, elementsToUrlMapping = {}, emptyQueries = [], errors = {} }) {
    Object.keys(data).forEach((resourceType) => {
      const elements = data[resourceType];
      const nullIds = [];
      const nonNullElements = [];
      Object.keys(elements).forEach((id) => {
        const element = elements[id];
        if (element === null) {
          nullIds.push(id);
        } else {
          nonNullElements.push(element);
        }
      });

      this.addResources(resourceType, nonNullElements);

      nullIds.forEach((id) => {
        // Manually rehydrating null elements for now until there is
        // a better method for rehydrating these through addResources.
        this.storage[resourceType][id] = null;
      });
    });

    this.responseCache = responseCache;
    this.elementsToUrlMapping = elementsToUrlMapping;
    this.emptyQueries = emptyQueries;
    this.errors = errors;
  }

  __getAllFromInternalStorage(Client) {
    const rawObjects = this.storage[Client.RESOURCE_NAME] || {};
    const keys = Object.keys(rawObjects);
    const returnObject = {};

    keys.forEach((key) => {
      returnObject[key] = new Client(rawObjects[key]);
    });

    return returnObject;
  }
}

export default NaptimeStore;
