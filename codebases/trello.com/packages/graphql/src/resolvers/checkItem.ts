import {
  MutationAddCheckItemArgs,
  MutationDeleteCheckItemArgs,
  MutationUpdateCheckItemNameArgs,
  MutationUpdateCheckItemPosArgs,
  MutationUpdateCheckItemStateArgs,
  MutationUpdateCheckItemDueDateArgs,
} from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { token } from '@trello/session-cookie';
import { fetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';
import { Analytics } from '@trello/atlassian-analytics';

export const addCheckItem = async (
  obj: object,
  args: MutationAddCheckItemArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/cards/${args.cardId}/checklist/${args.checklistId}/checkItem`,
    ),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        name: args.name,
        nameData: {
          emoji: {},
        },
        token: context.token || token,
      }),
    },
  );

  const checkItem = await response.json();

  checkItem.temporaryId = args.temporaryId;

  return prepareDataForApolloCache(checkItem, info);
};

export const deleteCheckItem = async (
  obj: object,
  args: MutationDeleteCheckItemArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/cards/${args.cardId}/checklist/${args.checklistId}/checkItem/${args.checkItemId}`,
    ),
    {
      method: 'DELETE',
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

  await response.json();

  return prepareDataForApolloCache({ success: true }, info);
};

export const updateCheckItemDueDate = async (
  obj: object,
  args: MutationUpdateCheckItemDueDateArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const params = new URLSearchParams();
  params.set('due', args.due);
  params.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/cards/${args.cardId}/checklist/${args.checklistId}/checkItem/${args.checkItemId}`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: params,
    },
  );

  const checkItem = await response.json();

  return prepareDataForApolloCache(checkItem, info);
};

export const updateCheckItemName = async (
  obj: object,
  args: MutationUpdateCheckItemNameArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const params = new URLSearchParams();
  params.set('name', args.name);
  params.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/cards/${args.cardId}/checklist/${args.checklistId}/checkItem/${args.checkItemId}`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: params,
    },
  );

  const checkItem = await response.json();

  return prepareDataForApolloCache(checkItem, info);
};

export const updateCheckItemPos = async (
  obj: object,
  args: MutationUpdateCheckItemPosArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const params = new URLSearchParams();
  params.set('pos', `${args.pos}`);
  params.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/cards/${args.cardId}/checklist/${args.checklistId}/checkItem/${args.checkItemId}`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: params,
    },
  );

  const checkItem = await response.json();

  return prepareDataForApolloCache(checkItem, info);
};

export const updateCheckItemState = async (
  obj: object,
  args: MutationUpdateCheckItemStateArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const params = new URLSearchParams();
  params.set('state', args.state);
  params.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/cards/${args.cardId}/checklist/${args.checklistId}/checkItem/${args.checkItemId}`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
        'X-Trello-TraceId': args.traceId,
      },
      body: params,
    },
  );

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  const checkItem = await response.json();

  return prepareDataForApolloCache(checkItem, info);
};
