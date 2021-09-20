import {
  QueryInfo,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import {
  MutationClaimOrganizationArgs,
  MutationLinkEnterpriseWithAtlassianOrganizationArgs,
  EnterpriseClaimableOrganizationsArgs,
  MutationDeleteManagedMemberTokensArgs,
  MutationUpdateEnterpriseApiTokenCreationPermissionArgs,
  EnterpriseManagedMembersWithTokensArgs,
} from '../generated';
import { token } from '@trello/session-cookie';
import { trelloFetch, fetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export async function enterpriseClaimableOrganizationsResolver(
  enterprise: {
    id: string;
  },
  args: EnterpriseClaimableOrganizationsArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  let model = null;
  const { limit, cursor, name } = args;

  const nameQuery = name ? `&name=${name}` : '';

  const queryParams = `limit=${limit || 20}&cursor=${encodeURIComponent(
    cursor || '',
  )}${nameQuery}`;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/enterprises/${enterprise.id}/claimableOrganizations?${queryParams}`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Enterprise.claimableOrganizations',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      const {
        organizations,
        claimableCount,
        cursor: nextCursor,
      } = await response.json();

      model = {
        organizations,
        count: claimableCount,
        cursor: nextCursor,
      };
    } else {
      throw new Error(
        `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
      );
    }

    return model ? prepareDataForApolloCache(model, info, 'Enterprise') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
}

export const transferrableDataForOrganizationResolver = async (
  enterprise: {
    id: string;
  },
  args: { idOrganization: string },
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/enterprises/${enterprise.id}/transferrable/organization/${args.idOrganization}`,
  );

  const response = await trelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.transferrableData',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  const model = await response.json();

  // The API should probably not be sending back status 200 for this, but alas
  if ('message' in model) {
    console.error(model);
    throw new Error(model.message);
  }

  return model ? prepareDataForApolloCache(model, info, 'Enterprise') : model;
};

export const claimOrganization = async (
  obj: object,
  { idEnterprise, idOrganization }: MutationClaimOrganizationArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/enterprises/${idEnterprise}/organizations`),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        idOrganization,
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  const model = await response.json();

  return prepareDataForApolloCache(model, info);
};

export const linkEnterpriseWithAtlassianOrganization = async (
  obj: object,
  {
    idEnterprise,
    atlOrgId,
  }: MutationLinkEnterpriseWithAtlassianOrganizationArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/enterprises/${idEnterprise}/linkWithAtlassianOrganization`,
    ),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        atlOrgId,
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  await response.json();

  return prepareDataForApolloCache({ success: true }, info);
};

export const managedMembersWithTokensResolver = async (
  enterprise: {
    id: string;
  },
  args: EnterpriseManagedMembersWithTokensArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/enterprises/${enterprise.id}/members/tokens?filter=${args.filter}`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Enterprise.managedMembersWithTokens',
        operationName: context.operationName,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    model = await response.json();

    return model ? prepareDataForApolloCache(model, info, 'Enterprise') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const deleteManagedMemberTokens = async (
  obj: object,
  { idEnterprise, idMember, filter }: MutationDeleteManagedMemberTokensArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/enterprises/${idEnterprise}/members/tokens/${idMember}`,
    ),
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        filter,
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  return prepareDataForApolloCache({ success: true }, info);
};

export const deleteAllManagedMemberTokens = async (
  obj: object,
  { idEnterprise, filter }: MutationDeleteManagedMemberTokensArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/enterprises/${idEnterprise}/members/tokens`),
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        filter,
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  return prepareDataForApolloCache({ success: true }, info);
};

export const updateEnterpriseApiTokenCreationPermission = async (
  obj: object,
  args: MutationUpdateEnterpriseApiTokenCreationPermissionArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/enterprise/${args.idEnterprise}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        'prefs/canIssueManagedConsentTokens': args.isAllowed,
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

export const auditlogResolver = async (
  enterprise: { id: string },
  args: null,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await trelloFetch(
    networkClient.getUrl(`/1/enterprise/${enterprise.id}/auditlog`),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info, 'Enterprise');
};
