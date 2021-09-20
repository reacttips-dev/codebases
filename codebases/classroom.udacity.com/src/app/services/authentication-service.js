import Hoth from '@udacity/ureact-hoth';
import cookies from 'js-cookie';

var REDIRECT_TO_KEY = '_auth_redirect_to';

export default {
    signOut() {
        Hoth.signOut();
    },

    authenticationRequired(location, replaceWith) {
        if (!this.isAuthenticated()) {
            this.authenticate(location);
            replaceWith('/loading');
        }
    },

    authenticate(location) {
        var returnUrl = location.pathname;

        // There's a race condition that could happen where the ajaxPrefilter
        // and the AuthenticationRequired mixin both fire, causing us to set the return
        // redirect twice, the second time being to /loading.
        // The simplest fix is to just ignore it when we try to set it.
        if (returnUrl !== '/loading') {
            cookies.set(REDIRECT_TO_KEY, returnUrl);
        }

        Hoth.authenticate({
            env: CONFIG.hothEnv,
            returnUrl: this._authenticationReturnUrl(),
            authType: '/sign-in',
        });
    },

    getNextPath() {
        return cookies.get(REDIRECT_TO_KEY);
    },

    clearNextPath() {
        cookies.remove(REDIRECT_TO_KEY);
    },

    isAuthenticated() {
        return Hoth.isAuthenticated();
    },

    getCurrentUser() {
        return Hoth.getCurrentUser();
    },

    getCurrentUserId() {
        return Hoth.getCurrentUserId();
    },

    getJWTToken() {
        return Hoth.getJWT();
    },

    _authenticationReturnUrl() {
        var {
            location
        } = window;
        return `${location.protocol}//${location.host}/authenticated`;
    },
};