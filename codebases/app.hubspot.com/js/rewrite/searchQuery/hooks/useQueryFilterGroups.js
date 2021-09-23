'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { PLACEHOLDER_NOW } from 'crm_data/filters/FilterPlaceholderResolver';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { setPlaceholdersOnFilter } from '../utils/setPlaceholdersOnFilter';
import omit from 'transmute/omit';
import I18n from 'I18n';
import { ALL_PIPELINES_VALUE } from '../../pipelines/constants/AllPipelinesValue';
import { useCurrentPipelineId } from '../../pipelines/hooks/useCurrentPipelineId';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import memoizeOne from 'react-utils/memoizeOne';
export var generateQueryFilterGroups = memoizeOne(function (filters, pipelineId, pipelinePropertyName) {
  var filtersWithPlaceholders = filters.map(function (filter) {
    return filter.withMutations(function (mutableFilter) {
      return setPlaceholdersOnFilter(mutableFilter, _defineProperty({}, PLACEHOLDER_NOW, I18n.moment.userTz().valueOf()));
    });
  }).toJS(); // HACK: If filters were cloned from a default view in the legacy verison of the app,
  // they may contain a "default" field. This field blows up graphql as it is not
  // expected on the filter object, so we have to make sure to filter them out.
  // Long-term we should have the BE backfill all custom views to remove the field.
  // The field is set in the defaults here: https://git.hubteam.com/HubSpot/crm_universal/blob/eef242d34c4c005e8a8f81431dbc51728233bd62/static/js/view/ViewDefaults.js#L394
  // And also as part of ViewsStore here: https://git.hubteam.com/HubSpot/CRM/blob/bb3b45d4279bcd65f05f47ee9b028c6bdd388da0/crm_ui/static/js/flux/views/ViewsStore.js#L53-L55

  var sanitizedFilters = filtersWithPlaceholders.map(omit(['default'])); // This block of code appends a filter for the current pipeline, if one exists. This
  // is where the value in the pipeline dropdown at the top of the page ends up, and filters
  // the entire query to only objects in the specified pipeline.

  if (pipelineId !== ALL_PIPELINES_VALUE) {
    return [{
      filters: sanitizedFilters.concat({
        operator: 'EQ',
        value: pipelineId,
        property: pipelinePropertyName
      })
    }];
  }

  return [{
    filters: sanitizedFilters
  }];
});
export var useQueryFilterGroups = function useQueryFilterGroups() {
  var _useCurrentView = useCurrentView(),
      filters = _useCurrentView.filters;

  var pipelineId = useCurrentPipelineId();

  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      pipelinePropertyName = _useSelectedObjectTyp.pipelinePropertyName;

  return generateQueryFilterGroups(filters, pipelineId, pipelinePropertyName);
};