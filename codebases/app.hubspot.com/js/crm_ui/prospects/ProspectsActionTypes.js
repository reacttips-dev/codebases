'use es6';

import uniqueActionTypes from 'crm_data/flux/uniqueActionTypes';
var ProspectsActionTypes = uniqueActionTypes({
  PROSPECTS_LOADING: 'PROSPECTS_LOADING',
  PROSPECT_ADD_SUCCESS: 'PROSPECT_ADD_SUCCESS',
  PROSPECTS_UPDATE_SUCCESS: 'PROSPECTS_UPDATE_SUCCESS'
});
export var PROSPECTS_LOADING = ProspectsActionTypes.PROSPECTS_LOADING;
export var PROSPECT_ADD_SUCCESS = ProspectsActionTypes.PROSPECT_ADD_SUCCESS;
export var PROSPECTS_UPDATE_SUCCESS = ProspectsActionTypes.PROSPECTS_UPDATE_SUCCESS;
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}