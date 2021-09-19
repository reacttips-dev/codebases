import { stringify } from 'query-string';

import {
  HEART_DEFAULT_LIST_ID,
  HEART_DEFAULT_LIST_TYPE,
  MAFIA_AUTH_REQ,
  MAFIA_RECOGNIZED_TOKEN
} from 'constants/apis';
import timedFetch from 'middleware/timedFetch';
import {
  fetchOpts
} from 'apis/mafia';
import marketplace from 'cfg/marketplace.json';

const { isInfluencerProgramEnabled } = marketplace;
const endpointVersion = isInfluencerProgramEnabled ? 'v2' : 'v1';

export function getTracking({ url }, orderId, shipmentId, fetcher = timedFetch('getTracking')) {
  return fetcher(`${url}/orders/api/getTracking?orderId=${orderId}&shipmentId=${shipmentId}`, {
    credentials: 'include'
  });
}

/*
  For /accountapi/cloudlist endpoints see: https://confluence.zappos.net/display/~jsenecal/Cloud+List+API
  Worth noting these cloudlist calls are shared on Search as well.
*/
export function getHeartList({ url }, { shareToken, listId = 'h.', nextPageToken }, credentials = {}, fetcher = timedFetch('getHeartList')) {
  const headers = { [MAFIA_AUTH_REQ]: true };

  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }

  let query = shareToken ? { shareToken } : { listId };
  query = nextPageToken ? stringify({ ...query, nextPageToken }) : stringify(query);

  return fetcher(`${url}/accountapi/cloudlist/v1/listItems?${query}`, {
    credentials: 'include',
    headers
  });
}

export function getListOfIds({ url }, listId = HEART_DEFAULT_LIST_ID, credentials = {}, fetcher = timedFetch('getHeartIdList')) {
  const headers = { [MAFIA_AUTH_REQ]: true };

  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }

  return fetcher(`${url}/accountapi/cloudlist/v1/itemIdsOnList?listId=${listId}`, {
    credentials: 'include'
  });
}

export function addToList({ url }, { itemId, subItemId, listId = HEART_DEFAULT_LIST_ID }, fetcher = timedFetch('addToHeartList')) {
  return fetcher(`${url}/accountapi/cloudlist/v1/addToList`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      itemId,
      subItemId,
      listId
    })
  });
}

export function removeFromList({ url }, { itemId, subItemId, listId = HEART_DEFAULT_LIST_ID }, fetcher = timedFetch('removeFromHeartList')) {
  return fetcher(`${url}/accountapi/cloudlist/v1/removeFromList`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      itemId,
      subItemId,
      listId
    })
  });
}

export function createList({ url }, { listTypeId = HEART_DEFAULT_LIST_TYPE, listName }, fetcher = timedFetch('createHeartList')) {
  return fetcher(`${url}/accountapi/cloudlist/v1/createList`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      type: listTypeId,
      name: listName
    })
  });
}

export function shareList({ url }, listId, fetcher = timedFetch('createShareList')) {
  return fetcher(`${url}/accountapi/cloudlist/v1/shareList`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      listId
    })
  });
}

export function deleteList({ url }, listId, fetcher = timedFetch('deleteHeartLists')) {
  return fetcher(`${url}/accountapi/cloudlist/v1/deleteList`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      listId
    })
  });
}

export function updateList({ url }, { listId, name, metadata : { subCopy, headerLayout, gridLayout } }, fetcher = timedFetch('updateList')) {
  return fetcher(`${url}/accountapi/cloudlist/v2/updateList`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      listId,
      name,
      subCopy,
      headerLayout,
      gridLayout
    })
  });
}

export function uploadImage({ url }, { listId, imageLocation, headerImageFile }, fetcher = timedFetch('uploadImage')) {
  const formData = new FormData();
  formData.append('file', headerImageFile);
  return fetcher(`${url}/accountapi/cloudlist/v2/uploadImage?listId=${listId}&imageLocation=${imageLocation}`, {
    credentials: 'include',
    method: 'POST',
    body: formData
  });
}

export function deleteImage({ url }, { listId, type }, fetcher = timedFetch('deleteImage')) {
  return fetcher(`${url}/accountapi/cloudlist/v2/deleteImage`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      listId,
      type
    })
  });
}

export function makePublic({ url }, listId, fetcher = timedFetch('makePublic')) {
  return fetcher(`${url}/accountapi/cloudlist/v2/makePublic`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      listId
    })
  });
}

export function makePrivate({ url }, listId, fetcher = timedFetch('makePrivate')) {
  return fetcher(`${url}/accountapi/cloudlist/v2/makePrivate`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      listId
    })
  });
}

export function recordMyAccountError(qs, fetcher = timedFetch('postMartyPixel')) {
  const reqUrl = `/martypixel?${qs}`;
  return fetcher(reqUrl, fetchOpts({ method: 'post' }));
}

export function getListInfo({ url }, { listId = 'h.', shareToken }, credentials = {}, fetcher = timedFetch('getListInfo')) {
  const headers = { [MAFIA_AUTH_REQ]: true };

  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }

  const query = shareToken ? stringify({ shareToken }) : stringify({ listId });

  return fetcher(`${url}/accountapi/cloudlist/${endpointVersion}/list?${query}`, {
    credentials: 'include'
  });
}

export function getItemSubsetOnLists({ url }, { itemId }, credentials = {}, fetcher = timedFetch('getItemSubsetOnLists')) {
  const headers = { [MAFIA_AUTH_REQ]: true };

  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }

  return fetcher(`${url}/accountapi/cloudlist/v1/itemSubsetOnLists?itemIds=${itemId}&type=h`, {
    credentials: 'include',
    headers
  });
}

export function getAllLists({ url }, { listId = HEART_DEFAULT_LIST_TYPE, shareToken = null, nextPageToken = null }, credentials = {}, fetcher = timedFetch('getAllLists')) {
  const headers = { [MAFIA_AUTH_REQ]: true };

  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }

  // use a share token, or listId
  let query = shareToken ? { shareToken } : { type: listId };
  query = nextPageToken ? stringify({ ...query, nextPageToken }) : stringify(query);

  return fetcher(`${url}/accountapi/cloudlist/${endpointVersion}/lists?${query}`, {
    credentials: 'include',
    headers
  });
}
