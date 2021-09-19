import { store } from 'entrypoints/bootstrapOnClient';
import { CART_PAGE } from 'constants/amethystPageTypes';
import { toFloatInt } from 'helpers/NumberFormats';
import { getIdentifierMismatch } from 'helpers/CartUtils';
import { evRecommendationClick } from 'events/recommendations';
import { getAmethystPageType, trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { middlewareTrack, titaniteView, track } from 'apis/amethyst';
import { sendMonetateEvent } from 'apis/monetate';
import {
  CART_ADD,
  CART_PAGE_VIEW,
  PROCEED_TO_CHECKOUT
} from 'constants/amethyst';
import {
  CART_PAGEVIEW,
  EVENT_ADD_TO_CART,
  EVENT_CART_CONTINUE_SHOPPING_CLICK,
  EVENT_CART_HEAD_BANNER_CLICK,
  EVENT_CART_RECO_CLICK
} from 'store/ducks/cart/types';

export const pvCart = cart => {
  const {
    isCartModal = false,
    activeItemTotalQuantity: itemsInCart,
    subtotal: { amount: grandTotal } = {},
    activeItems = [],
    savedItems
  } = cart;

  titaniteView();

  const products = activeItems.map(({ asin, productId, styleId, stockId }) => ({
    asin,
    productId,
    styleId,
    stockId
  }));

  const cartPageView = {
    distinctItemsInCart: activeItems.length,
    unavailableItemsInCart: savedItems.length,
    isCartModal,
    itemsInCart,
    grandTotal
  };

  // if there are products, include them into the payload
  if (products.length) {
    cartPageView.products = products;
  }

  return { [CART_PAGE_VIEW]: cartPageView };
};

export const evAddToCart = ({
  addedFrom,
  incompleteAddToCart = false,
  isSticky,
  missingDimension,
  price,
  productId,
  styleId
}) => {
  const formattedPrice = (typeof price === 'string') ? toFloatInt(price) : price;
  return {
    [CART_ADD]: {
      productIdentifiers: {
        productId,
        styleId
      },
      price: formattedPrice,
      incompleteAddToCart,
      missingDimension,
      addedFrom,
      isSticky
    }
  };
};

export const evRemoveFromCart = ({
  activeItems,
  savedItems,
  asin,
  isCartModal,
  isRemoveButton
}) => {
  const items = [ ...activeItems, ...savedItems ];
  const product = items.filter(item => item.asin === asin);
  const originalQuantity = product[0].quantity;

  return {
    removeFromCart: {
      originalQuantity,
      productIdentifiers: { asin },
      isCartModal,
      isRemoveButton
    }
  };
};

export const evModifyQuantity = ({
  activeItems,
  quantity: newQuantity,
  asin,
  isCartModal
}) => {
  const product = activeItems.filter(item => item.asin === asin);
  const originalQuantity = product[0].quantity;

  return {
    modifyQuantity: {
      originalQuantity,
      newQuantity,
      productIdentifiers: { asin },
      isCartModal
    }
  };
};

export const evProceedToCheckout = ({ pageType }) => ({
  [PROCEED_TO_CHECKOUT]: {
    pageType
  }
});

export const monetateCartView = appState => {
  const { cart: { cartObj } } = appState;
  const cartItems = cartObj.activeItems.map(v => {
    const { productId, price, styleId, quantity } = v;
    return { productId, sku: styleId, quantity, unitPrice: price };
  });
  sendMonetateEvent(
    ['setPageType', 'cart'],
    ['addCartRows', cartItems]
  );
};

export const evCartHeadBannerClick = bannerType => ({
  cartHeadBannerClick: {
    bannerType
  }
});

const getCartHeadBannerType = bannerType => {
  switch (bannerType) {
    case 'shipping_policy':
      return 'SHIPPING_POLICY';
    case 'privacy_policy':
      return 'PRIVACY_POLICY';
    case 'symphony_promo':
      return 'SYMPHONY_PROMO';
    default:
      return 'UNKNOWN_CART_BANNER_TYPE';
  }
};

const cartHeadBannerClick = (_, { bannerType }) => {
  middlewareTrack(evCartHeadBannerClick(getCartHeadBannerType(bannerType)));
};

export const evCartContinueShoppingClick = () => ({
  continueShoppingClick: {
    pageType: CART_PAGE
  }
});

const cartContinueShoppingClick = () => {
  middlewareTrack(evCartContinueShoppingClick());
};

export const evViewCartClick = () => ({
  viewCartClick: {
    sourcePage: CART_PAGE
  }
});

export const viewCartClick = () => {
  middlewareTrack(evViewCartClick());
};

export const evCartModalClose = () => ({
  cartModalClose: {}
});

export const cartModalClose = () => {
  middlewareTrack(evCartModalClose());
};

export const cartView = (appState, { cart }) => {
  const { cart: { cartObj } } = appState;
  middlewareTrack(pvCart(cart || cartObj));
  evOnShowRewardsTransparencyCart(appState);
  trackEvent('TE_PV_CARTPAGE');
};

const addToCart = (_, { product }) => {
  middlewareTrack(evAddToCart({ ...product, addedFrom: CART_PAGE }));
};

export const removeFromCart = (appState, { asin, isRemoveButton }) => {
  const { cart: { cartObj, isModalShowing: isCartModal } } = appState;

  trackLegacyEvent('CartRemoveItem', null, `asin:${asin}`);
  trackEvent('TE_CART_REMOVEITEM', asin);
  middlewareTrack(evRemoveFromCart({ ...cartObj, asin, isCartModal, isRemoveButton }));
};

export const modifyQuantity = (appState, { quantity, asin }) => {
  const { cart: { cartObj, isModalShowing: isCartModal } } = appState;

  trackEvent('TE_CART_MODIFYQUANTITY', asin);
  middlewareTrack(evModifyQuantity({ ...cartObj, quantity, asin, isCartModal }));
};

export const navigateToCheckout = (_, { pageType }) => {
  trackEvent('TE_CART_PROCEEDTOCHECKOUT');
  middlewareTrack(evProceedToCheckout({ pageType }));
};

export const cartRecommendationClick = (appState, { productId, index }) => {
  const { pageView: { pageType } } = appState;
  track(() => ([
    evRecommendationClick, {
      index,
      recommendationType: 'PRODUCT_RECOMMENDATION',
      recommendationValue: productId,
      recommendationSource: 'EP13N',
      widgetType: 'CUSTOMERS_WHO_BOUGHT_WIDGET',
      sourcePage: getAmethystPageType(pageType)
    }
  ]));
};

export const evOnShowRewardsTransparencyCart = appState => {
  const { cookies: { 'x-main': xMain }, pageView: { pageType }, sharedRewards: { transparencyPointsForCart, isEnrolled } } = appState;

  if (transparencyPointsForCart?.totalPoints?.points) {

    const { totalPoints: { points, dollarValue } } = transparencyPointsForCart;

    // ZFC event
    const recognizedStatus = xMain ? 'recognized' : 'unrecognized';
    const enrolledStatus = isEnrolled ? 'enrolled' : 'unenrolled';
    trackEvent('TE_SHOW_REWARDS_TRANSPARENCY', `${pageType}:${points}:${recognizedStatus}:${enrolledStatus}}`);

    // Amethyst event
    middlewareTrack({
      rewardsTransparencyImpression: {
        sourcePage: getAmethystPageType(pageType),
        isEnrolled: !!isEnrolled,
        rewardsPoints: points,
        rewardsDollars: dollarValue
      }
    });
  }
};

export const getActiveTotalQuantity = itemsArr => {
  let itemQuantity = 0;

  itemsArr.forEach(item => {
    itemQuantity += item.quantity;
  });

  return itemQuantity;
};

export const getOOSItemsFromLocalStorage = (itemsArr, oosItemsArr) => {
  const lsAsinArray = [];

  itemsArr.forEach(item => {
    lsAsinArray.push(item.asin);
  });

  const oosLocalStorageItems = oosItemsArr.filter(item => lsAsinArray.includes(item.asin));

  return getActiveTotalQuantity(oosLocalStorageItems);
};

export const evCartLocalStorage = ({
  items,
  savedItems,
  itemQuantityInCart,
  cookiesXMain,
  cookiesSessionId
}) => {
  const {
    hasXMain = false,
    isXMainMismatched = false,
    isSessionIdMismatched = false
  } = getIdentifierMismatch({ cookiesXMain, cookiesSessionId });

  const itemQuantityInLocalStorage = getActiveTotalQuantity(items);
  const oosItemQuantityInLocalStorage = getOOSItemsFromLocalStorage(items, savedItems);

  return {
    cartLocalStorage: {
      itemQuantityInLocalStorage,
      oosItemQuantityInLocalStorage,
      itemQuantityInCart,
      isSessionIdMismatched,
      isXMainMismatched,
      hasXMain
    }
  };
};

export const evCartRestoreFromLocalStorage = ({
  items,
  itemQuantityInCart,
  has200StatusOnCartRestore = true
}) => {

  const itemQuantityInLocalStorage = getActiveTotalQuantity(items);

  return {
    cartRestoreFromLocalStorage: {
      pageType: getAmethystPageType(store.getState().pageView.pageType),
      has200StatusOnCartRestore,
      itemQuantityInLocalStorage,
      itemQuantityInCart
    }
  };
};

// Quote these properties because they are indirectly referenced by the saga middleware and we don't want them mangled.
export default {
  pageEvent: CART_PAGEVIEW,
  events: {
    [EVENT_ADD_TO_CART]: [addToCart],
    [CART_PAGEVIEW]: [monetateCartView, cartView],
    [EVENT_CART_HEAD_BANNER_CLICK]: [cartHeadBannerClick],
    [EVENT_CART_CONTINUE_SHOPPING_CLICK]: [cartContinueShoppingClick],
    [EVENT_CART_RECO_CLICK]: [cartRecommendationClick]
  }
};
