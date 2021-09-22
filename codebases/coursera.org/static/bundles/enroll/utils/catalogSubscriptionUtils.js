import _ from 'underscore';
import epic from 'bundles/epic/client';
import {
  TRIAL_ELIGIBLE,
  SUBSCRIPTION_ELIGIBLE,
  UPGRADE_ELIGIBLE,
} from 'bundles/payments/common/CatalogSubscriptionEligibilityType';
import { hidden } from 'bundles/enroll/components/subscriptions/catalogSubscription/utils/experiment21Variants';
import createCatalogSubscriptionCart from 'bundles/payments/promises/createCatalogSubscriptionCart';
import { GOOGLE_CERT_S12N_SLUG } from 'bundles/enroll/constants/constants';

const TABLET_WIDTH = 768;
const BANNER_HEIGHT = 70;

function getCatalogSubscriptionPromise({ productSkuId, options }) {
  return createCatalogSubscriptionCart(productSkuId, options).then((cart) => ({ cart }));
}

function isSubscribed(enrollmentAvailableChoices, catalogSubscriptionsEnrollmentState) {
  return (
    (enrollmentAvailableChoices && enrollmentAvailableChoices.isSpecializationSubscribed) ||
    (catalogSubscriptionsEnrollmentState && catalogSubscriptionsEnrollmentState.isSubscribed)
  );
}

// Only hide banner if we can enroll through upgrade and there is a specific course context (course home, CDP)
// But don't hide if we are upgrading on a general page like dashboard
// (Thus, we only check this on enrollmentAvailableChoices and not also on catalogSubscriptionEnrollmentState)
function isEnrolledThroughPurchase(enrollmentAvailableChoices) {
  return (
    enrollmentAvailableChoices &&
    enrollmentAvailableChoices.canEnrollThroughCatalogSubscriptionUpgrade &&
    !enrollmentAvailableChoices.canPurchaseSingleCourse
  );
}

function isInHiddenCatalogSubs(catalogSubscriptionsEnrollmentState) {
  return (
    catalogSubscriptionsEnrollmentState &&
    catalogSubscriptionsEnrollmentState.canSubscribeToCatalog &&
    epic.get('CatalogSubscriptions', 'catalogSubscriptionsV2_2') === hidden
  );
}

function shouldHidePersistentBanner({
  isMonthlyCatalogSubscriptionEnabled,
  enrollmentAvailableChoices,
  catalogSubscriptionsEnrollmentState,
  programMemberships,
  plpNotOnboarded,
  hideForNonS12nCourses,
  s12nSlug,
}) {
  // Always hide the banner if mobile width - will clash with fixed enroll banner on top
  if (typeof window !== 'undefined' && window.innerWidth < TABLET_WIDTH) {
    return true;
  } else if (epic.get('GoogleCertScholarship', 'enableGoogleCertScholarship') && s12nSlug === GOOGLE_CERT_S12N_SLUG) {
    // Otherwise, always show the banner for Google IT cert SDP
    return false;
  } else if ((programMemberships && !_(programMemberships).isEmpty()) || hideForNonS12nCourses) {
    return true;
    // if Wall-e eligible, hide the banner if already subscribed or enrolled through a purchase
  } else if (isMonthlyCatalogSubscriptionEnabled) {
    return (
      isSubscribed(enrollmentAvailableChoices, catalogSubscriptionsEnrollmentState) ||
      isEnrolledThroughPurchase(enrollmentAvailableChoices) ||
      isInHiddenCatalogSubs(catalogSubscriptionsEnrollmentState)
    );
    // if not PLP and Wall-e eligible, hide the banner
  } else {
    return true;
  }
}

const exported = {
  choiceTypeToHandleSubmitPromise: {
    [TRIAL_ELIGIBLE]: getCatalogSubscriptionPromise,
    [SUBSCRIPTION_ELIGIBLE]: getCatalogSubscriptionPromise,
    [UPGRADE_ELIGIBLE]: getCatalogSubscriptionPromise,
  },

  shouldHidePersistentBanner,
  BANNER_HEIGHT,
};

export default exported;
export { shouldHidePersistentBanner, BANNER_HEIGHT };

export const { choiceTypeToHandleSubmitPromise } = exported;
