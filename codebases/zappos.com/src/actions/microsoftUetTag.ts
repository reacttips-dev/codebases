import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import marketplace from 'cfg/marketplace.json';
import { MICROSOFT_UET_IFRAME_ID } from 'constants/appConstants';
import {
  CLEAR_STORED_MICROSOFT_UET_EVENTS,
  SET_MICROSOFT_UET_TAG_LOADED,
  STORE_MICROSOFT_UET_EVENT
} from 'constants/reduxActions';
import { logError } from 'middleware/logger';
import {
  AddToCartMicrosoftUetEvent,
  MicrosoftUetEvent,
  MicrosoftUetEventProductEntry,
  PurchaseMicrosoftUetEvent,
  ViewCartPageMicrosoftUetEvent,
  ViewHomePageMicrosoftUetEvent,
  ViewProductPageMicrosoftUetEvent,
  ViewSearchPageMicrosoftUetEvent
} from 'types/microsoftUetTag';

export function clearStoredMicrosoftUetEvents() {
  return { type: CLEAR_STORED_MICROSOFT_UET_EVENTS };
}

export function setMicrosoftUetTagLoaded(loaded: boolean) {
  return {
    type: SET_MICROSOFT_UET_TAG_LOADED,
    loaded
  } as const;
}

export function storeMicrosoftUetEvent(event: MicrosoftUetEvent) {
  return {
    type: STORE_MICROSOFT_UET_EVENT,
    event
  } as const;
}

function doUncheckedPush(event: MicrosoftUetEvent) {
  const uetFrame = document.getElementById(MICROSOFT_UET_IFRAME_ID) as HTMLIFrameElement | null;
  if (!uetFrame) {
    logError('[msftUet] couldn\'t find iframe');
    return;
  }
  const { data, name = '' } = event;
  const payload = JSON.stringify({ microsoftUetTagEvent: { data, name } });
  uetFrame.contentWindow?.postMessage(payload, event.origin);
}

export function pushMicrosoftUetEvent(event: MicrosoftUetEvent): ThunkAction<void, any, void, AnyAction> {
  return (dispatch, getState) => {
    const { microsoftUetTag: { loaded } } = getState();
    if (loaded) {
      doUncheckedPush(event);
    } else {
      dispatch(storeMicrosoftUetEvent(event));
    }
  };
}

export function pushStoredMicrosoftUetEvents(): ThunkAction<void, any, void, AnyAction> {
  return (dispatch, getState) => {
    const { microsoftUetTag: { events } } = getState();
    events.forEach((event: MicrosoftUetEvent) => doUncheckedPush(event));
    dispatch(clearStoredMicrosoftUetEvents());
  };
}

function getDefaultTagOrigin(): string {
  return marketplace.analytics.microsoft.uet.tagOrigin;
}

export function createViewHomePageMicrosoftUetEvent() {
  const ret: ViewHomePageMicrosoftUetEvent = {
    data: { ecomm_pagetype: 'home' },
    name: '',
    origin: getDefaultTagOrigin()
  };
  return ret;
}

export function createViewSearchPageMicrosoftUetEvent(searchTerm: string, productIds: string[]) {
  const ret: ViewSearchPageMicrosoftUetEvent = {
    data: {
      ecomm_pagetype: 'searchresults',
      ecomm_prodid: productIds,
      ecomm_query: searchTerm
    },
    name: '',
    origin: getDefaultTagOrigin()
  };
  return ret;
}

export function createViewProductPageMicrosoftUetEvent(productId: string) {
  const ret: ViewProductPageMicrosoftUetEvent = {
    data: {
      ecomm_pagetype: 'product',
      ecomm_prodid: [productId]
    },
    name: '',
    origin: getDefaultTagOrigin()
  };
  return ret;
}

/**
 * create a Microsoft UET event for adding a product to cart
 *
 * @param stockId     the ID of the product
 * @param price       the price of the product
 * @param addedFrom   the page the product was added to cart from (usually
 *                    "product", as in, "added from PDP")
 */
export function createAddToCartMicrosoftUetEvent(stockId: string, price: number, addedFrom: 'product') {
  const ret: AddToCartMicrosoftUetEvent = {
    data: {
      ecomm_pagetype: addedFrom,
      ecomm_prodid: stockId,
      ecomm_totalvalue: price,
      currency: 'USD'
    },
    name: 'add_to_cart',
    origin: getDefaultTagOrigin()
  };
  return ret;
}

export function createViewCartPageMicrosoftUetEvent(stockIds: string[], total: number, items: MicrosoftUetEventProductEntry[]) {
  const ret: ViewCartPageMicrosoftUetEvent = {
    data: {
      ecomm_prodid: stockIds,
      ecomm_pagetype: 'cart',
      ecomm_totalvalue: total,
      currency: 'USD',
      items
    },
    name: '',
    origin: getDefaultTagOrigin()
  };
  return ret;
}

/** Microsoft UET event for the order confirmation page */
export function createPurchaseMicrosoftUetEvent(stockIds: string[], total: number, items: MicrosoftUetEventProductEntry[]) {
  const ret: PurchaseMicrosoftUetEvent = {
    data: {
      ecomm_prodid: stockIds,
      ecomm_pagetype: 'purchase',
      ecomm_totalvalue: total,
      currency: 'USD',
      items
    },
    name: '',
    origin: getDefaultTagOrigin()
  };
  return ret;
}
