import {
  braintree,
  ebanx,
  paypal,
  razorpay,
  zeroDollar,
  mockPaymentProcessor,
} from 'bundles/payments/common/PaymentProcessorTypes';
import ProductType from 'bundles/payments/common/ProductType';
import config from 'js/app/config';
import keysToConstants from 'js/lib/keysToConstants';
import path from 'js/lib/path';
import type { HostedFieldFieldOptions } from 'braintree-web';
import { RAZORPAY_POLLING_TIMEOUT } from 'bundles/payments-common/utils/razorpayClientUtils';

const S3_BUCKET_PREFIX = 'growth/payments';

// TODO (htran) consolidate 'wallet' type as subtype under braintree and paypal
const PAYMENT_METHODS = keysToConstants([
  braintree,
  ebanx,
  paypal,
  razorpay,
  'wallet',
  zeroDollar,
  mockPaymentProcessor,
]);

// The S3 location is coursera-web-assets/images/signature/cc
const creditCardImagesBaseUrl = path.join(config.url.assets, 'images/signature/cc');

function ccImageURL(imageFile: string) {
  return path.join(creditCardImagesBaseUrl, imageFile);
}

const allCreditCards = {
  VISA: {
    name: 'Visa',
    url: ccImageURL('visa-2.png'),
  },
  MASTERCARD: {
    name: 'MasterCard',
    url: ccImageURL('mastercard-2.png'),
  },
  AMEX: {
    name: 'American Express',
    url: ccImageURL('amex-2.png'),
  },
  DISCOVER: {
    name: 'Discover',
    url: ccImageURL('discover.png'),
  },
  JCB: {
    name: 'JCB',
    url: ccImageURL('jcb.png'),
  },
  DINERS: {
    name: 'Diners Club',
    url: ccImageURL('diners.png'),
  },
  ELO: {
    name: 'Elo',
    url: ccImageURL('elo.png'),
  },
  HIPERCARD: {
    name: 'Hipercard',
    url: ccImageURL('hipercard.png'),
  },
  CARNET: {
    name: 'CARNET',
    url: ccImageURL('carnet.png'),
  },
  UPI: {
    name: 'Unified Payment Interface',
    url: ccImageURL('upi.png'),
  },
  NET_BANKING: {
    name: 'Net Banking',
    url: ccImageURL('netbanking.png'),
  },
};

const { VISA, MASTERCARD, AMEX, DISCOVER, JCB, DINERS, ELO, HIPERCARD, CARNET, UPI, NET_BANKING } = allCreditCards;

export const braintreeFieldIds: Partial<Record<keyof HostedFieldFieldOptions, string>> = {
  number: 'cc-number',
  expirationDate: 'cc-expiration-date',
  cvv: 'cc-cvv',
};

export const DISCLAIMER_LINKS = {
  TERMS_OF_USE: '/about/terms',
  REFUND_POLICY: '/about/terms#refund-policy',
  PRIVACY_POLICY: '/about/privacy',
  CANCEL_SUBSCRIPTION: 'https://learner.coursera.help/hc/articles/216348123-Cancel-a-subscription',
};

