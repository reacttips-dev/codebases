import moment from 'moment';

import store from 'js/lib/coursera.store';
import user from 'js/lib/user';

const LOCAL_STORAGE_KEY = 'payments.cart.mostRecent';

type SavedCart = {
  id?: number;
  userId?: string;
  timestamp?: number;
};

export const get = (): SavedCart => {
  if (store && store.get) {
    const cart = store.get(LOCAL_STORAGE_KEY);

    // Check if not present, expired, or not created by the current user (except superuser)
    if (
      !cart ||
      moment(cart.timestamp).add(15, 'days').isBefore(moment()) ||
      (user.get().id !== cart.userId && !user.isSuperuser())
    ) {
      return {};
    }

    return cart;
  } else {
    return {};
  }
};

export const set = (cartId: number): void => {
  const date = new Date();
  store.setIfEnabled(LOCAL_STORAGE_KEY, {
    id: cartId,
    userId: user.get().id,
    timestamp: date.getTime(),
  });
};

export const reset = (): void => {
  if (store && store.remove) {
    store.remove(LOCAL_STORAGE_KEY);
  }
};

export default { get, set, reset };
