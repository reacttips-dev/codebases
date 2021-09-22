import { color, StyleSheet, placeholder } from '@coursera/coursera-ui';
import user from 'js/lib/user';
import { SvgEnvelopeDollar } from '@coursera/coursera-ui/svg';

import { REFER_A_FRIEND_PAGE_URL } from 'bundles/referral/constants';

import { enableNavInCourseHomeCtas } from 'bundles/referral/utils/utils';

import _t from 'i18n!nls/page';

export const mobileCarouselResponsiveProperty = [
  { breakpoint: 320, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  { breakpoint: 455, settings: { slidesToShow: 2, slidesToScroll: 2 } },
  { breakpoint: 590, settings: { slidesToShow: 3, slidesToScroll: 3 } },
  { breakpoint: 730, settings: { slidesToShow: 4, slidesToScroll: 4 } },
  { breakpoint: 840, settings: { slidesToShow: 5, slidesToScroll: 5 } },
  { breakpoint: 10000, settings: { slidesToShow: 6, slidesToScroll: 6 } },
];

const domainButtons = () => [
  {
    label: _t('Data Science'),
    name: 'data-science',
  },
  {
    label: _t('Business'),
    name: 'business',
  },
  {
    label: _t('Computer Science'),
    name: 'computer-science',
  },
  {
    label: _t('Information Technology'),
    name: 'information-technology',
  },
  {
    label: _t('Language Learning'),
    name: 'language-learning',
  },
  {
    label: _t('Health'),
    name: 'life-sciences',
  },
  {
    label: _t('Personal Development'),
    name: 'personal-development',
  },
  {
    label: _t('Physical Science and Engineering'),
    name: 'physical-science-and-engineering',
  },
  {
    label: _t('Social Sciences'),
    name: 'social-sciences',
  },
  {
    label: _t('Arts and Humanities'),
    name: 'arts-and-humanities',
  },
  {
    label: _t('Math and Logic'),
    name: 'math-and-logic',
  },
];

const megamenuButtons = () => [
  {
    href: '/courses?query=free',
    label: _t('Take a free course'),
    name: 'free-course',
  },
  {
    label: _t('Earn a Degree'),
    name: 'degree',
  },
  {
    label: _t('Earn a Certificate'),
    name: 'certificate',
  },
  {
    label: _t('Launch or advance your career'),
    name: 'clp',
  },
];

const helpCenterButtons = () => [
  {
    href: 'https://partner.coursera.help/hc',
    label: _t('Educator Resource Center'),
    name: 'partner-help',
  },
  {
    href: 'https://learner.coursera.help',
    label: _t('Help Center'),
    name: 'help',
  },
];

const updatesAndAccomplishmentsButtons = () => [
  {
    href: '/updates',
    label: _t('Updates'),
    name: 'updates',
  },
  {
    href: '/accomplishments',
    label: _t('Accomplishments'),
    name: 'accomplishments',
  },
];

const browseButton = () => ({
  href: '/browse',
  label: _t('Explore'),
  name: 'browse',
});

const browseAllSubjectsButton = () => ({
  href: '/browse',
  label: _t('Browse all subjects'),
  name: 'browse',
});

const adminButton = () => ({
  href: '/admin',
  label: _t('Educator Admin'),
  name: 'admin',
});

const enterpriseButton = () => ({
  href: '/business',
  label: _t('For Enterprise'),
  name: 'enterprise',
});

const forStudentButton = () => ({
  href: '/for-university-and-college-students/?utm_campaign=header-for-students&utm_content=corp-to-landing-for-students&utm_medium=coursera&utm_source=header-for-students-link',
  label: _t('For Students'),
  name: 'student',
});

const forCareerAcademyButton = () => ({
  label: '',
  name: 'career-academy',
});

export const loggedInNavButtons = (isEnterprise: boolean) => {
  const enterpriseButtons = [
    browseButton(),
    adminButton(),
    {
      href: '/',
      label: _t('My Coursera'),
      name: 'dashboard',
    },
    {
      label: _t('Account'),
      name: 'account',
    },
    {
      label: _t('Cart'),
      name: 'cart',
    },
    ...helpCenterButtons(),
    enterpriseButton(),
    forStudentButton(),
    forCareerAcademyButton(),
    ...updatesAndAccomplishmentsButtons(),
  ];
  const regularButtons = [
    adminButton(),
    {
      label: _t('Your account'),
      name: 'account',
    },
    enterpriseButton(),
    forCareerAcademyButton(),
    ...megamenuButtons(),
    ...domainButtons(),
    ...helpCenterButtons(),
    forStudentButton(),
  ];
  const navButtons: NavButtonType[] = isEnterprise ? enterpriseButtons : regularButtons;

  if (enableNavInCourseHomeCtas()) {
    navButtons.push({
      href: REFER_A_FRIEND_PAGE_URL,
      label: _t('Get 50% Off'),
      name: 'refer-a-friend',
    });
  }

  return navButtons;
};

export const loggedInAccountButtons = (isEnterprise: boolean) => {
  let navButtons: NavButtonType[] = [
    {
      href: `/user/${user.get().external_id}`,
      label: _t('Profile'),
      name: 'profile',
    },
    {
      href: '/account-settings',
      label: _t('Settings'),
      name: 'settings',
    },
    {
      href: '/my-purchases/transactions',
      label: _t('My Purchases'),
      name: 'purchases',
    },
  ];

  if (!isEnterprise) {
    navButtons = [...updatesAndAccomplishmentsButtons(), ...navButtons];
  }
  return navButtons;
};

export const loggedInReferralButtons = () => [
  {
    href: REFER_A_FRIEND_PAGE_URL,
    label: _t('Refer a friend'),
    name: 'refer-a-friend',
    icon: SvgEnvelopeDollar,
  },
];

export const authButtonClasses = {
  signup: 'signUp-btn',
  login: 'logIn-btn',
};

export const loggedOutAuthButtons = () => [
  {
    label: _t('Join for Free'),
    authMode: 'signup',
    wrapperClassName: 'mobile-header-btn',
    linkClassName: `${authButtonClasses.signup} mobile-auth-btn`,
  },
  {
    label: _t('Log In'),
    authMode: 'login',
    wrapperClassName: 'mobile-header-btn',
    linkClassName: `${authButtonClasses.login} mobile-auth-btn`,
  },
];

export const loggedOutNavButtons = (isEnterprise: boolean) => {
  const enterpriseButtons = [browseButton(), enterpriseButton(), forStudentButton(), forCareerAcademyButton()];
  const regularButtons = [
    enterpriseButton(),
    forStudentButton(),
    forCareerAcademyButton(),
    ...megamenuButtons(),
    ...domainButtons(),
    browseAllSubjectsButton(),
  ];
  return isEnterprise ? enterpriseButtons : regularButtons;
};

export const MOBILE_TOPIC_COLUMN_HEIGHT = 100;

export const placeholderStyles = StyleSheet.create({
  cardPlaceholder: {
    height: MOBILE_TOPIC_COLUMN_HEIGHT,
    width: '150px',
    margin: '8px 8px 8px 0',
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '3px',
    backgroundColor: color.gray,
    animationDelay: `${placeholder.animationDuration / 4}s`,
  },
  listPlaceholder: {
    display: 'block',
    height: '35px',
    marginBottom: '10px',
    width: 'calc(100vw - 30px)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: color.gray,
    animationDelay: `${placeholder.animationDuration / 4}s`,
  },
});

export const NUMBER_OF_DOMAINS = 11;

export const TRANSITION_DELAY = 300;

export const ACCOUNT_PAGE_IDENTIFIER = 'ACCOUNT_MENU';

export const CLP_PAGE_IDENTIFIER = 'CLP_MENU';

export const EXPLORE_PAGE_IDENTIFIER = 'EXPLORE_MENU';

export const DEGREES_PAGE_IDENTIFIER = 'DEGREES_MENU';

export const CERTIFICATE_PAGE_IDENTIFIER = 'CERTIFICATE_MENU';

export const CERTS_PAGE_IDENTIFIER = 'CERTS_MENU';

export const DOMAIN_PAGE_IDENTIFIER = 'DOMAIN_MENU';

export const MD_SCREEN_BREAKPOINT_PX = 992;

export type NavButtonType = {
  href?: string;
  label: string;
  name: string;
};

export type SwitcherSelectionType = {
  id: string;
  selectionType: string;
  programId?: string;
  degreeId?: string;
};
