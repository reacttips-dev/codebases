import { deepEqual } from 'fast-equals';

import ProductUtils from 'helpers/ProductUtils';

export const getAkitaKey = ({ environmentConfig: { akitaKey } }) => akitaKey;

export const getAccountApiAndCredentials = state => {
  const { environmentConfig: { api: { account } }, cookies } = state;
  return { account, credentials: cookies };
};

export const getIsAlsoBilling = ({ address: { isAlsoBilling } }) => isAlsoBilling;

export const getMafiaAndCredentials = state => {
  const { environmentConfig: { api: { mafia } }, cookies } = state;
  return { mafia, credentials: cookies };
};

export const getFeedback = ({ feedback }) => feedback;

export const getWasAddressValid = state => {
  const { address: { formItem } } = state;
  return deepEqual(formItem, {});
};

export const getAddressFormItem = ({ address: { formItem } }) => formItem;

export const getAddressFormItemIsBilling = ({ address: { formItem: { isBilling } } }) => isBilling;

export const getPurchaseAddresses = ({ address: { savedAddresses } }) => savedAddresses;

export const getAddressesIsLoaded = ({ address: { isLoaded } }) => isLoaded;

export const getNumberPurchaseProducts = ({ checkoutData: { purchase: { productList } } }) => productList.length;

export const getCheckoutProducts = ({ checkoutData: { purchase: { productList } } }) => productList;

export const getIsPlacingOrder = ({ checkoutData: { isPlacingOrder } }) => isPlacingOrder;

export const getShouldFireOrderConfirmationPixel = ({ pixelServer: { shouldFireOnOrderConfirmation } }) => shouldFireOnOrderConfirmation;

export const getPurchaseShippingAddress = ({ checkoutData: { purchase: { shippingAddressId } } }) => shippingAddressId;

export const getFormattedConstraintViolations = ({ checkoutData: { constraintViolations } }) => constraintViolations;

export const getCheckoutLinks = ({ checkoutData: { links } }) => links;

export const getPurchaseId = ({ checkoutData: { purchase: { purchaseId } } }) => purchaseId;

export const getUsePromoBalances = ({ checkoutData: { usePromoBalance } }) => usePromoBalance;

export const getCartType = ({ checkoutData: { cartType } }) => cartType;

export const getPurchaseCard = ({ checkoutData: { purchaseCreditCard } }) => purchaseCreditCard;

export const getVersionNumber = ({ checkoutData: { purchase: { versionNumber } } }) => versionNumber;

export const getPurchaseData = ({ checkoutData }) => checkoutData;

export const getUseAsDefaults = ({ checkoutData: { useAsDefaults } }) => useAsDefaults;

export const getPageType = ({ pageView: { pageType } }) => pageType;

export const getProductBrandIdProductIdPriceForAkita = ({ product: { detail: { productId, brandId, styles, defaultProductType, defaultCategory }, colorId } }) => ({
  'orders': [
    {
      'items': [
        {
          'brand_id': brandId,
          'product_id': productId,
          'product_type': defaultProductType,
          'product_category': defaultCategory,
          'price': ProductUtils.priceToFloat(ProductUtils.getStyleByColor(styles, colorId).price)
        }
      ]
    }
  ]
});
