import _t from 'i18n!nls/teams-landing';
import epic from 'bundles/epic/client';

import config from 'js/app/config';

import type { ProductFunctionality, ValueProposition } from '../types/sharedTypes';

const RESOURCE_ASSETS_URL = config.url.resource_assets;

export const WES_PROMOTION_KEY = 'wesPromotionId';
export const WES_PROMOTION_PROMO_ID_KEY = 'wesPromotionPromoId';
export const WES_PROMOTION_PROMO_CODE = 'wesPromotionPromoCode';

export const MASTERCARD_ID = 'nYTCtPatEeqrqBIivh7_bQ';
export const VISA_ID = 's02LAPatEeqrqBIivh7_bQ';
export const CAPITAL_ONE_ID = '99lWBt3KEeuNpw7MyAzmlQ';
export const getProductFunctionalities: () => ProductFunctionality[] = () => {
  const enableWESAnalytics = epic.get('Enterprise', 'enableWESAnalytics');

  return [
    {
      title: _t('Track learner engagement and progress'),
      subtitle: _t(
        'Create learning programs with curated content for select groups of learners. Keep updated with learner usage across programs by monitoring invitations, enrollments, and learning hours.'
      ),
      image: RESOURCE_ASSETS_URL + 'teams_landing/product_functionalities/screenshot-01.png',
    },

    ...(enableWESAnalytics
      ? [
          {
            title: _t('Quantify employee progress across technical and human skills'),
            subtitle: _t(
              'Track and measure skill development by domain and level of mastery with Skill Development Dashboards. Gain sharp insights into your program’s performance by tracking 100+ critical skill areas—including business, data, and technology—across four proficiency levels.'
            ),
            image: RESOURCE_ASSETS_URL + 'teams_landing/product_functionalities/wes-analytics.png',
          },
        ]
      : []),

    {
      title: _t('Receive personalized content recommendations'),
      subtitle: _t(
        'Select your team’s business function and choose from popular skills to receive personalized content recommendations. Create custom learning paths mapped to your team’s skill-development needs.'
      ),
      image: RESOURCE_ASSETS_URL + 'teams_landing/product_functionalities/screenshot-02.png',
    },

    {
      title: _t('Send custom messages to learners'),
      subtitle: _t(
        'Assess the health of your learning programs by identifying active and inactive learners. Send custom messages to encourage your learners with minimum effort on your part.'
      ),
      image: RESOURCE_ASSETS_URL + 'teams_landing/product_functionalities/screenshot-03.png',
    },
  ];
};

export const getValuePropositions: () => ValueProposition[] = () => [
  {
    title: _t('Flexible learning'),
    subtitle: _t('Set your own deadlines and learn anywhere on web or mobile devices'),
    image: RESOURCE_ASSETS_URL + 'teams_landing/value_proposition/group_8.svg',
  },
  {
    title: _t('Quality content'),
    subtitle: _t('Advance personally and professionally with access to quality content'),
    image: RESOURCE_ASSETS_URL + 'teams_landing/value_proposition/group_9.svg',
  },
  {
    title: _t('Learn at all levels'),
    subtitle: _t('Access a variety of content ranging from beginner to advanced levels'),
    image: RESOURCE_ASSETS_URL + 'teams_landing/value_proposition/group_10.svg',
  },
  {
    title: _t('Unlimited certificates'),
    subtitle: _t('Acquire industry-recognized certifications after each course completion '),
    image: RESOURCE_ASSETS_URL + 'teams_landing/value_proposition/group_11.svg',
  },
];

type HttpParams = Record<string, string | number>;

/* eslint-disable camelcase */
const addUtmParams = (params: HttpParams, utm_content: string): HttpParams => {
  return {
    ...params,
    utm_campaign: 'b2b-website',
    utm_content,
    utm_source: 'enterprise',
    utm_medium: 'coursera',
  };
};
/* eslint-enable */

const getUrl = (path: string, params: HttpParams, utmContent: string) => {
  const paramsWithUtm = addUtmParams(params, utmContent);
  const parts = Object.keys(paramsWithUtm).map(
    (k) => encodeURIComponent(k) + '=' + encodeURIComponent(paramsWithUtm[k])
  );
  return `${path}?${parts.join('&')}`;
};

