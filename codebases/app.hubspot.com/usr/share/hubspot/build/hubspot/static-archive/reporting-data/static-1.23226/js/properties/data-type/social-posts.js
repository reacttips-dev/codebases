'use es6';

import { fromJS } from 'immutable';
import prefix from '../../lib/prefix';
import { Promise } from '../../lib/promise';
import { SOCIAL_POSTS } from '../../constants/dataTypes';
import socialPostsModule from '../../dataTypeDefinitions/inboundDb/social-posts';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCountProperty from '../partial/count-property'; // lb NOTE - do not want to use /social-reporting/v1/report/posts/groups to load properties because its not translated
// SOCIAL_POSTS has the facade of inbounddb but its not, these are static on the backend, avoiding the request and having a defined set of properties in FE is advantageous

var translate = prefix('reporting-data.properties.socialPosts');
var translateGroup = prefix('reporting-data.groups.socialPosts');
var translateOptions = prefix('reporting-data.properties.unified.options');
var ACCOUNT_TYPES = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'];
export var CHANNEL_TYPES = ['FacebookPage', 'Instagram', 'Twitter', 'LinkedInStatus', 'LinkedInCompanyPage', 'YouTube'];
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(fromJS([{
    name: 'socialPostInfo',
    displayName: translateGroup('socialPostInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [{
      name: 'key',
      type: 'string',
      label: translate('key')
    }, {
      name: 'publishedAt',
      type: 'datetime',
      label: translate('publishedAt')
    }, {
      name: 'channelType',
      type: 'enumeration',
      label: translate('channelType'),
      options: CHANNEL_TYPES.map(function (channelType) {
        return {
          value: channelType,
          label: translateOptions("social-channels." + channelType.toLowerCase())
        };
      })
    }, {
      name: 'channelId',
      type: 'string',
      label: translate('channelId')
    }, {
      name: 'foreignId',
      type: 'string',
      label: translate('foreignId')
    }, {
      name: 'accountType',
      type: 'enumeration',
      label: translate('accountType'),
      options: ACCOUNT_TYPES.map(function (accountType) {
        return {
          value: accountType,
          label: translateOptions("social-accounts." + accountType.toLowerCase())
        };
      })
    }, {
      name: 'campaignGuid',
      type: 'string',
      label: translate('campaignGuid')
    }, {
      name: 'broadcastGuid',
      type: 'string',
      label: translate('broadcastGuid')
    }, {
      name: 'mediaType',
      type: 'string',
      label: translate('mediaType')
    }, {
      name: 'remoteContentId',
      type: 'string',
      label: translate('remoteContentId')
    }, {
      name: 'remoteContentType',
      type: 'string',
      label: translate('remoteContentType')
    }, {
      name: 'interactionsTotal',
      type: 'number',
      label: translate('stats.interactions')
    }, {
      name: 'interactionsClassicTotal',
      type: 'number',
      label: translate('stats.interactions')
    }, {
      name: 'body',
      type: 'string',
      label: translate('body')
    }, {
      name: 'stats.likes',
      type: 'number',
      label: translate('stats.likes')
    }, {
      name: 'stats.dislikes',
      type: 'number',
      label: translate('stats.dislikes')
    }, {
      name: 'stats.comments',
      type: 'number',
      label: translate('stats.comments')
    }, {
      name: 'stats.shares',
      type: 'number',
      label: translate('stats.shares')
    }, {
      name: 'stats.impressions',
      type: 'number',
      label: translate('stats.impressions')
    }, {
      name: 'stats.clicks',
      type: 'number',
      label: translate('stats.clicks')
    }, {
      name: 'stats.videoViews',
      type: 'number',
      label: translate('stats.videoViews')
    }, {
      name: 'stats.videoMinutesWatched',
      type: 'duration',
      durationUnit: 'minutes',
      label: translate('stats.videoMinutesWatched')
    }, {
      name: 'stats.videoAverageViewPercentage',
      type: 'percent',
      label: translate('stats.videoAverageViewPercentage')
    }, {
      name: 'stats.videoAverageViewDurationSeconds',
      type: 'duration',
      durationUnit: 'seconds',
      label: translate('stats.videoAverageViewDurationSeconds')
    }, // search properties
    {
      name: 'id',
      type: 'enumeration',
      label: translate('id')
    }]
  }]));
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(getCountProperty(SOCIAL_POSTS));
  })().then(overridePropertyTypes(socialPostsModule.getInboundSpec()));
};