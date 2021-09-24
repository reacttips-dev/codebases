'use es6';

import chunk from '../../lib/async/chunk';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
export var get = function get() {
  return http.get('owners/v2/owners').then(toJS);
};
export var batch = function batch(ids) {
  return chunk(function (group) {
    return http.get('owners/v2/owners/batch', {
      query: {
        ownerId: group.toArray(),
        includeSignature: false
      }
    }).then(toJS);
  }, function (responses) {
    return responses.reduce(function (memo, response) {
      return Object.assign({}, memo, {}, response);
    }, {});
  }, ids);
};