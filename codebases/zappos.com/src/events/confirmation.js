import { call } from 'redux-saga/effects';

import { sendMonetateEvent } from 'apis/monetate';
import { productBundle } from 'apis/cloudcatalog';
import { CHECKOUT_RECEIVE_ORDER_INFORMATION } from 'store/ducks/checkout/types';

const ORDER_CONFIRMATION_PAGEVIEW = 'ORDER_CONFIRMATION_PAGEVIEW';

function* monetateOcView(appState) {
  const purchasedItems = [];
  const orders = appState?.checkoutData?.purchaseData?.orderInfo || appState?.checkoutData?.orderInfo || [];

  const { environmentConfig: { api: { cloudcatalog } } } = appState;

  for (const order of orders) {
    for (const item of order.items) {
      const { productId, itemQuantity: quantity, price } = item;
      const productPromise = yield call(productBundle, cloudcatalog, { productId, includeOos: true });
      const productResponse = yield productPromise.json();
      const product = productResponse.product[0] || null;
      if (product && product.styles.length > 0) {
        const style = productResponse.product[0].styles.filter(s => s.color === item.color);
        if (style?.[0]) {
          const { styleId } = style[0];
          purchasedItems.push({ purchaseId: order.orderId, sku: styleId, productId, quantity, unitPrice: price });
        }
      }
    }
  }

  sendMonetateEvent(
    ['setPageType', 'confirmation'],
    ['addPurchaseRows', purchasedItems]
  );
}

export default {
  clientCalled: CHECKOUT_RECEIVE_ORDER_INFORMATION,
  pageEvent: ORDER_CONFIRMATION_PAGEVIEW,
  hasRedirects: true,
  events: {
    [ORDER_CONFIRMATION_PAGEVIEW]: [monetateOcView]
  }
};
