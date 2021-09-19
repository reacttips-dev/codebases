import {
  BASE_FREE_SHIPPING_TEXT,
  BASE_NON_PERK_TEXT,
  BASE_PERK_TEXT,
  BUSINESS_UNKNOWN_PERK_TEXT,
  HOLIDAY_NON_PERK_TEXT,
  HOLIDAY_PERK_TEXT,
  PRIME_NON_PERK_TEXT,
  PRIME_PERK_TEXT,
  VIP_NON_PERK_TEXT,
  VIP_PERK_TEXT
} from 'constants/shipOptionMessaging';
import {
  GET_SHIP_OPTION_LIST_SUCCESS,
  SET_SHIP_OPTIONS_NOT_LOADED
} from 'store/ducks/shipOption/types';
import {
  CHECKOUT_HAD_SHIP_OPTION_AUTO_SELECTED,
  CONFIGURE_CHECKOUT_SUCCESS,
  RESET_CHECKOUT
} from 'store/ducks/checkout/types';
import { toUSD } from 'helpers/NumberFormats';
import {
  dateFromPromise,
  getEndDateFromRange,
  isBaseZapposShipping,
  isFreeHolidayShipping,
  isFreeShippingSpeed,
  isOneDayVipShippingPerk,
  isTwoDayPrimeShippingPerk,
  isZapposShipping
} from 'helpers/CheckoutUtils';
import { trackError } from 'helpers/ErrorUtils';
import { DIGITS, MONTHS } from 'common/regex';

const defaultState = {
  savedShipOptions: [],
  isLoading: false,
  isLoaded: false,
  hasNextWow: false,
  lineItemDeliveryOptions: []
};

export default function shipOptions(state = defaultState, action = {}) {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case CHECKOUT_HAD_SHIP_OPTION_AUTO_SELECTED: {
      return { ...state, hasAutoSelectedShipOption: true };
    }

    case SET_SHIP_OPTIONS_NOT_LOADED: {
      return { ...state, isLoaded: false };
    }

    case RESET_CHECKOUT: {
      return defaultState;
    }

    case CONFIGURE_CHECKOUT_SUCCESS: {
      const {
        purchaseStatus: {
          deliveryGroups: pceFallbackDeliveryGroups,
          purchaseId,
          shippingBenefitReason,
          shipmentSpeed,
          productList,
          groupDeliveryOptions
        }
      } = payload;

      const { groupDeliveryOptions: prevGroupDeliveryOptions } = state;

      let newState = state;
      if (groupDeliveryOptions) {
        const options = groupDeliveryOptions.find(item => item.deliveryOptions?.length) || { deliveryOptions: [] };
        const savedShipOptions = options.deliveryOptions;
        newState = {
          ...state,
          savedShipOptions,
          lineItemDeliveryOptions: groupDeliveryOptions,
          hasNextWow: checkForNextWow(savedShipOptions),
          isLoaded: !!groupDeliveryOptions?.length,
          isLoading: false,
          groupDeliveryOptions
        };
      }

      newState = { ...newState, changedPromiseDates: [] };
      newState = addFallbackFromPce(newState, pceFallbackDeliveryGroups);
      newState = conditionallyAddAddPromiseAndDuration(newState);
      newState = addDescriptionToLineItemDelivery(newState, shippingBenefitReason);
      newState = addPurchaseDeliveryToLineItemDelivery(newState, shippingBenefitReason, shipmentSpeed);
      newState = storePromiseDateHasChangedDexToDex(newState, prevGroupDeliveryOptions, purchaseId);
      newState = storeGroupDigitalDeliveryStatus(newState, productList);
      newState = filterShipOptions(newState);

      return newState;
    }

    case GET_SHIP_OPTION_LIST_SUCCESS: {
      return addSavedShipOptionsToState(state, payload);
    }

    default: {
      return state;
    }
  }
}

const MONTH_TO_NUMERIC_MAP = {
  'January': 1,
  'February': 2,
  'March': 3,
  'April': 4,
  'May': 5,
  'June': 6,
  'July': 7,
  'August': 8,
  'September': 9,
  'October': 10,
  'November': 11,
  'December': 12
};

// unfortunately, we do not have a YEAR on our promises - this means we can't say that a date in Jan is sooner than a date in Dec.  Current data is showing promises as far as 44 days out, so this represents a 2 month buffer for comparing against december promises.
const END_OF_YEAR_LONG_PROMISE_WINDOW = new Set([
  MONTH_TO_NUMERIC_MAP['January'],
  MONTH_TO_NUMERIC_MAP['February']
]);

