import { QueryEmailProviderArgs } from '../generated';
import {
  QueryInfo,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import { trelloFetch } from '@trello/fetch';
import { ResolverContext } from '../types';

export const emailProviderResolver = async (
  obj: object,
  args: QueryEmailProviderArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const email = args && args.email;

  const response = await trelloFetch(
    `/checkYourEmail?email=${email}`,
    { credentials: 'same-origin' },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'EmailProvider',
        operationName: context.operationName,
      },
    },
  );

  const emailProvider = await response.json();

  if (emailProvider.error) {
    throw new Error(emailProvider.error);
  }

  return prepareDataForApolloCache(emailProvider, info);
};
