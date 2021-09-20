/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  MutationAddBoardStarArgs,
  MutationRemoveBoardStarArgs,
  MutationUpdateUserLocaleArgs,
  MutationUpdateTeamifyVoluntaryDoneArgs,
  MutationDeleteOneTimeMessagesDismissedArgs,
  MutationPrepMemberForAtlassianAccountOnboardingArgs,
  MutationPrepMemberForEmailHygieneArgs,
  MutationAcceptDeveloperTermsArgs,
  MutationUpdateMemberAvatarSourceArgs,
  MutationUploadMemberAvatarArgs,
  MutationAddCampaignArgs,
  MutationUpdateCampaignArgs,
  MutationChangeMemberEmailArgs,
  MutationResendVerificationEmailArgs,
  QueryMemberCardsArgs,
  Member_Atlassian_Organization,
  MutationUpdateMemberActiveChannelArgs,
} from '../generated';
import Cookie from 'js-cookie';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { JSONArray, JSONObject, ResolverContext } from '../types';
import { token } from '@trello/session-cookie';
import { atlassianApiGateway } from '@trello/config';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { trelloFetch, fetch } from '@trello/fetch';
import { getChildFieldNames } from '../restResourceResolver/queryParsing';
import { getNetworkClient } from '../getNetworkClient';

export async function addBoardStar(
  obj: object,
  args: MutationAddBoardStarArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/member/${args.memberId}/boardStars`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        token: context.token || token,
        idBoard: args.boardId,
        pos: args.pos,
      }),
    },
  );

  const member = await response.json();

  return prepareDataForApolloCache(member, info);
}

export async function removeBoardStar(
  obj: object,
  args: MutationRemoveBoardStarArgs,
  context: ResolverContext,
) {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(
      `/1/member/${args.memberId}/boardStars/${args.boardStarId}`,
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
}

export async function updateUserLocale(
  obj: object,
  args: MutationUpdateUserLocaleArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const searchParams = new URLSearchParams();

  searchParams.set('prefs/locale', args.locale);
  searchParams.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  const response = await fetch(
    networkClient.getUrl(`/1/members/${args.memberId}`),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: searchParams,
    },
  );

  const member = await response.json();

  return prepareDataForApolloCache(member, info);
}

export async function updateTeamifyVoluntaryDone(
  obj: object,
  args: MutationUpdateTeamifyVoluntaryDoneArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const searchParams = new URLSearchParams();
  searchParams.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/members/${args.memberId}/teamify/voluntaryDone`),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: searchParams,
    },
  );

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  throw await parseNetworkError(response);
}

export async function prepMemberForAtlassianAccountOnboarding(
  obj: object,
  args: MutationPrepMemberForAtlassianAccountOnboardingArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const searchParams = new URLSearchParams();

  searchParams.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  // Perform the PUT
  await fetch(
    networkClient.getUrl(
      `/1/member/${args.memberId}/logins/${args.aaLoginId}/primary`,
    ),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: searchParams,
    },
  );

  // Delete all the other logins
  for (const idLogin of args.nonAaLoginIds) {
    await fetch(
      networkClient.getUrl(`/1/member/${args.memberId}/logins/${idLogin}`),
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'X-Trello-Client-Version': context.clientAwareness.version,
        },
        body: searchParams.toString(),
      },
    );
  }

  // Re-fetch the Member so that the return will correctly update the apollo cache
  const response = await trelloFetch(
    networkClient.getUrl(`/1/member/${args.memberId}?logins=true`),
    {
      credentials: 'same-origin',
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'prepMemberForAtlassianAccountOnboarding',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );
  const member = await response.json();

  return prepareDataForApolloCache(member, info);
}

