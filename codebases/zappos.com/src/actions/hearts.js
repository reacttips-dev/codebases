import queryString from 'query-string';
import { replace } from 'react-router-redux';

import {
  ADD_OOS_ITEM,
  ADD_TO_HEART_ID_LIST,
  CLEAR_HEART_LIST,
  CLEAR_HEARTS,
  DELETE_IMAGE,
  RECEIVE_ALL_LISTS,
  RECEIVE_COLLECTION_PRODUCT_DETAIL,
  RECEIVE_HEART_COUNTS,
  RECEIVE_HEARTS,
  RECEIVE_HEARTS_IDS,
  RECEIVE_LIST_HEARTS,
  RECEIVE_LIST_INFO,
  RECEIVE_SPECIFIC_ITEMID_LISTS,
  REMOVE_FROM_HEART_ID_LIST,
  REMOVE_HEARTS,
  SET_DOC_META_COLLECTION,
  TOGGLE_HEARTING_LOGIN_MODAL,
  TOGGLE_INFLUENCER_COLLECTION_VISIBILITY,
  UPDATE_LIST
} from 'constants/reduxActions';
import { CLOUDCAT_MAX_ITEM_IDS } from 'constants/appConstants';
import { HEART_DEFAULT_LIST_TYPE } from 'constants/apis';
import { likeCounts, productBundle } from 'apis/cloudcatalog';
import { track } from 'apis/amethyst';
import { PRODUCT_ASIN } from 'common/regex';
import { changeQuantity, showCartModal } from 'actions/cart';
import { productNotFound } from 'actions/productDetail';
import {
  addSubItemId,
  CREATE_COLLECTION_LIST,
  DELETE_COLLECTION_LIST,
  evAddToCollections,
  evRemoveFromCollections,
  SHARE_COLLECTION_LIST
} from 'events/favorites';
import { getAmethystPageType, trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { authenticationErrorCatchHandlerFactory, err } from 'actions/errors';
import { translateCartError } from 'apis/mafia';
import { addToList, createList, deleteImage, deleteList, getAllLists, getHeartList, getItemSubsetOnLists, getListInfo, getListOfIds, makePrivate, makePublic, removeFromList, shareList, updateList, uploadImage } from 'apis/account';
import { prependAppRoot } from 'history/AppRootUtils';
import { fetchApiNotAuthenticatedMiddleware, fetchErrorMiddleware, fetchErrorMiddlewareMaybeJson } from 'middleware/fetchErrorMiddleware';
import { setSessionCookies } from 'actions/session';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import marketplace from 'cfg/marketplace.json';
import { trackError } from 'helpers/ErrorUtils';
const { hasHearting } = marketplace;

export function receiveHeartIdList(heartsStyleIds) {
  return {
    type: RECEIVE_HEARTS_IDS,
    heartsStyleIds
  };
}

export function removeHeartFromList(styleId) {
  return {
    type: REMOVE_FROM_HEART_ID_LIST,
    styleId
  };
}

export function addHeartToList(styleId) {
  return {
    type: ADD_TO_HEART_ID_LIST,
    styleId
  };
}

export function receiveHeartList(heartList, concat) {
  const { items, nextPageToken = null } = heartList;

  return {
    type: RECEIVE_HEARTS,
    hearts: items,
    nextPageToken,
    concat
  };
}

export function clearHearts() {
  return {
    type: CLEAR_HEARTS
  };
}

export function clearHeartList() {
  return {
    type: CLEAR_HEART_LIST
  };
}

export function receiveCollectionList(heartList, listId, concat) {
  const { items, nextPageToken = null } = heartList;

  return {
    type: RECEIVE_LIST_HEARTS,
    listId,
    hearts: items,
    nextPageToken,
    concat
  };
}

export function receiveCollectionProductDetail(productDetail, colorId) {
  return {
    type: RECEIVE_COLLECTION_PRODUCT_DETAIL,
    product: { detail: productDetail },
    colorId
  };
}

export function addOosItem({ itemId }) {
  return {
    type: ADD_OOS_ITEM,
    itemId
  };
}

export function receiveHeartCounts(heartsList) {
  return {
    type: RECEIVE_HEART_COUNTS,
    heartsList
  };
}

export function receiveListInfo(list) {
  return {
    type: RECEIVE_LIST_INFO,
    list
  };
}

export function receiveAllLists(listsObject, concat) {
  const { lists, nextPageToken } = listsObject;
  return {
    type: RECEIVE_ALL_LISTS,
    concat,
    lists,
    collectionNextPageToken: nextPageToken
  };
}

export function receiveSpecificItemIdLists(itemIdLists) {
  return {
    type: RECEIVE_SPECIFIC_ITEMID_LISTS,
    itemIdLists
  };
}

export function changeInfluencerCollectionVisibility(listId, toPublic) {
  return {
    type: TOGGLE_INFLUENCER_COLLECTION_VISIBILITY,
    listId,
    toPublic
  };
}

export function updateListData(list) {
  return {
    type: UPDATE_LIST,
    list
  };
}

export function removeImage(listId) {
  return {
    type: DELETE_IMAGE,
    listId
  };
}

export function removeHearts(itemIdsToRemove) {
  return dispatch => {
    dispatch({
      type: REMOVE_HEARTS,
      itemIdsToRemove
    });
  };
}

export function modifyList(list, call = updateList) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();

    return call(account, list)
      .then(fetchErrorMiddlewareMaybeJson)
      .then(resp => {
        dispatch(updateListData(list));
        return resp;
      })
      .catch(e => trackError('NON-FATAL', 'Could not update list details.', e));
  };
}

