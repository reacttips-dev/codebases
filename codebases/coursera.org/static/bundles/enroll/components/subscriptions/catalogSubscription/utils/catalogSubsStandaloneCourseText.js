import _ from 'underscore';
import {
  SUBSCRIBE_TO_CATALOG,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
} from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import { CATALOG_SUBSCRIPTION, VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';
import _t from 'i18n!nls/enroll';

function getHeaderAndValueProps(productType, enrollmentChoiceType, canEnrollThroughCatalogSubscriptionFreeTrial) {
  let header;
  let subheader;
  let valueProps;
  let ribbonText;

  const CATALOG_SUBSCRIPTION_VALUE_PROPS_1 = [
    _t('Enroll in this course without risk'),
    _t('Earn an official certificate'),
  ];

  const CATALOG_SUBSCRIPTION_VALUE_PROPS_2 = [
    _t('Explore any course in the catalog and enroll in your favorites'),
    _t('Cancel anytime'),
  ];

  const VERIFIED_CERTIFICATE_VALUE_PROPS = [_t('Enroll in this course'), _t('Earn an official certificate')];

  const CATALOG_SUBS_FREE_TRIAL = _t('Full access {numDays}-day free trial');
  // TODO: placeholder text
  const CATALOG_SUBS_UPGRADE = _t('Upgrade your current subscription');

  if (productType === VERIFIED_CERTIFICATE) {
    header = canEnrollThroughCatalogSubscriptionFreeTrial ? _t('Commit now') : _t('One-time payment');
    subheader = _t('Pay {price} now');
    valueProps = VERIFIED_CERTIFICATE_VALUE_PROPS;
  } else if (productType === CATALOG_SUBSCRIPTION) {
    let trialPeriodValueProp;
    ribbonText = _t('RECOMMENDED');
    if (enrollmentChoiceType === SUBSCRIBE_TO_CATALOG_TRIAL) {
      header = _t('Try for free');
      subheader = _t('{numDays} {numDays, plural, =1 {day} other {days}} free, then {price}/month');
      trialPeriodValueProp = CATALOG_SUBS_FREE_TRIAL;
    } else if (enrollmentChoiceType === SUBSCRIBE_TO_CATALOG) {
      header = _t('Subscribe');
      subheader = _t('All courses for {price}/month');
      trialPeriodValueProp = null;
    } else if (enrollmentChoiceType === UPGRADE_TO_CATALOG_SUBSCRIPTION) {
      header = _t('Upgrade to enroll');
      subheader = _t('Access to all courses for {price}/month');
      trialPeriodValueProp = CATALOG_SUBS_UPGRADE;
    } else {
      return null;
    }

    valueProps = _([
      ...CATALOG_SUBSCRIPTION_VALUE_PROPS_1,
      trialPeriodValueProp,
      ...CATALOG_SUBSCRIPTION_VALUE_PROPS_2,
    ]).compact();
  } else {
    return null;
  }

  return {
    header,
    subheader,
    valueProps,
    ribbonText,
  };
}

const exported = {
  getHeaderAndValueProps,
};

export default exported;
export { getHeaderAndValueProps };