const HIGHLIGHTED_SHIPPING_OPTION_MAP = {
  vip: {
    'next-business': true,
    'next': true
  },
  prime: {
    'second': true
  },
  base: {
    'next-wow': true,
    'std-us-non48': true
  },
  holiday: {
    'second': true,
    'next-business': true,
    'next': true
  }
};

export const getIsHighlighted = ({ shippingBenefitReason, shipmentSpeed }) => (isOneDayVipShippingPerk(shippingBenefitReason) && !!HIGHLIGHTED_SHIPPING_OPTION_MAP.vip[shipmentSpeed])
  || (isTwoDayPrimeShippingPerk(shippingBenefitReason) && !!HIGHLIGHTED_SHIPPING_OPTION_MAP.prime[shipmentSpeed])
  || (isFreeHolidayShipping(shippingBenefitReason) && shipmentSpeed !== 'next-wow')
  || (isBaseZapposShipping(shippingBenefitReason) && isFreeShippingSpeed(shipmentSpeed));

export const getLogo = ({ shippingBenefitReason, shipmentSpeed }) => {
  if (isOneDayVipShippingPerk(shippingBenefitReason) && !!HIGHLIGHTED_SHIPPING_OPTION_MAP.vip[shipmentSpeed]) {
    return 'vip';
  } else if (isTwoDayPrimeShippingPerk(shippingBenefitReason) && !!HIGHLIGHTED_SHIPPING_OPTION_MAP.prime[shipmentSpeed]) {
    return 'prime';
  } else if (isFreeHolidayShipping(shippingBenefitReason) && shipmentSpeed !== 'next-wow') {
    return 'holiday';
  } else if (isBaseZapposShipping(shippingBenefitReason) && isFreeShippingSpeed(shipmentSpeed)) {
    return 'zappos';
  }
  return false;
};

export const getDescription = ({ shippingBenefitReason, shipmentSpeed, price }) => {
  const isVipPerk = isOneDayVipShippingPerk(shippingBenefitReason);
  const isPrimePerk = isTwoDayPrimeShippingPerk(shippingBenefitReason);
  const isHolidayPerk = isFreeHolidayShipping(shippingBenefitReason);
  const isBasePerk = isBaseZapposShipping(shippingBenefitReason);
  const isZappos = isZapposShipping(shippingBenefitReason);

  if (isVipPerk && !!HIGHLIGHTED_SHIPPING_OPTION_MAP.vip[shipmentSpeed]) {
    return VIP_PERK_TEXT;
  } else if (isVipPerk && shipmentSpeed !== 'next-wow') {
    return VIP_NON_PERK_TEXT;
  } else if (isPrimePerk && !!HIGHLIGHTED_SHIPPING_OPTION_MAP.prime[shipmentSpeed]) {
    return PRIME_PERK_TEXT;
  } else if (isHolidayPerk && shipmentSpeed !== 'next-wow') {
    return HOLIDAY_PERK_TEXT;
  } else if (isBasePerk && isFreeShippingSpeed(shipmentSpeed)) {
    return BASE_PERK_TEXT;
  } else if (isZappos && isFreeShippingSpeed(shipmentSpeed)) {
    return BASE_NON_PERK_TEXT;
  } else if (price === 0) {
    return BASE_FREE_SHIPPING_TEXT;
  } else {
    return `${toUSD(price)} Paid Shipping`;
  }
};

export const getSelectedDescription = ({ isBusinessUnknown, shippingBenefitReason, shipmentSpeed, price }) => {
  if (isBusinessUnknown) {
    return;
  }

  const isVipPerk = isOneDayVipShippingPerk(shippingBenefitReason);
  const isPrimePerk = isTwoDayPrimeShippingPerk(shippingBenefitReason);
  const isHolidayPerk = isFreeHolidayShipping(shippingBenefitReason);
  const isZappos = isZapposShipping(shippingBenefitReason);

  if (isVipPerk && shipmentSpeed !== 'next-wow') {
    return VIP_NON_PERK_TEXT;
  } else if (isPrimePerk && shipmentSpeed === 'second') {
    return PRIME_NON_PERK_TEXT;
  } else if (isHolidayPerk && shipmentSpeed !== 'next-wow') {
    return HOLIDAY_NON_PERK_TEXT;
  } else if (isZappos && (isFreeShippingSpeed(shipmentSpeed))) {
    return BASE_NON_PERK_TEXT;
  } else if (price === 0) {
    return BASE_FREE_SHIPPING_TEXT;
  } else {
    return `${toUSD(price)} Paid Shipping`;
  }
};

