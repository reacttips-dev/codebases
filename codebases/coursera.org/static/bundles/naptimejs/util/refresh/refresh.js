import _ from 'lodash';
import Q from 'q';
import loadData from 'bundles/naptimejs/util/loadData';

const VERSIONED_RESOURCE_NAME_REGEXP = /([a-zA-Z]+[.]v[0-9]+)~.*/;

/**
 * @param  {string} elementKey resourceName.resourceVersion~elementId
 * @return {string} resourceName.resourceVersion
 */
const getVersionedResourceNameFromElementKey = (elementKey) => {
  const matches = VERSIONED_RESOURCE_NAME_REGEXP.exec(elementKey);
  if (matches[1]) {
    return matches[1];
  } else {
    throw new Error(`Could not find resourceName from elementKey ${elementKey}`);
  }
};

/**
 * @param  {NaptimeStore} naptimeStore - Reference to the fluxible NaptimeStore.
 * @param  {ApplicationStore} applicationStore - Reference to the fluxible ApplicationStore.
 * @param  {object} options
 * @param  {Array.<string>} options.elements - array of elements to refresh in format `resourceName.versionId~id`
 * @param  {Array.<string>} options.resources - array of resources to refresh in format `resourceName.versionId`
 * @return {[type]}           [description]
 */
export default function refresh(naptimeStore, applicationStore, { elements = [], resources = [] }) {
  /**
   * Identifying URLS that need to be refetched:
   *
   * 1. For elements that need to be refreshed, just match against the key
   *    in elementsToUrlMapping.
   * 2. For resources, also check that the resourceName in the 'key'
   *    (someResource.v1 should match someResource.v1~SOME_ID)
   *    that is to be refetched.
   * 3. If a query was made previously that returned an empty array of
   *    elements. It is tracked separately as naptimeStore.emptyQueries.
   *    Refreshes should be done on these as well.
   */

  const priorEmptyQueriesToRefetch = naptimeStore.emptyQueries.filter((url) => {
    if (typeof resources === 'object' && resources.length > 0) {
      if (resources.some((resourceName) => url.indexOf(resourceName) > -1)) {
        return true;
      }
    }
    return false;
  });

  // Remove these after refetching, if they are still empty, they will be added back.
  // Otherwise, we should track them using elementsToUrlMapping
  naptimeStore.removeEmptyQueries(priorEmptyQueriesToRefetch);

  const storedUrlsToRefetch = Object.keys(naptimeStore.elementsToUrlMapping)
    .filter((key) => {
      if (typeof resources === 'object' && resources.length > 0) {
        if (resources.some((resourceName) => resourceName === getVersionedResourceNameFromElementKey(key))) {
          return true;
        }
      }

      if (typeof elements === 'object' && elements.length > 0) {
        // Refreshing elements is as easy as refreshing the element key
        if (elements.indexOf(key) > -1) {
          return true;
        }
      }

      return false;
    })
    .map((key) => naptimeStore.elementsToUrlMapping[key])
    // flatten
    .reduce((memo, arr) => memo.concat(arr), []);

  const urlsToRefetch = [...priorEmptyQueriesToRefetch, ...storedUrlsToRefetch]
    // de-dupe
    .filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });

  const promises = urlsToRefetch.map((url) => loadData(url, applicationStore, naptimeStore));

  return Q.all(promises).then((responseData) => {
    const flattenedResponseData = _.compact(responseData);
    if (flattenedResponseData && flattenedResponseData.length) {
      return naptimeStore.processData(null, flattenedResponseData);
    } else {
      return Q();
    }
  });
}
