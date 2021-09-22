import { ApolloCache } from 'apollo-cache';

/**
 * Remove objects with given typeName from React Apollo cache.
 * Warning: it removes only objects and don't remove references to them in other objects.
 * That might lead to cache inconsistency and unexpedted results.
 *
 * TODO: Deprecate it in favor of `evict` after we migrate to Apollo Client 3.
 */
export const clearCacheWithTypename = (cache: ApolloCache<any>, typeName: string) => {
  // Loop through all the data in our cache
  // And delete any items that start with typeName
  // This clears all the cache items with given typeName and
  // forces a refetch of the data.
  const typeNameRegex = new RegExp(`^${typeName.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')}`);
  // @ts-expect-error cache.data is not public method and it does not exist in type declaration
  Object.keys(cache.data.data).forEach((key) => key.match(typeNameRegex) && cache.data.delete(key));
};

/**
 * Remove objects with given multiple typeNames from React Apollo cache.
 * Warning: it removes only objects and don't remove references to them in other objects.
 * That might lead to cache inconsistency and unexpedted results.
 *
 * TODO: Deprecate it in favor of `evict` after we migrate to Apollo Client 3.
 */
export const clearCacheWithTypenames = (cache: ApolloCache<any>, typeNames: Array<string>) => {
  typeNames.forEach((typeName) => clearCacheWithTypename(cache, typeName));
};

export default {};
