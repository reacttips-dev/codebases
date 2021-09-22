import Uri from 'jsuri';
import _ from 'lodash';

import type CartsV2 from 'bundles/naptimejs/resources/carts.v2';

import redirect from 'js/lib/coursera.redirect';

export const redirectToCheckout = (cart: CartsV2, params?: Record<string, string>, isFinaid?: boolean) => {
  const route = isFinaid ? 'finaid' : 'checkout';
  const checkoutPageUri = new Uri().setPath(`/payments/${route}`).addQueryParam('cartId', cart.id);

  if (params && !_.isEmpty(params)) {
    Object.keys(params).forEach((key) => {
      // guard against null entries so the url doesn't get `&a=&b=`
      if (params[key]) {
        checkoutPageUri.addQueryParam(key, params[key]);
      }
    });
  }

  redirect.setLocation(checkoutPageUri.toString());
};

export default redirectToCheckout;
