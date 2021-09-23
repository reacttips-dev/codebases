'use es6';

import toJS from 'transmute/toJS';
import { List, Map as ImmutableMap } from 'immutable';
import SearchAPIQuery from 'crm_data/elasticSearch/api/SearchAPIQuery';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import CustomPropertyHelper from './CustomPropertyHelper';
import { isOfMinSearchLength } from 'customer-data-objects/search/ElasticSearchQuery';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import getPipelineIdFromView from './getPipelineIdFromView';
import isEmpty from 'transmute/isEmpty';
import memoize from 'transmute/memoize';
import { getPropertiesToFetch } from 'crm_data/views/PropertiesToFetch';
export var transform = memoize(function (view, objectType, options) {
  options = options || ImmutableMap();
  var pageSize = options.get('pageSize') || 25;
  var currentPage = options.get('currentPage') || 0;
  var query = options.get('query');
  var defaultPipelineId = options.get('defaultPipelineId');
  var isCrmObject = options.get('isCrmObject') || false;
  var boardCardProperties = options.get('boardCardProperties'); // HACK: ignoreViewPipeline is used for the CRM Index Page to allow it to
  // force the pipeline to be null since it controls the default pipeline.
  // See: https://git.hubteam.com/HubSpot/CRM/pull/19606

  var pipelineId = options.get('ignoreViewPipeline') ? options.get('pipelineId') : options.get('pipelineId') || getPipelineIdFromView(view, defaultPipelineId);
  var viewState = view.get('state');
  var sortColumnName = viewState.get('sortColumnName');
  var sortKey = viewState.get('sortKey');
  var sortOptions;
  var extraProperties = CustomPropertyHelper.get(objectType, sortColumnName);

  if (extraProperties) {
    sortKey = extraProperties.get('sortValue') || sortKey;
    sortOptions = toJS(extraProperties.get('sortOptions'));
  }

  var order = viewState.get('order') === -1 ? 'ASC' : 'DESC';
  var filters = view.get('filters');
  var filterGroups = view.get('filterGroups');

  if (filters) {
    filters = view.get('filters').map(function (filter) {
      return filter.delete('default');
    });

    if ([DEAL, TICKET].includes(objectType) && pipelineId) {
      filters = filters.push(ImmutableMap({
        property: objectType === DEAL ? 'pipeline' : 'hs_pipeline',
        operator: 'EQ',
        value: pipelineId
      }));
    }
  }

  var sorts = [];

  if (List.isList(sortKey) || Array.isArray(sortKey)) {
    sortKey.forEach(function (property) {
      return sorts.push(Object.assign({
        property: property,
        order: order
      }, sortOptions));
    });
  } else {
    sorts.push(Object.assign({
      property: sortKey,
      order: order
    }, sortOptions));
  }

  if (!query || !isOfMinSearchLength(query)) {
    query = '';
  }

  var searchQuery = {
    count: pageSize,
    filterGroups: [],
    offset: pageSize * currentPage,
    query: query,
    sorts: sorts
  };
  var properties = getPropertiesToFetch(objectType, view);

  if (!isEmpty(properties)) {
    searchQuery.properties = properties;
  } // For board cards we have to pass in additional properties, so we'll add them conditionally here
  // If the original searchQuery does not specify an allowlist of properties, leave the allowlist
  // empty. By default, ES returns all properties if no allowlist is specified.


  if (Array.isArray(searchQuery.properties) && Array.isArray(boardCardProperties)) {
    searchQuery.properties = searchQuery.properties.concat(boardCardProperties);
  }

  if (filterGroups && filterGroups.size) {
    searchQuery.filterGroups = filterGroups;
  } else {
    searchQuery.filterGroups.push({
      filters: filters
    });
  }

  return SearchAPIQuery.default(searchQuery, objectType, isCrmObject);
});
export var searchCollectionToView = function searchCollectionToView(searchCollection) {
  var tempFilters = searchCollection.tempFilters,
      staticFilters = searchCollection.staticFilters;
  var viewModel = searchCollection.viewModel;
  var view = viewModel.toJSON();
  tempFilters = tempFilters && tempFilters.toJSON() || [];
  staticFilters = staticFilters || [];

  try {
    view.filters = [].concat(staticFilters, JSON.parse(view.filters), tempFilters);
  } catch (error) {
    /* do nothing */
  }

  try {
    view.columns = JSON.parse(view.columns);
  } catch (error1) {
    /* do nothing */
  }

  try {
    view.state = JSON.parse(view.state);
  } catch (error2) {
    /* do nothing */
  }

  return ViewRecord.fromJS(view);
};