import { types as CardType } from 'credit-card-type';
import queryString from 'query-string';

import {
  CANCELLED,
  COMPLETED,
  CS_CANCELLED,
  CS_COMPLETED,
  CS_CUSTOMER_ACTION_REQUIRED,
  CS_DECLINED,
  CS_DECLINED_CANCELLED,
  CS_DELIVERY_MISTAKE,
  CS_PROCESSING,
  CS_RETURN_IN_PROGESS,
  CS_RETURNED,
  CS_RETURNING,
  CS_SHIPPED,
  CS_SUBMITTED,
  CUSTOMER_ACTION_REQUIRED,
  DECLINED,
  DECLINED_ALT,
  DECLINED_CANCELLED,
  DELIVERY_MISTAKE,
  PROCESSING,
  RETURNED,
  RETURNING,
  RETURNING_ALT,
  SHIPPED,
  SUBMITTED
} from 'constants/orderStatuses';
import {
  AVAILABLE_FOR_PICKUP,
  CS_AVAILABLE_FOR_PICKUP,
  CS_DELAYED,
  CS_DELIVERED,
  CS_DELIVERY_ATTEMPTED,
  CS_IN_TRANSIT,
  CS_OUT_FOR_DELIVERY,
  CS_RETURNED_TO_SELLER,
  CS_RETURNING_TO_SELLER,
  CS_SHIPPING_SOON,
  CS_UNDELIVERABLE,
  DELAYED,
  DELIVERED,
  DELIVERY_ATTEMPTED,
  IN_TRANSIT,
  OUT_FOR_DELIVERY,
  RETURNED as SHIPPING_RETURNED,
  RETURNING as SHIPPING_RETURNING,
  SHIPPING_SOON,
  UNDELIVERABLE
} from 'constants/shippingStatuses';
import {
  CS_DROPOFF_PENDING,
  CS_PICKUP_SCHEDULED,
  CS_PROCESSING_RETURN,
  CS_RETURNED_TO_ZAPPOS,
  CS_RETURNING_TO_ZAPPOS,
  DROPOFF_PENDING,
  PICKUP_SCHEDULED,
  PROCESSING_RETURN,
  RETURNED_TO_ZAPPOS,
  RETURNING_TO_ZAPPOS
} from 'constants/returnTrackingStatuses';

export const RETURN_STATUSES = [RETURNING, RETURNED, RETURNING_ALT, SHIPPING_RETURNING, SHIPPING_RETURNED, DROPOFF_PENDING,
  RETURNED_TO_ZAPPOS, RETURNING_TO_ZAPPOS, PICKUP_SCHEDULED, PROCESSING_RETURN];
export const CANCEL_STATUSES = [CANCELLED, DECLINED_CANCELLED, DECLINED, DECLINED_ALT, DELIVERY_MISTAKE, UNDELIVERABLE];
export const SHIPPED_STATUSES = [SHIPPED, IN_TRANSIT, DELAYED, OUT_FOR_DELIVERY, DELIVERY_ATTEMPTED, AVAILABLE_FOR_PICKUP, SHIPPING_SOON, CUSTOMER_ACTION_REQUIRED];
export const DELIVERED_STATUSES = [DELIVERED, COMPLETED];
export const LEGACY_ORDER_RETURN_STATUSES = [RETURNING, RETURNED];

