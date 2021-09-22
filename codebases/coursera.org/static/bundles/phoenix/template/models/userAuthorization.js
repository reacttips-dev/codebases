/**
 * DEPRECATED: This model is deprecated because it is a singleton, and thus not SSR-friendly.
 * Please use `js/lib/user` instead. See https://coursera.atlassian.net/wiki/spaces/EN/pages/48169596/Common+pitfalls
 */

/**
 * Immutable Singleton UserAuthorization contains information about the user's authorization.
 *
 * attributes:
 *  authenticated: Boolean
 *  is_staff: Boolean
 *  is_superuser: Boolean
 *  is_poweruser: Boolean
 */
import Backbone from 'backbone';

import _ from 'lodash';
import makeImmutableModel from 'bundles/phoenix/template/models/backbone.immutable';
import Multitracker from 'js/app/multitrackerSingleton';
import redirect from 'js/lib/coursera.redirect';
import store from 'js/lib/coursera.store';
import userJson from 'bundles/user-account/common/user';

const defaultMode = store.get('account.hasLoggedIn') ? 'login' : 'signup';

const UserAuthorization = Backbone.Model.extend({
  initialize() {
    if (this.get('authenticated')) {
      store.setIfEnabled('account.hasLoggedIn', true);
    }
  },

  // Parses the user.json returned by django
  parse(userJson) {
    if (_.isEmpty(userJson)) {
      // user is not authenticated
      return {
        authenticated: false,
        is_staff: false,
        is_superuser: false,
        is_poweruser: false,
      };
    } else {
      // user is authenticated
      return _.extend(_.pick(userJson, ['is_staff', 'is_superuser', 'is_poweruser']), {
        authenticated: true,
      });
    }
  },

  isStaffOrSuperuser() {
    return this.get('is_staff') || this.get('is_superuser') || this.get('is_poweruser');
  },

  isStaff() {
    return this.get('is_staff');
  },

  isSuperuser() {
    return this.get('is_superuser') || this.get('is_poweruser');
  },

  /**
   * Returns true if the user is authenticated. Returns false and pops up a modal prompting the user to log in
   * or sign up if the user is not authenticated.
   * @param {?Object} params - A map of parameters.
   *   - mode: 'login' or 'signup'. Display the modal in the specified mode. Defaults to 'signup'
   *   - redirectUrl: A URL string or null. If null, reload the page after logging in or signing up.
         Otherwise, redirect to the specified URL. Defaults to null.
   * @return {Boolean} True if the user is already authenticated, or false otherwise.
   */
  ensureAuthenticated(params) {
    if (this.get('authenticated')) {
      return true;
    }

    params = _.extend(
      {
        mode: defaultMode,
        redirectUrl: null,
      },
      params
    );

    if (params.mode === 'login') {
      Multitracker.pushV2(['open_course.user.login_modal.open']);
    } else if (params.mode === 'signup') {
      Multitracker.pushV2(['open_course.user.signup_modal.open']);
    }

    return false;
  },

  /**
   * Like `ensureAuthenticated` but uses redirect instead of modal. Also defaults
   * to /signup
   *
   * @returns {Boolean} true if the user is authenticated. Otherwise returns false and
   * asynchronously authenticates the user.
   */
  ensureAuthenticatedByRedirect(params) {
    if (this.get('authenticated')) {
      return true;
    }

    Multitracker.pushV2(['open_course.user.redirected_to_login']);

    const mode = (params && params.mode) || defaultMode;

    redirect.authenticate(mode, _.omit(params, 'mode'));

    return false;
  },
});

const ImmutableUserAuthorization = makeImmutableModel(UserAuthorization);
const userAuthorizationSingleton = new ImmutableUserAuthorization(userJson, {
  parse: true,
});
export default userAuthorizationSingleton;
