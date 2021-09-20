import {
  MemberResponse,
  MembershipResponse,
  NonPublicFields,
  PrivacyResponse,
} from 'app/gamma/src/types/responses';
import { MemberModel, MembershipModel } from 'app/gamma/src/types/models';
import { normalizeLogin } from './login';
import { normalizeCampaign } from './campaign';
import { normalizeSavedSearch } from './saved-search';
import { normalizeSession } from './session';
import { normalizeToken } from 'app/gamma/src/api/normalizers/token';
import genericNormalizer from './generic';
import { normalizeMessagesDismissed } from './messages-dismissed';

const mapNonPublicFields = (
  nonPublicFields: PrivacyResponse,
  response: MemberResponse,
): void => {
  Object.entries(nonPublicFields).map((value) => {
    const [key, val] = value;
    if (val) {
      response[key as NonPublicFields] = val;
    }
  });
};

// This function is a pre-normalizer step, which applies any values, new or
// existing, from the `nonPublic` field to the response before invoking the
// normalizer.
const handleNonPublic = (
  response: MemberResponse,
  existing?: MemberModel,
): MemberResponse => {
  const transformedResponse: MemberResponse = {
    ...response,
  };
  // Apply any overrides from the existing nonPublic field
  if (existing && existing.nonPublic) {
    mapNonPublicFields(existing.nonPublic, transformedResponse);
  }

  // Apply any overrides from the response's nonPublic field, they are more
  // current than the existing ones
  if (response.nonPublic) {
    mapNonPublicFields(response.nonPublic, transformedResponse);
  }

  return transformedResponse;
};

export const normalizeMember = (
  response: MemberResponse,
  existing?: MemberModel,
): MemberModel => {
  const transformedResponse = handleNonPublic(response, existing);
  return genericNormalizer<MemberResponse, MemberModel>(
    ({ fallback, from, has }) => ({
      avatars: has('avatarUrl', (avatarUrl) => {
        if (avatarUrl) {
          return ['30', '50', '170', 'original'].reduce(
            (avatars: { [key: string]: string }, size) => {
              avatars[size] = `${avatarUrl}/${size}.png`;
              return avatars;
            },
            {},
          );
        }
        return null;
      }),
      aaEmail: from('aaEmail'),
      aaEnrolledDate: from('aaEnrolledDate'),
      aaId: from('aaId'),
      aaBlockSyncUntil: from('aaBlockSyncUntil'),
      activityBlocked: from('activityBlocked'),
      // NOTE: It's possible that we'll receive an update for our own model
      // over the board channel.  On the board channel we only see the public
      // version of the member model, which may have avatarSource set to null
      avatarSource: (
        { avatarSource },
        existingValue,
      ): Exclude<MemberResponse['avatarSource'], null> => {
        return avatarSource || existingValue;
      },
      bio: from('bio'),
      campaigns: has('campaigns', (campaigns) =>
        campaigns
          ? campaigns.map((campaign) => normalizeCampaign(campaign))
          : null,
      ),
      channels: from('channels'),
      confirmed: from('confirmed'),
      credentialsRemovedCount: from('credentialsRemovedCount'),
      domainClaimed: from('domainClaimed'),
      email: from('email'),
      enterpriseLicenses: from('enterpriseLicenses'),
      enterprises: from('enterprises'),
      id: from('id'),
      idBoards: from('idBoards'),
      idEnterprise: from('idEnterprise'),
      idEnterprisesAdmin: from('idEnterprisesAdmin'),
      idOrganizations: from('idOrganizations'),
      idPremOrgsAdmin: fallback(from('idPremOrgsAdmin'), []),
      isAaMastered: from('isAaMastered'),
      initials: from('initials'),
      logins: has('logins', (logins) =>
        logins.map((login) => normalizeLogin(login)),
      ),
      loginTypes: from('loginTypes'),
      marketingOptIn: has('marketingOptIn', (marketingOptIn) => {
        if (!('date' in marketingOptIn)) {
          return {};
        }

        const { date, optedIn } = marketingOptIn;

        return {
          date: new Date(date),
          optedIn,
        };
      }),
      memberType: from('memberType'),
      messagesDismissed: has('messagesDismissed', (messagesDismissed) =>
        messagesDismissed
          ? messagesDismissed.map((message) =>
              normalizeMessagesDismissed(message),
            )
          : null,
      ),
      name: from('fullName'),
      nonPublic: from('nonPublic'),
      oneTimeMessagesDismissed: from('oneTimeMessagesDismissed'),
      paidAccount: from('paidAccount'),
      prefs: from('prefs'),
      products: from('products'),
      savedSearches: has('savedSearches', (savedSearches) =>
        savedSearches.map((search) => normalizeSavedSearch(search)),
      ),
      sessions: has('sessions', (sessions) =>
        sessions.map((session) => normalizeSession(session)),
      ),
      tokens: has('tokens', (tokens) =>
        tokens.map((token) => normalizeToken(token)),
      ),
      username: from('username'),
    }),
  )(transformedResponse, existing);
};

// eslint-disable-next-line @trello/no-module-logic
export const normalizeMembership = genericNormalizer<
  MembershipResponse,
  MembershipModel
>(({ from }) => ({
  id: from('id'),
  deactivated: from('deactivated'),
  idMember: from('idMember'),
  type: from('memberType'),
  unconfirmed: from('unconfirmed'),
}));
