'use es6';

import { Map as ImmutableMap } from 'immutable';
import Request from '../../request/Request';
import * as http from '../../request/http';
import { makeOption } from '../Option';
var URL = 'inbounddbproducts/v1/products/batch';
export var generateProductLabel = function generateProductLabel(productInfo) {
  return productInfo.get('name');
};
export default (function (ids) {
  return http.retrieve(Request.get({
    url: URL,
    query: {
      id: ids,
      properties: 'name',
      includeDeletes: true
    }
  })).then(function (response) {
    return ImmutableMap(response.map(function (product, id) {
      return makeOption(id, product.getIn(['properties', 'name', 'value']));
    }));
  });
});