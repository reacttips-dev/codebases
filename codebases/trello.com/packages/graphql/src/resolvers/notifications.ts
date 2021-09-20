import { ResolverContext } from '../types';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { token } from '@trello/session-cookie';
import { trelloFetch, fetch } from '@trello/fetch';
import {
  QueryNotificationsCountArgs,
  MutationSetNotificationsReadArgs,
  QueryNotificationGroupsArgs,
} from '../generated';
import { parseNetworkError } from '@trello/graphql-error-handling';
import {
  getChildFieldNames,
  getChildNodes,
} from '../restResourceResolver/queryParsing';
import { getNetworkClient } from '../getNetworkClient';

export const notificationsCountResolver = async (
  _parent: unknown,
  args: QueryNotificationsCountArgs | null,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { grouped, filter } = args || {};
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/members/me/notificationsCount');
  const params = new URLSearchParams();

  if (grouped) {
    params.set('grouped', grouped.toString());
  }

  if (filter) {
    params.set('filter', filter);
  }

  const queryString = `${params}`;

  const response = await trelloFetch(
    queryString.length ? `${apiUrl}?${queryString}` : apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'notificationsCount',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const notificationsCount = await response.json();

  return prepareDataForApolloCache(notificationsCount, info);
};

export const notificationsResolver = async (
  _parent: unknown,
  args: null,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/members/me/notifications');
  const response = await trelloFetch(
    apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'notifications',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const notifications = await response.json();

  return prepareDataForApolloCache(notifications, info);
};

export const notificationGroupsResolver = async (
  _parent: unknown,
  args: QueryNotificationGroupsArgs | null,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const params = new URLSearchParams();
  if (args?.limit !== undefined) {
    params.set('limit', `${args.limit}`);
  }

  if (args?.skip !== undefined) {
    params.set('skip', `${args.skip}`);
  }

  if (args?.idCards !== undefined && Array.isArray(args?.idCards)) {
    params.set('idCards', args.idCards.join(','));
  }

  const children = getChildNodes(info.field);

  const cardSelection = children.find((child) => child.name.value === 'card');

  // We check idCards here to preserve the behavior of the way redux loaded notifications. We should ideally remove this
  // condition and allow optimization of card_fields even when idCards is set.
  if (cardSelection && args?.idCards === undefined) {
    // Converts sub-selections on "card" to REST args.
    params.set('card_fields', getChildFieldNames(cardSelection).join(','));
  }

  const apiPath =
    args?.idCards === undefined
      ? '/1/members/me/notificationGroups'
      : '/1/notificationGroups';

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    Array.from(params).length === 0 ? apiPath : `${apiPath}?${params}`,
  );

  const response = await trelloFetch(
    apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'notificationGroups',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const notificationGroups = await response.json();

  return prepareDataForApolloCache(notificationGroups, info);
};

export const setNotificationsRead = async (
  obj: object,
  args: MutationSetNotificationsReadArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/notifications/all/read`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        read: args.read,
        ids: args.ids.join(','),
        token: context.token || token,
      }),
    },
  );

  await response.json();

  return prepareDataForApolloCache({ success: true }, info);
};
export const setAllNotificationsRead = async (
  obj: object,
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/notifications/all/read`),
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

  await response.json();

  return prepareDataForApolloCache({ success: true }, info);
};
