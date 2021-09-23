'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import prefix from '../../lib/prefix';
import isBetPortal from '../../lib/isBetPortal';
import * as referencedObjectTypes from '../../constants/referencedObjectTypes';
import { getBetEngagementPropertyGroups } from './bet-engagement';
import offlineSources from '../../retrieve/unified/options/offlineSources';
var translate = prefix('reporting-data.properties.engagement');
var translateGroup = prefix('reporting-data.groups.engagement');
var translateCommon = prefix('reporting-data.properties.common');
export default (function () {
  return fromJS([{
    name: 'engagementInfo',
    displayName: translateGroup('engagementInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [{
      name: 'associations.contact',
      label: translateCommon('associatedContacts'),
      type: 'enumeration',
      hidden: false,
      blocklistedForFiltering: true
    }, {
      name: 'associations.company',
      label: translateCommon('associatedCompanies'),
      type: 'enumeration',
      hidden: false,
      blocklistedForFiltering: true
    }, {
      name: 'associations.deal',
      label: translateCommon('associatedDeals'),
      type: 'enumeration',
      hidden: false,
      blocklistedForFiltering: true
    }, {
      name: 'engagement.id',
      label: translate('instance'),
      type: 'string',
      hidden: true
    }, {
      name: 'engagement.details',
      label: translate('details'),
      type: 'string',
      blocklistedForFiltering: true
    }, {
      name: 'engagement.timestamp',
      label: translate('timestamp'),
      type: 'datetime'
    }, {
      name: 'engagement.createdAt',
      label: translateCommon('created'),
      type: 'datetime'
    }, {
      name: 'engagement.ownerId',
      label: translate('owner'),
      type: 'enumeration',
      externalOptions: true,
      referencedObjectType: referencedObjectTypes.OWNER,
      defaultNullValue: 0
    }, {
      name: 'engagement.createdBy',
      label: translate('createdBy'),
      type: 'enumeration',
      externalOptions: true,
      referencedObjectType: referencedObjectTypes.USER,
      defaultNullValue: 0
    }, {
      name: 'engagement.lastUpdated',
      label: translateCommon('updated'),
      type: 'datetime',
      hidden: true
    }, {
      name: 'engagement.modifiedBy',
      label: translate('modifiedBy'),
      type: 'enumeration',
      externalOptions: true,
      referencedObjectType: referencedObjectTypes.USER,
      defaultNullValue: 0,
      hidden: true
    }, {
      name: 'engagement.type',
      label: translate('type'),
      type: 'enumeration',
      options: [{
        value: 'EMAIL',
        label: translate('engagementType.email')
      }, {
        value: 'CALL',
        label: translate('engagementType.call')
      }, {
        value: 'MEETING',
        label: translate('engagementType.meeting')
      }, {
        value: 'TASK',
        label: translate('engagementType.task')
      }, {
        value: 'NOTE',
        label: translate('engagementType.note')
      }, {
        value: 'INCOMING_EMAIL',
        label: translate('engagementType.incomingEmail')
      }, {
        value: 'FORWARDED_EMAIL',
        label: translate('engagementType.forwardedEmail')
      }, {
        value: 'FB_MESSAGE',
        label: translate('engagementType.fbMessage')
      }, {
        value: 'CONVERSATION_SESSION',
        label: translate('engagementType.conversationSession')
      }, {
        value: 'PUBLISHING_TASK',
        label: translate('engagementType.publishingTask')
      }]
    }, {
      name: 'engagement.teamId',
      label: translate('team'),
      type: 'enumeration',
      externalOptions: true,
      referencedObjectType: referencedObjectTypes.TEAM,
      defaultNullValue: 0
    }, {
      name: 'engagement.source',
      label: translate('source'),
      type: 'enumeration',
      options: fromJS(offlineSources()).reduce(function (acc, val, key) {
        return acc.push(ImmutableMap({
          label: val,
          value: key
        }));
      }, List())
    }].concat(_toConsumableArray(isBetPortal() ? [] : [{
      name: 'engagement.activityType',
      label: translate('activityType'),
      type: 'enumeration',
      externalOptions: true
    }]))
  }]).concat(getBetEngagementPropertyGroups());
});