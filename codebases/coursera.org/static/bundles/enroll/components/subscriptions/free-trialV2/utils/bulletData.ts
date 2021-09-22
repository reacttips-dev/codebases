import _t from 'i18n!nls/enroll';

const getTranslations = (isProfessionalCertificate?: boolean) => {
  const UNLIMITED_BULLET = {
    header: !isProfessionalCertificate
      ? _t('Unlimited access to all courses in the Specialization')
      : _t('Unlimited access to all courses in the Certificate'),
    subheader: _t('Watch lectures, try assignments, participate in discussion forums, and more.'),
  };

  const CANCEL_ANYTIME_BULLET = {
    header: _t('Cancel anytime.'),
    subheader: _t("No penalties - simply cancel before the trial ends if it's not right for you."),
  };

  const MONTHLY_PRICE_BULLET = {
    header: _t('{monthlyPrice} per month to continue learning after trial ends.'),
    subheader: _t('Go as fast as you can - the faster you go, the more you save.'),
  };

  const CERTIFICATE_BULLET = {
    header: _t('Certificate when you complete.'),
    subheader: _t('Share on your resume, LinkedIn, and CV.'),
  };

  const FREE_TRIAL_LOGGED_IN_BULLETS = [
    UNLIMITED_BULLET,
    CANCEL_ANYTIME_BULLET,
    MONTHLY_PRICE_BULLET,
    CERTIFICATE_BULLET,
  ];

  const FREE_TRIAL_LOGGED_OUT_BULLETS = [UNLIMITED_BULLET, CANCEL_ANYTIME_BULLET, CERTIFICATE_BULLET];

  const CHECKOUT_VARIATIONS_TEST_SUBSCRIPTION_BULLETS = [
    {
      header: _t('Learn on web, iOS, and Android'),
    },
    {
      header: _t('Track progress and plan your time with easy-to-use tools'),
    },
    {
      header: _t('Earn a Certificate to add to your LinkedIn profile'),
    },
    {
      header: _t('Keep learning for {monthlyPrice} per month after your trial ends'),
    },
    {
      header: _t('Cancel online anytime'),
    },
  ];

  const CHECKOUT_VARIATIONS_TEST_PREMIUM_GRADED_BULLETS = [
    {
      header: _t('Just {monthlyPrice} to get full access'),
    },
    {
      header: _t('Learn on web, iOS, and Android'),
    },
    {
      header: _t('Track progress and plan your time with easy-to-use tools'),
    },
    {
      header: _t('Earn a Course Certificate to add to your LinkedIn profile'),
    },
  ];

  const CHECKOUT_VARIATIONS_TEST_NON_PREMIUM_GRADED_BULLETS = CHECKOUT_VARIATIONS_TEST_PREMIUM_GRADED_BULLETS;

  const CHECKOUT_VARIATIONS_TEST_NO_CERTIFICATE_BULLETS = [
    {
      header: _t('Track progress and plan your time with in-course tools'),
    },
  ];

  const CATALOG_SUBSCRIPTION_BULLETS = [
    {
      header: _t('Full access to 2000+ courses'),
    },
    {
      header: _t('Learn on web, iOS, and Android'),
    },
    {
      header: _t('Personalized recommendations'),
    },
    {
      header: _t('Progress tracking & planning'),
    },
    {
      header: _t('Shareable Course Certificates'),
    },
    {
      header: _t('One flat monthly fee of {monthlyPrice}'),
    },
    {
      header: _t('Cancel online anytime'),
    },
  ];

  const CATALOG_SUBSCRIPTION_FREE_TRIAL_BULLETS = [
    {
      header: _t('Full access to 2000+ courses'),
    },
    {
      header: _t('Learn on web, iOS, and Android'),
    },
    {
      header: _t('Personalized recommendations'),
    },
    {
      header: _t('Progress tracking & planning'),
    },
    {
      header: _t('Shareable Course Certificates'),
    },
    {
      header: _t('Just {monthlyPrice} after trial ends'),
    },
    {
      header: _t('Cancel online anytime'),
    },
  ];

  return {
    FREE_TRIAL_LOGGED_IN_BULLETS,
    FREE_TRIAL_LOGGED_OUT_BULLETS,
    CHECKOUT_VARIATIONS_TEST_SUBSCRIPTION_BULLETS,
    CATALOG_SUBSCRIPTION_BULLETS,
    CATALOG_SUBSCRIPTION_FREE_TRIAL_BULLETS,
    CHECKOUT_VARIATIONS_TEST_PREMIUM_GRADED_BULLETS,
    CHECKOUT_VARIATIONS_TEST_NON_PREMIUM_GRADED_BULLETS,
    CHECKOUT_VARIATIONS_TEST_NO_CERTIFICATE_BULLETS,
  };
};

export default getTranslations;
