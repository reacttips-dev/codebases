export const ITEM_IN_CART_WITH_NO_SHIP_OPTIONS = 'ITEM_IN_CART_WITH_NO_SHIP_OPTIONS';
export const ITEM_IN_CART_WITH_PROBLEM = 'ITEM_IN_CART_WITH_PROBLEM';
export const BAD_PROMO_CODE_OR_GIFT_CARD = 'BAD_PROMO_CODE_OR_GIFT_CARD';
export const NO_SHIP_OPTIONS = 'NO_SHIP_OPTIONS';
export const INVALID_GIFT_OPTION = 'InvalidGiftOption';
export const DELIVERY_OPTION = 'DeliveryOption';
export const GC_PAYMENT_METHOD_NOT_ALLOWED = 'GCPaymentMethodNotAllowed';
export const ADDRESS_ASSOCIATION = 'AddressAssociation';
export const DESTINATION_INFORMATION_MISSING = 'DestinationInformationMissing';
export const DELIVERY_INFORMATION_MISSING = 'DeliveryInformationMissing';
export const INACTIVE_INSTRUMENT_BILLING_ADDRESS_VIOLATION = 'InactiveInstrumentBillingAddressViolation';
export const INSUFFICIENT_COVERAGE = 'InsufficientCoverage';
export const INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM = 'InvalidSelectedDeliveryOptionForLineItem';
export const PROMOTIONAL_CODE_ALREADY_REDEEMED = 'PromotionalCodeAlreadyRedeemed';
export const PROMOTIONAL_CODE_EXPIRED = 'PromotionalCodeExpired';
export const PROMOTIONAL_CODE_USED_BEFORE_START_DATE = 'PromotionalCodeUsedBeforeStartDate';
export const PROMOTIONAL_CODE_INVALID_FOR_PURCHASE = 'PromotionalCodeInvalidForPurchase';
export const PROMOTIONAL_CODE_BAD = 'PromotionalCodeBad';
export const SHIPPING_ENGINE_REMOVER_BASED = 'ShippingEngine_RemoverBased';
export const LEGACY_ORDER_LEVEL_BILLING_ADDRESS_MISSING = 'LegacyOrderLevelBillingAddressMissing';
export const ITEM_QUANTITY_UNAVAILABLE = 'ItemQuantityUnavailable';
export const OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION = 'OfferListingNotAvailableContraintViolation';
export const SHIPPING_ENGINE_FILTER_BASED = 'ShippingEngine_FilterBased';
export const PAYMENT_PLAN_MISSING = 'PaymentPlanMissing';
export const INACTIVE_INSTRUMENT = 'InactiveInstrument';
export const EXPIRED_INSTRUMENT = 'ExpiredInstrument';
export const JURISDICTION = 'Jurisdiction';
export const PAYMENT_METHOD = 'PaymentMethod';
export const QUANTITY_LIMITS = 'QuantityLimits';
export const ADDRESS = 'Address';
export const SHIPPING_ENGINE_PROVIDER_BASED = 'ShippingEngine_ProviderBased';
export const SHIPPING_ENGINE_SHIPPING_OFFERING_NOT_SET = 'ShippingEngine_ShippingOfferingNotSet';
export const FULLFILMENT_NETWORK_MISSING = 'FulfillmentNetworkMissing';
export const INVALID_COUPON_BALANCE = 'InvalidCouponBalance';
export const OFFER_LISTING_AND_OFFER_SKU_DIFFER = 'OfferListingAndOfferSkuDiffer';
export const PRODUCT_MISSING = 'ProductMissing';
export const MISSING_DIGITAL_DELIVERY_INFORMATION = 'MissingDigitalDeliveryInformation';
export const GIFTCARD_CODE_ALREADY_REDEMEED = 'GiftCardCodeAlreadyRedeemed';
export const GIFTCARD_CODE_CANCELLED = 'GiftCardCodeCancelled';
export const GIFTCARD_CODE_EXPIRED = 'GiftCardCodeExpired';
export const GIFTCARD_CODE_INVALID = 'GiftCardCodeInvalid';
export const VALID_PAYMENT_METHOD_REQUIRED = 'ValidPaymentMethodRequired';
export const SHIP_ADDRESS_DEACTIVATED = 'ShipAddressDeactivated';
export const PROMOTIONAL_CODE_MISSING = 'PromotionalCodeMissing'; // client side only
export const GC_QUANTITY = 'GCQuantityLimit';
export const CART_QUANTITY_LIMIT = 'CartQuantityLimit';
export const DROP_PRODUCT_NOT_AVAILABLE = 'DropProductNotAvailable';
export const DROP_PRODUCT_PURCHASE_AUTHORIZATION_MISSING = 'DropProductPurchaseAuthorizationMissing';
export const DROP_PRODUCT_QUANTITY_LIMIT = 'DropProductQuantityLimit';
export const EXPORT_OFFER_BUYABILITY_RESTRICTION = 'ExportOfferBuyabilityRestriction';
export const CROSS_BORDER_EXPORT = 'CrossBorderExport';
export const DROP_PRODUCT_DIRECT_FULFILLMENT = 'DropProductDirectFulfillment';

