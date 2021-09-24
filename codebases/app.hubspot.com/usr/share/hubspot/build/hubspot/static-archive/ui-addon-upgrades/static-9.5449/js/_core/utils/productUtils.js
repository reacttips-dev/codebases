'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { QUANTITY_PACK } from 'self-service-api/constants/SkuTypes';

var getQuantityPackDetailsFromSku = function getQuantityPackDetailsFromSku(products, skuId) {
  var quantityPackDetails;
  Object.values(products).forEach(function (product) {
    product.productVersions.forEach(function (productVersion) {
      productVersion.quantityPackDetails.forEach(function (quantityPack) {
        if (quantityPack.skuId === skuId) {
          quantityPackDetails = quantityPack;
        }
      });
    });
  });
  return quantityPackDetails || null;
};

var getProductInfoFromSkuId = function getProductInfoFromSkuId(products, skuId) {
  return Object.values(products).find(function (product) {
    return product.productVersions.find(function (productVersion) {
      return productVersion.skuId === skuId;
    });
  }) || null;
};

var getProductVersionFromSkuId = function getProductVersionFromSkuId(products, skuId) {
  var productInfo = getProductInfoFromSkuId(products, skuId);
  return productInfo ? productInfo.productVersions.find(function (productVersion) {
    return productVersion.skuId === skuId;
  }) : null;
};

export var getProductTrackingName = function getProductTrackingName(products, skuId) {
  if (!products || !skuId) return null;
  var productVersion = getProductVersionFromSkuId(products, skuId);
  var quantityPackDetails = getQuantityPackDetailsFromSku(products, skuId);

  if (productVersion || quantityPackDetails) {
    return productVersion ? productVersion.trackingName : quantityPackDetails.trackingName;
  }

  return null;
};

var getSkuMap = function getSkuMap(productMap) {
  var productVersions = productMap.reduce(function (acc, product) {
    var keyedVersions = {};
    product.productVersions.forEach(function (version) {
      return keyedVersions[version.skuId] = Object.assign({}, version, {
        quantityPackDetails: version.quantityPackDetails.map(function (quantityPack) {
          return Object.assign({}, quantityPack, {
            productVersionSkuId: version.skuId
          });
        })
      });
    });
    return Object.assign({}, acc, {}, keyedVersions);
  }, {});
  return Object.values(productVersions).reduce(function (acc, productVersion) {
    var skus = Object.assign({}, acc, _defineProperty({}, productVersion.skuId, productVersion));
    productVersion.quantityPackDetails.forEach(function (quantityPack) {
      skus[quantityPack.skuId] = quantityPack;
    });
    return skus;
  }, {});
};

export var itemConfigToProductConfig = function itemConfigToProductConfig(itemConfigurations, productConfigurations, products) {
  if (productConfigurations) {
    return productConfigurations;
  } // Convert itemConfigurations to productConfigurations (ie merchandiseIds to skuIds)
  // Once product migration is complete and all uses of CheckoutButton are passing in
  // productConfigurations instead of itemConfigurations, we will not need this util. We will
  // be able to use productConfigurations directly.


  var skuMap = getSkuMap(products);
  return itemConfigurations.map(function (_ref) {
    var merchandiseId = _ref.merchandiseId,
        quantity = _ref.quantity;

    var _Object$values$find = Object.values(skuMap).find(function (product) {
      return product.itemId === merchandiseId;
    }),
        skuId = _Object$values$find.skuId;

    return {
      skuId: skuId,
      quantity: quantity
    };
  });
};
export var getIsQuantityUpgrade = function getIsQuantityUpgrade(products) {
  var productConfigurations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (productConfigurations.length !== 1) return false;
  var skuMap = getSkuMap(products);
  var skuId = productConfigurations[0].skuId;
  return skuMap[skuId].skuType === QUANTITY_PACK;
};
export var getSkuIdFromApiName = function getSkuIdFromApiName(products, name) {
  var productInfo = products.find(function (_ref2) {
    var apiName = _ref2.apiName;
    return apiName === name;
  });
  return productInfo.productVersions.find(function (product) {
    return product.versionType === 'CURRENT';
  }).skuId;
};