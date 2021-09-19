import ExecutionEnvironment from 'exenv';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  CART_CHANGE_FAILURE,
  CART_ERROR,
  CART_IS_LOADING,
  CART_RESET_STATE,
  PIN_IS_VALID,
  RECEIVE_CART_ITEMS,
  RECEIVE_CART_PROMOS,
  RECEIVE_PIN,
  RECEIVE_TRACKING_NUMBER,
  REQUEST_CART_UPDATE,
  SHOW_CART_MODAL,
  UPDATE_CART_COUNT
} from 'constants/reduxActions';
import { CART_LOCAL_STORAGE_KEY } from 'constants/appConstants';
import { onCartUpdated, onNavigateToCheckout } from 'store/ducks/cart/actions';
import {
  STORE_REWARDS_TRANSPARENCY_POINTS_FOR_CART
} from 'store/ducks/rewards/types';
import { trackEvent } from 'helpers/analytics';
import { loadFromLocalStorage } from 'helpers/localStorageUtilities';
import { mergeBrowserStorageCart, storeCartToLocalStorage } from 'helpers/CartUtils';
import { checkCustomerAuthentication } from 'actions/authentication';
import { triggerAssignment } from 'actions/ab';
import {
  createViewCartPageMicrosoftUetEvent,
  pushMicrosoftUetEvent
} from 'actions/microsoftUetTag';
import { firePixelServer } from 'actions/pixelServer';
import { err, setError } from 'actions/errors';
import { setSessionCookies } from 'actions/session';
import { fetchProductRecos } from 'actions/recos';
import { sendIntentEvent } from 'apis/intent';
import { middlewareTrack } from 'apis/amethyst';
import { cartData, changeCart, getLandingPageInfo, getPin, getTrackingLabel, validatePin } from 'apis/mafia';
import { fetchErrorMiddleware, fetchErrorMiddlewareAllowedErrors } from 'middleware/fetchErrorMiddleware';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import { formatMicrosoftPixelData } from 'helpers/SearchUtils';
import { AppState } from 'types/app';
import { CartError, CartItem, CartResponse, CartRewards, ChangeQuantityItem } from 'types/mafia';
import { evCartLocalStorage, evCartRestoreFromLocalStorage } from 'events/cart';
import marketplace from 'cfg/marketplace.json';
const { cart: { restoreEmptyCart }, checkout: { shouldRefreshCheckout, checkoutUrl, placeboHydraTest }, hasRewardsTransparency } = marketplace;

const CART_RECO_COUNT = 6;

interface CartPixelServerItems {
  asin: string;
  childAsin: string;
  productId: string;
  childStockId: string;
  name: string;
  qty: number;
  price: number;
  brandName: string;
  type: string;
  styleId: string;
}

interface PinData {
  pin: string;
}

function receiveCartItems(cart: CartResponse) {
  return {
    type: RECEIVE_CART_ITEMS,
    cartCount: cart.activeItemTotalQuantity || 0,
    cartObj: cart
  } as const;
}

export function resetCartState() {
  return {
    type: CART_RESET_STATE
  } as const;
}

export function changeCartCount(cartCount: number) {
  return {
    type: UPDATE_CART_COUNT,
    cartCount
  } as const;
}

export function requestCartUpdate() {
  return {
    type: REQUEST_CART_UPDATE
  } as const;
}

export function cartChangeFailure(errorDetail: CartError) {
  return {
    type: CART_CHANGE_FAILURE,
    errorDetail
  } as const;
}

export function cartError(error: null | string) {
  return {
    type: CART_ERROR,
    error
  } as const;
}

export function cartIsLoading() {
  return {
    type: CART_IS_LOADING
  } as const;
}

export function showCartModal(isShowing: boolean, stockId?: string) {
  return {
    type: SHOW_CART_MODAL,
    isShowing,
    stockId
  } as const;
}

export function receivePin({ pin }: PinData) {
  return {
    type: RECEIVE_PIN,
    pin
  } as const;
}

export function pinIsValid(isValid: boolean) {
  return {
    type: PIN_IS_VALID,
    isValid
  } as const;
}

export function receiveTrackingNumber(trackingNumber: string) {
  return {
    type: RECEIVE_TRACKING_NUMBER,
    trackingNumber
  } as const;
}

export function receiveCartPromos(promos: any) { // TODO ts use correct type when landing pages are converted to ts
  return {
    type: RECEIVE_CART_PROMOS,
    promos
  } as const;
}