const legacyStatusMap = {
  // Order Statuses
  [CS_SUBMITTED]: SUBMITTED,
  [CS_PROCESSING]: PROCESSING,
  [CS_DECLINED]: DECLINED,
  [CS_DECLINED_CANCELLED]: DECLINED_CANCELLED,
  [CS_CANCELLED]: CANCELLED,
  [CS_COMPLETED]: COMPLETED,
  [CS_SHIPPED]: SHIPPED,
  [CS_CUSTOMER_ACTION_REQUIRED]: CUSTOMER_ACTION_REQUIRED,
  [CS_DELIVERY_MISTAKE]: DELIVERY_MISTAKE,
  [CS_RETURN_IN_PROGESS]: RETURNING,
  [CS_RETURNED]: RETURNED,
  [CS_RETURNING]: RETURNING,
  // Shipping Statuses
  [CS_IN_TRANSIT]: IN_TRANSIT,
  [CS_DELAYED]: DELAYED,
  [CS_OUT_FOR_DELIVERY]: OUT_FOR_DELIVERY,
  [CS_DELIVERY_ATTEMPTED]: DELIVERY_ATTEMPTED,
  [CS_AVAILABLE_FOR_PICKUP]: AVAILABLE_FOR_PICKUP,
  [CS_DELIVERED]: DELIVERED,
  [CS_UNDELIVERABLE]: UNDELIVERABLE,
  [CS_RETURNED_TO_SELLER]: SHIPPING_RETURNED,
  [CS_RETURNING_TO_SELLER]: SHIPPING_RETURNING,
  [CS_SHIPPING_SOON]: SHIPPING_SOON,
  // Return Tracking Statuses
  [CS_DROPOFF_PENDING]: DROPOFF_PENDING,
  [CS_RETURNED_TO_ZAPPOS]: RETURNED_TO_ZAPPOS,
  [CS_RETURNING_TO_ZAPPOS]: RETURNING_TO_ZAPPOS,
  [CS_PICKUP_SCHEDULED]: PICKUP_SCHEDULED,
  [CS_PROCESSING_RETURN]: PROCESSING_RETURN
};

const compositeStatusMap = {
  // Order Statuses
  [SUBMITTED]: CS_SUBMITTED,
  [PROCESSING]: CS_PROCESSING,
  [DECLINED]: CS_DECLINED,
  [DECLINED_CANCELLED]: CS_DECLINED_CANCELLED,
  [CANCELLED]: CS_CANCELLED,
  [COMPLETED]: CS_COMPLETED,
  [SHIPPED]: CS_SHIPPED,
  [CUSTOMER_ACTION_REQUIRED]: CS_CUSTOMER_ACTION_REQUIRED,
  [DELIVERY_MISTAKE]: CS_DELIVERY_MISTAKE,
  [RETURNING]: CS_RETURN_IN_PROGESS,
  [RETURNED]: CS_RETURNED,
  [RETURNING]: CS_RETURNING,
  // Shipping Statuses
  [IN_TRANSIT]: CS_IN_TRANSIT,
  [DELAYED]: CS_DELAYED,
  [OUT_FOR_DELIVERY]: CS_OUT_FOR_DELIVERY,
  [DELIVERY_ATTEMPTED]: CS_DELIVERY_ATTEMPTED,
  [AVAILABLE_FOR_PICKUP]: CS_AVAILABLE_FOR_PICKUP,
  [DELIVERED]: CS_DELIVERED,
  [UNDELIVERABLE]: CS_UNDELIVERABLE,
  [SHIPPING_RETURNED]: CS_RETURNED_TO_SELLER,
  [SHIPPING_RETURNING]: CS_RETURNING_TO_SELLER,
  [SHIPPING_SOON]: CS_SHIPPING_SOON,
  // Return Tracking Statuses
  [DROPOFF_PENDING]: CS_DROPOFF_PENDING,
  [RETURNED_TO_ZAPPOS]: CS_RETURNED_TO_ZAPPOS,
  [RETURNING_TO_ZAPPOS]: CS_RETURNING_TO_ZAPPOS,
  [PICKUP_SCHEDULED]: CS_PICKUP_SCHEDULED,
  [PROCESSING_RETURN]: CS_PROCESSING_RETURN
};

export function getPaymentType(creditCardNumber) {
  switch (parseInt(creditCardNumber.slice(0, 1))) {
    case 3:
      return 'AmericanExpress';
    case 4:
      return 'Visa';
    case 5:
      return 'MasterCard';
    case 6:
      return 'Discover';
    default:
      return null;
  }
}

