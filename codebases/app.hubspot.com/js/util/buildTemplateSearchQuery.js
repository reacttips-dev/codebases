'use es6';

import invariant from 'react-utils/invariant';
import { List } from 'immutable';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import SearchFilterRecord from 'SalesContentIndexUI/data/records/SearchFilterRecord';
import { CONTENT_TYPE_FIELD, USER_ID_FIELD, TEAM_ID_FIELD, FOLDER_ID_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import * as EditorFolderTypes from '../constants/EditorFolderTypes';
import { getUserId, getTeamId } from 'SequencesUI/util/userContainerUtils';
var templateTypeFilter = SearchFilterRecord({
  field: CONTENT_TYPE_FIELD,
  values: List.of(SearchContentTypes.TEMPLATE)
});

var getTemplateFilter = function getTemplateFilter(currentFolder) {
  switch (currentFolder) {
    case EditorFolderTypes.CREATED_BY_ME.value:
      return new SearchFilterRecord({
        field: USER_ID_FIELD,
        values: [getUserId()]
      });

    case EditorFolderTypes.CREATED_BY_MY_TEAM.value:
      return new SearchFilterRecord({
        field: TEAM_ID_FIELD,
        values: [getTeamId()]
      });

    case EditorFolderTypes.ALL_TEMPLATES.value:
      return null;

    case EditorFolderTypes.OTHER_TEMPLATES.value:
      return new SearchFilterRecord({
        field: FOLDER_ID_FIELD,
        values: List()
      });

    default:
      return new SearchFilterRecord({
        field: FOLDER_ID_FIELD,
        values: List.of(parseInt(currentFolder, 10))
      });
  }
};

export default (function (query, _ref) {
  var searchTerm = _ref.searchTerm,
      currentFolder = _ref.currentFolder,
      page = _ref.page,
      offset = _ref.offset;
  invariant(query instanceof SearchQueryRecord, 'buildTemplateSearchQuery: expected first parameter to be a SearchQueryRecord');
  var result = query;

  if (currentFolder !== undefined) {
    var filters = List.of(templateTypeFilter);
    var templateFilter = getTemplateFilter(currentFolder);
    filters = templateFilter === null ? filters : filters.push(templateFilter);
    result = result.set('filters', filters);
  }

  if (searchTerm !== undefined) {
    result = result.set('query', searchTerm);
  }

  if (page !== undefined) {
    result = result.set('offset', result.limit * (page - 1));
  }

  if (offset !== undefined) {
    result = result.set('offset', offset);
  }

  return result;
});