export function receiveCartRewards(transparencyPointsForCart: CartRewards, isEnrolled: boolean) {
  return {
    type: STORE_REWARDS_TRANSPARENCY_POINTS_FOR_CART,
    transparencyPointsForCart,
    isEnrolled
  } as const;
}

interface PixelExtraData {
  justAdded?: ChangeQuantityItem[];
}

interface JustAddedData extends CartPixelServerItems {
  quantity?: number;
}

/** make the `justAdded` field for the pixel server call */
export function makeJustAddedField(extraData: PixelExtraData = {}, items: JustAddedData[] = []) {
  const justAdded: JustAddedData[] = [];
  if (extraData.justAdded) {
    extraData.justAdded.forEach(itemFromExtraData => {
      const itemFromCartResponse = items.find(item => item.childStockId === itemFromExtraData.stockId);
      if (itemFromCartResponse) {
        justAdded.push({
          ...itemFromCartResponse,
          quantity: itemFromExtraData.quantity || itemFromCartResponse.quantity
        });
      }
    });
  }
  return justAdded;
}

export function fireCartPixelServer(cart: CartResponse, extraData: PixelExtraData = {}, localFirePixelServer = firePixelServer) {
  const { activeItems } = cart;
  const items: JustAddedData[] = [];
  for (let i = 0; i < activeItems.length; i++) {
    const item: CartItem = activeItems[i];
    items.push({
      asin: item.parentAsin,
      childAsin: item.asin,
      productId: item.productId,
      childStockId: item.stockId,
      name: item.productName,
      qty: item.quantity,
      price: item.price,
      brandName: item.brandName,
      type: item.glProductGroupType,
      styleId: item.styleId
    });
  }
  const payload = {
    itemCount: cart.activeItemTotalQuantity,
    subtotal: cart.subtotal.amount,
    grandTotal: cart.subtotalWithTaxAndDiscounts.amount,
    tax: (cart.subtotalWithTax.amount - cart.subtotal.amount),
    justAdded: makeJustAddedField(extraData, items),
    items,
    microsoftItems: formatMicrosoftPixelData({ results: items })
  };
  return localFirePixelServer('cart', {
    cart: payload
  });
}

export function updateCartCount({ activeItemTotalQuantity: count }: { activeItemTotalQuantity: number }, doc = document, EventConstructor = CustomEvent) {
  doc.dispatchEvent(new EventConstructor('cart_item_count_change', { detail: count }));
}

export function clearCartCount(doc = document, EventConstructor = CustomEvent) {
  updateCartCount({ activeItemTotalQuantity: 0 }, doc, EventConstructor);
}

export function fetchCartRecos({ activeItems }: { activeItems: CartItem[] }, fetchRecosData = fetchProductRecos) {
  const randomIndex = Math.floor(Math.random() * activeItems.length);
  const product = activeItems[randomIndex];
  const productIds: string[] = [];
  const styleIds: string[] = [];

  activeItems.forEach(({ productId, styleId }) => {
    productIds.push(productId);
    styleIds.push(styleId);
  });

  if (product) {
    const { productId, styleId } = product;
    return fetchRecosData({ productIds, styleIds, productId, styleId, slot: 'zap_cart', limit: CART_RECO_COUNT });
  } else {
    return { type: 'NOOP' };
  }
}

export function fetchCartPromos(fetchZCSInfo = getLandingPageInfo): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const { cookies, client: { request }, environmentConfig: { api: { mafia } } } = getState();
    return fetchZCSInfo(mafia, { pageName: 'zapposcart' }, cookies, request)
      .then(fetchErrorMiddleware)
      .then((response: any) => { // TODO ts use correct type when landing pages are converted to typescript
        dispatch(receiveCartPromos(response));
      });
  };
}

export function syncCartLocalStorage(cart: CartResponse): ThunkAction<void, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const state = getState();
    const { ['x-main']: cookiesXMain, ['session-id']: cookiesSessionId } = state?.cookies || {};
    const { items = [] } = loadFromLocalStorage(CART_LOCAL_STORAGE_KEY) || {};
    const { activeItemTotalQuantity = 0, savedItems = [] } = cart || {};

    const emptyCart = activeItemTotalQuantity === 0;

    middlewareTrack(evCartLocalStorage({
      items,
      savedItems,
      itemQuantityInCart: activeItemTotalQuantity,
      cookiesXMain,
      cookiesSessionId
    }));

    // you have no local storage, or the local storage items is empty - and your cart is not empty, save to local storage
    if (!items.length && !emptyCart) {
      storeCartToLocalStorage(cart, cookiesXMain, cookiesSessionId);
    }

    // if there are local storage items, and your cart is empty
    if (items.length && emptyCart) {
      return dispatch(changeQuantity({ items }, { isCartRestore: true }));
    }
  };
}

