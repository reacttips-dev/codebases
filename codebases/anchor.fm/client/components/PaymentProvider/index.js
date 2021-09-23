import React, { useState, useEffect } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import { windowUndefined } from '../../../helpers/serverRenderingUtils';

const paymentProviderApiKey = windowUndefined()
  ? null
  : window.__PAYMENT_PROVIDER_API_KEY__;

function PaymentProvider({ children }) {
  const [stripe, setStripe] = useState(null);
  function setStripeState() {
    setStripe(window.Stripe(paymentProviderApiKey));
  }
  useEffect(() => {
    if (!paymentProviderApiKey) {
      throw new Error('An API key is required for the payment provider');
    }
    const stripeElement = document.getElementById('stripe-js');
    if (window.Stripe) {
      setStripeState();
    } else if (stripeElement) {
      stripeElement.addEventListener('load', setStripeState);
    }
    return () => {
      if (stripeElement) {
        stripeElement.removeEventListener('load', setStripeState);
      }
    };
  }, []);
  return <StripeProvider stripe={stripe}>{children}</StripeProvider>;
}

export { PaymentProvider };
