import { navigate } from 'app/scripts/controller/navigate';
import { useDismissFreeTeamOnboardingMutation } from './DismissFreeTeamOnboardingMutation.generated';
import {
  useFreeTeamOnboardingEligibilityQuery,
  FreeTeamOnboardingEligibilityQuery,
} from './FreeTeamOnboardingEligibilityQuery.generated';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { isMemberAdmin } from '@trello/organizations';
import { idToDate } from '@trello/dates';
import moment from 'moment';

// eslint-disable-next-line @trello/no-module-logic
const startDate = moment('2020-10-01');
type Member = NonNullable<FreeTeamOnboardingEligibilityQuery['member']>;
type Organization = Member['organizations'][number];

export const useFreeTeamOnboarding = (orgId: string = '') => {
  const isFlagEnabled = useFeatureFlag(
    'teamplates.web.free-team-onboarding',
    false,
  );

  const { loading, data } = useFreeTeamOnboardingEligibilityQuery({
    variables: { orgNameOrId: orgId },
    skip: !orgId || !isFlagEnabled,
  });

  const [
    dismissFreeTeamOnboarding,
    { loading: isDismissing },
  ] = useDismissFreeTeamOnboardingMutation();

  const organization = data?.organization;
  const orgName = data?.organization?.name || '';
  const member = data?.member;
  const messagesDismissed = member?.oneTimeMessagesDismissed || [];
  const isOrgAdmin =
    !!member && !!organization && isMemberAdmin(member, organization);

  const isFirstFreeOrganization = () => {
    const firstOrg = member?.organizations
      .filter((org: Organization) => !org.products?.length)
      .sort((a: Organization, b: Organization) => (a.id < b.id ? -1 : 1))[0];

    return firstOrg?.id === organization?.id;
  };
  const dismissAndRedirect = async () => {
    await dismissFreeTeamOnboarding({
      variables: {
        memberId: 'me',
        messageId: 'free-team-onboarding-home',
      },
    });

    navigate(`/${orgName}/home`, {
      trigger: true,
    });
  };

  return {
    isLoading: loading,
    organization,
    isDismissing,
    dismissAndRedirect,
    isEligible:
      isFlagEnabled &&
      !messagesDismissed.includes('free-team-onboarding-home') &&
      isOrgAdmin &&
      isFirstFreeOrganization() &&
      organization
        ? moment(idToDate(organization.id)).isAfter(startDate)
        : null,
  };
};
