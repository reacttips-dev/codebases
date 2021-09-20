type Config = {
  [key: string]: string | boolean | number;
};

// Production Configuration
let defaultConfig: Config = {
  CLASS_PREFIX: 'auth-component__',
  AUTH_WEB_URL: 'https://auth.udacity.com',
  GEO_API_URL: '/api/geode',
  USER_API_URL: '/api/user',
  SECURE_COOKIES: true,
  ALLOWED_REDIRECT_DOMAIN: 'udacity.com',
  REDIRECT_URL: 'https://www.udacity.com',
  SEGMENT_KEY: '2pmctCqPl2ftwe44heojWDso2pWdxfi1',
  RECAPTCHA_KEY: '6Lex-qMUAAAAAHiZ9JRWbDsOguAX7C1eFKGF9qAE'
};

export const initialize = (): void => {
  // Use staging endpoints when developing locally or when in a staging env
  const stagingRegex = /dev.udacity.com|localhost|staging/;
  if (stagingRegex.test(window.location.href)) {
    defaultConfig.SECURE_COOKIES = false;
    defaultConfig.SEGMENT_KEY = '4Jq4q1yIxB1F5lfVcXkrN3byhYjRpIp4';
  }
};

export const config = defaultConfig;
