import { TypedJSONObject, JSONObject, ResolverContext } from '../types';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { token } from '@trello/session-cookie';
import {
  MutationAddFreeTrialArgs,
  MutationAddMembersToOrgArgs,
  MutationRemoveMembersFromWorkspaceArgs,
  MutationApplyBcDiscountArgs,
  MutationUpdateOrganizationArgs,
  MutationCopyBoardToOrgArgs,
  MutationDeleteOrganizationLogoArgs,
  MutationUploadOrganizationImageArgs,
  Organization_Stats_Cards_GroupBy,
  QueryOrganizationMemberCardsArgs,
  MutationCreateOrganizationArgs,
  Board_Filter,
  MutationAddTagArgs,
} from '../generated';
import { confirmPaidAccount } from './paidAccount';
import { trelloFetch, fetch } from '@trello/fetch';
import {
  parseNetworkError,
  NetworkError,
  ErrorExtensionsType,
} from '@trello/graphql-error-handling';
import {
  getChildFieldNames,
  getChildNodes,
} from '../restResourceResolver/queryParsing';
import { getNetworkClient } from '../getNetworkClient';
import { Analytics } from '@trello/atlassian-analytics';

export const organizationNewBillableGuestsResolver = async (
  organization: {
    id: string;
  },
  args: { boardId: string },
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizations/${organization.id}/newBillableGuests/${args.boardId}`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization.newBillableGuests',
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

    return model
      ? prepareDataForApolloCache(model, info, 'Organization')
      : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const organizationOwnedPluginsResolver = async (
  organization: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
): Promise<TypedJSONObject> => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizations/${organization.id}/ownedPlugins`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization.ownedPlugins',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([401, 404, 449].includes(response.status)) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model
      ? prepareDataForApolloCache(model, info, 'Organization')
      : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const organizationLabelNamesResolver = async (
  organization: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizations/${organization.id}/stats/labelNames/`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization_Stats.labelNames',
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

    const mappedModel =
      Object.entries(model['data'] as JSONObject)
        // Map the labelNames returned from Apollo to LabelFilterOrgLabels
        // @ts-ignore
        .map(([name, orgLabel]: [string, JSONObject]) => ({
          name,
          ...orgLabel,
        })) || [];

    return prepareDataForApolloCache(
      {
        incomplete: model.incomplete,
        stats: mappedModel,
      },
      info,
      'Organization_Stats',
    );
  } catch (err) {
    console.error(err);
    return model;
  }
};

const GroupByToIdField: Record<Organization_Stats_Cards_GroupBy, string> = {
  [Organization_Stats_Cards_GroupBy.Label]: 'idLabel',
  [Organization_Stats_Cards_GroupBy.LabelName]: 'labelName',
  [Organization_Stats_Cards_GroupBy.Member]: 'idMember',
};

const assignGroupById = (
  obj: JSONObject,
  id: string,
  groupBy: Organization_Stats_Cards_GroupBy,
) => {
  const idField = GroupByToIdField[groupBy];
  return idField ? { [idField]: id, ...obj } : obj;
};

export const organizationCardStatsResolver = async (
  organizationStats: {
    id: string;
  },
  args: {
    groupBy?: Organization_Stats_Cards_GroupBy;
    idBoards?: string[];
    idMembers?: string[];
    idLabels?: string[];
    dueDateSince?: string;
    dueDateUntil?: string;
  },
  context: ResolverContext,
  info: QueryInfo,
) => {
  const {
    groupBy,
    idBoards,
    idMembers,
    idLabels,
    dueDateUntil,
    dueDateSince,
  } = args;
  const params = new URLSearchParams({
    ...(groupBy && { groupBy: groupBy }),
    ...(idBoards && idBoards.length > 0 && { idBoards: idBoards.join(',') }),
    ...(idMembers &&
      idMembers.length > 0 && { idMembers: idMembers.join(',') }),
    ...(idLabels && idLabels.length > 0 && { idLabels: idLabels.join(',') }),
    ...(dueDateUntil && { dueDateUntil }),
    ...(dueDateSince && { dueDateSince }),
    includeIds: 'overdue,upcoming',
  });
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizations/${organizationStats.id}/stats/cards?${params.toString()}`,
  );
  const response = await trelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Organization_Stats.cards',
      operationName: context.operationName,
    },
  });
  const json = await response.json();
  const cards = groupBy
    ? Object.entries((json['data'] || {}) as JSONObject).map(
        // @ts-ignore
        ([key, value]: [string, JSONObject]) => {
          return assignGroupById(value, key, groupBy);
        },
      )
    : [json['data'] || {}];
  return prepareDataForApolloCache(
    {
      incomplete: json.incomplete,
      stats: cards,
    },
    info,
    'Organization_Stats',
  );
};

