'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
var URI = 'companyprospects/v1/preferences';
export var fetchFavorites = function fetchFavorites() {
  return ImmutableAPI.get(URI).then(function (result) {
    return result.reduce(function (map, val) {
      var domain = val.get('domain');

      if (val.get('favorite')) {
        map = map.set(domain, true);
      }

      return map;
    }, ImmutableMap());
  });
};
export var toggle = function toggle(domain, isFavorite) {
  var method = isFavorite ? 'delete' : 'put';
  return ImmutableAPI[method](URI + "/" + encodeURIComponent(domain) + "/favorite");
};
export var hide = function hide(hiddenDomains) {
  return ImmutableAPI.post(URI + "/hide", hiddenDomains);
};