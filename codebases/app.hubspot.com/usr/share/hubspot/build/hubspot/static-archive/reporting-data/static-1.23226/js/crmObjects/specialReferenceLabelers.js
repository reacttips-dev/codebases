'use es6';

import { GLOBAL_NULL } from '../constants/defaultNullValues'; // https://git.hubteam.com/HubSpot/reporting/blob/master/reporting-data/static-1.23226/js/dataTypeDefinitions/inboundDb/contacts.js#L63

export var generateAnalyticsSourceData2Label = function generateAnalyticsSourceData2Label(sourceInfo, key) {
  var label = sourceInfo.get('label');
  return !label && key === GLOBAL_NULL ? null : label || key;
};