export const organizationStatsResolver = (
  organization: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) => {
  return prepareDataForApolloCache(
    {
      id: organization.id,
    },
    info,
    'Organization',
  );
};

export const createOrganization = async (
  obj: object,
  args: MutationCreateOrganizationArgs,
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
  const response = await fetch(networkClient.getUrl('/1/organizations'), {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      ...(args || {}),
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  throw await parseNetworkError(response);
};

export const updateOrganization = async (
  obj: object,
  args: MutationUpdateOrganizationArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/organizations/${args.orgId}`),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...(args || {}),
        token: context.token || token,
      }),
    },
  );

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  throw await parseNetworkError(response);
};

export async function copyBoardToOrg(
  obj: object,
  args: MutationCopyBoardToOrgArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  // Pre-fetch before mutation
  let response = await trelloFetch(
    networkClient.getUrl(`/1/boards/${args.boardId}`),
    {
      credentials: 'same-origin',
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'copyBoardToOrg',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );
  const copy = await response.json();

  const searchParams = new URLSearchParams();

  searchParams.set('token', context.token || token || '');
  searchParams.set('name', copy.name);
  searchParams.set('idOrganization', args.organizationId);
  searchParams.set('idBoardSource', args.boardId);
  searchParams.set('creationMethod', 'assisted');
  searchParams.set('keepFromSource', 'cards');
  searchParams.set('prefs_permissionLevel', 'org');

  response = await fetch(networkClient.getUrl(`/1/boards/`), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: searchParams,
  });

  const board = await response.json();

  return prepareDataForApolloCache(board, info);
}

export const addMembersToOrg = async (
  obj: object,
  {
    orgId,
    users,
    invitationMessage,
    type = 'normal',
  }: MutationAddMembersToOrgArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  try {
    const networkClient = getNetworkClient();
    await Promise.all(
      users.map((user) => {
        return fetch(
          networkClient.getUrl(
            `/1/organizations/${orgId}/members${user?.id ? `/${user.id}` : ''}`,
          ),
          {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Trello-Client-Version': context.clientAwareness.version,
            },
            body: JSON.stringify({
              ...(user?.id
                ? { acceptUnconfirmed: true }
                : { email: user?.email }),
              type,
              invitationMessage,
              token: context.token || token,
            }),
          },
        );
      }),
    );

    return prepareDataForApolloCache({ success: true }, info);
  } catch (err) {
    return prepareDataForApolloCache(
      {
        success: false,
        error: err.message,
      },
      info,
    );
  }
};

export const removeMembersFromWorkspace = async (
  obj: object,
  { orgId, users, type = 'normal' }: MutationRemoveMembersFromWorkspaceArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  try {
    const networkClient = getNetworkClient();
    await Promise.all(
      users.map((user) => {
        return fetch(
          networkClient.getUrl(
            `/1/organizations/${orgId}/members${user?.id ? `/${user.id}` : ''}`,
          ),
          {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Trello-Client-Version': context.clientAwareness.version,
            },
            body: JSON.stringify({
              ...(user?.id
                ? { acceptUnconfirmed: true }
                : { email: user?.email }),
              type,
              token: context.token || token,
            }),
          },
        );
      }),
    );

    return prepareDataForApolloCache({ success: true }, info);
  } catch (err) {
    return prepareDataForApolloCache(
      {
        success: false,
        error: err.message,
      },
      info,
    );
  }
};

export async function uploadOrganizationImage(
  obj: object,
  { orgId, file }: MutationUploadOrganizationImageArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const formData = new FormData();
  formData.set('file', file);
  formData.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  // We need to use XHR in order to track upload progress
  const request = new Promise<JSONObject>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('POST', networkClient.getUrl(`/1/organizations/${orgId}/logo`));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.onerror = () => {
      reject(xhr.response);
    };

    xhr.send(formData);
  });

  try {
    const organization = await request;
    return prepareDataForApolloCache(organization, info);
  } catch (err) {
    let error: { message: string; error: string };
    try {
      error = JSON.parse(err);
    } catch (e) {
      error = {
        message: err,
        error: 'UNKNOWN_ERROR',
      };
    }

    throw new NetworkError(error?.message, {
      code: (error?.error as ErrorExtensionsType) || 'UNKNOWN_ERROR',
      status: 400,
    });
  }
}

export const deleteOrganizationLogo = async (
  obj: object,
  { orgId }: MutationDeleteOrganizationLogoArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/organizations/${orgId}/logo`),
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
    throw await parseNetworkError(response);
  }

  // Re-fetching to populate Apollo cache
  const organization = await trelloFetch(
    networkClient.getUrl(`/1/organizations/${orgId}`),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'deleteOrganizationLogo',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );
  return prepareDataForApolloCache(await organization.json(), info);
};

