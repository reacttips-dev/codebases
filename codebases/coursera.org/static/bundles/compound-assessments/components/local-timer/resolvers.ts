import ApolloClient from 'apollo-client';

import { localTimerFragment } from './queries';

export const __typename = 'LocalTimerState';

const getLocalTimerResolver = (_obj: any, { id }: { id: string }, { cache, getCacheKey }: any) => {
  const cacheKey = getCacheKey({ __typename, id });
  const data = cache.readFragment({ id: cacheKey, fragment: localTimerFragment });

  return {
    id,
    expiresAt: (data || {}).expiresAt || null,
    __typename,
  };
};

export const updateLocalTimer = (
  newData: {
    id: string;
    expiresAt?: number;
  },
  client: ApolloClient<any>
) => {
  // @ts-expect-error TSMIGRATION
  const id = client.cache.config.dataIdFromObject({ __typename, id: newData.id });
  const prevData = client.cache.readFragment({ id, fragment: localTimerFragment });
  const data = {
    // @ts-expect-error
    ...prevData,
    ...newData,
  };
  client.writeFragment({ id, fragment: localTimerFragment, data });
};

const resolvers = {
  Query: {
    LocalTimer: (rootObj: $TSFixMe) => ({
      ...rootObj,
      __typename: 'LocalTimerRoot',
    }),
  },
  LocalTimerRoot: {
    get: getLocalTimerResolver,
  },
};

export const addLocalTimer = (client: any) => {
  if (!(((client || {}).localState || {}).resolvers || {}).LocalTimerRoot) {
    client.addResolvers(resolvers);
  }
};

export default addLocalTimer;
