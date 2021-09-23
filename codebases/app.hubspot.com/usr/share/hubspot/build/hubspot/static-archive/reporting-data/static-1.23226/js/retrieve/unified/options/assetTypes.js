'use es6';

import { fromJS } from 'immutable';
import prefix from '../../../lib/prefix';
var translate = prefix('reporting-data.properties.campaigns');
var assetTypeInfo = fromJS({
  keyword: {
    serverConst: 'KEYWORD',
    filterProp: 'keyword'
  },
  landingPage: {
    serverConst: 'LANDING_PAGE',
    filterProp: 'landingPageId'
  },
  cta: {
    serverConst: 'CTA',
    filterProp: 'ctaId'
  },
  blogPost: {
    serverConst: 'BLOG_POST',
    filterProp: 'blogPostId'
  },
  sitePage: {
    serverConst: 'SITE_PAGE',
    filterProp: 'sitePageId'
  },
  broadcast: {
    serverConst: 'BROADCAST',
    filterProp: 'broadcastId'
  },
  paidSource: {
    serverConst: 'PAID_SOURCE',
    filterProp: 'paidSourceId'
  },
  otherSource: {
    serverConst: 'OTHER_SOURCE',
    filterProp: 'otherSourceId'
  },
  utm: {
    serverConst: 'UTM',
    filterProp: 'utm'
  },
  email: {
    serverConst: 'EMAIL',
    filterProp: 'email'
  }
});
export var ASSET_TYPE = assetTypeInfo.keySeq().toList();
export var ASSET_TYPE_SERVER_CONST = assetTypeInfo.valueSeq().map(function (info) {
  return info.get('serverConst');
}).toList();
export var ASSET_ID_FILTER_PROP = assetTypeInfo.valueSeq().map(function (info) {
  return info.get('filterProp');
}).toList();
export var assetTypeToServerConst = function assetTypeToServerConst(assetType) {
  return assetTypeInfo.getIn([assetType, 'serverConst']);
};
export var assetTypeToFilterProp = function assetTypeToFilterProp(assetType) {
  return assetTypeInfo.getIn([assetType, 'filterProp']);
};
var SERVER_CONST_TO_ASSET_TYPE = assetTypeInfo.map(function (info) {
  return info.get('serverConst');
}).flip();
export var serverConstToAssetType = function serverConstToAssetType(serverConst) {
  return SERVER_CONST_TO_ASSET_TYPE.get(serverConst);
};
export default (function () {
  return {
    KEYWORD: translate('keyword'),
    LANDING_PAGE: translate('landingPage'),
    CTA: translate('cta'),
    BLOG_POST: translate('blogPost'),
    SITE_PAGE: translate('sitePage'),
    BROADCAST: translate('broadcast'),
    PAID_SOURCE: translate('paidSource'),
    OTHER_SOURCE: translate('otherSource'),
    UTM: translate('utm'),
    EMAIL: translate('email')
  };
});