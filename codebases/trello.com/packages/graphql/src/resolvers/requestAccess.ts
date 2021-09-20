import { ResolverContext } from '../types';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { trelloFetch } from '@trello/fetch';
import { QueryBoardAccessRequestArgs } from '../generated';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { getNetworkClient } from '../getNetworkClient';
import { token } from '@trello/session-cookie';

export const boardAccessRequestResolver = async (
  _parent: unknown,
  args: QueryBoardAccessRequestArgs | null,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { modelType, id } = args || {};
  const apiUrl = `/1/${modelType}/${id}/requestAccess`;
  const response = await trelloFetch(
    apiUrl,
    {
      credentials: 'same-origin',
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'RequestAccess.boardAccessRequest',
        operationName: context.operationName,
      },
    },
  );

  const statusCode = response.status;
  const result = {
    requested: false,
  };
  if (!response.ok) {
    if (statusCode === 429) {
      result.requested = true;
    } else {
      throw await parseNetworkError(response);
    }
  }

  return prepareDataForApolloCache(result, info);
};

export const sendBoardAccessRequest = async (
  obj: object,
  args: QueryBoardAccessRequestArgs | null,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { modelType, id } = args || {};
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/${modelType}/${id}/requestAccess`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info);
};
