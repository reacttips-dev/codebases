'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export var getProductInfoFromSkuId = function getProductInfoFromSkuId(products, id) {
  return products.find(function (product) {
    return product.productVersions.find(function (productVersion) {
      return productVersion.skuId === id;
    });
  }) || null;
};
export var getProductInfoFromQuantitySkuId = function getProductInfoFromQuantitySkuId(products, id) {
  return products.find(function (product) {
    return product.productVersions.find(function (productVersion) {
      return productVersion.quantityPackDetails.find(function (quantityPack) {
        return quantityPack.skuId === id;
      });
    });
  }) || null;
};
export var getSkuMap = function getSkuMap(products) {
  var productVersions = products.reduce(function (acc, product) {
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
export var getProductMap = function getProductMap(products) {
  var productMap = products.reduce(function (acc, product) {
    var id = product.id;
    return Object.assign({}, acc, _defineProperty({}, id, Object.assign({}, product, {
      productVersions: product.productVersions.map(function (_ref) {
        var skuId = _ref.skuId;
        return skuId;
      })
    })));
  }, {});
  return productMap;
};