export const GC_AND_PROMO_CONSTRAINTS = [
  PROMOTIONAL_CODE_MISSING,
  PROMOTIONAL_CODE_ALREADY_REDEEMED,
  PROMOTIONAL_CODE_EXPIRED,
  PROMOTIONAL_CODE_USED_BEFORE_START_DATE,
  PROMOTIONAL_CODE_INVALID_FOR_PURCHASE,
  PROMOTIONAL_CODE_BAD,
  GC_PAYMENT_METHOD_NOT_ALLOWED,
  GIFTCARD_CODE_ALREADY_REDEMEED,
  GIFTCARD_CODE_CANCELLED,
  GIFTCARD_CODE_EXPIRED,
  GIFTCARD_CODE_INVALID
];

// Most now served by mafia, some aren't, like:  ITEM_IN_CART_WITH_PROBLEM
export const CONSTRAINT_VIOLATIONS_MESSAGES = {
  account: {
    giftCard: {
      [GIFTCARD_CODE_ALREADY_REDEMEED]: 'The <%= giftCardTerm %> code you entered has already been applied to your account.',
      [GIFTCARD_CODE_CANCELLED]: 'Oh no! We don\'t recognize that <%= giftCardTerm %> code. Please try again.',
      [GIFTCARD_CODE_INVALID]: 'Oh no! We don\'t recognize that <%= giftCardTerm %> code. Please try again.'
    }
  },
  checkout: {
    [BAD_PROMO_CODE_OR_GIFT_CARD]: 'There was a problem adding your gift card or code.  See below for more information.',
    [INSUFFICIENT_COVERAGE]: 'Insufficient saved balance.  You have a remaining balance of $<%- amountRemaining %>. Please add an additional payment method to complete your order.',
    [ITEM_IN_CART_WITH_PROBLEM]: 'There is a problem with one of the items in your cart. Please modify it below to proceed with checkout.',
    [EXPIRED_INSTRUMENT]: 'Payment instrument has expired. Please select a new payment.',
    [INACTIVE_INSTRUMENT]: 'Payment instrument is inactive.  Please select a new payment.',
    [PAYMENT_METHOD]: 'There was a problem with the payment.  Please try again.',
    [MISSING_DIGITAL_DELIVERY_INFORMATION]: 'Your order is missing delivery information for a digital product.  Please remove the item below.',
    [NO_SHIP_OPTIONS]: 'Your order cannot be shipped to the current address. Please select a new one.',
    [OFFER_LISTING_AND_OFFER_SKU_DIFFER]: 'Sorry, there is an issue with an item on your purchase.  Please remove it below.',
    [ITEM_IN_CART_WITH_NO_SHIP_OPTIONS]: 'There is an item in your cart that has no valid shipping options.  Please use a different shipping address or remove the item below.',
    [SHIPPING_ENGINE_PROVIDER_BASED]: 'There is a problem with this purchase and it cannot be completed at this time.',
    [GC_PAYMENT_METHOD_NOT_ALLOWED]: 'You cannot purchase a gift card with a gift card.  Please select another payment method or remove the gift card from the purchase below.',
    giftCard: {
      [PROMOTIONAL_CODE_MISSING]: 'A gift card or promotional code is required.',
      [PROMOTIONAL_CODE_ALREADY_REDEEMED]: 'The code you entered has already been applied to your account.',
      [PROMOTIONAL_CODE_EXPIRED]: 'The code you entered has expired.',
      [PROMOTIONAL_CODE_USED_BEFORE_START_DATE]: 'Promo code not available yet. Check back tomorrow!',
      [PROMOTIONAL_CODE_INVALID_FOR_PURCHASE]: 'The code you entered is ineligible for this purchase.',
      [PROMOTIONAL_CODE_BAD]: 'An error occured while processing your promo code. Try again or contact us.',
      [GIFTCARD_CODE_ALREADY_REDEMEED]: 'The gift card you entered has already been redeemed.',
      [GIFTCARD_CODE_CANCELLED]: 'The gift card is not valid.',
      [GIFTCARD_CODE_EXPIRED]: 'The gift card has expired.',
      [GIFTCARD_CODE_INVALID]: 'The gift card is not valid.'
    },
    asinErrors: {
      [DROP_PRODUCT_DIRECT_FULFILLMENT]: 'Item cannot be shipped to current address. Please remove this item or change shipping address.',
      [OFFER_LISTING_AND_OFFER_SKU_DIFFER]: 'Inventory not available. Please remove this item.',
      [JURISDICTION]: 'Item cannot be shipped to current address. Please remove this item or change shipping address.',
      [ITEM_QUANTITY_UNAVAILABLE]: 'Item quantity is not available. Please remove one or more of this item.',
      [OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION]: 'Item no longer available. Please remove this item.',
      [MISSING_DIGITAL_DELIVERY_INFORMATION]: 'Digital items are not currently available for purchase.',
      [SHIPPING_ENGINE_FILTER_BASED]: 'Item has no valid shipping options. Please remove this item.',
      [SHIPPING_ENGINE_REMOVER_BASED]: 'Item has no valid shipping options. Please remove this item.',
      [SHIPPING_ENGINE_PROVIDER_BASED]: 'Our bad! There was a problem with this item. Please remove.',
      [DESTINATION_INFORMATION_MISSING]: 'Item has no valid shipping options. Please remove this item.',
      [DELIVERY_INFORMATION_MISSING]: 'Item has no valid shipping options. Please remove this item.',
      [FULLFILMENT_NETWORK_MISSING]: 'Inventory not available. Please remove this item.',
      [QUANTITY_LIMITS]: 'Item quantity is not available. Please remove one or more of this item.',
      [GC_PAYMENT_METHOD_NOT_ALLOWED]: 'Item cannot be purchased with a gift card.  Please remove this item or add another payment method.'
    }
  }
};
