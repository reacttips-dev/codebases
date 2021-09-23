'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import { getAllHierarchicalTeams, createGetAllHierarchicalTeams } from 'reference-resolvers/api/TeamsAPI';
import get from 'transmute/get';
export var createHierarchicalTeamReferenceResolver = function createHierarchicalTeamReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.HIERARCHICAL_TEAMS,
    createFetchData: createGetAllHierarchicalTeams,
    fetchData: getAllHierarchicalTeams,
    selectAllReferences: get('all'),
    selectReferencesById: get('byId')
  }, options));
};
export default createHierarchicalTeamReferenceResolver();