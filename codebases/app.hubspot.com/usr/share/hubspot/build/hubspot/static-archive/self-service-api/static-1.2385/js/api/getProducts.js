'use es6';

import Raven from 'Raven';
import http from 'hub-http/clients/apiClient';
import enviro from 'enviro';
import { PROD, QA } from 'self-service-api/constants/Environments';

var _cachedProducts;

export var getProducts = function getProducts() {
  if (_cachedProducts) {
    return _cachedProducts;
  }

  _cachedProducts = http.get('monetization-service/v3/product').catch(function (error) {
    _cachedProducts = null;

    if (error && error.status === 0) {
      return;
    }

    Raven.captureException(new Error('Failed to fetch products'), {
      extra: {
        error: error
      }
    });
  });
  return _cachedProducts;
};

var _cachedProductsOwned;

export var getOwnedProducts = function getOwnedProducts() {
  if (_cachedProductsOwned) {
    return _cachedProductsOwned;
  }

  _cachedProductsOwned = http.get('monetization-service/v3/product/owned').catch(function (error) {
    _cachedProductsOwned = null;
    var env = (enviro.isProd() ? PROD : QA).toUpperCase();
    Raven.captureException(new Error("[" + env + "] Failed to fetch products owned"), {
      extra: {
        error: error
      }
    });
  });
  return _cachedProductsOwned;
};