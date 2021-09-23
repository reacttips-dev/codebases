import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as CurrencyCodes from '../constants/CurrencyCodes';
import * as MerchandiseIds from '../constants/MerchandiseIds';
import * as TermIds from '../constants/TermIds';
import * as UpgradeProducts from '../constants/UpgradeProducts';
import * as ApiNames from '../constants/ApiNames';
import * as ProductBasedOfferIds from '../constants/ProductBasedOfferIds';
import { RECURRING } from '../constants/ChargeTypes';
var currencyCodeValues = Object.values(CurrencyCodes || {});
var merchandiseIdValues = Object.values(MerchandiseIds || {});
var offerIdValues = Object.values(TermIds || {});
var upgradeProductValues = Object.values(UpgradeProducts || {});
var apiNameValues = Object.values(ApiNames || {});
var productBasedOfferIdValues = Object.values(ProductBasedOfferIds || {});
var allowedOfferIdValues = [].concat(_toConsumableArray(offerIdValues), _toConsumableArray(productBasedOfferIdValues));
export var validateOfferId = function validateOfferId(offerId) {
  if (offerId === null || offerId === undefined) {
    return;
  }

  if (allowedOfferIdValues.indexOf(offerId) === -1) {
    console.error("Invalid offerId " + offerId + ", must be one of: " + offerIdValues);
  }
};
/**
 * @deprecated as part of product abstraction
 */

export var validateMerchandiseId = function validateMerchandiseId(merchandiseId) {
  if (merchandiseIdValues.indexOf(merchandiseId) === -1) {
    throw new Error("Invalid merchandiseId (" + merchandiseId + "), must be one of: " + merchandiseIdValues);
  }
};
export var validateSkuId = function validateSkuId(skuId) {
  if (typeof skuId !== 'number') {
    throw new Error("Invalid skuId (" + skuId + "), must be one of type number");
  }
};
export var validateProductBasedOfferId = function validateProductBasedOfferId(productBasedOfferId) {
  if (productBasedOfferIdValues.indexOf(productBasedOfferId) === -1) {
    console.error("Invalid productBasedOfferId, must be one of: " + productBasedOfferIdValues);
  }
};
export var validateCurrencyCode = function validateCurrencyCode(currencyCode) {
  if (currencyCodeValues.indexOf(currencyCode) === -1) {
    throw new Error("Invalid currencyCode, must be one of: " + currencyCodeValues);
  }
};
export var validateItemConfigurations = function validateItemConfigurations(itemConfigurations) {
  if (itemConfigurations === null || itemConfigurations === undefined || Array.isArray(itemConfigurations) && !itemConfigurations.length) {
    return;
  }

  if (!Array.isArray(itemConfigurations)) {
    throw new Error("Invalid itemConfigurations: " + JSON.stringify(itemConfigurations) + ", must be null, undefined, or an array");
  }

  itemConfigurations.forEach(function (itemConfiguration) {
    // The offer builder API uses the property name "id" but we enforce
    // "merchandiseId" for clarity and later transform it for the API
    validateMerchandiseId(itemConfiguration.merchandiseId); // The offer builder API supports null values for quantity and defaults
    // to 1 on the backend but we enforce the explicit passing of a value
    // for consistency on the front end.

    if (itemConfiguration.quantity === undefined || itemConfiguration.quantity === null) {
      throw new Error("Invalid itemConfiguration: " + JSON.stringify(itemConfiguration) + ", must contain a quantity.");
    }

    if (!Number.isInteger(itemConfiguration.quantity)) {
      throw new Error("Invalid itemConfiguration: " + JSON.stringify(itemConfiguration) + ", quantity must be an integer.");
    }
  });
};
export var validateProductConfigurations = function validateProductConfigurations(productConfigurations) {
  if (productConfigurations === null || productConfigurations === undefined || Array.isArray(productConfigurations) && !productConfigurations.length) {
    return;
  }

  if (!Array.isArray(productConfigurations)) {
    throw new Error("Invalid productConfigurations: " + JSON.stringify(productConfigurations) + ", must be null, undefined, or an array");
  }

  productConfigurations.forEach(function (productConfiguration) {
    // The offer builder API uses the property name "id" but we enforce
    // "merchandiseId" for clarity and later transform it for the API
    validateSkuId(productConfiguration.skuId); // The offer builder API supports null values for quantity and defaults
    // to 1 on the backend but we enforce the explicit passing of a value
    // for consistency on the front end.

    if (productConfiguration.quantity === undefined || productConfiguration.quantity === null) {
      throw new Error("Invalid productConfiguration: " + JSON.stringify(productConfiguration) + ", must contain a quantity.");
    }

    if (!Number.isInteger(productConfiguration.quantity)) {
      throw new Error("Invalid productConfiguration: " + JSON.stringify(productConfiguration) + ", quantity must be an integer.");
    }
  });
};
export var validateProductBasedOffers = function validateProductBasedOffers(productBasedOffers) {
  if (!Array.isArray(productBasedOffers)) {
    throw new Error("Invalid productBasedOffers: " + JSON.stringify(productBasedOffers) + ", must be null, undefined, or an array");
  }

  productBasedOffers.forEach(function (productBasedOfferId) {
    validateProductBasedOfferId(productBasedOfferId);
  });
};
export var validatePurchaseableItemInLegacyConfig = function validatePurchaseableItemInLegacyConfig(itemConfigurations, productBasedOffers) {
  if ((!itemConfigurations || !itemConfigurations.length) && (!productBasedOffers || !productBasedOffers.length)) {
    throw new Error("Invalid purchaseConfig, must have at least one itemConfiguration or productBasedOffer");
  }
};
export var validatePurchaseableItemInConfig = function validatePurchaseableItemInConfig(productConfigurations, productBasedOffers) {
  if ((!productConfigurations || !productConfigurations.length) && (!productBasedOffers || !productBasedOffers.length)) {
    throw new Error("Invalid purchaseConfig, must have at least one itemConfiguration or productBasedOffer");
  }
};

