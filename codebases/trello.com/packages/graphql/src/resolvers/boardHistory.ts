import { parseNetworkError } from '@trello/graphql-error-handling';
import { trelloFetch } from '@trello/fetch';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import {
  Board_HistoryCardsPerListArgs,
  Board_HistoryCardsPerLabelArgs,
  Board_HistoryCardsPerDueDateStatusArgs,
} from '../generated';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const boardHistoryResolver = (
  board: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) => {
  return prepareDataForApolloCache(
    {
      id: board.id,
    },
    info,
    'Board',
  );
};

export const getCardsPerList = async (
  board: {
    id: string;
  },
  args: Board_HistoryCardsPerListArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/boards/${board.id}/history/cardsPerList?${queryParams.toString()}`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board_History.cardsPerList',
        operationName: context.operationName,
      },
    },
  );

  const json = await response.json();

  // GraphQL doesn't have a map type, so we convert the
  // idList->dataPoints map into a list
  const series = Object.entries(json.series).map(([idList, series]) => {
    return {
      idList,
      dataPoints: series,
    };
  });

  if (response.ok) {
    return prepareDataForApolloCache(
      {
        ...json,
        series,
      },
      info,
      'Board_History',
    );
  }
  throw await parseNetworkError(response);
};

export const getCardsPerLabel = async (
  board: {
    id: string;
  },
  args: Board_HistoryCardsPerLabelArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/boards/${board.id}/history/cardsPerLabel?${queryParams.toString()}`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board_History.cardsPerLabel',
        operationName: context.operationName,
      },
    },
  );
  const json = await response.json();

  const series = Object.entries(json.series).map(([idLabel, series]) => {
    return {
      idLabel,
      dataPoints: series,
    };
  });

  if (response.ok) {
    return prepareDataForApolloCache(
      {
        ...json,
        series,
      },
      info,
      'Board_History',
    );
  }
  throw await parseNetworkError(response);
};

export const getCardsPerMember = async (
  board: {
    id: string;
  },
  args: Board_HistoryCardsPerLabelArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/boards/${board.id}/history/cardsPerMember?${queryParams.toString()}`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board_History.cardsPerMember',
        operationName: context.operationName,
      },
    },
  );
  const json = await response.json();

  const series = Object.entries(json.series).map(([idMember, series]) => {
    return {
      idMember,
      dataPoints: series,
    };
  });

  if (response.ok) {
    return prepareDataForApolloCache(
      {
        ...json,
        series,
      },
      info,
      'Board_History',
    );
  }
  throw await parseNetworkError(response);
};

export const getCardsPerDueDateStatus = async (
  board: {
    id: string;
  },
  args: Board_HistoryCardsPerDueDateStatusArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(
      `/1/boards/${
        board.id
      }/history/cardsPerDueDateStatus?${queryParams.toString()}`,
    ),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board_History.cardsPerDueDateStatus',
        operationName: context.operationName,
      },
    },
  );

  const json = await response.json();

  if (response.ok) {
    return prepareDataForApolloCache(json, info, 'Board_History');
  }
  throw await parseNetworkError(response);
};
