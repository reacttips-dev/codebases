import _ from 'lodash';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isFreshMobile } from 'bundles/mobile/lib/eligibility';
import requestCountryCode from 'bundles/phoenix/template/models/requestCountryCode';

import cookie from 'js/lib/cookie';
import redirect from 'js/lib/coursera.redirect';
import UserAgentInfo from 'js/lib/useragent';
import store from 'js/lib/coursera.store';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import userAgent from 'js/constants/userAgent';
import inServerContext from 'bundles/ssr/util/inServerContext';

import clientSideUserJson from 'bundles/user-account/common/user';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import VerificationProfile from 'bundles/ssr/class/VerificationProfile';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS: Array<keyof SerializedState> = [
  'csrfToken',
  'mobilePromoEligible',
  'requestCountryCode',
  'userAgent',
  'userData',
  'deferredRedirectParams',
  'appName',
];

/* eslint-disable camelcase */
type UserVerificationData = {
  first_name: string;
  middle_name: string;
  verified_by: string;
  last_name: string;
};

type UserData = {
  id?: number | null;
  authenticated: boolean;
  fullName?: string | null;
  full_name?: string | null;
  is_staff?: boolean;
  is_superuser?: boolean;
  id_verification?: UserVerificationData;
};
/* eslint-enable camelcase */

type SerializedState = {
  csrfToken: string | null | undefined;
  mobilePromoEligible: boolean | null | undefined;
  requestCountryCode: string | null | undefined;
  userAgent?: UserAgentInfo;
  userData: UserData;
  deferredRedirectParams: any;
  appName: string | undefined;
};

class ApplicationStore extends BaseStore {
  csrfToken: string | null | undefined;

  mobilePromoEligible: boolean | null | undefined;

  requestCountryCode: string | null | undefined;

  userAgent?: UserAgentInfo;

  userData: UserData = {
    id: null,
    authenticated: false,
    // TODO: consolidate the inconsistency with full name.
    fullName: null,
    // Property name is not negotiable.
    // eslint-disable-next-line camelcase
    full_name: null,
  };

  deferredRedirectParams: any;

  cookies: any;

  appName: string | undefined;

  static storeName = 'ApplicationStore';

  static handlers = {
    LOAD_COOKIES: 'loadCookies',
    INFER_MOBILE_PROMO_ELIGIBILITY: 'inferMobilePromoElibility',
    SET_CSRF_TOKEN: 'setCsrfToken',
    SET_CAUTH_TOKEN: 'setCauthToken',
    SET_REQUEST_COUNTRY: 'setRequestCountry',
    SET_USER_AGENT: 'setUserAgent',
    SET_USER_DATA: 'setUserData',
    SET_APP_NAME: 'setAppName',
  };

  constructor(dispatcher: any) {
    super(dispatcher);
    // this.userData = {
    //   id: null,
    //   authenticated: false,
    //   // TODO: consolidate the inconsistency with full name.
    //   fullName: null,
    //   full_name: null
    // };

    // HACK until our Fluxible apps all work consistently
    if (cookie) {
      // pull CSRF token from cookies in case it's never set by the Flux flow
      this.csrfToken = cookie.get('CSRF3-Token');
    }
  }

  inServerContext() {
    return inServerContext;
  }

  hasLoaded() {
    // TODO when setUserData is always triggered, set this to be when setUserData is true
    return true;
  }

  setCsrfToken(token: string) {
    this.csrfToken = token;

    this.emitChange();
  }

  /**
   * Set any state that depends on request cookies
   */
  loadCookies(cookies: any) {
    this.cookies = cookies;

    this.emitChange();
  }

  getCookies() {
    return this.cookies;
  }

  inferMobilePromoElibility() {
    // must load after userAgent. cookies can be undefined
    this.mobilePromoEligible = isFreshMobile(this.userAgent, this.cookies);
  }

  /**
   * Set the request country that Edge provides by the `X-Coursera-Country` header.
   *
   * In CSR, Edge replaces {user_location} in our Jade template.
   *
   * @param {String} countryCode in ISO 3166-1 alpha-2
   */
  setRequestCountry(countryCode?: string) {
    this.requestCountryCode = countryCode || null;

    this.emitChange();
  }

  setUserAgent(agentString: string) {
    this.userAgent = new UserAgentInfo(agentString);

    this.emitChange();
  }