export async function prepMemberForEmailHygiene(
  obj: object,
  args: MutationPrepMemberForEmailHygieneArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const searchParams = new URLSearchParams();

  searchParams.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  if (args.dismissMessage) {
    // Perform the PUT
    const setPrimaryResponse = await fetch(
      networkClient.getUrl(
        `/1/member/${args.memberId}/logins/${args.primaryLoginId}/primary?peh=true`,
      ),
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'X-Trello-Client-Version': context.clientAwareness.version,
        },
        body: searchParams.toString(),
      },
    );

    if (!setPrimaryResponse.ok) {
      // Sometimes the server sends us just the string as the error, however
      // sometimes the server also sends a JSON error with the key 'message'
      // as the error
      let message = await setPrimaryResponse.text(); // Parse it as text
      let data = null;

      try {
        data = JSON.parse(message); // Try to parse it as json
        message = data.message;
        // eslint-disable-next-line no-empty
      } catch {}

      throw new Error(message);
    }
  } else {
    const networkClient = getNetworkClient();
    // Perform the PUT
    const setPrimaryResponse = await fetch(
      networkClient.getUrl(
        `/1/member/${args.memberId}/logins/${args.primaryLoginId}/primary`,
      ),
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'X-Trello-Client-Version': context.clientAwareness.version,
        },
        body: searchParams.toString(),
      },
    );

    if (!setPrimaryResponse.ok) {
      throw new Error(
        `Invalid response status ${setPrimaryResponse.status} from PUT ${setPrimaryResponse.url}`,
      );
    }

    // Delete all the other logins
    for (const idLogin of args.removeLoginIds) {
      const removeEmailResponse = await fetch(
        networkClient.getUrl(`/1/member/${args.memberId}/logins/${idLogin}`),
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'X-Trello-Client-Version': context.clientAwareness.version,
          },
          body: searchParams.toString(),
        },
      );

      if (!removeEmailResponse.ok) {
        throw new Error(
          `Invalid response status ${removeEmailResponse.status} from DELETE ${removeEmailResponse.url}`,
        );
      }
    }
  }

  // Re-fetch the Member so that the return will correctly update the apollo cache
  const response = await trelloFetch(
    networkClient.getUrl(`/1/member/${args.memberId}?logins=true`),
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'prepMemberForEmailHygiene',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );
  if (!response.ok) {
    throw new Error(
      `Invalid response status ${response.status} from GET ${response.url}`,
    );
  }
  const member = await response.json();

  return prepareDataForApolloCache(member, info);
}

// Internal endpoint for development and trelloinc members
export async function deleteOneTimeMessagesDismissed(
  obj: object,
  args: MutationDeleteOneTimeMessagesDismissedArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const searchParams = new URLSearchParams();

  searchParams.set('value', args.message);
  searchParams.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  const response = await fetch(
    networkClient.getUrl(
      `/1/members/${args.memberId}/oneTimeMessagesDismissed`,
    ),
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: searchParams,
    },
  );

  const member = await response.json();

  return prepareDataForApolloCache(member, info);
}

export async function addOneTimeMessagesDismissed(
  obj: object,
  args: {
    memberId: string;
    messageId: string;
  },
  context: ResolverContext,
  info: QueryInfo,
) {
  const searchParams = new URLSearchParams();

  searchParams.set('value', args.messageId);
  searchParams.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  const response = await fetch(
    networkClient.getUrl(
      `/1/members/${args.memberId}/oneTimeMessagesDismissed`,
    ),
    {
      method: 'POST',
      credentials: 'include',
      body: searchParams,
      headers: {
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
    },
  );

  const member = await response.json();

  return prepareDataForApolloCache(member, info);
}

export async function memberAgreementsResolver(
  member: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(`/1/members/${member.id}/agreements`);

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Member.agreements',
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

    return model ? prepareDataForApolloCache(model, info, 'Member') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
}

export async function memberAtlassianOrganizationsResolver(
  member: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/members/${member.id}/atlassianOrganizations`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Member.atlassianOrganizations',
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

    // attempt to populate SSO URLs for any administered Orgs without a value
    await Promise.all(
      model.map(async (org: Member_Atlassian_Organization) => {
        if (org.isIdentityAdmin && !org.ssoUrl) {
          try {
            org.ssoUrl = await atlassianOrganizationFlexAuthSsoUrl(
              org.id,
              context,
            );
          } catch (err) {
            // Suppress errors. This data is value-add, don't break the page
            console.error(err);
          }
        }
      }),
    );
    return model ? prepareDataForApolloCache(model, info, 'Member') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
}

export async function memberGuestOrganizationsResolver(
  member: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) {
  let model = null;
  const childFields = getChildFieldNames(info.field);
  const params = new URLSearchParams(
    'fields=&boards=open&board_fields=idOrganization&board_organization=true&organizations=all&organization_fields=id',
  );
  params.set('board_organization_fields', childFields.join(','));
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/members/${member.id}?${params.toString()}`,
  );

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Member.guestOrganizations',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();

      model = (getGuestOrganizationsForMember(model) as unknown) as JSONArray;
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, info, 'Member') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
}
interface Board {
  idOrganization: string;
  organization: {
    id: string;
    displayName: string;
    logoHash: string | null;
  };
}

interface Organization {
  id: string;
}