var hasRecurringItems = function hasRecurringItems(itemConfigurations, merchandiseMap) {
  return itemConfigurations.some(function (_ref) {
    var merchandiseId = _ref.merchandiseId;
    return merchandiseMap[merchandiseId].chargeType === RECURRING;
  });
};

export var hasRecurringProducts = function hasRecurringProducts(productConfigurations, productMap, skuMap) {
  return productConfigurations.some(function (_ref2) {
    var skuId = _ref2.skuId;
    return productMap[skuMap[skuId].productId].chargeType === RECURRING;
  });
};
export var validateLegacyPurchaseConfig = function validateLegacyPurchaseConfig(_ref3, merchandiseMap) {
  var termId = _ref3.termId,
      currencyCode = _ref3.currencyCode,
      itemConfigurations = _ref3.itemConfigurations,
      productBasedOffers = _ref3.productBasedOffers;
  validateOfferId(termId);
  validateCurrencyCode(currencyCode);
  validateItemConfigurations(itemConfigurations);

  if (productBasedOffers) {
    validateProductBasedOffers(productBasedOffers);
  }

  validatePurchaseableItemInLegacyConfig(itemConfigurations, productBasedOffers);

  if (hasRecurringItems(itemConfigurations, merchandiseMap) && !termId) {
    throw new Error('Must include a termId if your itemConfigurations contain a RECURRING item');
  }
};
export var validatePurchaseConfig = function validatePurchaseConfig(_ref4, productMap, skuMap) {
  var offerId = _ref4.offerId,
      currencyCode = _ref4.currencyCode,
      productConfigurations = _ref4.productConfigurations,
      productBasedOffers = _ref4.productBasedOffers;
  validateOfferId(offerId);
  validateCurrencyCode(currencyCode);
  validateProductConfigurations(productConfigurations);

  if (productBasedOffers) {
    validateProductBasedOffers(productBasedOffers);
  }

  validatePurchaseableItemInConfig(productConfigurations, productBasedOffers);

  if (hasRecurringProducts(productConfigurations, productMap, skuMap) && !offerId) {
    throw new Error('Must include an offerId if your productConfigurations contain a RECURRING item');
  }
};
export var validateUpgradeProduct = function validateUpgradeProduct(upgradeProduct) {
  if (upgradeProductValues.indexOf(upgradeProduct) === -1) {
    throw new Error("Invalid upgradeProduct, must be one of: " + upgradeProductValues);
  }
};
export var validateApiName = function validateApiName(apiName) {
  if (apiNameValues.indexOf(apiName) === -1) {
    console.error("Invalid apiName, must be one of: " + apiNameValues);
  }
};