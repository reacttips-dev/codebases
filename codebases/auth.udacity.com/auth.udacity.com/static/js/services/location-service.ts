import { config, initialize as initConfig } from '../config';
initConfig();

export default {
  /**
   * Redirects only to a udacity.com domain or relative path, otherwise just redirects back to udacity.com
   */
  redirectSafelyTo: function(argURL: string): void {
    let redirectURL = config.REDIRECT_URL as string;

    try {
      // Note: new URL() throws exceptions on parse failures, and the
      // second argument is used if the first argument is a relative path
      const validURL = new URL(argURL, 'http://relative');

      // HTTP only here, defend against javascript:window.alert('bad')
      if (validURL.protocol === 'http:' || validURL.protocol === 'https:') {
        if (validURL.origin === 'http://relative') {
          // relative path and its query string as-is
          redirectURL = argURL;
        } else {
          // Allow the parent domain, subdomains of the parent, or localhost:
          //   udacity.com, *.udacity.com, localhost
          // Defend against fooudacity.com and udacity.com.foo
          if (validURL.hostname.endsWith('.' + config.ALLOWED_REDIRECT_DOMAIN)
              || validURL.hostname === config.ALLOWED_REDIRECT_DOMAIN
              || validURL.hostname === 'localhost') {
            // force https, no plain http redirects
            redirectURL = argURL.replace(/^http:/, 'https:');
          }
        }
      }
    } catch (e) {
      // fall through with the default redirect on parse failure
    }

    window.location.assign(redirectURL);
  }
};
