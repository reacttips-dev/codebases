import { ResolverContext, TypedJSONObject } from '../types';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { trelloFetch } from '@trello/fetch';
import { QueryPublicPluginsArgs } from '../generated';
import { getNetworkClient } from '../getNetworkClient';

export const publicPluginsResolver = async (
  organization: {
    id: string;
  },
  args: QueryPublicPluginsArgs,
  context: ResolverContext,
  info: QueryInfo,
): Promise<TypedJSONObject> => {
  let model = null;
  const queryParams = args?.preferredLocales
    ? new URLSearchParams({
        preferredLocales: args.preferredLocales,
      })
    : null;
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    queryParams
      ? `/1/plugins/public?${queryParams.toString()}`
      : '/1/plugins/public',
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'publicPlugins',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, info) : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const pluginCategoriesResolver = async (
  obj: object,
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/plugins/categories');

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'pluginCategories',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return prepareDataForApolloCache(model, info);
  } catch (err) {
    console.error(err);
    return model;
  }
};
