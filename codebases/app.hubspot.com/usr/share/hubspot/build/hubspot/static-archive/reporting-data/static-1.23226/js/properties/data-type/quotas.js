'use es6';

import { fromJS } from 'immutable';
import { QUOTAS } from '../../constants/dataTypes';
import prefix from '../../lib/prefix';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
var translate = prefix('reporting-data.properties.quotas');
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(fromJS([{
    name: 'quotainformation',
    displayName: 'Quota Information',
    displayOrder: 0,
    hubspotDefined: false,
    properties: [{
      name: 'hs_created_by',
      label: 'Created by',
      description: 'The person who created the quota',
      groupName: 'quotainformation',
      type: 'number',
      fieldType: 'text',
      options: [],
      hidden: false
    }, {
      name: 'hs_createdate',
      label: 'Create date',
      description: 'The date the quota was created',
      groupName: 'quotainformation',
      type: 'datetime',
      fieldType: 'text',
      options: [],
      hidden: false
    }, {
      name: 'hs_currency',
      label: 'Currency',
      description: 'The type of currency used for revenue quotas',
      groupName: 'quotainformation',
      type: 'string',
      fieldType: 'text',
      options: [],
      hidden: false,
      deleted: null
    }, {
      name: 'hs_lastmodifieddate',
      label: 'Last modified date',
      description: 'The date the quota was last modified',
      groupName: 'quotainformation',
      type: 'datetime',
      fieldType: 'text',
      options: [],
      hidden: false
    }, {
      name: 'hs_period',
      label: 'Quota period',
      description: 'The period of this quota, such as monthly',
      groupName: 'quotainformation',
      type: 'enumeration',
      fieldType: 'checkbox',
      options: [{
        hidden: false,
        label: 'Weekly',
        value: 'WEEKLY',
        readOnly: null,
        description: 'This is a weekly quota',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Monthly',
        value: 'MONTHLY',
        readOnly: null,
        description: 'This is a monthly quota',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Quarterly',
        value: 'QUARTERLY',
        readOnly: null,
        description: 'This is a quarterly quota',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Annually',
        value: 'ANNUALLY',
        readOnly: null,
        description: 'This is a annually quota',
        displayOrder: -1,
        doubleData: null
      }],
      hidden: false
    }, {
      name: 'hs_period_end_date',
      label: 'Period end date',
      description: 'Date that the period of this quota ends',
      groupName: 'quotainformation',
      type: 'datetime',
      fieldType: 'text',
      options: [],
      hidden: false
    }, {
      name: 'hs_period_start_date',
      label: 'Period start data',
      description: 'Date that the period of this quota starts',
      groupName: 'quotainformation',
      type: 'datetime',
      fieldType: 'text',
      options: [],
      hidden: false
    }, {
      name: 'hs_pipeline_id',
      label: 'Pipeline ID',
      description: 'The pipeline associated with the quota',
      groupName: 'quotainformation',
      type: 'enumeration',
      fieldType: 'text',
      options: [],
      hidden: false
    }, {
      name: 'hs_quota_type',
      label: 'Quota type',
      description: 'The type of value for the quota, such as revenue',
      groupName: 'quotainformation',
      type: 'enumeration',
      fieldType: 'checkbox',
      options: [{
        hidden: false,
        label: 'Average NPS',
        value: 'AVERAGE_NPS',
        readOnly: null,
        description: 'This is a quota for average NPS',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Average resolution time',
        value: 'AVERAGE_RESOLUTION_TIME',
        readOnly: null,
        description: 'This is a quota for average resolution time',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Average response time',
        value: 'AVERAGE_RESPONSE_TIME',
        readOnly: null,
        description: 'This is a quota for average response time',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Calls Made',
        value: 'CALLS_MADE',
        readOnly: null,
        description: 'This is a quota for calls made',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Deals made',
        value: 'DEALS_CREATED',
        readOnly: null,
        description: 'This is a quota for deals created',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Meetings Booked',
        value: 'MEETINGS_BOOKED',
        readOnly: null,
        description: 'This is a quota for meetings booked',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Revenue Closed',
        value: 'REVENUE',
        readOnly: null,
        description: 'This is a quota for revenue closed',
        displayOrder: -1,
        doubleData: null
      }, {
        hidden: false,
        label: 'Tickets Closed',
        value: 'TICKETS_CLOSED',
        readOnly: null,
        description: 'This is a quota for tickets closed',
        displayOrder: -1,
        doubleData: null
      }],
      hidden: false
    }, {
      name: 'hs_value',
      label: 'Quota amount',
      description: 'The value of the quota',
      groupName: 'quotainformation',
      type: 'number',
      options: [],
      hidden: false
    }, {
      name: 'hubspot_owner_id',
      label: 'Quota owner',
      description: 'The owner assigned to the quota',
      groupName: 'quotainformation',
      type: 'enumeration',
      options: [],
      hidden: false
    }]
  }]));
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(QUOTAS)).merge(fromJS({
      hubspot_owner_id: {
        name: 'hubspot_owner_id',
        label: translate('owner'),
        type: 'enumeration'
      }
    }));
  })();
};