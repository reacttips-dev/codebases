import { CART_LOCAL_STORAGE_KEY } from 'constants/appConstants';
import { loadFromLocalStorage, saveToLocalStorage } from 'helpers/localStorageUtilities';
import {
  CartItem as CartItemType,
  CartLocalStorageEGCItemType,
  CartLocalStorageItemType,
  CartResponse,
  ChangeQuantityItem
} from 'types/mafia';
import { IS_EGC_NAME } from 'common/regex';

interface GroupedCartItemsType {
  itemsWithFitRecommended: CartItemType[];
  itemsWithFitNotRecommended: CartItemType[];
  itemsWithNoRecommendationAvailable: CartItemType[];
}
export const groupCartItemsBySizePrediction = (cartItems: CartItemType[] = []) => {
  const groupedCartItems = cartItems.reduce((acc: GroupedCartItemsType, item) => {
    if (item?.sizing?.guidance) {
      if (item.sizing.guidance.isRecommendedSize) {
        acc.itemsWithFitRecommended.push(item);
      } else {
        acc.itemsWithFitNotRecommended.push(item);
      }
    } else {
      acc.itemsWithNoRecommendationAvailable.push(item);
    }
    return acc;
  }, { // Downstream-safe defaults for activeItems in cart
    itemsWithFitRecommended: [],
    itemsWithFitNotRecommended: [],
    itemsWithNoRecommendationAvailable: []
  });
  return groupedCartItems;
};

export const makeActiveItemsArray = (cart: CartResponse) => {
  const items = cart?.activeItems || [];
  const newItems: CartLocalStorageItemType[] = [];

  items.forEach((item: CartItemType) => {
    const {
      asin,
      stockId,
      quantity,
      price,
      egc,
      productName,
      recipientEmail,
      recipientName,
      senderName,
      message
    } = item;

    let newItem: CartLocalStorageItemType | CartLocalStorageEGCItemType = {
      asin,
      stockId,
      quantity
    };

    if (egc || IS_EGC_NAME.test(productName)) { // checkout does not provide `egc` boolean, so use productname regex instead
      newItem = {
        ...newItem,
        itemType: 'egc',
        egc: true,
        recipientEmail,
        recipientName,
        amount: price, // the param it takes is `amount` but the value in Mafia is called `price`
        senderName,
        message
      } as CartLocalStorageEGCItemType;
    }

    newItems.push(newItem);
  });

  return newItems;
};

interface CartIdentifiers {
  hasXMain: boolean;
  isXMainMismatched: boolean;
  isSessionIdMismatched: boolean;
}

export const getIdentifierMismatch = ({ cookiesXMain, cookiesSessionId }: { cookiesXMain: string; cookiesSessionId: string }) => {
  const cartLocalStorage = loadFromLocalStorage(CART_LOCAL_STORAGE_KEY);

  if (!cartLocalStorage) {
    return {};
  }

  const {
    xMain: lsXMain,
    sessionId: lsSessionId
  } = cartLocalStorage || {};

  const identifiers: CartIdentifiers = {
    hasXMain: !!cookiesXMain,
    isXMainMismatched: (cookiesXMain && cookiesXMain !== lsXMain) ? true : false,
    isSessionIdMismatched: cookiesSessionId !== lsSessionId ? true : false
  };

  return identifiers;
};

interface ChangeQuantityData {
  items: ChangeQuantityItem[];
}

export const mergeBrowserStorageCart = (changeQuantityPayload: ChangeQuantityData) => {
  const { items: dataItems } = changeQuantityPayload;
  const { items: localStorageItems = [] } = loadFromLocalStorage(CART_LOCAL_STORAGE_KEY) || {};

  // if local storage cart doesn't exist, just return active items
  if (!localStorageItems?.length) {
    return [...dataItems];
  }

  const filteredLocalStorageItems = localStorageItems.filter((item: CartLocalStorageEGCItemType) => !item.egc);

  // if there are items in local storage, and there's exactly one item in your cart
  if (localStorageItems.length && dataItems.length === 1) {
    const { asin, stockId, quantity } = dataItems[0];
    const matchingItem = localStorageItems.find((item: CartLocalStorageItemType) => (asin && item.asin === asin) || (stockId && item.stockId === stockId));

    // if there is a matching item from cart and local storage, sum the quantities and return early
    if (matchingItem) {
      matchingItem.quantity += quantity;
      return [...filteredLocalStorageItems];
    }
  }
  // otherwise just concat the two and return
  return [...filteredLocalStorageItems, ...dataItems];
};

export const storeCartToLocalStorage = (cart: CartResponse, xMain: string | undefined, sessionId: string) => {
  saveToLocalStorage(CART_LOCAL_STORAGE_KEY, {
    xMain,
    sessionId,
    items: makeActiveItemsArray(cart)
  });
};

export const clearCartLocalStorage = () => {
  localStorage.removeItem(CART_LOCAL_STORAGE_KEY);
};
