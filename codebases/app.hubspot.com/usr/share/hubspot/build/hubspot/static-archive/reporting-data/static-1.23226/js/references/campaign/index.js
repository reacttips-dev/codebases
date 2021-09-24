'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import I18n from 'I18n';
import { List, Map as ImmutableMap } from 'immutable';
import { GLOBAL_NULL } from '../../constants/defaultNullValues';
import chunk from '../../lib/async/chunk';
import { Promise } from '../../lib/promise';
import * as http from '../../request/http';
import Request from '../../request/Request';
import { makeOption } from '../Option';
var URL = 'campaigns/v1/campaigns/guids';
var ALL_CAMPAIGNS_URL = 'campaigns/v1/campaigns';
var MAX_BATCH_SIZE = 300;
export var generateCampaignLabel = function generateCampaignLabel(campaign, key) {
  var name = campaign.get('display_name', key !== GLOBAL_NULL ? key : null);
  return campaign.get('deleted') === 'true' || campaign.get('deleted') === true ? I18n.text('reporting-data.references.campaign.deleted', {
    name: name
  }) : name;
};

var batch = function batch(ids) {
  return chunk(function (group) {
    return http.retrieve(Request.get({
      url: URL,
      query: {
        guid: group,
        includeDeletes: true
      }
    }));
  }, function (responses) {
    return responses.reduce(function (memo, response) {
      return memo.concat(response);
    }, List());
  }, ids, MAX_BATCH_SIZE);
};

var getCampaigns = function getCampaigns(ids) {
  if (ids.size === 0) {
    return Promise.resolve(ImmutableMap());
  }

  return batch(ids).then(function (campaigns) {
    return campaigns.reduce(function (memo, campaign) {
      var guid = campaign.get('guid');
      return memo.set(guid, makeOption(guid, generateCampaignLabel(campaign)));
    }, ImmutableMap());
  });
};

export default getCampaigns;
export var getAllCampaigns = function getAllCampaigns() {
  return http.retrieve(Request.get({
    url: ALL_CAMPAIGNS_URL,
    query: {
      includeDeletes: true
    }
  })).then(function (campaigns) {
    return ImmutableMap(campaigns.map(function (campaign) {
      var guid = campaign.get('guid');
      return [guid, makeOption(guid, generateCampaignLabel(campaign))];
    }));
  });
};
export var campaigns = function campaigns(ids) {
  return getCampaigns(List(ids)).then(function (options) {
    return options.reduce(function (breakdowns, option) {
      return Object.assign({}, breakdowns, _defineProperty({}, option.get('value'), option.get('label')));
    }, {});
  });
};