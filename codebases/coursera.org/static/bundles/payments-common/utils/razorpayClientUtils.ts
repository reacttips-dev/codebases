import { color } from '@coursera/coursera-ui';

import user from 'js/lib/user';

import _t from 'i18n!nls/payments-common';

import config from 'js/app/config';

const RAZORPAY_SDK_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const COURSERA_LOGO = `${config.url.resource_assets}enterprise/coursera_logo.png`;

export const RAZORPAY_POLLING_TIMEOUT = 'razorpaySubscriptionPollingTimeout';

type RazorpayInstanceBaseOptions = {
  apiKey: string;
  amount: number;
  currencyCode: string;
  title?: string;
  description: string;
  logo?: string;
  callback: (response: RazorpayResponse) => void;
  callbackUrl: string;
  onModalClose: () => void;
};

type RazorpayInstanceOrderOptions = RazorpayInstanceBaseOptions & {
  orderId: string;
};

type RazorpayInstanceSubscriptionOptions = RazorpayInstanceBaseOptions & {
  subscriptionId: string;
  isSubscriptionUpdate?: boolean;
};

export type RazorpayInstanceOptions = RazorpayInstanceOrderOptions | RazorpayInstanceSubscriptionOptions;

export enum RazorpayEvents {
  PaymentFailed = 'payment.failed',
}

export type RazorpayRawErrorOrderMetadataField = {
  order_id: string; // eslint-disable-line camelcase
  payment_id: string; // eslint-disable-line camelcase
};

export type RazorpayRawErrorSubscriptionMetadataField = {
  subscription_id: string; // eslint-disable-line camelcase
  payment_id: string; // eslint-disable-line camelcase
};

export type RazorpayRawErrorResponse = {
  error: {
    code: string;
    description: string;
    reason: string;
    source: string;
    step: string;
    metadata: RazorpayRawErrorOrderMetadataField | RazorpayRawErrorSubscriptionMetadataField;
  };
};

// Reference: https://razorpay.com/docs/payment-gateway/web-integration/standard/
export type RazorpayInstance = {
  // Opens the Razorpay modal
  open: () => void;
  // Closes the Razorpay modal
  close: () => void;
  // Sets event listener to trigger a callback for a specific event (like payment failure)
  on: (eventName: RazorpayEvents, cb: (error: RazorpayRawErrorResponse) => void) => void;
  // Unattaches the event listener
  off: (eventName: RazorpayEvents) => void;
};

type RazorpayConstructorBaseOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (res: RazorpayRawResponse) => void;
  callback_url: string; // eslint-disable-line camelcase
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
};

type RazorpayConstructorOrderOptions = RazorpayConstructorBaseOptions & {
  order_id: string; // eslint-disable-line camelcase
};

type RazorpayConsturctorSubscriptionOptions = RazorpayConstructorBaseOptions & {
  subscription_id: string; // eslint-disable-line camelcase
  subscription_card_change?: 0 | 1; // eslint-disable-line camelcase
};

type RazorpayConstructorOptions = RazorpayConstructorOrderOptions | RazorpayConsturctorSubscriptionOptions;

type RazorpayConstructor = new (constructor: RazorpayConstructorOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

type RazorpayRawBaseResponse = {
  razorpay_payment_id: string; // eslint-disable-line camelcase
  razorpay_signature: string; // eslint-disable-line camelcase
};

type RazorpayRawOrderResponse = RazorpayRawBaseResponse & {
  razorpay_order_id: string; // eslint-disable-line camelcase
};

type RazorpayRawSubscriptionResponse = RazorpayRawBaseResponse & {
  razorpay_subscription_id: string; // eslint-disable-line camelcase
};

type RazorpayRawResponse = RazorpayRawOrderResponse | RazorpayRawSubscriptionResponse;

type RazorpayBaseResponse = {
  razorpayPaymentId: string;
  razorpaySignature?: string;
};

export type RazorpayOrderResponse = RazorpayBaseResponse & {
  razorpayOrderId: string;
};

export type RazorpaySubscriptionResponse = RazorpayBaseResponse & {
  razorpaySubscriptionId: string;
};

export type RazorpayResponse = RazorpayOrderResponse | RazorpaySubscriptionResponse;

let _Razorpay: RazorpayConstructor;

const init = (): Promise<RazorpayConstructor> => {
  if (_Razorpay) {
    return Promise.resolve(_Razorpay);
  }

  const script = document.createElement('script');
  script.src = RAZORPAY_SDK_URL;
  document.body.appendChild(script);

  return new Promise((resolve, reject) => {
    script.onload = () => {
      _Razorpay = window.Razorpay;
      resolve(_Razorpay);
    };
    script.onerror = reject;
  });
};

export const createInstance = async (instanceOptions: RazorpayInstanceOptions): Promise<RazorpayInstance> => {
  const {
    apiKey,
    amount,
    currencyCode,
    title = _t('Coursera'),
    description,
    logo = COURSERA_LOGO,
    callback,
    callbackUrl,
    onModalClose,
  } = instanceOptions;
  const Razorpay = await init();

  const baseOptions = {
    key: apiKey,
    amount,
    currency: currencyCode,
    name: title,
    description,
    image: logo,
    // Handler function takes precedence over callback url
    // Callback url only happens for certain in-app browsers that can't trigger a modal
    // and need to redirect the user to the bank page, and then back to the callback url
    handler: (res: RazorpayRawResponse) => {
      let parsedResponse: RazorpayOrderResponse | RazorpaySubscriptionResponse | undefined;
      const { razorpay_order_id } = (res as unknown) as RazorpayRawOrderResponse; // eslint-disable-line camelcase
      const { razorpay_subscription_id } = (res as unknown) as RazorpayRawSubscriptionResponse; // eslint-disable-line camelcase

      const baseResponse = {
        razorpayPaymentId: res.razorpay_payment_id,
        razorpaySignature: res.razorpay_signature,
      };

      // eslint-disable-next-line camelcase
      if (razorpay_order_id) {
        parsedResponse = { ...baseResponse, razorpayOrderId: razorpay_order_id };
        // eslint-disable-next-line camelcase
      } else if (razorpay_subscription_id) {
        parsedResponse = { ...baseResponse, razorpaySubscriptionId: razorpay_subscription_id };
      } else {
        throw new Error('Cannot parse Razorpay response without orderId or subscriptionId');
      }

      return callback(parsedResponse);
    },
    callback_url: callbackUrl,
    prefill: {
      name: user.get().fullName,
      email: user.get().email_address,
    },
    theme: {
      color: color.primary,
    },
    modal: {
      ondismiss: onModalClose,
    },
  };

  let options: RazorpayConstructorOrderOptions | RazorpayConsturctorSubscriptionOptions | undefined;
  const { orderId } = (instanceOptions as unknown) as RazorpayInstanceOrderOptions;
  const { subscriptionId, isSubscriptionUpdate } = (instanceOptions as unknown) as RazorpayInstanceSubscriptionOptions;

  if (orderId) {
    options = { ...baseOptions, order_id: orderId };
  } else if (subscriptionId) {
    options = {
      ...baseOptions,
      subscription_id: subscriptionId,
      ...(isSubscriptionUpdate ? { subscription_card_change: 1 } : {}),
    };
  } else {
    throw new Error('Cannot create Razorpay instance without orderId or subscriptionId');
  }

  return new Razorpay(options);
};
