'use es6';

import { getFrom, setFrom } from 'crm_data/settings/LocalSettings';
export var getPageTypeKey = function getPageTypeKey(objectTypeId) {
  return "CRM:pageType:" + objectTypeId;
};
export var getMostRecentlyUsedPageType = function getMostRecentlyUsedPageType(objectTypeId) {
  return getFrom(localStorage, getPageTypeKey(objectTypeId));
};
export var setMostRecentlyUsedPageType = function setMostRecentlyUsedPageType(objectTypeId, pageType) {
  return setFrom(localStorage, getPageTypeKey(objectTypeId), pageType);
};