'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { List } from 'immutable';
import { Promise } from '../../lib/promise';
import { ENGAGEMENT } from '../../constants/dataTypes';
import getCommonPropertyGroups from '../partial/engagement-common';
import { getCallPropertyGroups } from './calls';
import { getConversationPropertyGroups } from './conversations';
import { getNotePropertyGroups } from './notes';
import { getTaskPropertyGroups } from './tasks';
import { getPublishingTaskPropertyGroups } from './publishing-task';
import { getEngagementEmailPropertyGroups } from './engagement-emails';
import { getMeetingPropertyGroups } from './meetings';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
import engagementModule from '../../dataTypeDefinitions/inboundDb/engagement';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.all([getCallPropertyGroups(), getConversationPropertyGroups(), getNotePropertyGroups(), getEngagementEmailPropertyGroups(), getMeetingPropertyGroups(), getTaskPropertyGroups(), getPublishingTaskPropertyGroups()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 7),
        callPropertyGroups = _ref2[0],
        conversationPropertyGroups = _ref2[1],
        notePropertyGroups = _ref2[2],
        engagementEmailPropertyGroups = _ref2[3],
        meetingPropertyGroups = _ref2[4],
        taskPropertyGroups = _ref2[5],
        publishingTaskPropertyGroups = _ref2[6];

    return List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(callPropertyGroups), _toConsumableArray(conversationPropertyGroups), _toConsumableArray(notePropertyGroups), _toConsumableArray(engagementEmailPropertyGroups), _toConsumableArray(meetingPropertyGroups), _toConsumableArray(taskPropertyGroups), _toConsumableArray(publishingTaskPropertyGroups)));
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(ENGAGEMENT));
  })().then(overridePropertyTypes(engagementModule.getInboundSpec()));
};