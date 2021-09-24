/* eslint-disable max-len */
export const DISCOVER = {
  BEACON_VERSION: '1',
  BEACON_TEXT: 'Explore creators, curated categories and communities.',
}

export const ERROR_MESSAGES = {
  NONE: '',
  EMAIL: {
    INVALID: 'That email is invalid. Please try again.',
    UNAVAILABLE: 'That email is unavailable.',
  },
  CONFIRMATION_CODE: {
    INVALID: 'That code is invalid. Please try again.',
  },
  INVITATION_CODE: {
    INVALID: 'That code is invalid. Please try again.',
  },
  PASSWORD: {
    TOO_SHORT: 'Password must be at least 8 characters.',
  },
  USERNAME: {
    EXISTS: 'Username already exists. Please try a new one. You can change your username at any time',
    INVALID_CHARACTERS: 'Username must only contain letters, numbers, underscores & dashes.',
    INVALID: 'That username is invalid. Please try again.',
    SPACES: 'Username must not contain a space.',
  },
  USERNAME_OR_EMAIL: {
    INVALID: 'That username or email is invalid.',
  },
}

export const FOLLOWING = {
  BEACON_VERSION: '1',
  BEACON_TEXT: 'Follow the creators and communities that inspire you.',
}

export const FOOTER_LINKS = [
  { label: 'About', to: '/wtf/artists/' },
  { label: 'Help', to: '/wtf/support/' },
  { label: 'Blog', to: '/elloblog' },
  { label: 'Apps', to: '/wtf/resources/apps/' },
  { label: 'Terms', to: '/wtf/policies/terms/' },
  { label: 'Privacy', to: '/wtf/policies/privacy/' },
  { label: 'Careers', to: 'https://start.talenthouse.com' },
  { label: 'Brands', to: 'https://tlnt.holdings/?utm_source=ELLO&utm_medium=bottom_menu&utm_campaign=tlnt_partners#contacts' },
]

export const META = {
  ALL_PAGE_DESCRIPTION: 'Discover work on Ello in Art, Fashion, Photography, Design, Architecture, Illustration, GIFs, 3D, Writing, Music, Textile, Skate and Cycling.',
  DESCRIPTION: 'Welcome to the Creators Network. Ello is a community to discover, discuss, publish, share and promote the things you are passionate about.',
  ENTER_PAGE_DESCRIPTION: 'Welcome back to Ello. Sign in now to publish, share and promote your work and ideas, check your notifications, and collaborate.',
  ENTER_TITLE: 'Login | Ello',
  FEATURED_PAGE_DESCRIPTION: 'Welcome to the Creators Network. Ello is a community to discover, discuss, publish, share and promote the things you are passionate about.',
  FORGOT_PAGE_DESCRIPTION: 'Welcome back to Ello. Enter your email to reset your password.',
  FORGOT_TITLE: 'Forgot Password | Ello',
  IMAGE: '/static/images/support/ello-open-graph-image.png',
  SIGNUP_PAGE_DESCRIPTION: 'Join the Creators Network. Ello is a networked marketplace and publishing platform providing creators visibility, influence and opportunity.',
  SIGNUP_TITLE: 'Sign up | Ello',
  RECENT_PAGE_DESCRIPTION: 'Discover recent work from creators on Ello in Art, Fashion, Photography, Design, Architecture, Illustration, GIFs, Writing, Music, Textile, Skate and Cycling.',
  SEARCH_PAGE_DESCRIPTION: 'Find work from creators on Ello in Art, Fashion, Photography, Design, Architecture, Illustration, GIFs, 3D, Writing, Music, Textile, Skate and Cycling.',
  SEARCH_TITLE: 'Search | Ello',
  TITLE: 'Ello | The Creators Network.',
  TRENDING_PAGE_DESCRIPTION: 'Explore trending work on Ello in Art, Fashion, Photography, Design, Architecture, Illustration, GIFs, 3D, Writing, Music, Textile, Skate and Cycling.',
}

export const PREFERENCES = {
  NSFW_VIEW: {
    term: 'View Adult Content',
    desc: '<a href="/wtf/post/rules" target="_blank">What does this mean?</a>',
  },
  NSFW_POST: {
    term: 'Post Adult Content',
    desc: '<a href="/wtf/post/rules" target="_blank">What does this mean?</a>',
  },
}

export const SETTINGS = {
  NSFW_DISCLAIMER: 'Note: Apple iOS rules block the sharing of NSFW content through iOS apps. Accounts & posts marked NSFW will not appear in search results on the Ello iOS App but will appear when using Ello on the web. If you want your posts to appear on Ello iOS, please set "Post Adult Content" to "No".',
  YOUR_DATA_DESC: 'The only data that Ello stores about you is what you enter on your settings page and what you post. All other usage data that we collect is anonymized, and you can opt out.',
  ACCOUNT_DELETION_DEFINITION: {
    term: 'Delete Account',
    desc: 'By deleting your account you remove your personal information from Ello. Your account cannot be restored.',
  },
}
