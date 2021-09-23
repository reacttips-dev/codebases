'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import { getAllTeams, createGetAllTeams } from 'reference-resolvers/api/TeamsAPI';
export var createTeamReferenceResolver = function createTeamReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.TEAMS,
    createFetchData: createGetAllTeams,
    fetchData: getAllTeams
  }, options));
};
export default createTeamReferenceResolver();