export function storeGroupDigitalDeliveryStatus(state, productList) {
  if (!productList?.length) {
    return state;
  }

  const { lineItemDeliveryOptions } = state;
  const transformedLineItemDeliveryOptions = [];

  lineItemDeliveryOptions.forEach(item => {
    const { lineItemIds } = item;

    if (lineItemIds.length > 1) {
      transformedLineItemDeliveryOptions.push({
        ...item,
        isDigitalDelivery: false
      });
    } else {
      const isDigitalDelivery = !!productList.find(li => li.lineItemId === lineItemIds[0])?.gcCustomization;
      transformedLineItemDeliveryOptions.push({
        ...item,
        isDigitalDelivery
      });
    }
  });

  return { ...state, lineItemDeliveryOptions: transformedLineItemDeliveryOptions };
}

export function getPromiseForLineItemIdKeyAndOptionName(pceFallbackDeliveryGroups, lineItemIdKey, optionName) {
  const { deliveryOption = {} } = pceFallbackDeliveryGroups.find(({ lineItemIds, deliveryOption: { name } }) => {
    const tempLineItemIdKey = lineItemIds.sort().join('');
    if (lineItemIdKey === tempLineItemIdKey && name === optionName) {
      return true;
    }
  }) || {};

  return deliveryOption;
}

export function addFallbackFromPce(state, pceFallbackDeliveryGroups) {
  try {
    const { lineItemDeliveryOptions } = state;
    const collection = [];
    lineItemDeliveryOptions.forEach(item => {
      const { deliveryOptions = [], lineItemIds } = item; // eGC has no deliveryOptions
      const mappedOptions = deliveryOptions.map(option => {
        let fallback;
        let fallbackOptionPromise = option.promise;
        if (!option.deliveryPromise) {
          const lineItemIdKey = lineItemIds.sort().join('');
          fallback = getPromiseForLineItemIdKeyAndOptionName(pceFallbackDeliveryGroups, lineItemIdKey, option.name);
        }
        if (!fallbackOptionPromise) {
          const lineItemIdKey = lineItemIds.sort().join('');
          const { promise } = getPromiseForLineItemIdKeyAndOptionName(pceFallbackDeliveryGroups, lineItemIdKey, option.name);
          fallbackOptionPromise = promise;
        }
        const { deliveryPromise = { displayString: '' }, deliveryDuration = { displayString: '' } } = fallback ? fallback : option;
        return { ...option, deliveryPromise, deliveryDuration, promise: fallbackOptionPromise };
      });
      collection.push({ ...item, deliveryOptions: mappedOptions });
    });

    return { ...state, lineItemDeliveryOptions: collection };
  } catch (e) {
    trackError('NON-FATAL', 'Could not addFallbackFromPce', e);
    return state;
  }
}

export function conditionallyAddAddPromiseAndDuration(state) {
  const { lineItemDeliveryOptions } = state;
  const collection = [];

  lineItemDeliveryOptions.forEach(item => {
    const { deliveryOptions = [] } = item; // eGC has no deliveryOptions
    const mappedOptions = deliveryOptions.map(option => {
      const { deliveryPromise = { displayString: '' }, deliveryDuration = { displayString: '' } } = option;
      return { ...option, deliveryPromise, deliveryDuration };
    });
    collection.push({ ...item, deliveryOptions: mappedOptions });
  });

  return { ...state, lineItemDeliveryOptions: collection };
}

/*
  This generates the content for the box that appears above the ship options, ie, the perk box
*/
export function addPurchaseDeliveryToLineItemDelivery(state, shippingBenefitReason, shipmentSpeed) {
  const { lineItemDeliveryOptions } = state;
  const isHighlighted = getIsHighlighted({ shippingBenefitReason, shipmentSpeed });
  const logo = getLogo({ shippingBenefitReason, shipmentSpeed });
  const collection = [];

  lineItemDeliveryOptions.forEach(item => {
    const { deliveryOptions } = item;
    const option = deliveryOptions.find(option => option.name === shipmentSpeed) || { deliveryPromise: { displayString: 'Delivery' } };
    const { deliveryPromise: { displayString }, price } = option;
    const purchaseDelivery = {
      isHighlighted,
      logo,
      promise: getEndDateFromRange(dateFromPromise(displayString)),
      description: displayString ? getDescription({ shippingBenefitReason, shipmentSpeed, price }) : BUSINESS_UNKNOWN_PERK_TEXT
    };
    collection.push({ ...item, purchaseDelivery });
  });

  return { ...state, lineItemDeliveryOptions: collection };
}

