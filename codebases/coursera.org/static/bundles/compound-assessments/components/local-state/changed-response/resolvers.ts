import ApolloClient from 'apollo-client';
import { changedResponseFragment } from './queries';

import { ChangedResponse, Response, MultiGetQuizResponses, ChangedResponseQueryVariables } from './types';

const __typename = 'LocalChangedResponse';

export const updateChangedResponse = (
  id: string,
  changedResponse: Response | null | undefined,
  client: ApolloClient<any>
) => {
  const data = {
    id,
    __typename,
    response: changedResponse,
  };
  // @ts-expect-error TSMIGRATION
  const cacheKey = client.cache.config.dataIdFromObject(data);
  client.writeFragment({ id: cacheKey, fragment: changedResponseFragment, data });
};

const getChangedResponseResolver = (
  _obj: any,
  { id }: ChangedResponseQueryVariables,
  { cache, getCacheKey }: any
): ChangedResponse => {
  const cacheKey = getCacheKey({ __typename, id });
  const data: ChangedResponse | null = cache.readFragment({ id: cacheKey, fragment: changedResponseFragment });

  return {
    id,
    __typename,
    response: (data || {}).response || null,
  };
};

const multiGetChangedResponseResolver = (
  obj: $TSFixMe,
  { ids }: { ids: Array<string> },
  ...rest: $TSFixMe[]
): MultiGetQuizResponses => {
  // @ts-expect-error TSMIGRATION
  const responses = ids.map((id) => getChangedResponseResolver(obj, { id }, ...rest)).filter(Boolean);
  return {
    __typename: 'LocalMultiGetResponses',
    responses,
  };
};

const resolvers = {
  Query: {
    ChangedResponse: (rootObj: $TSFixMe) => ({
      ...rootObj,
      __typename: 'LocalChangedResponseRoot',
    }),
  },
  LocalChangedResponseRoot: {
    get: getChangedResponseResolver,
    multiGet: multiGetChangedResponseResolver,
  },
};

const addChangedResponse = (consumerClient: ApolloClient<any>) => {
  // @ts-expect-error TSMIGRATION
  if (!(((consumerClient || {}).localState || {}).resolvers || {}).LocalChangedResponseRoot) {
    consumerClient.addResolvers(resolvers);
  }
};

export default addChangedResponse;