export function fetchCartItems({ firePixel = false, localSendIntentEvent = sendIntentEvent, shouldFetchRecos = false } = {}, apiCartData = cartData, fetchRecosData = fetchProductRecos): ThunkAction<Promise<CartResponse>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    const querystring = hasRewardsTransparency ? '?displayRewards=true' : '';
    return apiCartData(mafia, querystring, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddleware)
      .then((response: CartResponse) => {
        if (ExecutionEnvironment.canUseDOM) {
          updateCartCount(response);
        }
        dispatch(receiveCartItems(response));
        const { cartRewards } = response || {};
        const { enrolled } = cartRewards || {};

        if (cartRewards) {
          dispatch(receiveCartRewards(cartRewards, enrolled));
        }

        if (firePixel) {
          dispatch(pushMicrosoftUetEvent(formatMicrosoftUetTagEvent(response)));
          const intentEvent = formatIntentEvent(response);
          dispatch(localSendIntentEvent('view', intentEvent));
          dispatch(fireCartPixelServer(response));
        }

        if (shouldFetchRecos) {
          fetchCartRecos(response, fetchRecosData);
        }

        return response;
      })
      .catch((e: Error) => {
        dispatch(showCartModal(false));
        return dispatch(setError(err.GENERIC, e));
      });
  };
}

export function formatIntentEvent(cart: CartResponse) {
  return {
    page_id: 'cart' as const,
    total_price: cart.subtotal.amount,
    cart: cart.activeItems.map(({ price, quantity, stockId }) => ({ id: stockId, price, quantity }))
  };
}

export function formatMicrosoftUetTagEvent(cart: CartResponse) {
  return createViewCartPageMicrosoftUetEvent(
    cart.activeItems.map(item => item.stockId),
    cart.subtotal.amount,
    cart.activeItems.map(({ price, stockId, quantity }) => ({ id: stockId, price, quantity }))
  );
}

// TODO ts change types to something more useful once context router is typed
interface ContextRouter {
  forceBrowserPush: any;
  forceRefreshPush: any;
}

export function navigateToCheckout({ forceBrowserPush, forceRefreshPush }: ContextRouter, pageType: string): ThunkAction<void, AppState, void, AnyAction> {
  return function(dispatch) {
    dispatch(triggerAssignment(placeboHydraTest));
    dispatch(onNavigateToCheckout(pageType));

    // TODO move the trackEvent into events/cart once https://github01.zappos.net/mweb/marty/issues/8228 is implemented, undo changes to checkCustomerAuthentication
    const pathname = `${checkoutUrl}/initiate`;
    dispatch(checkCustomerAuthentication(
      pathname,
      () => {
        shouldRefreshCheckout ? forceRefreshPush(pathname) : forceBrowserPush(pathname);
      }, {
        redirectOnClose: undefined,
        callbackIfNotAuthenticated: () => trackEvent('TE_CHECKOUT_ERROR_NOT_AUTHORIZED')
      })); // TODO move the trackEvent into events/cart once https://github01.zappos.net/mweb/marty/issues/8228 is implemented, undo changes to checkCustomerAuthentication
  };
}

interface ChangeQuantityData {
  items: ChangeQuantityItem[];
}

export const isSuccessfulCartResponse = (response: CartResponse | CartError): response is CartResponse => (response as CartResponse).activeItems !== undefined;
export const isCartResponseAsinNotAvailable = (response: CartResponse | CartError): response is CartResponse => (response as CartError).id === 'asin.not.available';

