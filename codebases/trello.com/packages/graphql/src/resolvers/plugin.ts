import {
  MutationUpdatePluginArgs,
  MutationCreatePluginListingArgs,
  MutationUpdatePluginListingArgs,
  MutationDeletePluginListingArgs,
  MutationCreatePluginArgs,
  MutationDeletePluginArgs,
  MutationAddPluginCollaboratorArgs,
  MutationRemovePluginCollaboratorArgs,
} from '../generated';
import {
  QueryInfo,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import { token } from '@trello/session-cookie';
import { trelloFetch, fetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const updatePlugin = async (
  obj: object,
  args: MutationUpdatePluginArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  if (!args.fields) {
    throw new Error('Expected fields argument is missing.');
  }

  const networkClient = getNetworkClient();

  const response = await fetch(
    networkClient.getUrl(`/1/plugin/${args.pluginId}`),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...args.fields,
        token: context.token || token,
      }),
    },
  );

  const plugin = await response.json();

  return prepareDataForApolloCache(plugin, info);
};

export const deletePluginListing = async (
  obj: object,
  args: MutationDeletePluginListingArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/plugin/${args.pluginId}/listings/${args.pluginListingId}`,
    ),
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...args,
        token: context.token || token,
      }),
    },
  );

  const listing = await response.json();

  return prepareDataForApolloCache(listing, info);
};

export const updatePluginListing = async (
  obj: object,
  args: MutationUpdatePluginListingArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/plugin/${args.pluginId}/listings/${args.pluginListingId}`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...args,
        token: context.token || token,
      }),
    },
  );

  const listing = await response.json();

  return prepareDataForApolloCache(listing, info);
};

export const createPluginListing = async (
  obj: object,
  args: MutationCreatePluginListingArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/plugin/${args.pluginId}/listings`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...args,
        token: context.token || token,
      }),
    },
  );

  const listing = await response.json();

  return prepareDataForApolloCache(listing, info);
};

export const createPlugin = async (
  obj: object,
  args: MutationCreatePluginArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl(`/1/plugin`), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      idAgreement: args.agreementId,
      idOrganizationOwner: args.organizationId,
      iframeConnectorUrl: args.iframeConnectorUrl,
      listings: args.listings,
      author: args.author || '',
      token: context.token || token,
    }),
  });

  const plugin = await response.json();

  return prepareDataForApolloCache(plugin, info);
};

export const deletePlugin = async (
  obj: object,
  args: MutationDeletePluginArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/plugins/${args.pluginId}`),
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

export const pluginCollaboratorsResolver = async (
  plugin: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(`/1/plugin/${plugin.id}/collaborators`);

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Plugin.collaborators',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([401, 404].includes(response.status)) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, info, 'Plugin') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

const updatePluginCollaborator = async (
  plugin: {
    id: string;
  },
  args: {
    pluginId: string;
    memberId: string;
    method: string;
  },
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/plugin/${args.pluginId}/collaborators`,
  );
  const method = args.method;

  try {
    const response = await fetch(apiUrl, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        idCollaborator: args.memberId,
        token: context.token || token,
      }),
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([401, 404].includes(response.status)) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, info) : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const addPluginCollaborator = async (
  plugin: {
    id: string;
  },
  args: MutationAddPluginCollaboratorArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const mutationArgs = {
    ...args,
    method: 'PUT',
  };
  return updatePluginCollaborator(plugin, mutationArgs, context, info);
};

export const removePluginCollaborator = async (
  plugin: {
    id: string;
  },
  args: MutationRemovePluginCollaboratorArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const mutationArgs = {
    ...args,
    method: 'DELETE',
  };
  return updatePluginCollaborator(plugin, mutationArgs, context, info);
};