export function uploadImageData(imageData, call = uploadImage) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();

    return call(account, imageData)
      .then(fetchErrorMiddlewareMaybeJson)
      .catch(e => trackError('NON-FATAL', 'Could not upload image details.', e));
  };
}

export function deleteCollectionImage({ listId, imageLocation } = {}, call = deleteImage) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();

    return call(account, { listId, type: imageLocation })
      .then(fetchErrorMiddlewareMaybeJson)
      .then(() => {
        dispatch(removeImage(listId));
      })
      .catch(e => trackError('NON-FATAL', 'Could not delete image details.', e));
  };
}

export function toggleInfluencerCollectionVisibility({ listId, toPublic } = {}, turnPublic = makePublic, turnPrivate = makePrivate) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();

    const call = toPublic ? turnPublic : turnPrivate;

    return call(account, listId)
      .then(fetchErrorMiddleware)
      .then(resp => {
        dispatch(changeInfluencerCollectionVisibility(listId, toPublic));
        return resp;
      })
      .catch(e => trackError('NON-FATAL', 'Could not toggle collection visibility.', e));
  };
}

export function fetchHeartList({ nextPageToken = null, concat = false, suppressAuthCatch = false, shareToken = undefined, listId = 'h.' } = {}, heartList = getHeartList, authFactory = authenticationErrorCatchHandlerFactory) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { account } }, routing: { locationBeforeTransitions } } = getState();
    const { 'x-main': xMain } = cookies;

    if (!shareToken) {
      if (!cookies['x-main'] && !suppressAuthCatch) {
        return authFactory(dispatch, prependAppRoot('/account/favorites', locationBeforeTransitions));
      } else if (!xMain) {
        return;
      }
    }

    return heartList(account, { shareToken, listId, nextPageToken }, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchApiNotAuthenticatedMiddleware)
      .then(fetchErrorMiddleware)
      .then(resp => {
        dispatch(receiveHeartList(resp, concat));
        return resp;
      })
      .catch(!suppressAuthCatch && authFactory(dispatch, prependAppRoot('/account/favorites', locationBeforeTransitions)));
  };
}

export function setMetaDataForList(collectionId, collectionName, collectionSubCopy, imageId, imageExtension) {
  return {
    type: SET_DOC_META_COLLECTION,
    metaPayload: {
      collectionId,
      collectionName,
      collectionSubCopy,
      imageId,
      imageExtension
    }
  };
}

export function getMetaDataForList(collectionId, collectionName, collectionSubCopy, images, isPublic, headerLayout, productImageIds) {
  let collectionImageId = null;
  let imageExtension = null;
  const collectionDescription = isPublic ? collectionSubCopy : '';
  if (images.length > 0 && headerLayout === 2 && isPublic) {
    // If collection has header Image
    collectionImageId = images[0].imageId;
    imageExtension = images[0].imageExt;
  } else if (productImageIds.length > 0) {
    // If collection does not have header Image then get it's first product image in the collection
    collectionImageId = productImageIds[0];
  }
  return dispatch =>
    dispatch(setMetaDataForList(collectionId, collectionName.trim(), collectionDescription.trim(), collectionImageId, imageExtension));
}
export function fetchCollectionList({ listId, nextPageToken = null, concat = false, suppressAuthCatch = false } = {}, heartList = getHeartList, authFactory = authenticationErrorCatchHandlerFactory) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { account } }, routing: { locationBeforeTransitions } } = getState();
    return heartList(account, { listId, nextPageToken }, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchApiNotAuthenticatedMiddleware)
      .then(fetchErrorMiddleware)
      .then(resp => {
        dispatch(receiveCollectionList(resp, listId, concat));
        return resp;
      })
      .catch(!suppressAuthCatch && authFactory(dispatch, prependAppRoot('/account/favorites', locationBeforeTransitions)));
  };
}