export function changeQuantity(data: ChangeQuantityData, { isCartRestore = false, firePixel = false } = {}, apiChangeCart = changeCart): ThunkAction<Promise<CartResponse | CartError>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    const { ['x-main']: xMain, ['session-id']: sessionId } = cookies;

    const querystring = hasRewardsTransparency ? '?displayRewards=true' : '';

    // determine if `changeQuantity` came from add to cart vs modify quantity, and concat the data with local storage if so
    const isAddToCart = data.items?.some(item => item.quantityAddition);
    const newData = (restoreEmptyCart && isAddToCart) ? { items: mergeBrowserStorageCart(data) } : data;

    dispatch(requestCartUpdate());

    return apiChangeCart(mafia, querystring, newData, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddlewareAllowedErrors([400, 404]))
      .then((response: CartResponse | CartError) => {
        // We tried to add an OOS DF LS (Out of stock, Direct Fulfillment, Local Storage) item to your cart, and Mafia threw an error.
        // Display an error message and gracefully handle add to cart
        if (isCartResponseAsinNotAvailable(response)) {
          dispatch(fetchCartItems()).then(response => {
            storeCartToLocalStorage(response, xMain, sessionId);

            // don't show a cart modal on /cart
            if (isAddToCart) {
              dispatch(showCartModal(true));
            }
          });
        }

        // we encountered a problem, return the problem to the caller to allow them to handle it
        // successful responses don't include the statusCode field at all
        if (isSuccessfulCartResponse(response)) {
          if (ExecutionEnvironment.canUseDOM) {
            updateCartCount(response);
          }

          // fire an extra event if the changeQuantity came from a local storage cart restoration
          if (restoreEmptyCart && isCartRestore) {
            const { activeItemTotalQuantity = 0 } = response || {};

            middlewareTrack(evCartRestoreFromLocalStorage({
              items: data.items,
              itemQuantityInCart: activeItemTotalQuantity
            }));
          }

          storeCartToLocalStorage(response, xMain, sessionId);

          dispatch(receiveCartItems(response));
          dispatch(onCartUpdated());
          const { cartRewards } = response || {};
          const { enrolled } = cartRewards || {};
          if (cartRewards) {
            dispatch(receiveCartRewards(cartRewards, enrolled));
          }
          if (firePixel) {
            dispatch(fireCartPixelServer(response, { justAdded: data.items }));
          }
        } else {
          dispatch(cartChangeFailure(response));
        }

        return response;
      })
      .catch((e: Error) => {
        // if the cart restore was a failure, fire the cart restoration event with "has200" boolean set to false
        if (restoreEmptyCart && isCartRestore) {
          middlewareTrack(evCartRestoreFromLocalStorage({
            items: data.items,
            itemQuantityInCart: 0,
            has200StatusOnCartRestore: false
          }));

          // in the event we try to add any local storage items that are OOS, refetch the cart and store new cart response to local storage
          dispatch(fetchCartItems()).then(response => {
            storeCartToLocalStorage(response, xMain, sessionId);
          });
        } else {
          dispatch(setError(err.CART, e));
        }
      });
  };
}

export function fetchPin(apiGetPin = getPin): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return apiGetPin(mafia, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddleware)
      .then((response: PinData) => {
        dispatch(receivePin(response));
      })
      .catch(() => {
        window.location.reload();
      });
  };
}

export function validateUserPin(pin: string, apiValidatePin = validatePin): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return apiValidatePin(mafia, pin, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddleware)
      .then((response: { isWhitelisted: boolean }) => {
        dispatch(pinIsValid(response.isWhitelisted));
      })
      .catch(() => {
        window.location.reload();
      });
  };
}

interface TrackingNumberData {
  pin: string;
  addressId: string;
}

interface TrackingNumberResponse {
  trackingNumber: string;
}

export function getTrackingNumber(data: TrackingNumberData, cb: (...args: any[]) => any, apiGetTrackingLabel = getTrackingLabel): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return apiGetTrackingLabel(mafia, data, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddleware)
      .then(({ trackingNumber }: TrackingNumberResponse) => {
        if (cb) {
          cb();
        }

        dispatch(receiveTrackingNumber(trackingNumber));
      })
      .catch(() => {
        window.location.reload();
      });
  };
}

export type CartActions =
| ReturnType<typeof receiveCartItems>
| ReturnType<typeof resetCartState>
| ReturnType<typeof changeCartCount>
| ReturnType<typeof requestCartUpdate>
| ReturnType<typeof cartChangeFailure>
| ReturnType<typeof cartError>
| ReturnType<typeof cartIsLoading>
| ReturnType<typeof showCartModal>
| ReturnType<typeof receivePin>
| ReturnType<typeof pinIsValid>
| ReturnType<typeof receiveTrackingNumber>
| ReturnType<typeof receiveCartPromos>
| ReturnType<typeof receiveCartRewards>;

