const TOKEN_PARAM_NAME = 'csrf3-token';

// Login and Signup endpoints used to be included here, but they have been deprecated.
// See ticket on Jira here: https://coursera.atlassian.net/browse/GR-17571
const ENDPOINT = {
  logout: '/api/logoutSsr/v1',
} as const;

const exported = {
  // authMode is either 'login' or 'signup'
  getActionUrl(authMode: keyof typeof ENDPOINT, csrfToken: string, src?: string) {
    const endpoint = ENDPOINT[authMode];
    const srcParam = src ? `&src=${src}` : '';
    return `${endpoint}?${TOKEN_PARAM_NAME}=${csrfToken}${srcParam}`;
  },
};

export default exported;

export const { getActionUrl } = exported;
