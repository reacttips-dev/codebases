import { idToDate } from '@trello/dates';
import { featureFlagClient } from '@trello/feature-flag-client';

import { Auth } from 'app/scripts/db/auth';
import { Organization } from 'app/scripts/models/organization';
import { Member } from 'app/scripts/models/member';

const isFirstFreeOrganization = (organization: Organization) => {
  const firstOrg = Auth.me()
    .organizationList.filter((org) => !org.isPremium())
    .sort((a: Organization, b: Organization) =>
      a.get('id') < b.get('id') ? -1 : 1,
    )[0];

  return firstOrg && firstOrg.get('name') === organization.get('name');
};

export const shouldShowFreeTeamGettingStarted = (
  organization: Organization,
  member: Member,
) => {
  if (!featureFlagClient.get('teamplates.web.free-team-onboarding', false)) {
    return false;
  }

  // note: the number 9 here indicates October due to JS dates indexing at 0
  const startDate = new Date(2020, 9, 1);

  return (
    organization &&
    !Auth.me().isDismissed('free-team-onboarding-home') &&
    organization.ownedByMember(member) &&
    isFirstFreeOrganization(organization) &&
    idToDate(organization.get('id')) > startDate
  );
};

export const Helpers = {
  shouldShowFreeTeamGettingStarted,
};
