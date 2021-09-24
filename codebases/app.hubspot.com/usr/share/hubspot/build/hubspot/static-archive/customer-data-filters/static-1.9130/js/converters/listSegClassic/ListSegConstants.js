'use es6';

import { INTEGRATION } from '../../filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
export var __ANY_CTA = '__ANY_CTA';
export var __ANY_FORM = '__ANY_FORM';
export var __ANY_LINK = '__ANY_LINK';
export var __ANY_PAGE = '__ANY_PAGE';
export var __ANY_WEBINAR = '__ANY_WEBINAR';
export var __PRIVACY_CONSENT = '__PRIVACY_CONSENT';
export var __ASSOCIATION_LABEL = '__ASSOCIATION_LABEL'; // This is a special case property that actually uses this value on the BE

export var __OCCURRED_INTEGRATION_PROPERTY = 'timestamp';
export var PRIVACY_CONSENT = 'PrivacyConsent';
export var ListSegClassicTimestampTypes = {
  NONE: 'NONE',
  PORTAL_TZ_ALIGNED: 'PORTAL_TZ_ALIGNED',
  UTC_TZ_ALIGNED: 'UTC_TZ_ALIGNED'
};
export var AdsEntityListTypes = {
  AD_TYPE: 'AD_TYPE',
  IDS: 'IDS',
  // classic
  ID: 'ID',
  // objseg
  NAMES: 'NAMES',
  // classic
  NAME: 'NAME',
  // objseg
  TIMESTAMP: 'TIMESTAMP'
};
export var AdsSearchTermTypes = {
  AD: 'AD',
  ADGROUP: 'ADGROUP',
  CAMPAIGN: 'CAMPAIGN',
  KEYWORD: 'KEYWORD'
};
export var AdsInteraction = 'INTERACTION';
export var WistiaIntegrationFamilies = [INTEGRATION + "-14723", INTEGRATION + "-14724", INTEGRATION + "-14691", INTEGRATION + "-14722", INTEGRATION + "-14725"];