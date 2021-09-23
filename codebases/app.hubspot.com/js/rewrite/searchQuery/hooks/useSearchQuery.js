'use es6';

import memoizeOne from 'react-utils/memoizeOne';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { usePaginationState } from '../../pagination/hooks/usePaginationState';
import { useSearchTerm } from '../../search/hooks/useSearchTerm';
import { useQueryFilterGroups } from './useQueryFilterGroups';
import { useQueryProperties } from './useQueryProperties';
import { useQuerySorts } from './useQuerySorts';
import { useDecorateQueryWithPipelinePermissions } from '../../pipelines/hooks/useDecorateQueryWithPipelinePermissions';
export var generateSearchQuery = memoizeOne(function (objectTypeId, sorts, properties, searchTerm, page, pageSize, filterGroups) {
  return {
    objectTypeId: objectTypeId,
    sorts: sorts,
    requestOptions: {
      properties: properties
    },
    query: searchTerm,
    offset: page * pageSize,
    count: pageSize,
    filterGroups: filterGroups
  };
});
export var useSearchQuery = function useSearchQuery() {
  var objectTypeId = useSelectedObjectTypeId();
  var sorts = useQuerySorts();
  var properties = useQueryProperties();
  var searchTerm = useSearchTerm();

  var _usePaginationState = usePaginationState(),
      page = _usePaginationState.page,
      pageSize = _usePaginationState.pageSize;

  var filterGroups = useQueryFilterGroups();
  var query = generateSearchQuery(objectTypeId, sorts, properties, searchTerm, page, pageSize, filterGroups);
  return useDecorateQueryWithPipelinePermissions(query);
};