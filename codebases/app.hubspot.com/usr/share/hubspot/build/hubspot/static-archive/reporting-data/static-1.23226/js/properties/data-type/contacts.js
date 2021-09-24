'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List } from 'immutable';
import prefix from '../../lib/prefix';
import { CONTACTS } from '../../constants/dataTypes';
import { ENUMERATION, BUCKETS } from '../../constants/property-types';
import { EQ, IN, HAS_PROPERTY } from '../../constants/operators';
import getInboundDbPropertyGroups from '../../retrieve/inboundDb/common/properties';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import lifecyclestages from '../partial/contacts-lifecyclestages';
import contactEvents from '../partial/contacts-events';
import enteredLifecyclestages from '../partial/contacts-entered-lifecyclestages';
import conversionProperty from '../partial/conversion-property';
import countProperty from '../partial/count-property';
import { mergeProperties } from '../mergeProperties';
import contactModule from '../../dataTypeDefinitions/inboundDb/contacts';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
import { DEFAULT_NULL_VALUES } from '../../constants/defaultNullValues';
var translate = prefix('reporting-data.properties.contacts');
var translateGroup = prefix('reporting-data.groups.contacts');
var translateCommon = prefix('reporting-data.properties.common');

var getScriptedPropertyGroup = function getScriptedPropertyGroup() {
  return fromJS({
    name: 'contactscripted',
    displayName: translateGroup('contactscripted'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [{
      name: 'BUCKET_customer',
      property: 'lifecyclestage',
      groupName: 'contactscripted',
      scripted: true,
      label: translate('BUCKET_customer'),
      type: BUCKETS,
      blocklistedForFiltering: true,
      options: [{
        value: 'CUSTOMER',
        label: translate('BUCKET_customer')
      }],
      buckets: [{
        name: 'CUSTOMER',
        operator: IN,
        values: ['customer']
      }]
    }, {
      name: 'BUCKET_sources',
      property: 'hs_analytics_source',
      groupName: 'contactscripted',
      label: translate('BUCKET_sources'),
      scripted: true,
      blocklistedForFiltering: true,
      type: BUCKETS,
      options: [{
        value: 'UNKNOWN',
        label: translate('buckets.UNKNOWN')
      }, {
        value: 'OFFLINE',
        label: translate('buckets.OFFLINE')
      }, {
        value: 'ONLINE',
        label: translate('buckets.ONLINE')
      }],
      buckets: [{
        name: 'OFFLINE',
        operator: EQ,
        value: 'OFFLINE'
      }, {
        name: 'ONLINE',
        operator: HAS_PROPERTY
      }, {
        name: 'UNKNOWN'
      }]
    }, // entered lifecycle bucket
    {
      name: 'BUCKET_createdate_enteredCount',
      property: 'createdate',
      groupName: 'contactscripted',
      scripted: true,
      blocklistedForFiltering: true,
      label: translate('BUCKET_createdate_enteredCount'),
      type: BUCKETS,
      options: [{
        value: 'YES',
        label: translateCommon('buckets.included')
      }, {
        value: 'NO',
        label: translateCommon('buckets.excluded')
      }]
    }].concat(_toConsumableArray(enteredLifecyclestages().toJS()))
  });
};

export var getPropertyGroups = function getPropertyGroups() {
  return getInboundDbPropertyGroups(CONTACTS).then(function (groups) {
    return mergeProperties(List([].concat(_toConsumableArray(groups), [getScriptedPropertyGroup()])), 'contactinformation', {
      'listMemberships.listId': {
        name: 'listMemberships.listId',
        label: translate('listMembership'),
        type: ENUMERATION,
        defaultNullValue: DEFAULT_NULL_VALUES.NUMBER,
        reportingOverwrittenNumericType: true,
        scripted: true,
        externalOptions: true
      },
      hubspot_team_id: {
        referencedObjectType: 'TEAM'
      },
      associatedcompanyid: {
        name: 'associatedcompanyid',
        label: translate('associatedCompanyId'),
        hidden: false
      },
      'formSubmissions.formId': {
        name: 'formSubmissions.formId',
        label: translate('formSubmission'),
        type: ENUMERATION,
        scripted: true,
        externalOptions: true
      },
      '_inbounddbio.importid_': {
        name: '_inbounddbio.importid_',
        label: translateCommon('inboundDbImport'),
        type: ENUMERATION,
        hidden: false,
        blocklistedForAggregation: true
      },
      lifecyclestage: {
        options: fromJS(lifecyclestages())
      },
      hs_contact_source_event: {
        name: 'hs_contact_source_event',
        label: translate('hs_contact_source_event'),
        type: ENUMERATION,
        options: fromJS(contactEvents()),
        hidden: true
      },
      // XXX: https://git.hubteam.com/HubSpot/reporting/pull/2975
      hs_analytics_num_visits: {
        label: translate('hs_analytics_num_visits')
      },
      hs_analytics_first_visit_timestamp: {
        label: translate('hs_analytics_first_visit_timestamp')
      },
      hs_analytics_last_visit_timestamp: {
        label: translate('hs_analytics_last_visit_timestamp')
      }
    });
  });
};
var getPropertiesPartial = createPropertiesGetterFromGroups(getPropertyGroups);
export var getProperties = function getProperties() {
  return getPropertiesPartial().then(function (properties) {
    var lifecyclestageLabel = properties.getIn(['lifecyclestage', 'label']);
    return properties.merge(countProperty(CONTACTS)).merge(conversionProperty()).merge(fromJS({
      vid: {
        name: 'vid',
        label: translate('contact'),
        type: 'string'
      },
      'pipeline.lifecyclestage': {
        name: 'pipeline.lifecyclestage',
        label: lifecyclestageLabel,
        type: ENUMERATION,
        options: fromJS(lifecyclestages())
      },
      'funnel.lifecyclestage': {
        name: 'funnel.lifecyclestage',
        label: lifecyclestageLabel,
        type: ENUMERATION,
        options: fromJS(lifecyclestages())
      }
    }));
  }).then(overridePropertyTypes(contactModule.getInboundSpec()));
};