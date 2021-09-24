'use es6';

import { handleImportError } from '../../util/ErrorUtil';
var promise = import('./AblyManager'
/* webpackChunkName: "ably" */
).then(function (mod) {
  return mod.default;
});
export default {
  setup: function setup(crossTab) {
    promise.then(function (Manager) {
      return Manager.setup(crossTab);
    }).catch(handleImportError);
  }
};