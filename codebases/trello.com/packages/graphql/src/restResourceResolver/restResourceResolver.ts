import { FieldNode } from 'graphql';
import { trelloFetch } from '@trello/fetch';
import {
  TypedJSONObject,
  JSONObject,
  RestResourceResolverArgs,
  BatchRestResourceResolverArgs,
  ResolverContext,
} from '../types';
import {
  QueryInfo,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import { queryToApiUrl, queryToBatchApiUrl } from './queryToApiUrl';
import {
  NoRootIdArgumentError,
  NoRootIdsArgumentError,
  InvalidIDError,
} from '../errors';
import { firstLetterToUpper, singularize } from '../stringOperations';

// This is the regex used to determine whether an id is a valid hex string
// that is 24 characters long
const OBJECT_ID_REGEX = new RegExp('^[0-9a-fA-F]{24}$');

import { idCache, isShortLink } from '@trello/shortlinks';

/**
 * Attempt to satisfy all the requested data of a graphql query
 * by generating a REST API URL based on the nested resource
 * definitions in nestedResources.ts
 */
export const restResourceResolver = async (
  parent: FieldNode,
  rootArgs: RestResourceResolverArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const rootNode = info.field;

  // Currently we are only given access to the rootArgs (i.e the arguments passed to
  // the root node of the query). If we were using schema-link, this is where we could
  // pass the _full_ map of variables obtained via 'context'.
  const apiUrl = queryToApiUrl(rootNode, rootArgs, rootArgs.id);

  // If an apiUrl could not be generated, it means no fields were being queried for
  // that can be resolved generically, so just forward the ID through for any custom
  // resolvers that might need it without needing a useless REST request needing to
  // be exectued first.
  if (!apiUrl && rootArgs.id) {
    // To perform this optimisation we need to make sure the ID we were given is
    // _actually_ an ID, _not_ a name or some other identifier accepted by
    // server. This is so we can store this object in Apollo's cache by the same
    // ID that it would be stored under if it were fetched from server.
    if (!OBJECT_ID_REGEX.test(rootArgs.id)) {
      throw new InvalidIDError(rootArgs.id);
    }

    return prepareDataForApolloCache(
      {
        id: rootArgs.id,
      },
      info,
    );
  }

  // If there was no apiUrl generated, but we didn't even have a rootId, something
  // went wrong
  if (!apiUrl) {
    throw new NoRootIdArgumentError(rootNode.name.value);
  }

  let model = null;

  try {
    const typename = singularize(firstLetterToUpper(rootNode.name.value));
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: typename,
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        // Possible ways we can end up here:
        //   1. Session expires (or not logged in) - results in 401 Unauthorized.
        //   2. Backend is down - results in 503 Service Unavailable.
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    if (rootArgs?.id && isShortLink(rootArgs?.id) && model?.id) {
      if (typename === 'Board' || typename === 'Card') {
        idCache.setId(typename, rootArgs.id, model.id);
      }
    }

    return model ? prepareDataForApolloCache(model, info) : model;
  } catch (err) {
    // One way this can happen us if we're offline, we should handle this better in a follow-up PR.
    console.error(err);

    // Three possible options for handling of other errors:
    //   1. Catch the errors and return them in the result as an array of errors (similar to apollo-link-error).
    //   2. Throw them and let the componenents/UI implement error handling for the exception.
    //   3. Handle them an make assumptions the response. e.g. if you're not authorized (401), then you'll get a null model.
    return model;
  }
};

export const batchRestResourceResolver = async (
  parent: FieldNode,
  rootArgs: BatchRestResourceResolverArgs,
  context: ResolverContext,
  info: QueryInfo,
): Promise<TypedJSONObject> => {
  // On the client this comes through as info.field, but in GraphiQL in comes
  // through as info.fieldNodes[0], so we need to support both.
  const rootNode = info.field;

  if (!rootArgs.ids) {
    throw new NoRootIdsArgumentError(rootNode.name.value);
  }

  const apiUrl = queryToBatchApiUrl(rootNode, rootArgs, rootArgs.ids);

  let model = null;

  try {
    const typename = singularize(firstLetterToUpper(rootNode.name.value));
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: typename,
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      const batchedResult = await response.json();
      model = batchedResult
        .filter((result: JSONObject) => result['200'])
        .map((result: JSONObject) => result['200']);
      rootArgs.ids.map((id, index) => {
        const resultId = batchedResult[index]['200']?.id;
        if (isShortLink(id) && resultId) {
          if (typename === 'Board' || typename === 'Card') {
            idCache.setId(typename, id, resultId);
          }
        }
      });
    } else {
      throw new Error(
        `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
      );
    }

    return model ? prepareDataForApolloCache(model, info) : model;
  } catch (err) {
    // One way this can happen us if we're offline, we should handle this better in a follow-up PR.
    console.error(err);

    // Three possible options for handling of other errors:
    //   1. Catch the errors and return them in the result as an array of errors (similar to apollo-link-error).
    //   2. Throw them and let the componenents/UI implement error handling for the exception.
    //   3. Handle them an make assumptions the response. e.g. if you're not authorized (401), then you'll get a null model.
    return model;
  }
};