export function fetchCollectionProductDetail({ asin, colorId } = {}) {
  return function(dispatch, getState) {
    if (asin) {
      if (!PRODUCT_ASIN.test(asin.toUpperCase())) {
        dispatch(productNotFound());
        return Promise.reject(err.PRODUCT_DETAILS);
      }
    }

    const state = getState();
    const { environmentConfig: { api: { cloudcatalog: cloudcatalogInfo } } } = state;

    const productRequest = productBundle(cloudcatalogInfo, { asin })
      .then(fetchErrorMiddleware);

    const dispatchErrorMessageOrNotFound = () => Promise.reject(err.PRODUCT_DETAILS);

    return productRequest.then(productResponse => {
      if (!productResponse.product || productResponse.product.length !== 1) {
        dispatch(productNotFound());
        // Also throw an error because this means the response returned without the data we need
        throw err.PRODUCT_DETAILS;
      }

      const product = productResponse.product[0];

      const { styles } = product;

      if (asin) {
        const style = styles.find(style => style.stocks.find(stock => stock.asin === asin));
        if (style) {
          ({ colorId } = style);
        }
      }

      dispatch(receiveCollectionProductDetail(product, colorId));

      return product;
    }).catch(dispatchErrorMessageOrNotFound);
  };
}

export function toggleHeartingLoginModal(open, id) {
  return {
    type: TOGGLE_HEARTING_LOGIN_MODAL,
    open,
    id
  };
}

export function addHeartToCart(id) {
  const IDTYPE = PRODUCT_ASIN.test(id) ? 'asin' : 'stockId';

  return dispatch => {
    dispatch(changeQuantity({ items: [{ [IDTYPE]: id, quantity: 1, quantityAddition: true }] }, { firePixel: true }))
      .then(response => {
        const error = translateCartError(response);
        if (error) {
          trackEvent('TE_FAVORITES_ADDTOCART_FAILURE');
          alert(error);
        } else {
          trackLegacyEvent('CartAddItem', null, `asin:${id}`);
          trackEvent('TE_FAVORITES_ADDTOCART', id);
          dispatch(showCartModal(true, id));
        }
      });
  };
}

export function heartProduct({ itemId = undefined, subItemId = undefined, listId = undefined, colorId = undefined, productId = undefined, price = undefined, missingDimension = undefined }, callback, { add = addToList } = {}) { // TODO ts remove undefined and make the interface Partial once this file is typed
  return (dispatch, getState) => {
    const state = getState();
    const { environmentConfig: { api: { account } }, cookies: { 'x-main': xMain }, pageView: { pageType } } = state;

    if (!xMain) {
      return dispatch(toggleHeartingLoginModal(true, itemId));
    }

    !!itemId && dispatch(addHeartToList(itemId)); // heart right away in the UI to prevent delay
    return add(account, { itemId, subItemId, listId })
      .then(res => {
        // If successful we get 200 w/ empty body
        if (res.status !== 200) {
          throw Error(res.statusText);
        } else {
          if (callback) {
            callback();
          }

          const amePayload = addSubItemId({
            styleId: parseInt(itemId, 10),
            collectionId: listId,
            productId: parseInt(productId, 10),
            colorId: parseInt(colorId, 10),
            price,
            sourcePage: getAmethystPageType(pageType),
            incompleteAddToCollections: !!missingDimension,
            missingDimension
          }, subItemId);

          track(() => ([evAddToCollections, amePayload]));
        }
      })
      .catch(() => {
        dispatch(removeHeartFromList(itemId)); // unheart if call fails
        // x-main probably just invalid, let's have them login and try again
        return dispatch(toggleHeartingLoginModal(true, itemId));
      });
  };
}

export function unHeartProduct({ itemId, subItemId, listId, colorId, productId, price }, callback, { remove = removeFromList } = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const { environmentConfig: { api: { account } }, pageView: { pageType } } = state;
    !!itemId && dispatch(removeHeartFromList(itemId)); // unheart right away in the UI to prevent delay
    return remove(account, { itemId, subItemId, listId })
      .then(res => {
        // If successful we get 200 w/ empty body
        if (res.status !== 200) {
          throw Error(res.statusText);
        } else {
          if (callback) {
            callback();
          }

          const amePayload = addSubItemId({
            styleId: itemId,
            collectionId: listId,
            colorId,
            productId,
            sourcePage: getAmethystPageType(pageType),
            price
          }, subItemId);

          track(() => ([evRemoveFromCollections, amePayload]));
        }
      })
      .catch(() => {
        dispatch(addHeartToList(itemId)); // re-heart if call fails
        // x-main probably just invalid, let's have them login and try again
        return dispatch(toggleHeartingLoginModal(true, itemId));
      });
  };
}

