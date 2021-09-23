'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { ENGAGEMENT_EMAILS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCommonPropertyGroups from '../partial/engagement-common';
import countProperty from '../partial/count-property';
import engagementModule from '../../dataTypeDefinitions/inboundDb/engagement';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
var translate = prefix('reporting-data.properties.engagementEmail');
var translateGroup = prefix('reporting-data.groups.engagement');
export var getEngagementEmailPropertyGroups = function getEngagementEmailPropertyGroups() {
  return Promise.resolve(List.of(fromJS({
    name: 'engagementEmailInfo',
    displayName: translateGroup('engagementEmailInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [{
      name: 'email.subject',
      label: translate('subject'),
      type: 'string'
    }, {
      name: 'email.text',
      label: translate('text'),
      type: 'string',
      hidden: true
    }, {
      name: 'email.html',
      label: translate('html'),
      type: 'string'
    }, {
      name: 'email.trackerKey',
      label: translate('trackerKey'),
      type: 'string',
      hidden: true
    }, {
      name: 'email.messageId',
      label: translate('messageId'),
      type: 'string',
      hidden: true
    }, {
      name: 'email.threadId',
      label: translate('threadId'),
      type: 'string',
      hidden: true
    }, {
      name: 'email.status',
      label: translate('status'),
      type: 'string'
    }, {
      name: 'email.sentVia',
      label: translate('sentVia'),
      type: 'string'
    }, {
      name: 'email.attachedVideoId',
      label: translate('attachedVideoId'),
      type: 'string'
    }, {
      name: 'email.attachedVideoOpened',
      label: translate('attachedVideoOpened'),
      type: 'bool'
    }, {
      name: 'email.attachedVideoWatched',
      label: translate('attachedVideoWatched'),
      type: 'bool'
    }]
  })));
};
export var getPropertyGroups = function getPropertyGroups() {
  return getEngagementEmailPropertyGroups().then(function (engagementEmailPropertyGroups) {
    return Promise.resolve(List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(engagementEmailPropertyGroups))));
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(ENGAGEMENT_EMAILS));
  })().then(overridePropertyTypes(engagementModule.getInboundSpec()));
};