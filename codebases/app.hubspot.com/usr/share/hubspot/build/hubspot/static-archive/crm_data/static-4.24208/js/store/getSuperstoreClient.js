'use es6';

import Superstore, { IndexedDB } from 'superstore';
export var defaultNamespace = 'crm-data-cache';
var client;
export var getSuperstoreClient = function getSuperstoreClient() {
  var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultNamespace;

  if (!client) {
    client = new Superstore({
      backend: IndexedDB,
      namespace: namespace
    }).open();
  }

  return client;
};