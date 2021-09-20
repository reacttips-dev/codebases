import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import {
  MutationCreateCustomFieldArgs,
  MutationEnablePluginArgs,
  MutationStartBoardExportArgs,
  MutationUpdateBoardOrgArgs,
  MutationUpdateBoardVisibilityArgs,
  MutationUpdateBoardCardCoversPrefArgs,
  MutationUpdateCalendarKeyArgs,
  MutationUpdateCalendarFeedEnabledPrefArgs,
} from '../generated';
import { token } from '@trello/session-cookie';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { trelloFetch, fetch } from '@trello/fetch';
import { getNetworkClient } from '../getNetworkClient';
import { ResolverContext } from '../types';
import { Analytics } from '@trello/atlassian-analytics';

export const createCustomField = async (
  obj: object,
  args: MutationCreateCustomFieldArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { name, idModel, modelType, display, type, options } = args;
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl('/1/customFields'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      display_cardFront: display.cardFront,
      idModel,
      modelType,
      name,
      options,
      type,
      token: context.token || token,
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, info);
};

export const enablePlugin = async (
  obj: object,
  args: MutationEnablePluginArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.boardId}/boardPlugins`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        'X-Trello-TraceId': args.traceId,
      },
      body: JSON.stringify({
        idPlugin: args.pluginId,
        token: context.token || token,
      }),
    },
  );

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return prepareDataForApolloCache({ success: true }, info);
};

export const updateBoardOrg = async (
  obj: object,
  args: MutationUpdateBoardOrgArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Trello-Client-Version': context.clientAwareness.version,
  };

  if (args.traceId) {
    headers['X-Trello-TraceId'] = args.traceId;
  }

  const networkClient = getNetworkClient();
  // eslint-disable-next-line @trello/fetch-includes-client-version
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.boardId}`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        keepBillableGuests: args.keepBillableGuests,
        idOrganization: args.orgId,
        token: context.token || token,
      }),
    },
  );

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info);
};

export const updateBoardVisibility = async (
  obj: object,
  args: MutationUpdateBoardVisibilityArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.boardId}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        keepBillableGuests: args.keepBillableGuests,
        'prefs/permissionLevel': args.visibility,
        idOrganization: args.orgId,
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

export const updateBoardCardCoversPref = async (
  obj: object,
  args: MutationUpdateBoardCardCoversPrefArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.boardId}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        'prefs/cardCovers': args.cardCovers,
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info);
};

export const boardExportResolver = async (
  board: {
    id: string; // idBoard
  },
  args: {
    id: string; // idExport
  },
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/boards/${board.id}/exports/${args.id}`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.export',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, info, 'Board') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const startBoardExport = async (
  obj: object,
  args: MutationStartBoardExportArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.id}/exports`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        token: context.token || token,
        attachments: true,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info);
};

export const statsResolver = async (
  obj: object,
  args: { id: string },
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(`/1/boards/${args.id}/stats`),
    { credentials: 'same-origin' },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.stats',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    } else {
      const error = await response.text();
      console.error(error);
      throw new Error(error);
    }
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, info, 'Board');
};

export const boardDashboardViewTileResolver = async (
  board: {
    id: string; // idBoard
  },
  args: {
    id: string; // idTile
  },
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/boards/${board.id}/dashboardViewTiles/${args.id}`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.DashboardViewTile',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, info, 'Board') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const updateCalendarKey = async (
  obj: object,
  args: MutationUpdateCalendarKeyArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.boardId}/calendarKey/generate`),
    {
      method: 'POST',
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
    const error = await response.json();
    throw new Error(error.error);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, info);
};

export const updateCalendarFeedEnabledPref = async (
  obj: object,
  args: MutationUpdateCalendarFeedEnabledPrefArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/boards/${args.boardId}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        'prefs/calendarFeedEnabled': args.calendarFeedEnabled,
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info);
};
