'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List, Map as ImmutableMap, fromJS } from 'immutable';
import prefix from '../../lib/prefix';
import { CALLS } from '../../constants/dataTypes';
import getDispositionOptions from '../partial/call-disposition-options';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCommonPropertyGroups from '../partial/engagement-common';
import getQuotasProperties from '../partial/quotas';
import countProperty from '../partial/count-property';
import engagementModule from '../../dataTypeDefinitions/inboundDb/engagement';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
var translate = prefix('reporting-data.properties.call');
var translateStatus = prefix('reporting-data.properties.call.callStatus');
var translateGroup = prefix('reporting-data.groups.engagement');
export var getCallPropertyGroups = function getCallPropertyGroups() {
  return getDispositionOptions().then(function (dispositionOptions) {
    return List([ImmutableMap({
      name: 'callInfo',
      displayName: translateGroup('callInfo'),
      displayOrder: 0,
      hubspotDefined: true,
      properties: List([ImmutableMap({
        name: 'call.status',
        label: translate('status'),
        type: 'enumeration',
        hidden: true,
        options: fromJS([{
          value: 'COMPLETED',
          label: translateStatus('completed')
        }, {
          value: 'NO_ANSWER',
          label: translateStatus('noAnswer')
        }, {
          value: 'QUEUED',
          label: translateStatus('queued')
        }, {
          value: 'FAILED',
          label: translateStatus('failed')
        }, {
          value: 'CANCELED',
          label: translateStatus('canceled')
        }, {
          value: 'BUSY',
          label: translateStatus('busy')
        }, {
          value: 'CONNECTING',
          label: translateStatus('connecting')
        }, {
          value: 'CALLING_CRM_USER',
          label: translateStatus('callingCrmUser')
        }, {
          value: 'RINGING',
          label: translateStatus('ringing')
        }, {
          value: 'IN_PROGRESS',
          label: translateStatus('inProgress')
        }])
      }), ImmutableMap({
        name: 'call.durationMilliseconds',
        label: translate('duration'),
        type: 'duration'
      }), ImmutableMap({
        name: 'call.disposition',
        label: translate('disposition'),
        type: 'enumeration',
        options: dispositionOptions
      }), ImmutableMap({
        name: 'call.body',
        label: translate('body'),
        type: 'string'
      })])
    })]);
  });
};
export var getPropertyGroups = function getPropertyGroups() {
  return getCallPropertyGroups().then(function (callPropertyGroups) {
    return List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(callPropertyGroups)));
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(CALLS)).merge(getQuotasProperties());
  })().then(overridePropertyTypes(engagementModule.getInboundSpec()));
};