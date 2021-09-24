import React from 'react';
import { PaymentRequestButtonElement } from 'react-stripe-elements';

import styles from './NativePayButton.sass';
import ApplePayLogo from '../ApplePayLogo';
import GooglePayLogo from '../GooglePayLogo';

import {
  APPLE_PAY_PAYMENT_PLATFORM,
  GOOGLE_PAY_PAYMENT_PLATFORM,
  GENERIC_PAYMENT_PLATFORM,
} from '../../constants';

export const APPLE_PAY_ARIA_LABEL = 'Click to pay with Apple Pay';
export const GOOGLE_PAY_ARIA_LABEL = 'Click to pay with Google Pay';

const GooglePayButton = ({ onClick }) => (
  <div className={styles.googlePayButtonContainer}>
    <button
      className={styles.nativePayButton}
      onClick={onClick}
      aria-label={GOOGLE_PAY_ARIA_LABEL}
    >
      <GooglePayLogo />
    </button>
  </div>
);

const ApplePayButton = ({ onClick }) => (
  <div className={styles.applePayButtonContainer}>
    <button
      className={styles.nativePayButton}
      onClick={onClick}
      aria-label={APPLE_PAY_ARIA_LABEL}
    >
      <ApplePayLogo />
    </button>
  </div>
);

const GenericPayButton = ({ paymentRequest }) => (
  <PaymentRequestButtonElement
    paymentRequest={paymentRequest}
    style={{
      // For more details on how to style the Payment Request Button, see:
      // https://stripe.com/docs/elements/payment-request-button#styling-the-element
      paymentRequestButton: {
        theme: 'dark',
        height: '58px',
      },
    }}
  />
);

const NativePaySection = ({
  paymentPlatform,
  onClickPaymentButton,
  isLoading,
  paymentRequest,
}) => (
  <div className={styles.root}>
    {!isLoading && paymentPlatform === GOOGLE_PAY_PAYMENT_PLATFORM && (
      <GooglePayButton onClick={onClickPaymentButton} />
    )}
    {!isLoading && paymentPlatform === APPLE_PAY_PAYMENT_PLATFORM && (
      <ApplePayButton onClick={onClickPaymentButton} />
    )}
    {!isLoading && paymentPlatform === GENERIC_PAYMENT_PLATFORM && (
      <GenericPayButton paymentRequest={paymentRequest} />
    )}
  </div>
);

export default NativePaySection;
