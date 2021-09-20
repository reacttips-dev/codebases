import { allowedQueryParamsForSyncing } from './allowedQueryParamsForSyncing';
import { QueryParam, QueryParams } from '../types';

interface AllowedQueryParamsForSyncing {
  [paramName: string]: Set<QueryParam>;
}

/**
 * Takes a query, and returns the unsafe fields that we
 * should not sync from the query response
 */
export const getUnsafeFields = (
  queryParams: QueryParams,
  allowedQueryParams: AllowedQueryParamsForSyncing = allowedQueryParamsForSyncing,
): string[] => {
  return Object.entries(queryParams)
    .filter(
      ([paramName, paramValue]) =>
        allowedQueryParams[paramName] &&
        !allowedQueryParams[paramName].has(paramValue),
    )
    .map(([paramName]) => paramName);
};
