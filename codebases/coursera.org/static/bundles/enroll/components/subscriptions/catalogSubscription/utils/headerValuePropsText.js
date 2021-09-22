import getTranslations from 'bundles/enroll/components/subscriptions/catalogSubscription/utils/catalogSubsEnrollModalValueProps';
import _t from 'i18n!nls/enroll';
import logger from 'js/app/loggerSingleton';

function getHeaderAndValueProps(catalogSubscriptionsEnrollmentState, courseId, s12nId, prioritizeCourse) {
  const FREE_TRIAL_HEADER = _t('Unlimited access: Free for {numDays} {numDays, plural, =1 {day} other {days}}');
  const NO_FREE_TRIAL_HEADER = _t('Unlimited access');
  const UNLIMITED_LEARNING = _t('Unlimited learning');

  const {
    freeTrialNoProduct,
    freeTrialCourse,
    freeTrialS12n,
    noFreeTrialNoProduct,
    noFreeTrialCourse,
    noFreeTrialS12n,
    upgrade,
  } = getTranslations();

  let header;
  let subheader;
  let valueProps;

  if (!catalogSubscriptionsEnrollmentState) {
    logger.warn('Catalog enrollment state required');
  } else if (catalogSubscriptionsEnrollmentState.canEnrollThroughFreeTrial) {
    header = FREE_TRIAL_HEADER;

    if (s12nId && !prioritizeCourse) {
      valueProps = freeTrialS12n();
    } else if (courseId) {
      valueProps = freeTrialCourse();
    } else {
      valueProps = freeTrialNoProduct();
    }
  } else if (catalogSubscriptionsEnrollmentState.canEnrollThroughCatalogSubscription) {
    header = NO_FREE_TRIAL_HEADER;

    if (s12nId && !prioritizeCourse) {
      valueProps = noFreeTrialS12n();
    } else if (courseId) {
      valueProps = noFreeTrialCourse();
    } else {
      valueProps = noFreeTrialNoProduct();
    }
  } else if (catalogSubscriptionsEnrollmentState.canEnrollThroughCatalogSubscriptionUpgrade) {
    header = UNLIMITED_LEARNING;
    subheader = _t("Update your subscription to our new plan. Here's what that means:");
    valueProps = upgrade();
  } else {
    logger.warn('User not eligible to enroll in catalog subs');
  }

  return {
    header,
    subheader,
    valueProps,
  };
}

const exported = {
  getHeaderAndValueProps,
};

export default exported;
export { getHeaderAndValueProps };
