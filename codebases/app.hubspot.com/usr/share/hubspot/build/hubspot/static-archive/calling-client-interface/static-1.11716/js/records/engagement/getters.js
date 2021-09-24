'use es6';

import get from 'transmute/get';
import getIn from 'transmute/getIn';
import { CALL_META_PROPERTIES, CALL_ENGAGEMENT_PROPERTIES } from './Engagement';
export var getEngagementPropertyValue = function getEngagementPropertyValue(property, engagement) {
  return getIn(['properties', property, 'value'], engagement);
};
export var getObjectId = get('objectId');
export function getCallStatusFromEngagement(engagement) {
  return engagement && getEngagementPropertyValue(CALL_META_PROPERTIES.status, engagement);
}
export function getDurationFromEngagement(engagement) {
  if (!engagement) return 0;
  var duration = getEngagementPropertyValue(CALL_META_PROPERTIES.durationMilliseconds, engagement);
  return Number(duration) || 0;
}
export function getBodyFromEngagement(engagement) {
  return engagement && getEngagementPropertyValue(CALL_META_PROPERTIES.body, engagement) || '';
}
export function getDispositionFromEngagement(engagement) {
  return engagement && getEngagementPropertyValue(CALL_META_PROPERTIES.disposition, engagement);
}
export function getActivityTypeFromEngagement(engagement) {
  return engagement && getEngagementPropertyValue(CALL_ENGAGEMENT_PROPERTIES.activityType, engagement);
}
export function getExternalIdFromEngagement(engagement) {
  return engagement && getEngagementPropertyValue(CALL_META_PROPERTIES.externalId, engagement);
}