export const addFreeTrial = async (
  obj: object,
  { orgId, via, count }: MutationAddFreeTrialArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const postResponse = await fetch(
    networkClient.getUrl(`/1/organizations/${orgId}/freeTrial`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        token: context.token || token,
        ...(via ? { via } : {}),
        ...(count ? { count } : {}),
      }),
    },
  );

  if (!postResponse.ok) {
    throw await parseNetworkError(postResponse);
  }

  const data = await confirmPaidAccount(
    networkClient.getUrl(
      `/1/organizations/${orgId}?fields=credits&paidAccount=true&paidAccount_fields=products,standing`,
    ),
    {
      products: [110],
      freeTrial: true,
    },
    context,
  );

  return prepareDataForApolloCache(data, info);
};

export const applyBCDiscount = async (
  obj: object,
  { orgId }: MutationApplyBcDiscountArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const res = await fetch(
    networkClient.getUrl(`/1/organizations/${orgId}/promotions/redeem`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        token: context.token || token,
        promotion: 'bcWinback',
      }),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return true;
};

export const organizationCardsResolver = async (
  organization: {
    id: string;
  },
  args: {
    idBoards: string[];
    limit?: number;
    cursor?: string;
    due?: string;
    start?: string;
    date?: string;
    dueComplete?: boolean;
    sortBy?: string;
    idLists?: string[];
    labels?: string[];
    idMembers?: string[];
  },
  context: ResolverContext,
  info: QueryInfo,
): Promise<TypedJSONObject> => {
  let model = null;

  try {
    const {
      idBoards,
      limit,
      cursor,
      due,
      start,
      date,
      dueComplete,
      sortBy,
      idLists,
      labels,
      idMembers,
    } = args;
    const params = new URLSearchParams({
      idBoards: idBoards.join(','),
      ...(limit && { limit: `${limit}` }),
      ...(cursor && { cursor }),
      ...(start && { start }),
      ...(date && { date }),
      ...(due && { due }),
      ...(dueComplete !== null && { dueComplete: `${dueComplete}` }),
      ...(sortBy && { sortBy }),
      ...(idLists && { idLists: idLists.join(',') }),
      ...(labels && { labels: labels.join(',') }),
      ...(idMembers && { idMembers: idMembers.join(',') }),
    });

    const networkClient = getNetworkClient();

    const apiUrl = networkClient.getUrl(
      `/1/organizations/${organization.id}/cards?${params.toString()}`,
    );

    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization.cards',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([400, 401, 404, 422, 449].includes(response.status)) {
        model = null;
        throw new Error(await response.text());
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model
      ? prepareDataForApolloCache(model, info, 'Organization')
      : model;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

// Very specific resolver to use on /members/id/cards
export const organizationMemberCardsResolver = async (
  obj: object,
  args: QueryOrganizationMemberCardsArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { id, idMember } = args;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organization/${id}/members/${idMember}/cards`,
  );

  const params = new URLSearchParams();
  params.set(
    'fields',
    'badges,closed,dateLastActivity,due,dueComplete,idAttachmentCover,idList,idBoard,idMembers,idShort,labels,name,url',
  );
  params.set('board', 'true');
  params.set('board_fields', 'name,closed,memberships');
  params.set('list', 'true');
  params.set('attachments', 'true');
  params.set('stickers', 'all');
  params.set('members', 'true');
  params.set(
    'member_fields',
    'activityBlocked,avatarUrl,bio,bioData,confirmed,fullName,idEnterprise,idMemberReferrer,initials,memberType,nonPublic,products,url,username',
  );

  const response = await trelloFetch(`${apiUrl}?${params}`, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'organizationMemberCards',
      operationName: context.operationName,
    },
  });

  if (response.ok) {
    const model = await response.json();
    return prepareDataForApolloCache(model, info);
  } else {
    throw new Error(
      `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }
};

/**
 * Fetches from the organization boards mixin. This is a custom resolver so that
 * we can supply `ids` as an arg to the nested `boards` query, which we couldn't
 * do if it was implemented as a `restResourceResolver`.
 */
export const organizationBoardsResolver = async (
  organization: {
    id: string;
  },
  args: {
    filter?: Board_Filter;
    ids?: string[];
    startIndex?: number;
    count?: number;
    boardLabelsLimit?: number;
  },
  context: ResolverContext,
  info: QueryInfo,
) => {
  try {
    const params = new URLSearchParams();

    const childFields = getChildFieldNames(info.field);

    // Make sure args isn't null
    args = args ?? {};

    params.set('boards', args.filter ?? 'all');

    args.ids && params.set('board_ids', args.ids.join(','));
    args.count && params.set('boards_count', `${args.count}`);
    args.startIndex && params.set('boards_startIndex', `${args.startIndex}`);

    params.set('board_fields', childFields.join(','));

    const children = getChildNodes(info.field);

    // Converts subselections on org boards to REST args.
    const membersSelection = children.find(
      (child) => child.name.value === 'members',
    );
    if (membersSelection) {
      const membersFilter = (membersSelection.arguments?.find(
        (arg) => arg.name.value === 'filter',
      )?.value as { value: string } | undefined)?.value;

      params.set('board_members', membersFilter ?? 'all');
      params.set(
        'board_member_fields',
        getChildFieldNames(membersSelection).join(','),
      );
    }

    const listsSelection = children.find(
      (child) => child.name.value === 'lists',
    );
    if (listsSelection) {
      const listsFilter = (listsSelection.arguments?.find(
        (arg) => arg.name.value === 'filter',
      )?.value as { value: string } | undefined)?.value;

      params.set('board_lists', listsFilter ?? 'open');
      params.set(
        'board_list_fields',
        getChildFieldNames(listsSelection).join(','),
      );
    }

    const labelsSelection = children.find(
      (child) => child.name.value === 'labels',
    );
    if (labelsSelection) {
      const labelsFilter = (labelsSelection.arguments?.find(
        (arg) => arg.name.value === 'filter',
      )?.value as { value: string } | undefined)?.value;

      params.set('board_labels', labelsFilter ?? 'all');
      params.set(
        'board_label_fields',
        getChildFieldNames(labelsSelection).join(','),
      );
      if (args.boardLabelsLimit) {
        params.set('board_labels_limit', args.boardLabelsLimit.toString());
      }
    }

    // Board plugins are specified outside of the board_fields param.
    const boardPluginsSelection = children.find(
      (child) => child.name.value === 'boardPlugins',
    );
    if (boardPluginsSelection) {
      params.set('board_boardPlugins', 'true');
    }

    const networkClient = getNetworkClient();
    const apiUrl = networkClient.getUrl(
      `/1/organization/${organization.id}?${params.toString()}`,
    );

    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization.boards',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      const model = await response.json();
      return prepareDataForApolloCache(model.boards, info, 'Organization');
    } else {
      if ([400, 401, 404, 422, 449].includes(response.status)) {
        throw new Error(await response.text());
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const addTag = async (
  obj: object,
  { orgId, tag }: MutationAddTagArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const res = await fetch(
    networkClient.getUrl(`/1/organizations/${orgId}/tags`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        token: context.token || token,
        name: tag,
      }),
    },
  );

  if (!res.ok) {
    throw await parseNetworkError(res);
  }

  return true;
};
