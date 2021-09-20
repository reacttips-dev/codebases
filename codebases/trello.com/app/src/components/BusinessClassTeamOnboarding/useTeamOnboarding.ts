import { useTeamOnboardingEligibilityQuery } from './TeamOnboardingEligibilityQuery.generated';
import { useDismissTeamOnboardingMutation } from './DismissTeamOnboardingMutation.generated';
import moment from 'moment';
import Cookies from 'js-cookie';
import { isMemberAdmin, getFreeTrialProperties } from '@trello/organizations';
import { navigate } from 'app/scripts/controller/navigate';

// eslint-disable-next-line @trello/no-module-logic
const startDate = moment('2020-07-05');

// TODO add router condition to only return true if users
// last url was /getting-started
export const useTeamOnboarding = (orgId: string = '') => {
  const { loading, data } = useTeamOnboardingEligibilityQuery({
    variables: { orgNameOrId: orgId },
    skip: !orgId,
  });
  const [
    dismissTeamOnboarding,
    { loading: isDismissing },
  ] = useDismissTeamOnboardingMutation();

  const organization = data?.organization;
  const orgName = data?.organization?.name || '';
  const member = data?.member;
  const products = organization?.products || [];
  const credits = organization?.credits || [];
  const messagesDismissed = member?.oneTimeMessagesDismissed || [];
  const dateFirstSubscription =
    organization?.paidAccount?.dateFirstSubscription;
  const isEnterprise = member?.idEnterprise;
  const isOrgAdmin =
    !!member && !!organization && isMemberAdmin(member, organization);
  const trialProperties = getFreeTrialProperties(
    credits,
    products,
    organization?.paidAccount?.trialExpiration || '',
  );
  // there is a bug where dateFirstSubscription is null right after initiating the
  // paidAccount. Since thats the only time it happens, there is nothing concerning
  // about defaulting to true here, since that inherently means its a new account.
  const isNewSubscription = dateFirstSubscription
    ? moment(dateFirstSubscription).isAfter(startDate)
    : true;

  const dismissAndRedirect = async () => {
    await dismissTeamOnboarding({
      variables: {
        memberId: 'me',
        messageId: `bc-onboarding-home:${orgId}`,
      },
    });

    navigate(`/${orgName}/home`, {
      trigger: true,
    });
  };

  return {
    isLoading: loading,
    isFreeTrialActive: trialProperties?.isActive,
    organization,
    isDismissing,
    dismissAndRedirect,
    isEligible:
      !loading &&
      !messagesDismissed.includes(`bc-onboarding-home:${orgId}`) &&
      !isEnterprise &&
      (products.includes(110) || products.includes(111)) &&
      isOrgAdmin &&
      (isNewSubscription || !!Cookies.get('simulateNewOrg')),
  };
};
