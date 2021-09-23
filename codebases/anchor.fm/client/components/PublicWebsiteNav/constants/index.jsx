import { ENABLE_ADS_BY_ANCHOR_PAGE } from 'client/screens/AdsByAnchorScreen/constants';

const adsByAnchorLink = ENABLE_ADS_BY_ANCHOR_PAGE
  ? [
      {
        label: 'Ads by Anchor',
        key: 'ads',
        to: '/ads-by-anchor',
      },
    ]
  : [];

const SIGNED_OUT_LINKS = [
  {
    label: 'Features',
    key: 'features',
    to: '/features',
  },
  {
    label: 'Switch to Anchor',
    key: 'switch',
    to: '/switch',
  },
  ...adsByAnchorLink,
  {
    label: 'Blog',
    key: 'blog',
    href: 'https://blog.anchor.fm',
    openInNewTab: true,
  },
];

// These are normally in the footer, but for narrow screens, we only keep Legal there.
const SECONDARY_MOBILE_LINKS = [
  {
    label: 'Careers',
    key: 'careers',
    href: 'https://spotifyjobs.com/jobs?q=Podcaster%20Mission',
    target: '_blank',
  },
  {
    label: 'Help',
    key: 'help',
    href: 'https://help.anchor.fm/',
    target: '_blank',
  },
];

// TODO: add back episodes link when the episodes page is ready
const SIGNED_IN_LINKS = [
  {
    label: 'Network',
    key: 'network',
    to: '/dashboard/network',
  },
  {
    label: 'Dashboard',
    key: 'dashboard',
    to: '/dashboard',
  },
  {
    label: 'Episodes',
    key: 'episodes',
    to: '/dashboard/episodes',
  },
  {
    label: 'Money',
    key: 'money',
    to: '/dashboard/money',
    notificationBadge: 'DollarSignIcon',
  },
];

const ACCOUNT_MENU_ITEMS = [
  {
    label: 'Update settings',
    icon: {
      type: 'GearIcon',
      iconColor: '#c9cbcd',
      backgroundColor: 'transparent',
      width: 18,
      padding: 0,
    },
    to: '/dashboard/podcast/edit',
  },
  {
    label: 'Help',
    icon: {
      type: 'QuestionMarkIcon',
      iconColor: '#ffffff',
      backgroundColor: 'gray',
      width: 18,
      padding: 3,
    },
    target: '_blank',
    href: 'https://help.anchor.fm/',
  },
];

export {
  SIGNED_OUT_LINKS,
  SIGNED_IN_LINKS,
  ACCOUNT_MENU_ITEMS,
  SECONDARY_MOBILE_LINKS,
};
