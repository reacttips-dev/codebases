/* eslint-disable no-console */
import Q from 'q';

import Api from 'js/lib/api';
import { Get, MultiGet } from 'bundles/naptimejs/client';
import inServerContext from 'bundles/ssr/util/inServerContext';

/**
 * Error responses triggered by Naptime backends will either have
 * a statusCode property or errorCode property. Any error responses
 * without either of these properties (or aren't JSON) are triggered
 * through other means.
 */
function isErrorNaptimeResponse(res) {
  return (
    Object.prototype.hasOwnProperty.call(res, 'statusCode') || Object.prototype.hasOwnProperty.call(res, 'errorCode')
  );
}

function isSuccessNaptimeResponse(res) {
  return Object.prototype.hasOwnProperty.call(res, 'elements');
}

// TODO: Remove the client parameter on loadData.
// client is currently needed because the consumer of loadData's response
// sometimes uses the client information.
export default function loadData(url, applicationStore, naptimeStore, client = null) {
  // During SSR, we never care about making the same request for data multiple times.
  // This is usually indication of a mistake:
  //   - a resource has been requested via MultiGet that does not exist.
  //   - a resource is returning an id that is different than what is requested.
  if (inServerContext) {
    if (naptimeStore.fulfilledUrls.includes(url)) {
      console.warn(
        `Expected data not received! NaptimeJS tried fetching ${client.getClientIdentifier()} via`,
        `${url} again because it could not find`,
        "it within it's cache. This is an indication that the backend response does not contain all of",
        'the requested resources in its results.'
      );
      // Return a completed promise
      return Q();
    }
  }

  let apiCall = naptimeStore.getRequestInFlight(url);
  const apiClient = new Api('');
  if (apiCall === undefined) {
    apiCall = apiClient.get(url);
    naptimeStore.addRequestInFlight(url, apiCall);
  }

  return Q(apiCall)
    .then((res) => {
      if (!isSuccessNaptimeResponse(res)) {
        if (isErrorNaptimeResponse(res)) {
          throw new Error(`APIError: ${res.statusCode || res.errorCode}: ${res.message}`);
        } else {
          throw new Error(`APIError: ${JSON.stringify(res.message)}`);
        }
      }

      if (client instanceof Get || client instanceof MultiGet) {
        /**
         * In cases with `Gets` and `MultiGets` keep track of requestedResourceIds. If we don't
         * get this in the response, throw a warning.
         */
        let requestedResourceIds;
        if (client instanceof Get) {
          requestedResourceIds = [client.id];
        } else if (client instanceof MultiGet) {
          requestedResourceIds = client.ids;
        }

        const receivedAll = requestedResourceIds.reduce((memo, requestedResourceId) => {
          return memo && res.elements.some((el) => el.id.toString() === requestedResourceId.toString());
        }, true);

        if (!receivedAll) {
          console.warn(
            `Error: ID Mismatch! NaptimeJS made a request for ${client.resourceName}([${requestedResourceIds.join(
              ', '
            )}]) but only got the following ids back: [${res.elements.map((el) => el.id).join(', ')}].`
          );
        }
      }

      return Object.assign(
        { url, client },
        {
          data: res,
        }
      );
    })
    .fail((e) => {
      console.error(`Data loading from ${url} failed`, e);
      if (client) {
        naptimeStore.markClientError(client, e);
      } else {
        console.warn(`NaptimeJS called failed for ${url} when no client was provided`);
      }

      return Object.assign(
        { url, client },
        {
          data: {},
          failure: e,
        }
      );
    });
}
