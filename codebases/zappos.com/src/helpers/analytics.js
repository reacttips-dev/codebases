/* eslint import/namespace: [2, { allowComputed: true }] import/no-namespace: 0 */
// this is for line `eventConstants[event]` which cannot be statically analyzed
import * as eventConstants from 'constants/analytics';
import { REQUEST_SESSION_STORAGE_KEY } from 'constants/e2e';
import { logDebug } from 'middleware/logger';
import { lazyExecute, stripSpecialChars } from 'helpers';
import AppEnvironment from 'helpers/AppEnvironment';
import { trackError } from 'helpers/ErrorUtils';
import { onEvent } from 'helpers/EventHelpers';
import { storeRequest } from 'helpers/e2e';
import marketplace from 'cfg/marketplace.json';

const k2Stubs = {
  addEvent: e => {
    logDebug('event.cgi', e.type, e.payload); // debug this out for development help, track.cgi is already printed elsewhere in dev.
  },
  track: () => {}
};
// If/when we are ready to replace karakoram with k2, we just need to re-implement the isBrowser check, configureK2, and re-add the library
const { addEvent: addK2Event, track: trackK2PageView } = k2Stubs;

const {
  analytics: {
    google: { trackers }
  }
} = marketplace;

const starValue = value => (typeof value !== 'undefined' && value !== null ? `*${value}` : '');

export const trackPage = bundle => {
  trackK2PageView(bundle);
};

export const e2eEventStorage = request => {
  if (typeof window !== 'undefined' && window.renderTestLocators) {
    storeRequest({ url: 'zfcEvent', request }, REQUEST_SESSION_STORAGE_KEY);
  }
};

export const trackLegacyEvent = (action, label, value, addEvent = addK2Event) => {
  if (!AppEnvironment.hasZfc || window.mk2) {
    addEvent({
      type: [action, label].filter(v => typeof v !== 'undefined').join('*'),
      payload: value
    });
  } else {
    lazyExecute(() => {
    // form the payload for the zfc sendEvent
      const zfcEventData = [
        'sendEvent',
        `${action}${starValue(label)}`,
        value || null
      ];

      window.zfc.push(zfcEventData);
    });
  }
  e2eEventStorage({ type: `${action}${starValue(label)}`, payload: value });
};

export const trackEvent = (event, category, { l3: alternativeL3, addEvent = addK2Event } = {}) => {
  const eventConstant = eventConstants[event];
  if (!eventConstant) {
    logDebug(`No analytics event ${event}`);
    return;
  }

  const {
    l1: level1, // Action, Page View
    l2, // PDP, Cart, Search
    l3: level3, // Modify Quantity, Typed Search
    l4: level4 // sku, asin, quantity
  } = eventConstant;

  const l1 = level1 || 'Action'; // if l1 is not defined, default to 'Action'
  const l3 = level3 || alternativeL3 || '-';
  const l4 = level4 || category; // if level4/l4 is defined, use that, otherwise use the 'category' argument

  if (!AppEnvironment.hasZfc || window.mk2) {
    addEvent({
      type: [l1, l2, l4].filter(v => typeof v !== 'undefined').join('*'),
      payload: l3
    });
  } else {
    lazyExecute(() => {
      // form the payload for the zfc sendEvent
      const zfcEventData = [
        'sendEvent',
        `${l1}${starValue(l2)}${starValue(l4)}`,
        l3 || null
      ];

      window.zfc.push(zfcEventData);

      tpTrackEvent(l1, l2, l3);
    });
  }
  e2eEventStorage({ type: `${l1}${starValue(l2)}${starValue(l4)}`, payload: l3 });
};

export const trackOrderConfirmationEvent = (zfcEventData, addEvent = addK2Event) => {
  if (!AppEnvironment.hasZfc || window.mk2) {
    addEvent(zfcEventData);
  } else {
    lazyExecute(() => {
      window.zfc.push(['sendFullEvent', zfcEventData]);
    });
  }
};

const isPageView = action => action.match(/PageView/);

