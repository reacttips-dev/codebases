import { QueryUnsplashPhotosArgs } from '../generated';
import {
  QueryInfo,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import { unsplashClient } from '@trello/unsplash';
import { JSONArray, ResolverContext } from '../types';

export const unsplashPhotosResolver = async (
  obj: object,
  args: QueryUnsplashPhotosArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const searchQuery = args && args.query && args.query.trim();
  const page = (args && args.page) || undefined;
  const perPage = (args && args.perPage) || undefined;

  const photos = searchQuery
    ? await unsplashClient.searchPhotos(searchQuery, page, perPage)
    : await unsplashClient.getDefaultCollectionPhotos(page);

  return prepareDataForApolloCache((photos as unknown) as JSONArray, info);
};
