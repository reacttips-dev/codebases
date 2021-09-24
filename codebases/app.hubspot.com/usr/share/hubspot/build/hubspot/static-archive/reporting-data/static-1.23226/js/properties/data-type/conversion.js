'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { CONVERSION } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getSourceOptions from '../partial/contacts-sources';
import countProperty from '../partial/count-property';
var translate = prefix('reporting-data.properties.conversion');
var translateGroup = prefix('reporting-data.groups.conversion');

var translateProperty = function translateProperty(property, activity) {
  return translate(property) + " (" + translate(activity) + ")";
};

var conversionAttribution = ['firstVisit', 'firstVisitInCreateSession', 'lastVisitInCreateSession', 'firstVisitInLeadSession', 'lastVisitInLeadSession', 'firstVisitInCloseSession', 'lastVisitInCloseSession'];
var attributionRecord = {
  visitTime: 'datetime',
  pageUrl: 'string',
  pageDomain: 'string',
  visitSource: 'string',
  pageContentType: 'string',
  analyticsPageId: 'string',
  pageAuthor: 'string',
  pageBlogId: 'number',
  country: 'string',
  region: 'string',
  city: 'string',
  persona: 'string',
  conversionTime: 'datetime',
  referrerVisitTime: 'datetime',
  referrerUrl: 'string',
  referrerDomain: 'string',
  referrerVisitSource: 'string',
  referrerContentType: 'string',
  referrerAnalyticsPageId: 'string',
  referrerAuthor: 'string',
  referrerBlogAuthorId: 'number',
  referrerBlogId: 'number'
};

var getPageContentTypeOptions = function getPageContentTypeOptions() {
  return [{
    value: 'LANDING_PAGE',
    label: translate('pageContentTypes.landingPage')
  }, {
    value: 'STANDARD_PAGE',
    label: translate('pageContentTypes.standardPage')
  }, {
    value: 'BLOG_POST',
    label: translate('pageContentTypes.blogPost')
  }, {
    value: 'LISTING_PAGE',
    label: translate('pageContentTypes.listingPage')
  }];
};

var options = {
  pageContentType: getPageContentTypeOptions,
  referrerContentType: getPageContentTypeOptions,
  visitSource: getSourceOptions,
  referrerVisitSource: getSourceOptions
};
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(fromJS([{
    name: 'conversionInfo',
    displayName: translateGroup('conversionInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: conversionAttribution.reduce(function (merged, activity) {
      return Object.keys(attributionRecord).reduce(function (memo, property) {
        return [].concat(_toConsumableArray(memo), [{
          name: activity + "." + property,
          label: translateProperty(property, activity),
          type: attributionRecord[property],
          options: typeof options[property] === 'function' ? options[property]() : []
        }]);
      }, merged);
    }, [])
  }]));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
  return properties.merge(countProperty(CONVERSION));
});