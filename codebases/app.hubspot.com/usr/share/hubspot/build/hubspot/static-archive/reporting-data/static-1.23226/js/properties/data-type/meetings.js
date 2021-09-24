'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Map as ImmutableMap, List, fromJS } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { MEETINGS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCommonPropertyGroups from '../partial/engagement-common';
import getQuotasProperties from '../partial/quotas';
import countProperty from '../partial/count-property';
import engagementModule from '../../dataTypeDefinitions/inboundDb/engagement';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
import { ENUMERATION } from '../../constants/property-types';
var translateMeetingOutcomes = prefix('reporting-data.properties.meetings.outcomes');
var translateMeetings = prefix('reporting-data.properties.meetings');
var translateGroup = prefix('reporting-data.groups.engagement');
export var getMeetingPropertyGroups = function getMeetingPropertyGroups() {
  return Promise.resolve(List.of(ImmutableMap({
    name: 'meetingInfo',
    displayName: translateGroup('meetingInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: List([ImmutableMap({
      name: 'meeting.body',
      label: translateMeetings('description'),
      type: 'string'
    }), ImmutableMap({
      name: 'meeting.title',
      label: translateMeetings('title'),
      type: 'string'
    }), ImmutableMap({
      name: 'meeting.source',
      label: translateMeetings('source'),
      type: 'string'
    }), ImmutableMap({
      name: 'meeting.startTime',
      label: translateMeetings('startTime'),
      type: 'date'
    }), ImmutableMap({
      name: 'meeting.meetingOutcome',
      label: translateMeetings('outcome'),
      type: ENUMERATION,
      options: fromJS([{
        label: translateMeetingOutcomes('scheduled'),
        value: 'SCHEDULED'
      }, {
        label: translateMeetingOutcomes('completed'),
        value: 'COMPLETED'
      }, {
        label: translateMeetingOutcomes('rescheduled'),
        value: 'RESCHEDULED'
      }, {
        label: translateMeetingOutcomes('noshow'),
        value: 'NO_SHOW'
      }, {
        label: translateMeetingOutcomes('canceled'),
        value: 'CANCELED'
      }])
    })])
  })));
};
export var getPropertyGroups = function getPropertyGroups() {
  return getMeetingPropertyGroups().then(function (meetingPropertyGroups) {
    return List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(meetingPropertyGroups)));
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(MEETINGS)).merge(getQuotasProperties());
  })().then(overridePropertyTypes(engagementModule.getInboundSpec()));
};