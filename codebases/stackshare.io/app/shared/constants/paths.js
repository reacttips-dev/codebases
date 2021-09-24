export const SIGN_IN_PATH = '/sign_in';
export const LOG_IN_PATH = '/login';
export const LOG_IN_OR_SIGN_UP_PATH = '/login_signup';
export const JOBS = '/jobs';
export const PRIVATE = '/private';
export const API_PATH = '/api';
export const STACKS_PATH = '/stacks';
export const STACKS_TRENDING_PATH = '/stacks/trending';
export const FEATURED_POSTS_PATH = '/featured-posts';
export const TOOLS_PATH = '/tools';
export const TOOLS_TRENDING_PATH = '/tools/trending';
export const TOOLS_NEW_PATH = '/tools/new';
export const STACKUPS_PATH = '/stackups';
export const STACKUPS_TRENDING_PATH = '/stackups/trending';
export const STACKUPS_NEW_PATH = '/stackups/new';
export const COMPANIES_PATH = '/companies';
export const SEARCH_PATH = '/search';
export const SEARCH_QUERY_PATH = /\/search\/q=(.*)/;
export const DECISIONS_QUERY_PATH = /\/decisions\//;
export const CAREERS_PATH = '/careers';
export const VENDORS_PATH = '/vendors';
export const ALTERNATIVES_PATH = '/alternatives';
export const TERMS_PATH = '/terms';
export const PRIVACY_PATH = '/privacy';
export const FEED_PATH = '/feed';
export const FEED_TRENDING_PATH = '/feed/trending';
export const FEED_ADVICE_PATH = '/feed/advice';
export const HOMEPAGE_PATH = '/';
export const TOOLS_BLOG_POST = '/posts/top-developer-tools-2019';

export const testAuthPage = pathname => {
  return Boolean(
    AUTH_PAGES.find(page => (page instanceof RegExp ? page.test(pathname) : pathname === page))
  );
};

export const AUTH_PAGES = [SIGN_IN_PATH, LOG_IN_OR_SIGN_UP_PATH, LOG_IN_PATH];

export const testGatewayPage = pathname => {
  return Boolean(
    GATEWAY_PAGES.find(page => (page instanceof RegExp ? page.test(pathname) : pathname === page))
  );
};

export const GATEWAY_PAGES = [
  LOG_IN_OR_SIGN_UP_PATH,
  JOBS,
  SIGN_IN_PATH,
  API_PATH,
  STACKS_PATH,
  STACKS_TRENDING_PATH,
  FEATURED_POSTS_PATH,
  TOOLS_PATH,
  TOOLS_TRENDING_PATH,
  TOOLS_NEW_PATH,
  STACKUPS_PATH,
  STACKUPS_TRENDING_PATH,
  STACKUPS_NEW_PATH,
  COMPANIES_PATH,
  SEARCH_PATH,
  SEARCH_QUERY_PATH,
  DECISIONS_QUERY_PATH,
  CAREERS_PATH,
  VENDORS_PATH,
  ALTERNATIVES_PATH,
  TERMS_PATH,
  PRIVACY_PATH,
  FEED_PATH,
  FEED_TRENDING_PATH,
  FEED_ADVICE_PATH,
  HOMEPAGE_PATH,
  TOOLS_BLOG_POST,
  PRIVATE
];
