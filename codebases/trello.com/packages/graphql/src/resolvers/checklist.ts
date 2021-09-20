import {
  MutationAddChecklistArgs,
  MutationDeleteChecklistArgs,
  MutationUpdateChecklistNameArgs,
  MutationUpdateChecklistPosArgs,
} from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { token } from '@trello/session-cookie';
import { fetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const addChecklist = async (
  obj: object,
  args: MutationAddChecklistArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl(`/1/checklists`), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      idBoard: args.boardId,
      idCard: args.cardId,
      idChecklistSource: args.checklistSourceId || '',
      name: args.name,
      token: context.token || token,
    }),
  });

  const checklist = await response.json();

  checklist.temporaryId = args.temporaryId;

  return prepareDataForApolloCache(checklist, info);
};

export const deleteChecklist = async (
  obj: object,
  args: MutationDeleteChecklistArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/checklists/${args.checklistId}`),
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

export const updateChecklistName = async (
  obj: object,
  args: MutationUpdateChecklistNameArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const params = new URLSearchParams();
  params.set('name', args.name);
  params.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/checklists/${args.checklistId}`),
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

  const checklist = await response.json();

  return prepareDataForApolloCache(checklist, info);
};

export const updateChecklistPos = async (
  obj: object,
  args: MutationUpdateChecklistPosArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const params = new URLSearchParams();
  params.set('pos', `${args.pos}`);
  params.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/checklists/${args.checklistId}`),
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

  const checklist = await response.json();

  return prepareDataForApolloCache(checklist, info);
};