const addDescriptionToLineItemDelivery = (newState, shippingBenefitReason) => {
  const { lineItemDeliveryOptions } = newState;

  const transformedLineItemDeliveryOptions = [];

  lineItemDeliveryOptions.forEach(({ deliveryOptions, lineItemIds }) => {
    const transformedDeliveryOptions = [...deliveryOptions].map(option => {
      const { price, name, deliveryPromise: { isBusinessUnknown } } = option;
      const description = getSelectedDescription({ isBusinessUnknown, shippingBenefitReason, shipmentSpeed: name, price });
      return { ...option, description };
    });
    transformedLineItemDeliveryOptions.push({ deliveryOptions: transformedDeliveryOptions, lineItemIds });
  });

  return { ...newState, lineItemDeliveryOptions: transformedLineItemDeliveryOptions };
};

export function determinePromiseChanges(previous, current, purchaseId, type) {
  const changedPromiseDates = [];

  try {
    // for prev, we only want to track that it does not exist in current
    previous.forEach(group => {
      const { lineItemIds, deliveryOptions: prevDeliveryOptions } = group;
      const lineItemKey = lineItemIds.sort().join('');

      prevDeliveryOptions.forEach(option => {
        const {
          name,
          deliveryPromise: { displayString } = { displayString: '' },
          deliveryDuration: { displayString: duration } = { displayString: '' }
        } = option;

        const currentGroup = current.find(el => el.lineItemIds.sort().join('') === lineItemKey);
        const currentOption = currentGroup?.deliveryOptions.find(el => el.name === name);

        if (!currentOption) {
          changedPromiseDates.push({
            name,
            duration,
            prevPromiseDate: displayString,
            promiseDate: 'Option existed in prev but not current',
            purchaseId,
            sameOtherThanType: false,
            type
          });
        }
      });
    });

    // for each current ship option, capture differences
    current.forEach(group => {
      const { lineItemIds, deliveryOptions: nextDeliveryOptions } = group;
      const lineItemKey = lineItemIds.sort().join('');

      nextDeliveryOptions.forEach(option => {
        const {
          name,
          deliveryPromise: { displayString } = { displayString: '' },
          deliveryDuration: { displayString: duration } = { displayString: '' }
        } = option;

        const prevGroup = previous.find(el => el.lineItemIds.sort().join('') === lineItemKey);
        const prevOption = prevGroup?.deliveryOptions.find(el => el.name === name);

        if (prevOption) {
          const prevDisplayString = prevOption.deliveryPromise?.displayString || '';
          const strippedPromise = dateFromPromise(displayString);
          const strippedPrevDisplayString = dateFromPromise(prevDisplayString);
          if (displayString !== prevDisplayString) {
            changedPromiseDates.push({
              name,
              duration,
              prevPromiseDate: prevDisplayString,
              promiseDate: displayString,
              purchaseId,
              sameOtherThanType: strippedPromise === strippedPrevDisplayString,
              type
            });
          }
        } else {
          changedPromiseDates.push({
            name,
            duration,
            prevPromiseDate: 'Option existed in current but not previous',
            promiseDate: displayString,
            purchaseId,
            sameOtherThanType: false,
            type
          });
        }
      });
    });
  } catch (error) {
    trackError('NON-FATAL', 'Could not determine if promise data changed', error);
  }
  return changedPromiseDates;
}

export function storePromiseDateHasChangedDexToDex(state, prevGroupDeliveryOptions, purchaseId) {
  const { groupDeliveryOptions, changedPromiseDates = [] } = state;

  if (!prevGroupDeliveryOptions?.length || !groupDeliveryOptions?.length) {
    return state;
  }

  const changes = determinePromiseChanges(prevGroupDeliveryOptions, groupDeliveryOptions, purchaseId, 'DEX_TO_DEX');

  return { ...state, changedPromiseDates: [...changedPromiseDates, ...changes] };
}

export const checkForNextWow = savedShipOptions => !!savedShipOptions?.find(item => item.name === 'next-wow');

