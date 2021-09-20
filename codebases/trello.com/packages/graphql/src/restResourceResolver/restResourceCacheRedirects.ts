import {
  restResourceResolver,
  batchRestResourceResolver,
} from './restResourceResolver';
import { singularize, firstLetterToUpper } from '../stringOperations';
import { memberId } from '@trello/session-cookie';
import { FieldReadFunction, gql, InMemoryCache } from '@apollo/client';
import { idCache, isShortLink } from '@trello/shortlinks';

interface ResolverMap {
  [field: string]: unknown;
}

interface FieldPolicyMap {
  [fieldName: string]: {
    read: FieldReadFunction;
  };
}

const readFromCache = (cache: InMemoryCache, typename: string, id: string) =>
  cache.readFragment({
    id: `${typename}:${id}`,
    fragment: gql`
    fragment Check${typename} on ${typename} {
      id
    }
  `,
  });

const fieldPolicyForRestResource = (name: string): FieldReadFunction => (
  existing: Readonly<unknown> | undefined,
  { args, toReference, cache },
) => {
  if (existing !== undefined) {
    // Apollo already found all the items in cache
    return existing;
  }
  const id = args?.id;
  if (!id) {
    return;
  }

  const typename = singularize(firstLetterToUpper(name));
  const fullId =
    typename === 'Board' || typename === 'Card'
      ? idCache.getId(typename, id) || id
      : id;
  if (isShortLink(fullId)) {
    // This is unknown shortLink that we cannot resolve into id
    return;
  }
  if (!readFromCache(cache, typename, fullId)) {
    // Cache miss
    return;
  }

  return toReference({ __typename: typename, id: fullId });
};

const fieldPolicyForBatchRestResource = (name: string): FieldReadFunction => (
  existing: Readonly<unknown> | undefined,
  { args, toReference, cache },
) => {
  if (existing !== undefined) {
    // Apollo already found all the items in cache
    return existing;
  }
  const references = [];
  const typename = singularize(firstLetterToUpper(name));
  const ids = args?.ids ?? [];
  for (const id of ids) {
    const fullId =
      typename === 'Board' || typename === 'Card'
        ? idCache.getId(typename, id) || id
        : id;
    if (isShortLink(fullId)) {
      // This is unknown shortLink that we cannot resolve into id
      return;
    }
    if (!readFromCache(cache, typename, fullId)) {
      // If ANY item from the bulk is not in cache - that is a cache miss
      return;
    }
    references.push(toReference({ __typename: typename, id: fullId }));
  }
  return references;
};

/**
 * Adds fieldPolicies (https://www.apollographql.com/docs/react/advanced/caching/#cache-redirects-with-cacheredirects)
 * for any restResourceResolvers in the resolver map. This will ensure that the item can be grabbed by the Apollo Cache
 * by querying for its id (rather than firing off an unnecessary REST request)
 *
 * @param resolvers A map of resolver functions, some of which should be restResourceResolver
 */
export const restResourceFieldPolicies = (
  queryResolvers: ResolverMap,
): FieldPolicyMap => {
  // Get the resolvers that use restResourceResolver
  const restResourceResolverEntries = Object.keys(queryResolvers).filter(
    (name) => queryResolvers[name] === restResourceResolver,
  );

  // For each of these resources, create a cache redirect that infers the typename+id
  // cache index for that resource based on it's name and the id passed as an argument
  const fieldPolicies: FieldPolicyMap = restResourceResolverEntries.reduce(
    (acc: FieldPolicyMap, name) => ({
      ...acc,
      [name]: {
        read: fieldPolicyForRestResource(name),
      },
    }),
    {},
  );

  return fieldPolicies;
};

/**
 * Adds fieldPolicies (https://www.apollographql.com/docs/react/advanced/caching/#cache-redirects-with-cacheredirects)
 * for any batchRestResourceResolvers in the resolver map. This will ensure that the item can be grabbed by the Apollo Cache
 * by querying for their ids (rather than firing off an unnecessary REST request)
 *
 * @param resolvers A map of resolver functions, some of which should be batchRestResourceResolver
 */
export const batchRestResourceFieldPolicies = (
  queryResolvers: ResolverMap,
): FieldPolicyMap => {
  // Get the resolvers that use batchRestResourceResolver
  const batchRestResourceResolverEntries = Object.keys(queryResolvers).filter(
    (name) => queryResolvers[name] === batchRestResourceResolver,
  );

  // For each of these resources, create a cache redirect that infers the typename+id
  // cache index for that resource based on it's name and the id passed as an argument
  const fieldPolicies: FieldPolicyMap = batchRestResourceResolverEntries.reduce(
    (acc: FieldPolicyMap, name) => ({
      ...acc,
      [name]: {
        read: fieldPolicyForBatchRestResource(name),
      },
    }),
    {},
  );

  return fieldPolicies;
};

export const readMemberMe: FieldReadFunction = (
  existing: Readonly<unknown> | undefined,
  { args, toReference },
) => {
  if (existing !== undefined) {
    // Apollo already found the item in cache
    return existing;
  }
  const id = args?.id;
  // This solves the issue of a cache miss looking for member:me instead
  // of member:memberId
  return toReference({
    __typename: 'Member',
    id: id === 'me' ? memberId : id,
  });
};