export const thirdPartyTrackEvent = (action, label, value = null) => {
  lazyExecute(() => {
    if (typeof(action) !== 'string') {
      return;
    }

    try {
      action = stripSpecialChars(action);
      label = label ? stripSpecialChars(label) : '';
      value = value ? stripSpecialChars(`${value}`) : '';

      if (isPageView(action)) {
        const fieldsObj = {
          hitType: 'page',
          page: window.location.pathname,
          title: value || label
        };

        trackers.forEach(tracker => {
          window.ga(`${tracker.name}.set`, fieldsObj);
          window.ga(`${tracker.name}.send`, 'pageview');
        });
      }
    } catch (e) {
      trackError('NON-FATAL', 'Could not fire third party analytics event', e);
    }
  });
};

const tpTrackEvent = AppEnvironment.hasTrackers ? thirdPartyTrackEvent : (f => f);

function shouldTrackElement(element) {
  const trackEvent = element.getAttribute('data-te');
  const trackAction = element.getAttribute('data-track-action');
  const trackLabel = element.getAttribute('data-track-label');
  const trackValue = element.getAttribute('data-track-value');
  return (trackAction && trackLabel && trackValue) || trackEvent;
}

/*
  Event handler that checks whether a clicked element has analytics information as data-te attribute
  and sends data to analytics if necessary.
*/
function handleClick(event) {
  const element = findElementWithAttributes(event.target);

  if (element) {
    const eventName = element.getAttribute('data-te');
    if (eventName) { // if the element is using the new constants file
      const eventData = element.getAttribute('data-ted');
      trackEvent(eventName, eventData);
    } else { // the older data-track-* approach
      const trackAction = element.getAttribute('data-track-action');
      const trackLabel = element.getAttribute('data-track-label');
      const trackValue = element.getAttribute('data-track-value');
      trackLegacyEvent(trackAction, trackLabel, trackValue);
    }
  }
}

function findElementWithAttributes(srcElement) {
  if (!srcElement) {
    return;
  }

  if (shouldTrackElement(srcElement)) {
    return srcElement;
  }

  if (srcElement.parentElement) {
    return findElementWithAttributes(srcElement.parentElement);
  }
}

export function setupDataAttributeAnalytics() {
  const setupBodyClick = () => onEvent(document.body, 'click', handleClick);
  onEvent(document, 'DOMContentLoaded', setupBodyClick);
}

/**
  * Given a list of items, return array in the ProductIdentifiers amethyst format below
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ProductIdentifiers.proto
*/
export function createProductIdentifiersProto(items) {
  return items.map(item => {
    const { product } = item;
    if (product) {
      const { asin, productId, styleId, stockId, colorId } = product;
      return {
        asin,
        productId,
        styleId,
        stockId,
        colorId
      };
    } else { // hearted or favorited item
      const { asin, productId, styleId, stockId, colorId } = item;
      return {
        asin,
        productId,
        styleId,
        stockId,
        colorId
      };
    }
  });
}

/*
  Get the Amethyst pageType from the marty/pixel pageType
  Taken from `enum PageType`
  https://code.amazon.com/packages/AmethystEvents/blobs/550dbac47f4d540a123099fce86197b501df93e9/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L85
*/
export const PAGE_TYPE_MAP = {
  brand: 'BRAND_PAGE',
  homepage: 'HOMEPAGE',
  pdp: 'PRODUCT_PAGE',
  product: 'PRODUCT_PAGE',
  search: 'SEARCH_PAGE',
  cart: 'CART_PAGE',
  cartModal: 'CART_PAGE_MODAL',
  landing: 'LANDING_PAGE',
  checkout: 'CHECKOUT_PAGE',
  account: 'MY_ACCOUNT_PAGE',
  confirmation: 'ORDER_CONFIRMATION_PAGE',
  orders: 'ORDER_HISTORY_PAGE',
  orderInformation: 'ORDER_DETAIL_PAGE',
  favorites: 'FAVORITES_PAGE',
  recommended: 'INTERSTITIAL_ADD_TO_CART_PAGE'
};

export function getAmethystPageType(pageType) {
  return PAGE_TYPE_MAP[pageType] || 'UNKNOWN_PAGE_TYPE';
}