export function getHearts(getHeartsList = getListOfIds, enabled = hasHearting) {
  return (dispatch, getState) => {

    const {
      cookies,
      environmentConfig: { api: { account } },
      routing: { locationBeforeTransitions: { pathname, query } }
    } = getState();
    const { heartOnLoad: itemId, heartOnLoadSub: subItemId } = query;

    if (!enabled || !cookies['x-main']) {
      return null;
    }
    return getHeartsList(account)
      .then(fetchErrorMiddleware)
      .then(res => {
        if (res && res.ids) {
          dispatch(receiveHeartIdList(res.ids));
        }

        if (itemId || subItemId) {
          const newQueryObject = { ...query, heartOnLoad: undefined, heartOnLoadSub: undefined };
          const newQueryString = queryString.stringify(newQueryObject);
          dispatch(replace(`${pathname}?${newQueryString}`));
          return dispatch(heartProduct({ itemId, subItemId }));
        }
      });
  };
}

export function getHeartCounts(productsList = [], getCall = likeCounts, enabled = hasHearting) {
  return (dispatch, getState) => {
    if (!enabled) {
      return null;
    }
    const { environmentConfig: { api: { cloudcatalog: cloudcatalogInfo } } } = getState();

    const styleIds = productsList.reduce((acc, { styleId }) => {
      if (
        !acc.includes(styleId) && // only push non-dupes
        acc.length < CLOUDCAT_MAX_ITEM_IDS // ensure we don't go over endpoint threshold(which should never happen) in order to prevent 400s
      ) {
        acc.push(styleId);
      }
      return acc;
    }, []);

    if (styleIds.length) {
      return getCall(cloudcatalogInfo, { styleIds, type: HEART_DEFAULT_LIST_TYPE })
        .then(fetchErrorMiddleware)
        .then(response => {
          dispatch(receiveHeartCounts(response));
        })
        .catch(e => {
          trackError('NON-FATAL', 'Could not retrieve heart counts', e);
        });
    }
  };
}

export function createHeartList({ listTypeId, listName }, doCreateList = createList) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();
    return doCreateList(account, { listTypeId, listName })
      .then(resp => {
        dispatch({ type: CREATE_COLLECTION_LIST, collectionName: listName, collectionId: listTypeId });
        return resp;
      })
      .then(fetchErrorMiddleware);
  };
}

export function deleteHeartList(listTypeId, doDeleteList = deleteList) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();
    return doDeleteList(account, listTypeId)
      .then(resp => {
        dispatch({ type: DELETE_COLLECTION_LIST, collectionId: listTypeId });
        return resp;
      })
      .then(fetchErrorMiddlewareMaybeJson);
  };
}

export function fetchListInfo({ listId, shareToken }, listInfo = getListInfo) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();
    return listInfo(account, { listId, shareToken })
      .then(fetchErrorMiddleware)
      .then(response => {
        dispatch(receiveListInfo(response));
      });
  };
}

export function sharingList({ listId }, doShareList = shareList) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { account } } } = getState();
    return doShareList(account, listId)
      .then(fetchErrorMiddleware);
  };
}

export function shareListEvent({ listId, shareToken }) {
  return (dispatch, getState) => {
    const { pageView: { pageType } } = getState();
    dispatch({ type: SHARE_COLLECTION_LIST, collectionId: listId, shareToken, sourcePage: getAmethystPageType(pageType) });
  };
}

export function getListsForItemId({ itemId }, getLists = getItemSubsetOnLists) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { account } } } = getState();
    return getLists(account, { itemId }, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        dispatch(receiveSpecificItemIdLists(response));
      });
  };
}

export function getLists({ shareToken, listId, nextPageToken = null, concat = false } = {}, getLists = getAllLists) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { account } } } = getState();

    if (!shareToken && !cookies['x-main']) {
      return dispatch(toggleHeartingLoginModal(true));
    }

    return getLists(account, { shareToken, listId, nextPageToken }, cookies)
      .then(response => {
        if (response.status !== 200) {
          dispatch(toggleHeartingLoginModal(true));
          throw Error(response.statusText);
        } else {
          return response?.json();
        }
      })
      .then(response => {
        dispatch(receiveAllLists(response, concat));
      })
      .catch(e => trackError('NON-FATAL', 'Could not load hearts getLists.', e));
  };
}
