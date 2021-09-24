'use es6';

import { fromJS } from 'immutable';
import { Promise } from '../../../lib/promise';
import prefix from '../../../lib/prefix';
import { EXPERIMENTAL_REVENUE } from '../../../constants/dataTypes';
import getCountProperty from '../../partial/count-property';
import createPropertiesGetterFromGroups from '../../createPropertiesGetterFromGroups';
var translate = prefix('reporting-data.properties.recurring-revenue');
var translateGroup = prefix('reporting-data.groups.recurring-revenue');
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(fromJS([{
    name: 'experimentalRevenueInfo',
    displayName: translateGroup('group'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [{
      name: 'Revenue',
      label: translate('date'),
      type: 'datetime'
    }, {
      name: 'recurring_revenue',
      label: translate('recurringRevenue'),
      type: 'datetime'
    }, {
      name: 'lostRecurringRevenue',
      label: translate('lostRecurringRevenue'),
      type: 'currency'
    }, {
      name: 'newRecurringRevenue',
      label: translate('newRecurringRevenue'),
      type: 'currency'
    }, {
      name: 'existingRecurringRevenue',
      label: translate('existingRecurringRevenue'),
      type: 'currency'
    }]
  }]));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
  return properties.merge(getCountProperty(EXPERIMENTAL_REVENUE));
});