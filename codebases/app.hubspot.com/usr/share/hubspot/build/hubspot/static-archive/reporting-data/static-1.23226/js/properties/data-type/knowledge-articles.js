'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { KNOWLEDGE_ARTICLES } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
var translate = prefix('reporting-data.properties.knowledge-articles');
var translateGroups = prefix('reporting-data.groups.knowledgeArticles');
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(List([ImmutableMap({
    name: 'knowledgeArticleInfo',
    displayName: translateGroups('knowledgeArticleInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: List([ImmutableMap({
      name: 'averageTimeOnPage',
      label: translate('averageTimeOnPage'),
      type: 'duration',
      durationUnit: 'seconds'
    }), ImmutableMap({
      name: 'helpfulFeedback',
      label: translate('helpfulFeedback'),
      type: 'number'
    }), ImmutableMap({
      name: 'helpfulFeedbackPercentage',
      label: translate('helpfulFeedbackPercentage'),
      type: 'percent'
    }), ImmutableMap({
      name: 'id',
      label: translate('name'),
      type: 'enumeration'
    }), ImmutableMap({
      name: 'lastUpdated',
      label: translate('lastUpdated'),
      type: 'datetime'
    }), ImmutableMap({
      name: 'rawViews',
      label: translate('rawViews'),
      type: 'number'
    }), ImmutableMap({
      name: 'totalFeedback',
      label: translate('totalFeedback'),
      type: 'number'
    }), ImmutableMap({
      name: 'unhelpfulFeedback',
      label: translate('unhelpfulFeedback'),
      type: 'number'
    }), ImmutableMap({
      name: 'unhelpfulFeedbackPercentage',
      label: translate('unhelpfulFeedbackPercentage'),
      type: 'percent'
    })])
  })]));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
  return properties.merge(countProperty(KNOWLEDGE_ARTICLES));
});