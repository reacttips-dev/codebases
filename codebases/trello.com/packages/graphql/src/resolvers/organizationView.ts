import { token } from '@trello/session-cookie';
import { parseNetworkError } from '@trello/graphql-error-handling';
import {
  MutationCreateOrganizationViewArgs,
  MutationUpdateOrganizationViewArgs,
  MutationUpdateViewInOrganizationViewArgs,
} from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { fetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const createOrganizationView = async (
  obj: object,
  args: MutationCreateOrganizationViewArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl('/1/organizationViews'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...(args || {}),
      token: context.token || token,
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  throw await parseNetworkError(response);
};

export const updateOrganizationView = async (
  obj: object,
  args: MutationUpdateOrganizationViewArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const body = {
    ...args.organizationView,
  };

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/organizationViews/${args.idOrganizationView}`),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...(body || {}),
        token: context.token || token,
      }),
    },
  );

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  throw await parseNetworkError(response);
};

export const updateViewInOrganizationView = async (
  obj: object,
  args: MutationUpdateViewInOrganizationViewArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const body = {
    ...args.view,
  };

  const networkClient = getNetworkClient();

  const response = await fetch(
    networkClient.getUrl(
      `/1/organizationViews/${args.idOrganizationView}/views/${args.idView}`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...(body || {}),
        token: context.token || token,
      }),
    },
  );

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  throw await parseNetworkError(response);
};