function getGuestOrganizationsForMember({
  boards,
  organizations,
}: {
  boards: Board[];
  organizations: Organization[];
}) {
  const guestOrganizationsMap: {
    [key: string]: Organization;
  } = {};
  const organizationIds = organizations.map((org: { id: string }) => org.id);
  const guestBoards = boards.filter(
    (b: { idOrganization: string }) =>
      b.idOrganization && !organizationIds.includes(b.idOrganization),
  );
  for (const board of guestBoards) {
    if (
      // is not already in our guest organizations map
      !guestOrganizationsMap[board.idOrganization] &&
      // and has the organization subdocument. Note: this is required
      // because there was a rare bug where board.idOrganization was
      // defined but board.organization was undefined
      board.organization
    ) {
      guestOrganizationsMap[board.idOrganization] = board.organization;
    }
  }

  return Object.values(guestOrganizationsMap);
}

/**
 * Returns the SSO URL for the Atlassian Org *if* it is FlexAuth
 * Atlassian Orgs are migrating from legacy to FlexAuth. This changes how SSO
 * is modeled. This API only contains the SSO URL for FlexAuth organizations
 * Trello can only obtain SSO URLs for non-FlexAuth organizations. To bridge
 * this gap we will check for an SSO URL from this API if the record from
 * Trello's API doesn't have a value for ssoUrl.
 */
async function atlassianOrganizationFlexAuthSsoUrl(
  orgId: string,
  context: ResolverContext,
) {
  // eslint-disable-next-line @trello/fetch-includes-client-version
  const response = await trelloFetch(
    `${atlassianApiGateway}gateway/api/admin/private/org/${orgId}/saml-configuration`,
    {
      headers: {
        'X-Trello-Client-Version': undefined,
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Member.atlassianOrganizations',
        operationName: context.operationName,
      },
    },
  );
  if (response.ok) {
    const samlConfig = await response.json();
    return samlConfig?.samlConfiguration?.ssoUrl;
  } else {
    // Two status codes are expected errors. Ignore them.
    // 404 returned when OrgId isn't found or Org isn't FlexAuth.
    // 402 returned when Org isn't licensed for Access.
    if (response.status === 404 || response.status === 402) {
      return null;
    } else {
      const error = await response.json();
      throw new Error(
        `An error occurred while fetching Org SAML Config. ` +
          `(status: ${response.status}, statusText: ${response.statusText}, ` +
          `orgId: ${orgId}, code: ${error.code}, message: ${error.message})`,
      );
    }
  }
}

export async function acceptDeveloperTerms(
  obj: object,
  args: MutationAcceptDeveloperTermsArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(`/1/members/${args.memberId}/agreements`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        agreementType: 'developer-terms',
        token: context.token || token,
      }),
    });

    if (response.ok) {
      model = await response.json();
    } else {
      throw new Error(
        `An error occurred while resolving a GraphQL mutation. (status: ${response.status}, statusText: ${response.statusText})`,
      );
    }

    return model ? prepareDataForApolloCache(model, info) : model;
  } catch (err) {
    console.error(err);
    return model;
  }
}

export async function updateMemberAvatarSource(
  obj: object,
  args: MutationUpdateMemberAvatarSourceArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const body = new URLSearchParams();
  body.set('avatarSource', args.avatarSource);
  body.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  const response = await fetch(networkClient.getUrl(`/1/members/me`), {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body,
  });

  const member = await response.json();

  return prepareDataForApolloCache(member, info);
}

export async function uploadMemberAvatar(
  obj: object,
  { file, uploadProgressCallback }: MutationUploadMemberAvatarArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const formData = new FormData();
  formData.set('file', file);
  formData.set('token', context.token || token || '');

  // We need to use XHR in order to track upload progress
  const request = new Promise<JSONObject>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    if (uploadProgressCallback) {
      const upload = xhr.upload;

      upload.addEventListener('progress', (e) => {
        // 64kb is the minimum threshold
        if (!e.lengthComputable || e.total < 1024 * 64) {
          return;
        }

        uploadProgressCallback(Math.round((100 * e.loaded) / e.total));
      });

      upload.addEventListener('load', () => {
        uploadProgressCallback(100);
      });
    }

    const networkClient = getNetworkClient();
    xhr.open('POST', networkClient.getUrl(`/1/member/me/avatar`));
    xhr.onload = () => {
      const response = JSON.parse(xhr.response);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response);
      } else {
        reject(response);
      }
    };
    xhr.onerror = () => {
      reject({ status: xhr.status, statusText: xhr.statusText });
    };

    xhr.send(formData);
  });

  try {
    const member = await request;
    return prepareDataForApolloCache(member, info);
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function addCampaign(
  obj: object,
  args: MutationAddCampaignArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl('/1/members/me/campaigns'),
    {
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
    },
  );

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  throw await parseNetworkError(response);
}

