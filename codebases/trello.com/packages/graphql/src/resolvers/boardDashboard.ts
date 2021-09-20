import { token } from '@trello/session-cookie';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { getStringFromAdvancedDate } from '@trello/dashboard';
import { fetch } from '@trello/fetch';
import {
  MutationCreateDashboardViewTileArgs,
  MutationUpdateDashboardViewTileArgs,
  MutationDeleteDashboardViewTileArgs,
  CreateDashboardViewTile,
  UpdateDashboardViewTile,
} from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

const mapUpdateTileInputToPayload = (input: UpdateDashboardViewTile) => {
  return {
    ...(input.type && { type: input.type }),
    ...(input.graph && { graph_type: input.graph.type }),
    ...(input.from && {
      from: getStringFromAdvancedDate(input.from),
    }),
  };
};

const mapCreateTileInputToPayload = (input: CreateDashboardViewTile) => {
  return {
    type: input.type,
    graph_type: input.graph.type,
    pos: input.pos,
    ...(input.from && {
      from: getStringFromAdvancedDate(input.from),
    }),
  };
};

export const createDashboardViewTile = async (
  obj: object,
  args: MutationCreateDashboardViewTileArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  if (!args.tile) {
    return;
  }
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.idBoard}/dashboardViewTiles`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...mapCreateTileInputToPayload(args.tile),
        token: context.token || token,
      }),
    },
  );

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }
  throw await parseNetworkError(response);
};

export const updateDashboardViewTile = async (
  obj: object,
  args: MutationUpdateDashboardViewTileArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  if (!args.tile) {
    return;
  }
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/boards/${args.idBoard}/dashboardViewTiles/${args.tile.id}`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...mapUpdateTileInputToPayload(args.tile),
        token: context.token || token,
      }),
    },
  );

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }
  throw await parseNetworkError(response);
};

export const deleteDashboardViewTile = async (
  obj: object,
  args: MutationDeleteDashboardViewTileArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/boards/${args.idBoard}/dashboardViewTiles/${args.idTile}`,
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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return true;
};
