import config from 'js/app/config';

interface GoogleOauth2 {
  endpoint: string;
  queryParams: {
    [param: string]: string;
  };
}

export const googleOauth2: GoogleOauth2 = {
  endpoint: `${config.url.base}api/thirdpartyauth.v1/oauth/google/initiate`,
  queryParams: {
    redirectURL: 'https://coursera.org/ssoCallback',
    clientState: '',
  },
};

export const OAUTH = {
  ENDPOINT_TEMPLATE: `${config.url.base}api/thirdpartyauth.v1/oauth/<serviceName>/initiate`,
  REDIRECT_URL: `${config.url.base}/ssoCallback`,
};

/* Ignore lint errors raised because identifiers are not in camel case; they are defined as they are to match what the social provider's APIs are expecting */
export default {
  config,
  naptimeResource: 'thirdPartyAccounts.v1',
  authApi: 'thirdpartyauth.v1/web',
  linkApi: 'thirdpartyauth.v1/link',
  profilesApi: 'profiles.v1',
  alternateEmailApi: 'userEmails.v2?action=insert',
  userEmailsApi: 'userEmails.v2',
  authTypes: ['facebook', 'apple', 'google'],

  apple: {
    init: {
      clientId: 'org.coursera.signin',
      scope: 'name email',
      // This default value will change depending on the user's i18n subdomain.
      // e.g. if on es.coursera.org, this redirectURI will change to https://es.coursera.org
      // See static/bundles/socialPlugins/lib.ts to see how this changes
      redirectURI: 'https://www.coursera.org',
      // Generating random hex value for state in apple init, 16777215 is equivalent to FFFFFF
      state: Math.floor(Math.random() * 16777215).toString(16),
      usePopup: true,
    },
  },

  facebook: {
    init: {
      appId: '823425307723964',
      status: true,
      xfbml: true,
      version: 'v2.4',
    },
    // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.3
    loginParams: {
      scope: 'public_profile,email,user_friends,user_birthday',
      return_scopes: true,
    },
  },

  google: {
    init: {
      client_id: '870424449695-86pfhfkg1mpnppc2t3809v4rh37c3vjv.apps.googleusercontent.com',
    },
  },
};
