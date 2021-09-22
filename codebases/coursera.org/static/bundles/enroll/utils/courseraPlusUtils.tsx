import React from 'react';

import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { currencyCodeMap } from 'bundles/payments/lib/currencies';
import { Big } from 'big.js';

import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type SubscriptionTrialsV1 from 'bundles/naptimejs/resources/subscriptionTrials.v1';
import epic from 'bundles/epic/client';
import _t from 'i18n!nls/enroll';
import type { CourseraPlusProductVariant } from 'bundles/payments-common/common/CourseraPlusProductVariant';
import CourseraPlusProductVariants, {
  isMonthly,
  isYearly,
} from 'bundles/payments-common/common/CourseraPlusProductVariant';

import config from 'js/app/config';

export const getCourseraPlusDisplayName = (): string => _t('Coursera Plus');
export const getCourseraPlusDisplayNameWithBillingCycle = (productSku: string): string => {
  if (isMonthly(productSku)) {
    return _t('Coursera Plus Monthly');
  }
  if (isYearly(productSku)) {
    return _t('Coursera Plus Annual');
  }
  // just in case there's something new
  return getCourseraPlusDisplayName();
};

export const getOrderedEnrollmentChoiceTypes = (
  choiceTypes: Array<keyof typeof EnrollmentChoiceTypes>,
  isMobile: boolean
): Array<keyof typeof EnrollmentChoiceTypes> => {
  const withoutSubscribeToCourseraPlus = choiceTypes.filter(
    (choiceType) => choiceType !== EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS
  );

  if (isMobile) {
    return [...withoutSubscribeToCourseraPlus, EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS];
  } else {
    return [
      withoutSubscribeToCourseraPlus[0],
      EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS,
      ...withoutSubscribeToCourseraPlus.slice(1),
    ];
  }
};

const fractionValueRoundedUp = (numerator: number, denominator: number, decimals: number): number => {
  // the reason we use the Big library // http://mikemcl.github.io/big.js/
  // for the computation is because native js has issues with floating point
  // math, e.g. 0.1 * 0.2 => 0.020000000000000004
  const BIG_ROUND_UP = 3;
  return new Big(numerator).div(denominator).round(decimals, BIG_ROUND_UP).toNumber();
};

const priceTwelfth = (currencyCode: string, annualAmount: number): number => {
  const decimals: number | undefined = currencyCodeMap[currencyCode]?.decimalPlaces;
  return fractionValueRoundedUp(annualAmount, 12, decimals ?? 2);
};

export const discountedPrice = (amount: number, percents: number, decimals?: number): number =>
  fractionValueRoundedUp(amount * (100 - percents), 100, decimals ?? 0);

export const discountedPriceForCurrency = (price: number, percents: number, currencyCode: string) => {
  const decimals: number | undefined = currencyCodeMap[currencyCode]?.decimalPlaces;
  return discountedPrice(price, percents, decimals);
};

export const getCourseraPlusMonthlyFromAnnualPrice = (
  currencyCode: string,
  annualAmount: number
): React.ReactElement<typeof ReactPriceDisplay> => {
  const monthlyPrice = priceTwelfth(currencyCode, annualAmount);
  return <ReactPriceDisplay currency={currencyCode} value={monthlyPrice} hideCurrencyCode={true} />;
};

export const getSuccessPercentage = () => _t('87%');

export const numberOfProductsNoPlusSign = '3,000';
export const numberOfProducts = `${numberOfProductsNoPlusSign}+`;

export const getCopy = (): {
  numberOfProducts: string;
  headlineExpanded: string;
  upgradeCourseraPlus: string;
  headline: string;
  headlineV4: string;
  moneyBack: string;
  freeTrial: string;
  mainValueProps: Array<string>;
} => ({
  numberOfProducts, // REQUIRED for `headlineExpanded` and `headline`
  headlineExpanded: _t(
    'Get unlimited access to {numberOfProducts} courses, Guided Projects, Specializations, and Professional Certificates with Coursera Plus'
  ),
  upgradeCourseraPlus: _t(
    'Upgrade for unlimited access to #{numberOfProducts} courses, Guided Projects, Specializations, and Professional Certificates',
    { numberOfProducts }
  ),
  headline: _t(
    'Unlimited access to {numberOfProducts} courses, Guided Projects, Specializations, and Professional Certificates'
  ),
  headlineV4: _t(`Unlimited access to {numberOfProducts} world-class courses, 
    hands-on projects, and job-ready certificate programs, for one
    all-inclusive subscription price.`),
  moneyBack: _t('14-day money-back guarantee'),
  freeTrial: _t('7-day free trial'),
  mainValueProps: [
    _t('Explore trending topics and skills in data science, computer science, business, health, and more'),
    _t('Learn without limits — move between and switch courses at any time'),
    _t('Earn shareable certificates for every course you complete at no extra cost'),
  ],
});

