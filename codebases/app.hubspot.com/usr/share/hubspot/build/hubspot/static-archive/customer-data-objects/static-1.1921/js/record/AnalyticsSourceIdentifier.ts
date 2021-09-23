import { getProperty } from '../record/ObjectRecordAccessors';
import { IMPORT, INTEGRATION, SOCIAL } from 'customer-data-objects/property/PropertySourceTypes';
import { EMAIL_MARKETING, OFFLINE } from 'customer-data-objects/property/VisitSourceTypes';
/**
 * Analytics source properties (`hs_analytics_source`, `hs_analytics_source_data_1`,
 * and `hs_analytics_source_data_2`) are used to track and attribute the original
 * source (i.e., the contact's first visit or interaction with a business)
 * that led to a contact's creation.
 *
 * These properties are set asynchronously after contact creation, by workers owned
 * by the #web-analytics-backend team. Once they're set, they get copied automatically
 * to associated companies and deals by workers owned by #crm-backend.
 *
 * For details on the values stored in these properties, see the following KB articles:
 *
 * - https://knowledge.hubspot.com/reports/what-do-the-properties-original-source-data-1-and-2-mean
 * - https://knowledge.hubspot.com/reports/how-were-contacts-added-to-hubspot-from-an-offline-source
 *
 * "Original source type" (`hs_analytics_source`)
 * -----
 * Set to a `VisitSource` constant. `OFFLINE` represents a variety of possible
 * direct sources (manual creation via the UI, API, integrations, import, internal
 * systems, etc.)
 *
 * "Original source drill-down 1" (`hs_analytics_source_data_1`)
 * -----
 * For `OFFLINE` sources, this will be a `PropertySource` constant.
 *
 * "Original source drill-down 2" (`hs_analytics_source_data_2`)
 * -----
 * For `OFFLINE` sources, the logic is complex. OSDD2 is "whatever the leadSourceId
 * is set to at time of contact creation, which can potentially be anything
 * if the contact creation is coming from an internal HubSpot system".
 */

export var SOURCE = 'hs_analytics_source';
export var DATA_1 = 'hs_analytics_source_data_1';
export var DATA_2 = 'hs_analytics_source_data_2';
export var VISIT_DATA_1 = 'sourceData1';
export var VISIT_DATA_2 = 'sourceData2'; // Values of the `hs_analytics_source` property indicating that a record was created from an import.
// Normally `hs_analytics_source` stores a `VisitSource`; legacy code also checked for 'IMPORTED',
// even though that isn't a valid enum value. It's unknown whether there are old records that have
// a value of `IMPORTED` , or whether this field is actually freeform and may in some circumstances
// still get set to a value that isn't in the `VisitSource` enum

var IMPORT_SOURCE_VALUES = [OFFLINE, 'IMPORTED'];
export function isSourceFromImport(_ref) {
  var analyticsSource = _ref.analyticsSource,
      analyticsSourceData1 = _ref.analyticsSourceData1;
  return analyticsSource && IMPORT_SOURCE_VALUES.includes(analyticsSource) && analyticsSourceData1 === IMPORT;
}
export function isSourceFromIntegration(_ref2) {
  var analyticsSourceData1 = _ref2.analyticsSourceData1;
  return analyticsSourceData1 === INTEGRATION;
}
export function isSourceFromEmailMarketing(_ref3) {
  var analyticsSource = _ref3.analyticsSource;
  return analyticsSource === EMAIL_MARKETING;
}
export function isSourceFromFacebookMessenger(_ref4) {
  var analyticsSourceData1 = _ref4.analyticsSourceData1,
      analyticsSourceData2 = _ref4.analyticsSourceData2;
  return analyticsSourceData1 === SOCIAL && analyticsSourceData2 === 'FacebookMessenger';
}
/**
 * @return {boolean} Whether a contact was created from an imported list.
 *   If so, the value in `hs_analytics_source_data_2` will be an import id.
 */

export function isFromImport(record) {
  return record && isSourceFromImport({
    analyticsSource: getProperty(record, SOURCE),
    analyticsSourceData1: getProperty(record, DATA_1)
  });
}
/**
 * @return {boolean} Whether a contact was created by an integration.
 *   If so, the value in `hs_analytics_source_data_2` will be an integration id.
 */

export function isFromIntegration(record) {
  return record && isSourceFromIntegration({
    analyticsSourceData1: getProperty(record, DATA_1)
  });
}
/**
 * @return {boolean} Whether a contact was created from from an email campaign.
 *   If so, the value in `hs_analytics_source_data_2` will be a campaign id.
 */

export function isFromEmailMarketing(record) {
  return record && isSourceFromEmailMarketing({
    analyticsSource: getProperty(record, SOURCE)
  });
}
/**
 * @return {boolean} Whether a contact was created from a Facebook Messenger chat.
 */

export function isFromFacebookMessenger(record) {
  return record && isSourceFromFacebookMessenger({
    analyticsSourceData1: getProperty(record, DATA_1),
    analyticsSourceData2: getProperty(record, DATA_2)
  });
}