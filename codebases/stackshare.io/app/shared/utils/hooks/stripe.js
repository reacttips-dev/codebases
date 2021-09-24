import {useEffect} from 'react';

const useStripe = () => {
  useEffect(() => {
    if (typeof Stripe === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
};

export default useStripe;