export const getCtaAnnualNoteCopy = (
  productItemId: CourseraPlusProductVariant,
  subscriptionTrials?: Array<SubscriptionTrialsV1>
): string | undefined => {
  const { moneyBack, freeTrial } = getCopy();
  if (productItemId === CourseraPlusProductVariants.ANNUAL_SEVEN_DAY_FREE_TRIAL) {
    return subscriptionTrials && subscriptionTrials.length > 0 ? undefined : freeTrial;
  } else {
    return moneyBack;
  }
};

export type EnrollButtonCopy = {
  title: string;
  verboseTitleWithPlaceholder: (product: string) => string;
  subtitle: string;
};

export const getEnrollButtonCopy = (): Record<string, EnrollButtonCopy> => {
  return {
    freeTrial: {
      title: _t('Start free trial'),
      verboseTitleWithPlaceholder: (product) => _t('Start #{product} free trial', { product }), // primarily for accessibility
      subtitle: _t('Cancel anytime'),
    },
    freeTrialWithDays: {
      title: _t('Start 7-day free trial'),
      verboseTitleWithPlaceholder: (product) => _t('Start 7-day free trial of #{product}', { product }), // primarily for accessibility
      subtitle: _t('No commitment. Cancel anytime.'),
    },
    subscription: {
      title: _t('Subscribe'),
      verboseTitleWithPlaceholder: (product) => _t('Subscribe to #{product}', { product }), // primarily for accessibility
      subtitle: _t('Cancel anytime'),
    },
    subscriptionNoCommitment: {
      title: _t('Subscribe'),
      verboseTitleWithPlaceholder: (product) => _t('Subscribe to #{product}', { product }), // primarily for accessibility
      subtitle: _t('No commitment. Cancel anytime.'),
    },
  };
};

const awsFolder = `${config.url.resource_assets}coursera_plus/`;

export const logo = {
  PLUS_PILL_BLUE: `${awsFolder}coursera-plus-badge-blue.png`,
  PLUS_PILL_WHITE: `${awsFolder}courseraplus-badge-white-rgb-cropped.png`,
  PLUS_FULL_BLUE: `${awsFolder}landing_page/coursera-plus-blue.png`,
  PLUS_FULL_WHITE: `${awsFolder}courseraplus-reversed-rgb-cropped.png`,
  PLUS_FULL_PURPLE: `${awsFolder}courseraplus-transparent-with-purple-pill.png`,
};

export const constants = {
  CATALOG_CONTENT_LINK: 'https://learner.coursera.help/hc/articles/360036151932',
  REFUND_POLICY_LINK: 'https://learner.coursera.help/hc/articles/208280266-Refund-policies',
  LEARN_MORE_LINK: 'https://learner.coursera.help/hc/articles/360036151872',
  LIST_OF_INCLUDED_CONTENT: 'https://learner.coursera.help/hc/articles/360036151932',
  MY_PURCHASES_LINK: '/my-purchases/transactions',
  HOW_TO_ADD_RESUME_LINK: 'https://blog.coursera.org/how-to-add-coursera-credentials-to-resume/',
  // There are four different Coursera Plus subscription permutations that the user can enroll / own - see CourseraPlusProductVariants.ts
  COURSERA_PLUS_SUBSCRIPTION_UNDERLYING_PRODUCT_ITEM_ID: 'Nf1hONLKQjyXSmwOh0KGyQ',
  LANDING_PAGE_LEARN_MORE_SECTION: 'learnMore',
};

export const getLandingPageLink = (): string => {
  const monthlyEpicValue = epic.get('growthFalcons', 'highlightCPMonthly');
  if (monthlyEpicValue === 'monthlyOnly') {
    return '/courseraplus/subscribe/v5';
  }
  if (monthlyEpicValue === 'monthlyAndAnnual') {
    return '/courseraplus/subscribe/v6';
  }
  return '/courseraplus';
};