export function isCreditCardExpired(creditCard) {
  const currDate = new Date(Date.now());
  const expMonth = parseInt(creditCard.expirationMonth);
  const expYear = parseInt(creditCard.expirationYear);
  return expYear < currDate.getFullYear() || (expYear === currDate.getFullYear() && expMonth < currDate.getMonth() + 1);
}

export function formatCreditCardExpiration(expiration) {
  let [ month, year ] = expiration.split(/\W|\//);

  if (month.length === 1) {
    month = `0${month}`;
  }

  if (year.length === 2) {
    year = `20${year}`;
  }

  return {
    expirationMonth: month,
    expirationYear: year
  };
}

export function isExpirationDateValid(expMonth, expYear) {
  const today = new Date();
  const selectedDate = new Date();
  selectedDate.setFullYear(expYear, expMonth, 1);
  return selectedDate >= today;
}

export function formatCreditCard(number) {
  return number.replace(/\D/g, '');
}

export function hasTracking(order) {
  const { lineItems } = order;
  return lineItems.every(item => item?.shipment?.tracking?.events?.length);
}

export function hasOrderBeenShipped(lineItems) {
  return lineItems.every(({ state }) => state === SHIPPED || state === RETURNING || state === RETURNED || state === COMPLETED);
}

export function hasOrderBeenDelivered(lineItems) {
  return hasOrderBeenShipped(lineItems) && lineItems.every(({ state, shipment }) => {
    const { tracking } = shipment;
    return tracking.statusCode === DELIVERED || state === COMPLETED;
  });
}

export const hasShipmentBeenDelivered = status => DELIVERED_STATUSES.includes(status);

export const hasShipmentBeenShipped = status => SHIPPED_STATUSES.includes(status);

export function getCurrentShipment(shipmentId, shipments) {
  return shipments?.find(shipment => shipmentId === shipment.id) || {};
}

export function getShipmentsWithFilteredOutCompositeStatuses(shipments) {
  return shipments?.filter(({ compositeStatus }) => compositeStatus !== CS_CANCELLED);
}

// we will do some filtering on what is counted as a shipment
export function getTotalShipmentsNumber(shipments) {
  return getShipmentsWithFilteredOutCompositeStatuses(shipments)?.length;
}

export function getCurrentShipmentNumber(shipmentId, shipments) {
  return getShipmentsWithFilteredOutCompositeStatuses(shipments)?.findIndex(shipment => shipmentId === shipment.id) + 1;
}

export function getCurrentShipmentMessage(shipmentId, shipments) {
  return (getCurrentShipment(shipmentId, shipments))?.shipmentDisplayMessage;
}

// composite status represents
export function getLegacyStatusFromCompositeStatus(status) {
  return legacyStatusMap[status];
}

export function getCompositeStatusfromLegacyStatus(status) {
  return compositeStatusMap[status];
}

/*
  With the release of the exchange feature, an order will not be cancellable
  by the customer - but still is by the CLT - if it is
  generated by an exchange. The new flag 'isCustomerCancellable', will
  support that business rule.
  But we keep the possibility to use the old flags by default.
*/
export function isOrderCancellable(lineItems, doesUseNewFlags = false) {
  return doesUseNewFlags ?
    lineItems.some(lineItem => lineItem.customerCancellable)
    :
    lineItems.some(lineItem => lineItem.cancellable);
}

export function isOrderExchangeable(lineItems) {
  return lineItems.some(lineItem => lineItem.exchangeable);
}

/*
  With the release of the exchange feature, an order will not be returnable
  by the customer - but still is by the CLT - if it is
  generated by an exchange. The new flag 'isCustomerReturnable', will
  support that business rule.
  But we keep the possibility to use the old flags by default.
*/
export function isOrderReturnable(lineItems, doesUseNewFlags = false) {
  return doesUseNewFlags ?
    lineItems.some(lineItem => lineItem.customerReturnable)
    :
    lineItems.some(lineItem => lineItem.returnable);
}

export function extractReturnableOrders(orders, doesUseNewFlag = false) {
  return orders.filter(order => isOrderReturnable(order.lineItems, doesUseNewFlag));
}

export function isLineItemReturnable(lineItem, doesUseNewFlags = false) {
  return doesUseNewFlags ?
    lineItem.customerReturnable
    :
    lineItem.returnable;
}

export function isOrderGeneratedByExchange(order) {
  return !!order.exchangeOrder;
}

export function isOrderContainingShipped(lineItems) {
  return lineItems.some(({ state }) => state === SHIPPED);
}

export function reverseReturnUrlLookup(url) {
  if (/^\/addresses$/.test(url)) {
    return 'Shipping Information';
  } else if (/^\/addresses\/new$/.test(url)) {
    return 'Add New Address';
  } else if (/^\/payments$/.test(url)) {
    return 'Manage Payments';
  } else if (/^\/payments\/new$/.test(url)) {
    return 'Add New Payment';
  } else if (/^\/payments\/[a-zA-Z0-9-_]+\/edit$/.test(url)) {
    return 'Edit Payment Method';
  } else if (/^\/orders\/[a-zA-Z0-9-_]+$/.test(url)) {
    return 'Order Information';
  }
}

export function normalizePaymentType(paymentType) {
  switch (paymentType) {
    case 'Visa':
      return CardType.VISA;
    case 'MasterCard':
      return CardType.MASTERCARD;
    case 'Discover':
      return CardType.DISCOVER;
    case 'AmericanExpress':
      return CardType.AMERICAN_EXPRESS;
  }
}

export function generateProductUrl(product, isLegacy) {
  const { asin, productUrl } = product;
  if (isLegacy) {
    return productUrl;
  } else {
    return `/p/asin/${asin}`;
  }
}

export function isItemInReturnState(itemState) {
  return RETURN_STATUSES.includes(itemState);
}

export function isItemInCancelState(itemState) {
  return CANCEL_STATUSES.includes(itemState);
}

/* query-string library not correctly parsing '+' symbol and sending spaces for subscriptions endpoint */
export function replaceAuthTokenSpace(authToken) {
  if (authToken) {
    return authToken.split(' ').join('+');
  }
}

/*
  Generates unique ids for each lineItem and assigns them.

  The ids have the following format:
  - {order id}-{returnable-fingerprint}-{item code}-{index}

  Example:
  - 113-5838898-9370642-r-21136263204721-0

  {returnable-fingerprint} specifies whether the item is (r)eturnable.
  In the example above, '-r-' means the item is indeed returnable.

  {index} differentiates between two or more line items with
  identical order ids, attributes and codes.
*/
export function injectUniqueIdsToLineItems({ orderId, lineItems = [] }) {
  const idSuffixes = {};
  return lineItems.map(lineItem => {
    const { id: lineItemId, returnable } = lineItem;
    const returnableFingerPrint = returnable ? '-r' : '';
    const idPrefix = `${orderId}${returnableFingerPrint}-${lineItemId}`;
    idSuffixes[idPrefix] = idSuffixes[idPrefix] || 0;
    const idSuffix = idSuffixes[idPrefix]++;
    return {
      ...lineItem,
      itemUniqueId: `${idPrefix}-${idSuffix}`
    };
  });
}

/* Combine info from fetchShipmentTracking call with order data in state */
export function injectTrackingToLineItems({ lineItems }, trackingInfo) {
  const updatedLineItems = [];
  lineItems.forEach(lineItem => {
    const lineItemCopy = Object.assign({}, lineItem);
    const { shipment: { id } } = lineItem;
    trackingInfo.forEach(info => {
      const { id: trackingInfoShipmentId } = info;
      if (id === trackingInfoShipmentId) {
        lineItemCopy.shipment = info;
      }
    });
    updatedLineItems.push(lineItemCopy);
  });
  return updatedLineItems;
}

export function getAsinFromProductUrl(productUrl) {
  if (productUrl && productUrl.includes('asin')) {
    return productUrl.split(/\/asin\//)[1];
  }
  return null;
}

export function getOrderAddress(orderShippingAddress, shipping) {
  const { addressId: orderAddressId } = orderShippingAddress || {};
  const { addresses: customerAddresses } = shipping;
  if (!customerAddresses?.length) {
    return orderShippingAddress;
  }

  const matchedAddress = customerAddresses.find(customerAddress => customerAddress.addressId === orderAddressId);

  if (matchedAddress) {
    return orderShippingAddress;
  }

  let defaultAddress = customerAddresses.find(customerAddresses => customerAddresses.isDefaultShippingAddress);

  if (!defaultAddress) {
    defaultAddress = customerAddresses[0];
  }

  const {
    addressId,
    mailingAddress: {
      addressLine1,
      addressLine2,
      city,
      countryCode,
      countryName,
      postalCode,
      stateOrRegion
    },
    name: {
      fullName
    },
    isDefaultShippingAddress,
    phone: { voice: { primary: { number } } }
  } = defaultAddress;

  return {
    addressId: addressId,
    addressLine1: addressLine1,
    addressLine2: addressLine2,
    city: city,
    countryCode: countryCode,
    countryName: countryName,
    fullName: fullName,
    phoneNumber: number,
    postalCode: postalCode,
    primaryShippingAddress: isDefaultShippingAddress,
    stateOrRegion: stateOrRegion
  };
}

export function makeShipmentStatusEvent(order) {
  const { shipments = [], orderId } = order || {};

  // return all shipment statuses of an order
  return shipments.map(shipment => {
    const {
      id: shipmentId,
      compositeStatus
    } = shipment || {};

    return {
      orderId,
      shipmentId,
      compositeStatus
    };
  });
}

export const getPaginationInformation = search => {
  const queryParams = queryString.parse(search);
  const { page, pageSize } = queryParams;
  return {
    currentPage: parseInt(page, 10) || 1,
    pageSize
  };
};

export function applyReturnTrackingStatusToLegacyStatus(status, returnTrackingStatus) {
  if (LEGACY_ORDER_RETURN_STATUSES.includes(status)) {
    return getReturnStatusFromReturnTrackingInfo(returnTrackingStatus);
  } else {
    return status;
  }
}

export function applyReturnTrackingStatusToCompositeStatus(compositeStatus, returnTrackingStatus) {
  const status = getLegacyStatusFromCompositeStatus(compositeStatus);
  if (LEGACY_ORDER_RETURN_STATUSES.includes(status)) {
    const convertedStatus = getReturnStatusFromReturnTrackingInfo(returnTrackingStatus);
    return convertedStatus ? getCompositeStatusfromLegacyStatus(convertedStatus) : null;
  } else {
    return compositeStatus;
  }
}

// takes the lower end of the estimate on number of orders
export function calculateEstimatedOrderTotal(pageSize, totalPages, numberOfOrdersOnFirstPage) {
  if (totalPages > 1) { // use orders if totalPages === 1;
    return pageSize ? (totalPages - 1) * pageSize + 1 : (totalPages - 1) * 10 + 1;
  } else {
    return numberOfOrdersOnFirstPage;
  }
}

export function getReturnStatusFromReturnTrackingInfo(returnTrackingInfo) {
  switch (returnTrackingInfo) {
    case 'DROPOFF_PENDING': return DROPOFF_PENDING;
    case 'PICKUP_SCHEDULED': return PICKUP_SCHEDULED;
    case 'PICKUP_FAILED':
    case 'NO_TRACKING_DATA': return CUSTOMER_ACTION_REQUIRED;
    case 'RETURNING': return RETURNING_TO_ZAPPOS;
    case 'PROCESSING': return PROCESSING_RETURN;
    case 'PROCESSED':
    case 'REFUNDED': return RETURNED_TO_ZAPPOS;
    default: return null;
  }
}
