export const MOBILE_BREAKPOINT = 600;
export const COLOR_MUTED_TEXT = '#5F6369';
export const COLOR_MUTED_BOLD_TEXT = '#7F8287';
export const COLOR_MUTED_BORDER = '#DFE0E1';
export const COLOR_MUTED_BACKGROUND = '#F3F3F4';
export const COLOR_ACCENT = '#5000b9';
export const COLOR_ACCENT_BACKGROUND = 'rgba(80, 0, 185, 0.2)';
export const BORDER_RADIUS_DEFAULT = '6px';
export const BORDER_RADIUS_LARGE = '8px';
export const DEFAULT_LISTENER_MESSAGE =
  'Get access to subscriber-only episodes for a monthly subscription.';
export const SETUP_PAYWALLS_URL = '/dashboard/episodes/subscribe';
export const SETUP_STRIPE_AND_PAYWALLS_URL = `/auth/stripe?product=Paywalls&returnTo=${encodeURIComponent(
  SETUP_PAYWALLS_URL
)}`;
export const SETUP_EPISODES_URL = '/dashboard/episodes';
export const PODCAST_SETTINGS_EDIT_SHOWNOTES_URL =
  '/dashboard/podcast/edit?navigatedFrom=subscribersLinkCTA';

export const CONSUMER_BETA_PROGRAM_RULES_URL =
  'https://help.anchor.fm/hc/en-us/articles/360058514391';
export const CREATOR_BETA_PROGRAM_RULES_URL =
  'https://help.anchor.fm/hc/en-us/articles/360058061032';
export const TERMS_OF_SERVICE_URL = '/tos';
export const PRIVACY_POLICY_URL = '/privacy';
export const PRIVATE_RSS_HELP_URL =
  'https://help.anchor.fm/hc/en-us/articles/360057624432';
