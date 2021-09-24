'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap } from 'immutable';
import { LOCALSETTINGS } from 'crm_data/actions/ActionNamespaces';
import { dispatch } from 'crm_data/flux/dispatch';
import { setFrom } from 'crm_data/settings/LocalSettings';
export var save = function save(key, value) {
  var result = setFrom(localStorage, key, value);

  if (result === value) {
    var merges = ImmutableMap(_defineProperty({}, key, value));
    dispatch(LOCALSETTINGS + "_UPDATE_SUCCEEDED", merges);
  } else {
    dispatch(LOCALSETTINGS + "_UPDATE_FAILED");
  }
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}