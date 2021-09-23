'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, Map as ImmutableMap, List } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { CONVERSATIONS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCommonPropertyGroups from '../partial/engagement-common';
import getCountProperty from '../partial/count-property';
import engagementModule from '../../dataTypeDefinitions/inboundDb/engagement';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
var translate = prefix('reporting-data.properties.conversations');
var translateGroup = prefix('reporting-data.groups.conversations');

var withNamespace = function withNamespace(namespace, properties) {
  return fromJS(properties.map(function (property) {
    return Object.assign({}, property, {
      name: namespace + "." + property.name
    });
  }));
};

export var getConversationPropertyGroups = function getConversationPropertyGroups() {
  return Promise.resolve(List.of(ImmutableMap({
    name: 'conversationInfo',
    displayName: translateGroup('conversationInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: withNamespace('conversationSession', [{
      name: 'visitorStartTime',
      label: translate('visitorStartTime'),
      type: 'datetime'
    }, {
      name: 'visitorEndTime',
      label: translate('visitorEndTime'),
      type: 'datetime'
    }, {
      name: 'visitorWaitTimeMilliseconds',
      label: translate('visitorWaitTimeMilliseconds'),
      type: 'duration'
    }, {
      name: 'sessionDurationMilliseconds',
      label: translate('sessionDurationMilliseconds'),
      type: 'duration'
    }, {
      name: 'agentJoinTime',
      label: translate('agentJoinTime'),
      type: 'datetime'
    }, {
      name: 'numVisitorMessages',
      label: translate('numVisitorMessages'),
      type: 'number'
    }, {
      name: 'numAgentMessages',
      label: translate('numAgentMessages'),
      type: 'number'
    }, {
      name: 'online',
      label: translate('online'),
      type: 'bool',
      hidden: true
    }, {
      name: 'isBot',
      label: translate('isBot'),
      type: 'bool'
    }, {
      name: 'fullUrl',
      label: translate('fullUrl'),
      type: 'string'
    }, {
      name: 'conversationSource',
      label: translate('conversationSource'),
      type: 'enumeration',
      options: [{
        value: 'LIVE_CHAT',
        label: translate('conversationSources.liveChat')
      }, {
        value: 'FB_MESSENGER',
        label: translate('conversationSources.facebookMessenger')
      }]
    }, {
      name: 'threadId',
      label: translate('threadId'),
      type: 'string',
      hidden: true
    }, {
      name: 'sessionClosedAt',
      label: translate('sessionClosedAt'),
      type: 'datetime'
    }, {
      name: 'agentResponseTimeMilliseconds',
      label: translate('agentResponseTimeMilliseconds'),
      type: 'duration'
    }])
  })));
};
export var getPropertyGroups = function getPropertyGroups() {
  return getConversationPropertyGroups().then(function (conversationPropertyGroups) {
    return Promise.resolve(List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(conversationPropertyGroups))));
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(getCountProperty(CONVERSATIONS));
  })().then(overridePropertyTypes(engagementModule.getInboundSpec()));
};