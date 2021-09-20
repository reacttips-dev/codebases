import { token, getToken } from './token';

let tokenWatchInterval: number = 0;

/*
 * After the POST /logout returned (erasing your cookie, with a 303), it started
 * a race between the redirect loading (/logged-out) and the cookie change
 * checker noticing that your cookie disappeared and doing a refresh. If it
 * looks like we're trying to change pages, just stop checking for a cookie
 * change.
 */
const beforeUnloadListener = (): void => {
  window.clearInterval(tokenWatchInterval);
};

export const stopTokenWatcher = (): void => {
  window.clearInterval(tokenWatchInterval);
  window.removeEventListener('beforeunload', beforeUnloadListener);
};

/*
 * Check to see if the idMember changes; if it does, then it means that they've
 * logged out in another window, or logged in as someone else, or cleared their
 * cookies or something, and any requests we make now might be unauthorized.
 */
export const startTokenWatcher = (): void => {
  const tokenWatcher = () => {
    const newToken = getToken();
    if (token !== newToken) {
      window.location.reload();
    }
  };

  window.clearInterval(tokenWatchInterval);
  tokenWatchInterval = window.setInterval(tokenWatcher, 3000);
  window.addEventListener('beforeunload', beforeUnloadListener);
};