export function filterShipOptions(state) {
  const { lineItemDeliveryOptions } = state;
  const filteredLineItemDeliveryOptions = [];

  if (!lineItemDeliveryOptions?.length) {
    return state;
  }

  try {
    lineItemDeliveryOptions.forEach(lineItemDelivery => {
      const { deliveryOptions, isDigitalDelivery } = lineItemDelivery;

      if (isDigitalDelivery) {
        filteredLineItemDeliveryOptions.push(lineItemDelivery);
        return { ...state, lineItemDeliveryOptions: filteredLineItemDeliveryOptions };
      }

      const nextWowOption = deliveryOptions.find(option => option.name === 'next-wow');
      const nextBusinessOption = deliveryOptions.find(option => option.name === 'next-business');
      const secondOption = deliveryOptions.find(option => option.name === 'second');
      const nextOption = deliveryOptions.find(option => option.name === 'next');

      if (!nextWowOption || !nextBusinessOption || !secondOption) {
        // we are only considering base case where zappos customer has at least the 3 standard options
        filteredLineItemDeliveryOptions.push(lineItemDelivery);
        return { ...state, lineItemDeliveryOptions: filteredLineItemDeliveryOptions };
      }

      const nextWowPromise = getEndDateFromRange(dateFromPromise(nextWowOption.deliveryPromise?.displayString));
      const nextBusinessPromise = getEndDateFromRange(dateFromPromise(nextBusinessOption.deliveryPromise?.displayString));
      const secondPromise = getEndDateFromRange(dateFromPromise(secondOption.deliveryPromise?.displayString));
      const nextPromise = !!nextOption && getEndDateFromRange(dateFromPromise(nextOption.deliveryPromise?.displayString));

      const nextBusinessPrice = nextBusinessOption.price;
      const nextPrice = nextOption?.price;
      const secondPrice = secondOption.price;

      const filteredOptions = [];
      const filteredShipSpeeds = [];

      const areAllOptionsSamePromise = (deliveryOptions.length === 3 && (nextWowPromise === nextBusinessPromise && nextWowPromise === secondPromise))
        || (deliveryOptions.length === 4 && (nextWowPromise === nextBusinessPromise && nextWowPromise === secondPromise && nextWowPromise === nextPromise));

      const isNextFiltered = !!nextPromise && (isPromiseSameOrFasterThan(secondPromise, nextPromise)
        || isPromiseSameOrFasterThan(nextBusinessPromise, nextPromise)
        || areAllOptionsSamePromise)
        || (!nextPromise && !nextBusinessPromise);

      const isNextBusinessFiltered = !!nextBusinessPromise && (isPromiseSameOrFasterThan(secondPromise, nextBusinessPromise)
        || (!isNextFiltered && isPromiseSameOrFasterThan(nextPromise, nextBusinessPromise))
        || areAllOptionsSamePromise);

      const isSecondFiltered = !!secondPromise && ((!isNextBusinessFiltered && isPromiseSameOrFasterThan(nextBusinessPromise, secondPromise) && secondPrice === nextBusinessPrice)
        || (!isNextFiltered && isPromiseSameOrFasterThan(nextPromise, secondPromise) && secondPrice === nextPrice)
        || areAllOptionsSamePromise);

      filteredOptions.push(
        { ...nextWowOption, isFiltered: false },
        { ...secondOption, isFiltered: isSecondFiltered },
        { ...nextBusinessOption, isFiltered: isNextBusinessFiltered }
      );

      if (nextOption) {
        filteredOptions.push({ ...nextOption, isFiltered: isNextFiltered });
      }

      if (isNextFiltered) {
        filteredShipSpeeds.push('next');
      }

      if (isNextBusinessFiltered) {
        filteredShipSpeeds.push('next-business');
      }

      if (isSecondFiltered) {
        filteredShipSpeeds.push('second');
      }

      filteredLineItemDeliveryOptions.push({ ...lineItemDelivery, deliveryOptions: filteredOptions, filteredShipSpeeds });
    });
  } catch (e) {
    return state;
  }

  return { ...state, lineItemDeliveryOptions: filteredLineItemDeliveryOptions };
}

const getMonthFromPromise = promise => (promise ? promise.match(MONTHS) : '');

const getDayFromPromise = promise => (promise ? parseInt(promise.match(DIGITS)[0], 10) : '');

export const isPromiseSameOrFasterThan = (promise1, promise2) => {
  if (!promise1 || !promise2) {
    return false;
  }

  const month1 = getMonthFromPromise(promise1);
  const day1 = getDayFromPromise(promise1);

  const month2 = getMonthFromPromise(promise2);
  const day2 = getDayFromPromise(promise2);

  if (MONTH_TO_NUMERIC_MAP[month1] === 12 && END_OF_YEAR_LONG_PROMISE_WINDOW.has(MONTH_TO_NUMERIC_MAP[month2])) {
    return true;
  }

  if (END_OF_YEAR_LONG_PROMISE_WINDOW.has(MONTH_TO_NUMERIC_MAP[month1]) && MONTH_TO_NUMERIC_MAP[month2] === 12) {
    return false;
  }

  if (MONTH_TO_NUMERIC_MAP[month1] < MONTH_TO_NUMERIC_MAP[month2]) {
    return true;
  }

  if (MONTH_TO_NUMERIC_MAP[month1] > MONTH_TO_NUMERIC_MAP[month2]) {
    return false;
  }

  return day1 <= day2;
};
