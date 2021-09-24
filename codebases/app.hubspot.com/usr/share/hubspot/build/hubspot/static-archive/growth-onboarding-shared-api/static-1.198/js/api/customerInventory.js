'use es6';

import http from 'hub-http/clients/apiClient';
export var getCustomerInventory = function getCustomerInventory() {
  return http.get('customer-inventory/v1/inventory');
};
export var isPaidHub = function isPaidHub() {
  return getCustomerInventory().then(function (customerInventory) {
    var _customerInventory$pr = customerInventory.products,
        products = _customerInventory$pr === void 0 ? [] : _customerInventory$pr,
        _customerInventory$no = customerInventory.nonRecurringProducts,
        nonRecurringProducts = _customerInventory$no === void 0 ? [] : _customerInventory$no;
    return products.length > 0 || nonRecurringProducts.length > 0;
  });
};