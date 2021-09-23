'use es6';

import PropTypes from 'prop-types';
import { FACEBOOK, GOOGLE, TWITTER, RSS, INSTAGRAM, YOUTUBE, XING, PINTEREST, LINKEDIN, CANDY_APPLE } from 'HubStyleTokens/colors';
export var SOCIAL_MAP = {
  facebook: {
    icon: 'socialFacebook',
    color: FACEBOOK
  },
  google: {
    icon: 'socialGoogle',
    color: GOOGLE
  },
  googledrive: {
    icon: 'socialGoogleDrive',
    color: GOOGLE
  },
  googleplus: {
    icon: 'socialGoogleplus',
    color: GOOGLE
  },
  heart: {
    icon: 'socialHeart',
    color: CANDY_APPLE
  },
  instagram: {
    icon: 'socialInstagram',
    color: INSTAGRAM
  },
  linkedin: {
    icon: 'socialLinkedin',
    color: LINKEDIN
  },
  pinterest: {
    icon: 'socialInstagram',
    color: PINTEREST
  },
  retweet: {
    icon: 'socialRetweet',
    color: TWITTER
  },
  rss: {
    icon: 'socialRss',
    color: RSS
  },
  slack: {
    icon: 'socialSlack',
    color: FACEBOOK
  },
  twitter: {
    icon: 'socialTwitter',
    color: TWITTER
  },
  xing: {
    icon: 'socialXing',
    color: XING
  },
  youtube: {
    icon: 'socialBlockYoutubeplay',
    color: YOUTUBE
  },
  youtubeplay: {
    icon: 'socialYoutubeplay',
    color: YOUTUBE
  }
};
export var BORDERWIDTH = 1;
export var SIZE_CLASSES = {
  responsive: '',
  xs: 'private-avatar--xs',
  sm: 'uiAvatarSmall private-avatar--sm',
  md: 'uiAvatarMedium private-avatar--md',
  lg: 'uiAvatarLarge private-avatar--lg',
  xl: 'uiAvatarXLarge private-avatar--xl'
};
export var AVATAR_SIZES = {
  xxs: 16,
  xs: 24,
  sm: 32,
  md: 48,
  lg: 72,
  xl: 108,
  responsive: 'responsive'
};
export var AVATAR_TYPES = {
  company: 'COMPANIES',
  companyId: 'COMPANIES',
  contact: 'CONTACT',
  domain: 'COMPANIES',
  email: 'CONTACT',
  emails: 'CONTACT',
  enrichmentDomain: 'COMPANIES',
  enrichmentEmail: 'CONTACT',
  hubSpotUserEmail: 'CONTACT',
  hubSpotUserEmails: 'CONTACT',
  productId: 'PRODUCT',
  vid: 'CONTACT',
  ticket: 'TICKET',
  deal: 'DEAL',
  _isHasMore: false
};
export var AVATAR_TYPE_ICONS = {
  COMPANIES: 'companies',
  CONTACT: 'contacts',
  PRODUCT: 'product',
  TICKET: 'ticket',
  DEAL: 'deals'
};
export var RETINA_MULTIPLIER = 2;
export var API_KNOWN_KEY_MAPPINGS = {
  contact: 'knownContacts',
  company: 'knownCompanies'
};
export var API_KNOWN_VALUE_MAPPINGS = {
  contact: {
    primaryIdentifier: 'vid',
    secondaryIdentifier: 'email'
  },
  company: {
    primaryIdentifier: 'companyId',
    secondaryIdentifier: 'domain'
  }
};
export var API_IDENTIFIER_MAPPINGS = {
  contact: 'vids',
  company: 'companyIds',
  vids: 'vids',
  vid: 'vids',
  companyId: 'companyIds',
  email: 'emails',
  domain: 'domains',
  enrichmentEmail: 'emails',
  enrichmentDomain: 'domains',
  hubSpotUserEmails: 'hubSpotUserEmails',
  hubSpotUserEmail: 'hubSpotUserEmails',
  product: 'productIds',
  productId: 'productIds',
  _isHasMore: false
};
export var DEFAULT_MAX_UPLOAD_SIZE_MB = 4;
export var OBJECT_TYPE_TO_ENDPOINT_MAPPINGS = {
  contact: 'contacts/vid',
  vid: 'contacts/vid',
  company: 'companies/companyId',
  companyId: 'companies/companyId',
  product: 'products/productId',
  productId: 'products/productId'
};
export var OBJECT_TYPES_THAT_REQUIRE_PORTAL_ID = ['contact', 'vid', 'company', 'companyId', 'product', 'productId'];
export var AVATAR_LOOKUP_PROPTYPES = PropTypes.oneOfType([PropTypes.shape({
  type: PropTypes.oneOf(['contact']).isRequired,
  primaryIdentifier: PropTypes.number.isRequired,
  secondaryIdentifier: PropTypes.string,
  fileManagerKey: PropTypes.string,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['company']).isRequired,
  primaryIdentifier: PropTypes.number.isRequired,
  secondaryIdentifier: PropTypes.string,
  fileManagerKey: PropTypes.string,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['vid']).isRequired,
  primaryIdentifier: PropTypes.number.isRequired,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['companyId']).isRequired,
  primaryIdentifier: PropTypes.number.isRequired,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['email']).isRequired,
  primaryIdentifier: PropTypes.string.isRequired,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['domain']).isRequired,
  primaryIdentifier: PropTypes.string.isRequired,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['enrichmentEmail']).isRequired,
  primaryIdentifier: PropTypes.string.isRequired,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['enrichmentDomain']).isRequired,
  primaryIdentifier: PropTypes.string.isRequired,
  displayName: PropTypes.string
}).isRequired, PropTypes.shape({
  type: PropTypes.oneOf(['hubSpotUserEmail']).isRequired,
  primaryIdentifier: PropTypes.string.isRequired,
  displayName: PropTypes.string
}).isRequired]);