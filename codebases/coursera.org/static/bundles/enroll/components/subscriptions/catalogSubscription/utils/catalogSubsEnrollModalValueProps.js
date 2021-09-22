import _t from 'i18n!nls/enroll';
import epic from 'bundles/epic/client';

export default function () {
  const ALL_COURSES = {
    header: _t('2000+ courses - take as many as you like!'),
  };

  const ALL_COURSES_COURSE = {
    header: _t('Unlimited access to 2000+ courses, including this one'),
  };

  const ALL_COURSES_S12N = {
    header: _t('Unlimited access to this Specialization, plus 2000+ other courses'),
  };
  const PERSONALIZED_COURSE_RECS = {
    header: _t('Personalized course recommendations based on your goals'),
  };

  const EARN_CERT_LINKEDIN = {
    header: _t('Earn official certificates to add to your LinkedIn profile'),
  };

  const EARN_CERT_LINKEDIN_PAYWALL = {
    header: _t('Earn official certificates to add to your LinkedIn profile after trial ends'),
  };

  const MONTHLY_PRICE_FREE_TRIAL = {
    header: _t('{monthlyPrice} per month to keep learning after {numDays} {numDays, plural, =1 {day} other {days}}'),
  };

  const MONTHLY_PRICE = {
    header: _t('{monthlyPrice} per month to take as many courses as you like'),
  };

  const CANCEL = {
    header: _t('Cancel online anytime'),
  };

  const UPGRADE_ACCESS = {
    header: _t("You'll have full access to all courses and Specializations in our catalog."),
  };

  const UPGRADE_EARN_CERT = {
    header: _t("You'll be able to earn Certificates in as many courses as you like."),
  };

  const UPGRADE_EXISTING_ENROLL = {
    header: _t('Your existing enrollments and progress will be saved.'),
  };

  const UPGRADE_MONTHLY_PRICE = {
    header: _t(
      "You'll be charged {monthlyPrice} per month until you cancel, regardless of how many courses you take. Your first payment will occur on your next regular billing date, and your existing subscriptions will be canceled automatically."
    ),
  };

  const UPGRADE_CANCEL = {
    header: _t('You can cancel your subscription online anytime.'),
  };

  const certificateBulletPointFreeTrial = epic.get('Growth', 'blockTrialOnlyCertificatesEnabledAt')
    ? EARN_CERT_LINKEDIN_PAYWALL
    : EARN_CERT_LINKEDIN;

  const BASE_VALUE_PROPS = [EARN_CERT_LINKEDIN, PERSONALIZED_COURSE_RECS, MONTHLY_PRICE, CANCEL];

  const BASE_VALUE_PROPS_FREE_TRIAL = [
    certificateBulletPointFreeTrial,
    PERSONALIZED_COURSE_RECS,
    MONTHLY_PRICE_FREE_TRIAL,
    CANCEL,
  ];

  return {
    freeTrialNoProduct: () => [ALL_COURSES, ...BASE_VALUE_PROPS_FREE_TRIAL],
    freeTrialCourse: () => [ALL_COURSES_COURSE, ...BASE_VALUE_PROPS_FREE_TRIAL],
    freeTrialS12n: () => [ALL_COURSES_S12N, ...BASE_VALUE_PROPS_FREE_TRIAL],
    noFreeTrialNoProduct: () => [ALL_COURSES, ...BASE_VALUE_PROPS],
    noFreeTrialCourse: () => [ALL_COURSES_COURSE, ...BASE_VALUE_PROPS],
    noFreeTrialS12n: () => [ALL_COURSES_S12N, ...BASE_VALUE_PROPS],
    upgrade: () => [UPGRADE_ACCESS, UPGRADE_EARN_CERT, UPGRADE_EXISTING_ENROLL, UPGRADE_MONTHLY_PRICE, UPGRADE_CANCEL],
  };
}