  /**
   * FIXME: this method does not get called when CSR fallback happens
   *
   * Set the user data that Edge provides by the `X-Course-User-*` headers.
   *
   * In CSR, Edge injects a user JSON blob into Jade template, but that comes from a deprecated Django API.
   *
   * @param {Object} userData {id, fullName}
   */
  setUserData(userData: UserData) {
    this.userData = Object.assign({}, userData, {
      authenticated: !!userData.id,
    });

    this.emitChange();
  }

  setAppName(appName: string) {
    this.appName = appName;

    this.emitChange();
  }

  getState(): SerializedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  dehydrate(): SerializedState {
    return this.getState();
  }

  rehydrate(state: SerializedState) {
    const stateObserved = _.pick(state, ...SERIALIZED_PROPS);
    Object.assign(this, stateObserved);

    this.handlePotentialDeferredRedirect();
  }

  isSuperuser(): boolean {
    return !!this.getUserData().is_superuser;
  }

  isStaffUser(): boolean {
    return !!this.getUserData().is_staff;
  }

  isAuthenticatedUser(): boolean {
    return !!this.getUserData().authenticated;
  }

  /**
   * Get basic information about the logged-in user in SSR-compatible manner. First try to access data through
   *   this.userData, and then fall back to data in userIdentity. This is necessary until userData is present
   *   when CSR fallback occurs.
   *
   * @return {Object} {
   *   authenticated: {Boolean},
   *   [id]: {Number},
   *   [fullName]: {String},
   * }
   */
  getUserData(): UserData {
    // Until we can guarantee that setUserData is always triggered, we need to use coursera.user
    // during CSR to guarantee that its there.
    if (typeof window !== 'undefined') {
      return {
        ...clientSideUserJson,
        // Because we could have a scenario where clientSideUserJson = {} we should ignore the ts-error
        // this is because if id is undefined the double negation will change it to a bolean pf false
        // @ts-ignore
        authenticated: !!clientSideUserJson.id,
        // @ts-ignore
        fullName: clientSideUserJson?.full_name,
      };
    } else {
      return this.userData;
    }
  }

  getRequestCountryCode(): string {
    // During SSR, this uses the requestCountryCode passed
    // through by the request header.

    // During CSR, this uses the requestCountryCode that was
    // injected into the DOM.

    // TODO: Unify this.
    return this.requestCountryCode || requestCountryCode;
  }

  getMobilePromoEligibility(): boolean {
    return this.mobilePromoEligible == null
      ? isFreshMobile(this.getUserAgent(), this.cookies)
      : this.mobilePromoEligible;
  }

  getUserAgent(): UserAgentInfo {
    return this.userAgent || userAgent;
  }

  /**
   * Ensure a user is authenticated. Because redirecting only works
   * on CSR, if the user is not authenticated during SSR, we will just
   * return false, and defer to the redirect on the client during
   * the hydration step.
   * TODO: Build a way to have render submit a redirect to the login
   * page with a post redirect back to the original page. That way we can
   * serve the login page much quicker than serving a fully rendered
   * page that redirects during rehydration.
   * @param {object} params
   * @param {'login'|'signup'} mode
   */
  ensureAuthenticatedByRedirect(params: any = {}) {
    if (this.getUserData().authenticated) {
      return true;
    } else if (this.inServerContext()) {
      this.deferredRedirectParams = {
        mode: params.mode,
        r: params.r,
      };
    } else {
      const mode = params.mode || (store && store.get && store.get('account.hasLoggedIn')) ? 'login' : 'signup';

      redirect.authenticate(mode, _.omit(params, 'mode'));
    }

    return false;
  }

  /**
   * @alias ensureAuthenticatedByRedirect
   */
  ensureAuthenticated(...args: any) {
    return this.ensureAuthenticatedByRedirect(...args);
  }

  /**
   * @private
   * Used in conjunction with `ensureAuthenticatedByRedirect`
   */
  handlePotentialDeferredRedirect() {
    if (this.deferredRedirectParams) {
      if (!this.deferredRedirectParams.r) {
        // If this 'r' param isn't defined once in CSR,
        // set the post redirect link to the current page
        // since we likely just want to load the same
        // page but just after the user has authenticated.
        this.deferredRedirectParams.r = window.location.href;
      }

      const mode =
        this.deferredRedirectParams.mode || (store && store.get && store.get('account.hasLoggedIn'))
          ? 'login'
          : 'signup';

      redirect.authenticate(mode, _.omit(this.deferredRedirectParams, 'mode'));

      delete this.deferredRedirectParams;
    }
  }
}

export default ApplicationStore;