const exported = {
  config,
  rootPath: '/payments',
  creditCardImagesBaseUrl,
  refundProductAction: 'Refund',
  buyProductAction: 'Buy',
  finaidAppMinWords: 10,
  finaidAppMinChars: 50,
  finaidAppMaxChars: 5000,
  daphneImg: 'https://s3.amazonaws.com/coursera/media/Daphne_Koller.png',
  andrewImg: 'https://s3.amazonaws.com/coursera/media/Andrew_Ng.png',

  // USD Currency Code
  VC_DEFAULT_CURRENCY: 840,

  VC_DEFAULT_COUNTRY_ALPHA2: 'US',
  VC_DEFAULT_CURRENCY_CODE: 'USD',
  epicNamespace: 'payments',
  cartUrl: 'checkout',
  cartIcon: 'bundles/payments/assets/cart_badged.png',
  paypalLogo: path.join(config.url.resource_assets, S3_BUCKET_PREFIX, 'paypal-logo.png'),
  cvvIcon: path.join(config.url.resource_assets, S3_BUCKET_PREFIX, 'cvv.png'),

  ProductType,

  ServicePeriod: {
    VERIFIED_CERTIFICATE: 180,
    SPECIALIZATION: 365,
  },

  fakeValidNonce: 'fake-valid-nonce',

  errorMapping: {
    fraud: 'card-declined-error',
    generalError: 'general-error',
    [RAZORPAY_POLLING_TIMEOUT]: RAZORPAY_POLLING_TIMEOUT,
    invalidRequest: 'general-error',
    invalidCard: 'card-invalid-error',
    'invalidCart.invalidCoupon': 'invalid-coupon',
    issuerDecline: 'card-declined-error',
    paypalBuyerRevokedPaymentAuthorization: 'paypal-buyer-revoked-payment-authorization-error',
    paypalFailure: 'paypal-error',
    paypalLogin: 'paypal-missing-login',
    unknown: 'card-declined-error',
    timeout: 'timeout-error',
    internalErrorProduct: 'general-error',
    internalErrorPayment: 'general-error',
    paymentProcessorError: 'general-error',
    paymentWalletBadRequest: 'card-declined-error',
    invalidFields: 'card-fields-error',
    CONTRACT_PAYMENT_ERROR: 'enterprise-contract-error',
    courseraPlusAmexPromoIneligible: 'courseraPlusAmexPromoIneligible',
  },

  acceptedCreditCards: [VISA, MASTERCARD, AMEX, DISCOVER, JCB],
  acceptedCreditCardsAmexCampaign: [AMEX],

  acceptedCreditCardsBR: [VISA, MASTERCARD, AMEX, DINERS, ELO, HIPERCARD],
  acceptedCreditCardsMX: [VISA, MASTERCARD, AMEX, CARNET],
  acceptedCreditCardsCO: [VISA, MASTERCARD, AMEX, DINERS],
  acceptedCreditCardsStandaloneCourseIN: [VISA, MASTERCARD, AMEX, UPI, NET_BANKING],
  acceptedCreditCardsSubscriptionIN: [VISA, MASTERCARD],

  paymentMethods: PAYMENT_METHODS,

  premiumExperienceVariants: {
    premiumCourse: 'PremiumCourse',
    premiumGrading: 'PremiumGrading',
    baseVariant: 'BaseVariant',
  },

  subscriptionBillingType: keysToConstants(['MONTHLY', 'ANNUAL', 'BIANNUAL']),

  freeTrial: {
    numDays: 7,
  },

  // 7-day free trial subscription BE promo id
  subscriptionTrialPromoId: 854,

  catalogSubscription: {
    cartItemImage: `${config.url.resource_assets}growth_catalog_subscription/catalog_access_cart_item.png`,
  },

  braintreeVerifiedLink: 'https://www.braintreegateway.com/merchants/2v7ggjcrvs26zssz/verified',

  creditCardPaymentMethods: [PAYMENT_METHODS.braintree, PAYMENT_METHODS.ebanx],

  braintreeFieldIds,
};

export default exported;
export { config, creditCardImagesBaseUrl, ProductType };

export const {
  rootPath,
  refundProductAction,
  buyProductAction,
  finaidAppMinWords,
  finaidAppMinChars,
  finaidAppMaxChars,
  daphneImg,
  andrewImg,
  VC_DEFAULT_CURRENCY,
  VC_DEFAULT_COUNTRY_ALPHA2,
  VC_DEFAULT_CURRENCY_CODE,
  epicNamespace,
  cartUrl,
  cartIcon,
  paypalLogo,
  cvvIcon,
  ServicePeriod,
  fakeValidNonce,
  errorMapping,
  acceptedCreditCards,
  acceptedCreditCardsAmexCampaign,
  acceptedCreditCardsBR,
  acceptedCreditCardsMX,
  acceptedCreditCardsCO,
  acceptedCreditCardsStandaloneCourseIN,
  acceptedCreditCardsSubscriptionIN,
  paymentMethods,
  premiumExperienceVariants,
  subscriptionBillingType,
  freeTrial,
  subscriptionTrialPromoId,
  catalogSubscription,
  braintreeVerifiedLink,
  creditCardPaymentMethods,
} = exported;
