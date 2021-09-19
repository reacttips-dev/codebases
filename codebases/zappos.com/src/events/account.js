import { createProductIdentifiersProto, getAmethystPageType } from 'helpers/analytics';
import { getCompositeStatusfromLegacyStatus, makeShipmentStatusEvent } from 'helpers/MyAccountUtils';
import { myAccountLinkMap, PRODUCT_LINK_TYPE } from 'constants/amethystEnums';
import { middlewareTrack } from 'apis/amethyst';
import {
  REQUEST_REDEEM_GIFT_CARD
} from 'constants/reduxActions';

// As defined here: https://code.amazon.com/packages/AmethystEvents/blobs/e82c1c5363418a1dcb2269219999ee5d88384ac1/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L40
const amethystCancellationReasonCodes = {
  'no-reason': 0,
  'no-longer-want': 1,
  'too-late': 2,
  'duplicate-order': 3,
  'wrong-item': 4
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/OrderDetailPageView.proto
export const pvOrderDetail = ({ order, emailCampaign }) => {
  const { lineItems } = order;

  const shipmentStatus = makeShipmentStatusEvent(order);
  return {
    orderDetailPageView: {
      orderedItems: createProductIdentifiersProto(lineItems),
      shipmentStatus,
      emailCampaign
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddAddressClick.proto
export const evAddAddressClick = ({ addressType }) => ({
  addAddressClick: {
    addressType
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddPaymentInstrumentClick.proto
export const evAddPaymentInstrumentClick = ({ sourcePage }) => ({
  addPaymentInstrumentClick: { // https://code.amazon.com/packages/AmethystEvents/blobs/5adec2785fb8813a769db8ec29692d7f353486f2/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L74
    sourcePage // 7 for regular MyAccount Payments page; 9 for Order Care (order detail)
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CancelCheckedItemsClick.proto
export const evCancelCheckedItemsClick = ({ orderId, items }) => ({
  cancelCheckedItemsClick: {
    amazonOrderId: orderId,
    productIdentifiers: createProductIdentifiersProto(items)
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CancellationReasonSelection.proto
export const evCancellationReasonSelection = ({ orderId, lineItem, reason }) => {
  const { product: { asin, productId, styleId, stockId } } = lineItem;
  return {
    cancellationReasonSelection: {
      productIdentifiers: {
        asin,
        productId,
        styleId,
        stockId
      },
      amazonOrderId: orderId,
      cancellationReason: amethystCancellationReasonCodes[reason]
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/EditAddressClick.proto
export const evEditAddressClick = ({ addressType, addressIndex, addressId }) => ({
  editAddressClick: {
    addressType,
    addressIndex,
    addressId
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SubmitCancellationClick.proto
export const evSubmitCancellationClick = () => ({
  submitCancellationClick: {}
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CancellationConfirmationPageView.proto
export const pvCancellationConfirmationPageView = ({ items, amazonOrderId }) => ({
  cancellationConfirmationPageView: {
    itemsToCancel: createProductIdentifiersProto(items),
    amazonOrderId
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddOrEditAddress.proto
export const evAddOrEditAddress = ({ valid, addressId, addressType }) => ({
  addOrEditAddress: {
    passedValidation: valid,
    addressId,
    addressType
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/DeleteAddress.proto
export const evDeleteAddress = ({ addressId, addressType, sourcePage }) => ({
  deleteAddress: {
    addressId,
    addressType,
    sourcePage
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddPaymentInstrument.proto
export const evAddPaymentInstrument = ({ valid, paymentInstrumentId, isPrimarySuccess }) => ({
  addPaymentInstrument: {
    passedValidation: valid,
    paymentInstrumentId,
    makeDefaultPaymentInstrument: isPrimarySuccess
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SearchOrders.proto
export const evTrackOrderHistorySearch = ({ keyword, sourcePage }) => ({
  searchOrders: {
    keyword,
    sourcePage
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/MyAccountPageView.proto
export const evMyAccountPageView = ({ payment, shipping, orders, rewardsInfo, estimatedTotalOrders }) => {
  const { paymentInstruments } = payment;
  const { addresses } = shipping;
  const { enrolled, consented } = rewardsInfo;

  const hasPrimaryAddress = Boolean(paymentInstruments.find(instrument => instrument.primary) || paymentInstruments[0]);
  const hasPrimaryPayment = Boolean(addresses.find(address => address.isDefaultShippingAddress) || addresses[0]);
  const numberOfOrders = orders.length;
  const isVip = enrolled && consented;

  return ({
    myAccountPageView: {
      hasPrimaryPayment,
      hasPrimaryAddress,
      isVip,
      numberOfOrders,
      estimatedTotalOrders
    }
  })
  ;
};

export const evOrderHistoryPageView = ({ numberOfOrders, estimatedTotalOrders }) => ({
  orderHistoryPageView: {
    numberOfOrders,
    estimatedTotalOrders
  }
});

export const evAddressesPageView = ({ numberOfAddresses, hasDefaultShippingAddress }) => ({
  addressesPageView: {
    numberOfAddresses,
    hasDefaultShippingAddress
  }
});

export const evPaymentsPageView = ({ numberOfPaymentInstruments, hasDefaultPaymentInstrument }) => ({
  paymentsPageView: {
    numberOfPaymentInstruments,
    hasDefaultPaymentInstrument
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/OrderNumberClick.proto
export const evOrderNumberClick = ({ orderId, totalItems, pageNumber, sourcePage, itemIndex, orderIndex, linkType }) => ({
  orderNumberClick: {
    linkType,
    orderId,
    totalItems,
    pageNumber,
    sourcePage,
    itemIndex,
    orderIndex
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/OrderStatusHover.proto
export const evOrderStatusHover = ({ orderStatus, sourcePage }) => ({
  orderStatusHover: {
    shipmentStatus: {
      compositeStatus: getCompositeStatusfromLegacyStatus(orderStatus)
    },
    sourcePage
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/PaginationClick.proto
export const evPaginationClick = ({ currentPage, nextPage, sourcePage }) => ({
  paginationClick: {
    currentPage,
    nextPage,
    sourcePage
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/PaginationResultsPerPageUpdate.proto
export const evPaginationResultsPerPageUpdate = ({ newAmount, currentAmount, sourcePage }) => ({
  paginationResultsPerPageUpdate: {
    newAmount,
    currentAmount,
    sourcePage: getAmethystPageType(sourcePage)
  }
});

export const evOrderHistoryActionClick = ({ product, orderHistoryActionType, sourcePage }) => {
  const { asin, productId, styleId, stockId } = product;
  return ({
    orderHistoryActionClick: {
      productIdentifiers: {
        asin,
        productId,
        styleId,
        stockId
      },
      orderHistoryActionType,
      sourcePage
    }
  });
};

export const evTrackAccountClick = ({ clickType, sourcePage }) => {
  switch (clickType) {
    case myAccountLinkMap.MANAGE_MY_ADDRESSES_CLICK:
      return {
        manageMyAddressesClick: {}
      };
    case myAccountLinkMap.MANAGE_MY_PAYMENT_CLICK:
      return {
        manageMyPaymentClick: {}
      };
    case myAccountLinkMap.RETURN_ITEMS_CLICK:
      return {
        returnItemsButtonClick: {
          sourcePage
        }
      };
    case myAccountLinkMap.MANAGE_AD_PREFERENCES_CLICK:
      return {
        manageAdPreferencesClick: {}
      };
    case myAccountLinkMap.MANAGE_EMAIL_PREFERENCES_CLICK:
      return {
        manageEmailPreferencesClick: {}
      };
    case myAccountLinkMap.VIEW_VIP_DASHBOARD_CLICK:
      return {
        myAccountVipDashboardLinkClick: {}
      };
    case myAccountLinkMap.VIEW_VIP_INFORMATION_CLICK:
      return {
        myAccountVipTermsLinkClick: {}
      };
    case myAccountLinkMap.MANAGE_ACCOUNT_INFORMATION_CLICK:
      return {
        manageAccountInformationClick: {}
      };
    case myAccountLinkMap.RETURN_POLICY_CLICK:
      return {
        myAccountReturnPolicyLinkClick: {}
      };
  }
};

export const evOrderDetailShipmentClick = ({ order, shipmentId, compositeStatus }) => {
  const { orderId } = order;

  return {
    orderDetailShipmentClick: {
      shipmentStatuses: [{
        orderId,
        shipmentId,
        compositeStatus
      }]
    }
  };
};

export const evOrderHistoryShipmentClick = ({ order, shipmentId, compositeStatus }) => {
  const { orderId } = order;

  return {
    orderHistoryShipmentClick: {
      shipmentStatus: {
        orderId,
        shipmentId,
        compositeStatus
      }
    }
  };
};

export const evOrderHistoryTrackingClick = ({ orderId, shipmentId, compositeStatus, sourcePage }) => ({
  orderHistoryTrackingClick: {
    shipmentStatus: {
      orderId,
      shipmentId,
      compositeStatus
    },
    sourcePage
  }
});

export const evProductClickThrough = ({ product, productLinkType = PRODUCT_LINK_TYPE.UNKNOWN_PRODUCT_LINK_TYPE, sourcePage }) => {
  const { asin, productId, styleId, colorId, stockId } = product;
  return {
    productClickthrough: {
      productLinkType,
      clickedProduct: {
        asin,
        productId,
        styleId,
        colorId,
        stockId
      },
      sourcePage
    }
  };
};

export const evRecentOrderItemClick = ({ order, lineItem }) => {
  const { orderId, shipments } = order;
  const {
    id: lineItemId,
    shipment: { id: shipmentId, compositeStatus }
  } = lineItem;

  return {
    recentOrderItemClick: {
      orderId,
      shipmentId,
      compositeStatus,
      lineItemId,
      numberOfShipments: shipments.length
    }
  };
};

export const evRecentOrderTrackingClick = ({ order, shipmentId, compositeStatus }) => {
  const { orderId } = order;

  return {
    recentOrderTrackingClick: {
      shipmentStatus: {
        orderId,
        shipmentId,
        compositeStatus
      }
    }
  };
};

export const evDeletePaymentOption = ({ paymentInstrumentId, sourcePage }) => ({
  deletePaymentOption: {
    paymentInstrumentId,
    sourcePage
  }
});

export const evEditPaymentClick = ({ paymentInstrumentId }) => ({
  editPaymentClick: {
    paymentInstrumentId
  }
});

export const evMakePaymentOptionPrimary = ({ paymentInstrumentId }) => ({
  makePaymentOptionPrimary: {
    paymentInstrumentId
  }
});

export const evMakeShippingOptionPrimary = ({ addressId }) => ({
  makeShippingOptionPrimary: {
    addressId
  }
});

export const evRedeemGiftCard = ({ sourcePage }) => ({
  redeemGiftCard: {
    sourcePage
  }
});

export const ACCOUNT_PAGE_VEW = 'ACCOUNT_PAGE_VEW';

export default {
  pageEvent: ACCOUNT_PAGE_VEW,
  events: {
    [REQUEST_REDEEM_GIFT_CARD]: [(_, params) => middlewareTrack(evRedeemGiftCard(params))]
  }
};
