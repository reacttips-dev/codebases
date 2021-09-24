'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap } from 'immutable';
import { has } from '../../lib/has';
import prefix from '../../lib/prefix';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { channels } from '../../retrieve/unified/options/social';
import { makeOption } from '../Option';
var translate = prefix('reporting-data.properties.unified.options.social-channels');
var mapping = {
  Twitter: 'tw',
  FacebookPage: 'fbp',
  Instagram: 'ig',
  LinkedInStatus: 'lis',
  LinkedInCompanyPage: 'lcp',
  GooglePlusPage: 'gpp',
  YouTube: 'ytc'
};

var convert = function convert(key) {
  var _key$split = key.split(':'),
      _key$split2 = _slicedToArray(_key$split, 2),
      type = _key$split2[0],
      id = _key$split2[1];

  var namespace = has(mapping, type) ? mapping[type] : type;
  return (namespace + "-" + id).toLowerCase();
};

var get = function get() {
  return http.get('broadcast/v2/channels').then(toJS);
};

var getSocialChannels = function getSocialChannels() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$useAnalyticsType = _ref.useAnalyticsType,
      useAnalyticsType = _ref$useAnalyticsType === void 0 ? false : _ref$useAnalyticsType,
      _ref$useChannelId = _ref.useChannelId,
      useChannelId = _ref$useChannelId === void 0 ? false : _ref$useChannelId;

  return get().then(function () {
    var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return response.reduce(function (options, _ref2) {
      var channelKey = _ref2.channelKey,
          channelId = _ref2.channelId,
          channelSlug = _ref2.channelSlug,
          name = _ref2.name;
      var value = channelKey;

      if (useAnalyticsType) {
        value = convert(channelKey);
      } else if (useChannelId) {
        value = channelId;
      }

      return options.set(value, makeOption(value, name + " (" + translate(channelSlug) + ")"));
    }, ImmutableMap());
  });
};

export default getSocialChannels;
export var socialChannels = function socialChannels(args) {
  return getSocialChannels(args).then(function (options) {
    return options.reduce(function (breakdowns, option) {
      return Object.assign({}, breakdowns, _defineProperty({}, option.get('value'), option.get('label')));
    }, {});
  });
};
export var socialChannelsOrKeys = function socialChannelsOrKeys(breakdownType) {
  return breakdownType === 'channelType' ? Promise.resolve(channels()) : socialChannels();
};
export var analyticsSocialChannels = function analyticsSocialChannels() {
  return socialChannels({
    useAnalyticsType: true
  });
};