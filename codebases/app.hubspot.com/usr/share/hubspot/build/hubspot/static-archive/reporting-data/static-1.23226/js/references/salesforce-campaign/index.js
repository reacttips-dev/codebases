'use es6';

import { Map as ImmutableMap } from 'immutable';
import { DEFAULT_NULL_VALUES, GLOBAL_NULL } from '../../constants/defaultNullValues';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { makeOption } from '../Option';

var batch = function batch(ids) {
  return http.post("sfdc/v1/campaigns/batch", {
    data: ids.filter(function (id) {
      return id !== DEFAULT_NULL_VALUES.ENUMERATION;
    })
  }).then(toJS);
};

export var generateSalesforceCampaignLabel = function generateSalesforceCampaignLabel(campaignInfo, key) {
  var name = campaignInfo.get('name');
  return !name && key === GLOBAL_NULL ? null : name || key;
};
export default (function (ids) {
  return batch(ids).then(function (campaigns) {
    return campaigns.reduce(function (options, _ref) {
      var id = _ref.id,
          name = _ref.name;
      return options.set(id, makeOption(id, generateSalesforceCampaignLabel(ImmutableMap({
        name: name
      }), id)));
    }, ImmutableMap());
  });
});