type TeamsLandingLinkOptions = {
  promoCode?: string;
  isFreeTrial?: boolean;
};

const getTeamsLandingLink = (options: TeamsLandingLinkOptions & { utmContent: string }): string => {
  const params: HttpParams = { billingType: 1 };
  const isEpicFreeTrial = epic.get('Enterprise', 'enableFreeTrial');

  if (options.promoCode) {
    params.promoCode = options.promoCode;
  }

  if (options.isFreeTrial) {
    params.freetrial = '1';
  }

  // Our FT links all have -ft appended to the utm content
  let utmContent = options.utmContent;
  if (isEpicFreeTrial) {
    utmContent = `${utmContent}-ft`;
  }

  return getUrl('/purchase/plan', params, utmContent);
};

// Teams Hero
export const getTeamsLandingLinkHero = (options?: TeamsLandingLinkOptions) => {
  return getTeamsLandingLink({ ...options, utmContent: 'teams-buy-now-hero' });
};

export const getTeamsLandingOrBuyNowLinkHero = (options?: TeamsLandingLinkOptions) => {
  return getTeamsLandingLink({ ...options, utmContent: 'teams-or-buy-now-hero' });
};

// Teams "Footer"
export const getTeamsLandingLinkFooter = (options?: TeamsLandingLinkOptions) => {
  return getTeamsLandingLink({ ...options, utmContent: 'teams-buy-now-bottom' });
};

export const getTeamsLandingOrBuyLinkFooter = (options?: TeamsLandingLinkOptions) => {
  return getTeamsLandingLink({ ...options, utmContent: 'teams-or-buy-now-bottom' });
};

// Teams Search CTA
export const getTeamsLandingSearchLink = (options?: TeamsLandingLinkOptions) => {
  return getTeamsLandingLink({ ...options, utmContent: 'teams-buy-now-search' });
};

// Sticky Top Nav
export const getTeamsLandingStickyNavLink = (options?: TeamsLandingLinkOptions) => {
  return getTeamsLandingLink({ ...options, utmContent: 'teams-buy-now-sticky-nav' });
};

// Static Top Nav
export const getBuyNowLink = (options?: TeamsLandingLinkOptions) => {
  return getTeamsLandingLink({ ...options, utmContent: 'teams-buy-now-top-nav' });
};

/* eslint-disable no-restricted-syntax */
// Disabling this rule because these urls only exist on the marketing pages.
export const TEAMS_FAQ_BILLING_CONTACT_LINK = 'https://www.coursera.org/business/learn-more/';
export const TEAMS_FAQ_BILLING_LINK = getUrl(
  'https://www.coursera.org/purchase/plan',
  { billingType: 1 },
  'teams-faq-pay-buy-now'
);

export const RESOURCE_CENTER_LINK = getUrl('https://www.coursera.org/business/ebook/', {}, 'teams-faq');

export const AVAILABLE_COURSES_LINK = getUrl('https://www.coursera.org/browse', {}, 'teams-faq');
export const UNAVAILABLE_COURSES_LINK = getUrl(
  'https://business.coursera.help/hc/articles/115012670388-Unavailable-courses-and-Specializations',
  {},
  'teams-faq'
);

export const REFUND_POLICY_LINK = getUrl(
  'https://business.coursera.help/hc/categories/360001860393-Team-Plan',
  {},
  'teams-faq-helpcenter'
);
export const MARKETING_TOOLKIT_LINK = getUrl(
  'https://business.coursera.help/hc/articles/360027255114-Learner-Marketing-and-Communications-Tool-Kit',
  {},
  'teams-faq-marketingtoolkit'
);

export const ENTERPRISE_LINK = getUrl('https://www.coursera.org/business/', {}, 'teams-buy-now-top-nav-for-enterpirse');
export const COMPARE_PLANS_LINK = getUrl(
  'https://www.coursera.org/business/compare-plans/',
  {},
  'teams-buy-now-top-nav-compare-plans'
);
export const PRODUCT_LINK = getUrl('https://www.coursera.org/business/products/', {}, 'teams-buy-now-top-nav-product');
/* eslint-enable no-restricted-syntax */
export const TEAM_LANDING_HERO_HEIGHT = 500;
export const TEAMS_LOGO_URL = RESOURCE_ASSETS_URL + 'teams_landing/nav/C4T_logo_new.svg';
