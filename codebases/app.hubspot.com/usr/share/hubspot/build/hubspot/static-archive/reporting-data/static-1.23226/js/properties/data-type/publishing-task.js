'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List, fromJS } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCommonPropertyGroups from '../partial/engagement-common';
import { CAMPAIGN } from 'reference-resolvers/constants/ReferenceObjectTypes';
var translateGroup = prefix('reporting-data.groups.engagement');
var translateProperty = prefix('reporting-data.properties.publishingTasks');
export var getPublishingTaskPropertyGroups = function getPublishingTaskPropertyGroups() {
  return Promise.resolve(List.of(fromJS({
    name: 'publishingTaskInfo',
    displayName: translateGroup('publishingTaskInfo'),
    hubspotDefined: true,
    properties: [{
      name: 'publishingTask.state',
      label: translateProperty('state.label'),
      type: 'enumeration',
      options: [{
        value: 'TODO',
        label: translateProperty('state.options.TODO')
      }, {
        value: 'DONE',
        label: translateProperty('state.options.DONE')
      }]
    }, {
      name: 'publishingTask.category',
      label: translateProperty('category.label'),
      type: 'enumeration',
      options: [{
        label: translateProperty('category.options.BLOG_POST'),
        value: 'BLOG_POST'
      }, {
        label: translateProperty('category.options.CUSTOM'),
        value: 'CUSTOM'
      }, {
        label: translateProperty('category.options.EMAIL'),
        value: 'EMAIL'
      }, {
        label: translateProperty('category.options.FACEBOOK'),
        value: 'FACEBOOK'
      }, {
        label: translateProperty('category.options.LANDING_PAGE'),
        value: 'LANDING_PAGE'
      }, {
        label: translateProperty('category.options.LEGACY_PAGE'),
        value: 'LEGACY_PAGE'
      }, {
        label: translateProperty('category.options.LINKEDIN'),
        value: 'LINKEDIN'
      }, {
        label: translateProperty('category.options.SITE_PAGE'),
        value: 'SITE_PAGE'
      }, {
        label: translateProperty('category.options.TWITTER'),
        value: 'TWITTER'
      }]
    }, {
      name: 'publishingTask.campaignGuid',
      label: translateProperty('campaignGuid.label'),
      type: 'enumeration',
      externalOptions: true,
      referencedObjectType: CAMPAIGN
    }]
  })));
};
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(getPublishingTaskPropertyGroups().then(function (propertyGroups) {
    return List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(propertyGroups)));
  }));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
  return properties;
});