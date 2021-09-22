import localStorage from 'js/lib/coursera.store';
import logger from 'js/app/loggerSingleton';
import user from 'js/lib/user';
import moment from 'moment';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

type AbandonCartPromoData = {
  userId?: number;
  expiresAt?: number;
  promoCode: string;
  productType?: string;
  productId?: string;
  productSku?: string;
};

const LOCAL_STORAGE_KEY = 'abandonedCartPromoData';

export const getPromotionDataFromQuery = (query: {
  userId?: string;
  timestamp?: string;
  edocomorp?: string; // Make promo code more cryptic since it's user facing
  productSku?: string;
  productId?: string;
}): AbandonCartPromoData | null => {
  // We expect at least a promo code
  if (!query || !query.edocomorp || !query.userId || !query.timestamp) {
    return null;
  }
  const { productSku, edocomorp, productId } = query;

  const userId = parseInt(query.userId, 10);

  const timestamp = parseInt(query.timestamp, 10);
  const expiresAt = moment(timestamp).add(14, 'days').valueOf();

  const productType = productSku && stringKeyToTuple(productSku)[0];

  return {
    userId,
    expiresAt,
    promoCode: edocomorp,
    productType,
    productId,
    productSku,
  };
};

export const clearAbandonedCartPromotionFromStorage = () => {
  localStorage.remove(LOCAL_STORAGE_KEY);
};

export const saveAbandonedCartPromoDataToStorage = (promoData: AbandonCartPromoData) => {
  if (typeof window === 'undefined') {
    logger.error('Attempted to save abandoned cart promo to local storage in a server context');
    return;
  }

  const base64String = btoa(JSON.stringify(promoData));
  localStorage.set(LOCAL_STORAGE_KEY, base64String);
};

export const loadAbandonedCartPromoDataFromStorage = (): AbandonCartPromoData | typeof undefined => {
  const base64String = localStorage.get(LOCAL_STORAGE_KEY);
  try {
    return JSON.parse(atob(base64String));
  } catch (err) {
    return undefined;
  }
};

export const isValidAbandonedCartPromotion = (userId: number, expiresAt: number) => {
  return user.get().id === userId && new Date(expiresAt) > new Date();
};
