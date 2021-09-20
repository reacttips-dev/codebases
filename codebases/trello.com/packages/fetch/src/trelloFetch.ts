import { sendNetworkRequestEvent } from './analytics';
import { fetch } from './fetch';
import {
  NetworkRequestEventAttributes,
  TrelloFetchOptions,
  TrelloRequestInit,
} from './trelloFetch.types';

// hash that contains the url and maps it to the request promise
// for fetching the resource. If you mount multiple components at once,
// each of week has its own instance of an apollo hook, apollo wont
// know that you are already fetching that resource until it exists in
// the cache. Therefore, we construct this map to make sure we only
// make the request once, then remove it from the hash.
const requestHash: { [url: string]: Promise<Response> | null } = {};

function maybeAddOperationNameToUrl(
  url: string,
  networkRequestEventAttributes: NetworkRequestEventAttributes | undefined,
) {
  if (
    process.env.NODE_ENV !== 'production' &&
    networkRequestEventAttributes?.source === 'graphql' &&
    networkRequestEventAttributes.operationName
  ) {
    try {
      // Add the operationName as a query parameter for GraphQL requests in
      // non-prod environments.
      const urlObject = new URL(url, window.location.origin);
      urlObject.searchParams.set(
        'operationName',
        networkRequestEventAttributes.operationName,
      );
      return urlObject.toString();
    } catch (err) {
      // If we have a problem parsing the URL, just return the original.
      return url;
    }
  } else {
    // For non-GraphQL requests or prod environments, just return the original URL.
    return url;
  }
}

export const trelloFetch = async (
  url: string,
  init?: TrelloRequestInit,
  options?: TrelloFetchOptions,
) => {
  const {
    deduplicate = true,
    clientVersion = '',
    networkRequestEventAttributes,
  } = options || {};
  const requestPromise =
    (deduplicate && requestHash[url]) ||
    sendNetworkRequestEvent(networkRequestEventAttributes) ||
    fetch(maybeAddOperationNameToUrl(url, networkRequestEventAttributes), {
      credentials: 'include',
      ...init,
      headers: {
        'X-Trello-Client-Version': clientVersion,
        ...(init?.headers || {}),
      },
    });

  if (!requestHash[url]) {
    requestHash[url] = requestPromise;
  }

  const response = await requestPromise;

  // once the request finishes, remove the url from the cache
  // so the future refetches can still run
  requestHash[url] = null;

  return response.clone();
};
