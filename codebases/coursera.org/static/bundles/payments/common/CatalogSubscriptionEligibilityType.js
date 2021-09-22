import keysToConstants from 'js/lib/keysToConstants';

const exported = keysToConstants([
  /**
   * User is not eligible for catalog subscription.
   */
  'NOT_ELIGIBLE',

  /**
   * User already subscribed to B2C catalog
   */
  'SUBSCRIBED',

  /**
   * User is eligible for catalog subscription without free trial
   */
  'SUBSCRIPTION_ELIGIBLE',

  /**
   * User is eligible for free trial of catalog subscription
   */
  'TRIAL_ELIGIBLE',

  /**
   * User is eligible to upgrade to catalog subscription
   */
  'UPGRADE_ELIGIBLE',
]);

export const { NOT_ELIGIBLE, SUBSCRIBED, SUBSCRIPTION_ELIGIBLE, TRIAL_ELIGIBLE, UPGRADE_ELIGIBLE } = exported;

export default exported;
