import Cookies, { CookieAttributes } from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { config, initialize as initConfig } from '../config';

initConfig();

const JWT_COOKIE_NAME = '_jwt';
const SSO_COOKIE_NAME = '_sso';

export default {
  setJWT: function(jwt: string): void {
    const options: CookieAttributes = {
      expires: this._getExpiration(jwt),
      domain: this._getBaseDomain(),
      secure: this._shouldSecureCookies()
    };
    Cookies.set(JWT_COOKIE_NAME, jwt, options);
  },

  getJWT: function(): string | undefined {
    return Cookies.get(JWT_COOKIE_NAME);
  },

  _getExpiration: function(jwt: string): Date {
    interface TokenDTO {
      exp: number;
      // Could add all the user-api JWT claims and export as a type...
    }
    // I don't follow why jwtDecode's default export is parameterized but then
    // doesn't provide at least the default JWT interface
    return new Date(jwtDecode<TokenDTO>(jwt).exp * 1000);
  },

  /* Example
     www.udacity.com => udacity.com
     udacity.com => udacity.com
     localhost => localhost

     NOTE: This assumes we don't have "compound" TLDs like `co.uk`.
  */
  _getBaseDomain(): string {
    return window.location.hostname
      .split('.')
      .slice(-2)
      .join('.');
  },

  _shouldSecureCookies(): boolean {
    const configValue = config.SECURE_COOKIES;
    return configValue !== 'false';
  },

  getUserId(): string {
    const jwt = this.getJWT();

    if (!jwt) {
      return '';
    }

    let jwtClaims;

    const jwtParts = jwt.split('.');
    const jwtPayload = jwtParts.length > 1 ? jwtParts[1] : '';
    try {
      jwtClaims = JSON.parse(atob(jwtPayload));
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error decoding user JWT');
    }
    return (jwtClaims && jwtClaims.uid) || '';
  },

  isSsoCookied(): boolean {
    return !!Cookies.get(SSO_COOKIE_NAME);
  },

  clearSsoCookie(): void {
    const options: CookieAttributes = {
      domain: this._getBaseDomain(),
      secure: this._shouldSecureCookies()
    };
    Cookies.remove(SSO_COOKIE_NAME, options);
  }
};
