import { ResolverContext, TypedJSONObject } from '../types';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { QueryTemplateGalleryArgs } from '../generated';
import { trelloFetch } from '@trello/fetch';
import { getNetworkClient } from '../getNetworkClient';

export const templateCategoriesResolver = async (
  _parent: unknown,
  _args: unknown,
  context: ResolverContext,
  info: QueryInfo,
): Promise<TypedJSONObject> => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(`/1/resources/templates/categories`);

  let response;

  try {
    response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'templateCategories',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
      return model ? prepareDataForApolloCache(model, info) : model;
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      `An error occurred while fetching/parsing template categories GraphQL query. (error: ${err}, status: ${response?.status}, statusText: ${response?.statusText}`,
    );
  }

  throw new Error(
    `An error occurred while resolving template categories GraphQL query. (status: ${response?.status}, statusText: ${response?.statusText})`,
  );
};

export const templateLanguagesResolver = async (
  _parent: unknown,
  _args: unknown,
  context: ResolverContext,
  info: QueryInfo,
): Promise<TypedJSONObject> => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    '/1/resources/templates/languages?enabled=true',
  );

  let response;

  try {
    response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'templateLanguages',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
      return model ? prepareDataForApolloCache(model, info) : model;
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      `An error occurred while fetching/parsing template languages GraphQL query. ${{
        error: err,
        response,
      }}`,
    );
  }

  throw new Error(
    `An error occurred while resolving template languages GraphQL query. (status: ${response?.status}, statusText: ${response?.statusText})`,
  );
};

export const templateGalleryResolver = async (
  _parent: unknown,
  args: QueryTemplateGalleryArgs,
  context: ResolverContext,
  info: QueryInfo,
): Promise<TypedJSONObject> => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/boards/templates/gallery?locale=${args.locale || 'en'}`,
  );

  let response;

  try {
    response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'templateGallery',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
      return model ? prepareDataForApolloCache(model, info) : model;
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      `An error occurred while fetching/parsing template gallery GraphQL query. ${{
        error: err,
        response,
      }}`,
    );
  }

  throw new Error(
    `An error occurred while resolving template gallery GraphQL query. (status: ${response?.status}, statusText: ${response?.statusText})`,
  );
};