export async function updateCampaign(
  obj: object,
  args: MutationUpdateCampaignArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const { campaignId, ...rest } = args;
  const networkClient = getNetworkClient();
  const response = await fetch(
    networkClient.getUrl(`/1/members/me/campaigns/${campaignId}`),
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...(rest || {}),
        token: context.token || token,
      }),
    },
  );

  if (!response.ok) {
    throw await parseNetworkError(response);
  }
}

export async function changeMemberEmail(
  obj: object,
  args: MutationChangeMemberEmailArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  let model = null;
  let response = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/members/me/logins');

  const { email, loginId, primary } = args;

  try {
    response = await fetch(`${apiUrl}/${loginId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        email,
        primary,
        token: context.token || token,
      }),
    });

    if (response.ok) {
      model = await response.json();

      if (args.dismissMessage) {
        const networkClient = getNetworkClient();
        const dismissResponse = await fetch(
          networkClient.getUrl(`/1/member/me/oneTimeMessagesDismissed`),
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Trello-Client-Version': context.clientAwareness.version,
            },
            body: JSON.stringify({
              token: context.token || token,
              value: args.dismissMessage,
            }),
          },
        );

        if (!dismissResponse.ok) {
          throw new Error(
            `Invalid response status ${dismissResponse.status} from POST ${dismissResponse.url}`,
          );
        }
      }
    } else {
      throw new Error(
        `An error occurred while resolving a GraphQL mutation. (status: ${response.status}, statusText: ${response.statusText})`,
      );
    }

    return model ? prepareDataForApolloCache(model, info) : model;
  } catch (err) {
    if (response) {
      // Sometimes the server sends us just the string as the error, however
      // sometimes the server also sends a JSON error with the key 'message'
      // as the error
      let message = await response.text(); // Parse it as text
      let data = null;

      try {
        data = JSON.parse(message); // Try to parse it as json
        message = data.message;
        // eslint-disable-next-line no-empty
      } catch {}

      throw new Error(message);
    } else {
      throw new Error('Unknown error');
    }
  }
}

export async function resendVerificationEmail(
  obj: object,
  args: MutationResendVerificationEmailArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  let model = null;
  let response = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/resendValidate');

  const { email } = args;

  response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      email,
      token: Cookie.get(`token${window.location.port ? '3000' : ''}`) || '',
    }),
  });

  if (response.ok) {
    model = await response.json();

    if (model.badEmail) {
      throw new Error('bad email');
    } else if (model.alreadyConfirmed) {
      throw new Error('already confirmed');
    }
  } else {
    throw new Error(
      `An error occurred while resolving a GraphQL mutation. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }

  return model ? prepareDataForApolloCache(model, info) : model;
}

export async function updateMemberActiveChannel(
  parent: object,
  args: MutationUpdateMemberActiveChannelArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const searchParams = new URLSearchParams();
  searchParams.set('value', args.channel);
  searchParams.set('token', context.token || token || '');

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/members/${args.memberId}/channels/active`,
  );

  const response = await fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: searchParams,
  });

  if (response.ok) {
    const model = await response.json();
    return prepareDataForApolloCache(
      { id: args.memberId, channels: model },
      info,
    );
  } else {
    throw new Error(
      `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }
}

export async function memberAtlassianAccountsResolver(
  parent: object,
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/members/me/logins/atlassianAccounts');

  const response = await trelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'atlassianAccounts',
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
}

// Very specific resolver to use on /members/id/cards
export const memberCardsResolver = async (
  obj: object,
  args: QueryMemberCardsArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { id, limit, before, modifiedSince, sort } = args;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(`/1/members/${id}/cards`);

  const params = new URLSearchParams();
  params.set('filter', 'visible');
  params.set('stickers', 'true');
  params.set('attachments', 'true');
  params.set('members', 'true');

  if (limit) {
    params.set('limit', limit.toString());
  }
  if (before) {
    params.set('before', before);
  }
  if (modifiedSince) {
    params.set('modifiedSince', modifiedSince.toString());
  }
  if (sort) {
    params.set('sort', sort);
  }

  const response = await trelloFetch(`${apiUrl}?${params}`, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'memberCards',
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
