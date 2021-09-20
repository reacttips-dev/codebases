/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cookie = require('js-cookie');
const _ = require('underscore');
const Language = require('@trello/locale');
const Session = require('@trello/session-cookie');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.Auth = new ((function () {
  let idNotLoggedIn = undefined;
  let memberId = undefined;
  const Cls = class {
    static initClass() {
      idNotLoggedIn = 'notLoggedIn';
      memberId = Session.memberId || idNotLoggedIn;
    }

    isLoggedIn() {
      return memberId !== idNotLoggedIn;
    }
    myId() {
      return memberId;
    }
    myUsername() {
      return __guard__(this.me(), (x) => x.get('username'));
    }
    myToken() {
      return Session.token;
    }
    myLocale() {
      // Server doesn't do validation on locales so we can't trust this has been
      // normalized already i.e. it could be ja_jp when we generally want ja-jp
      const locale = __guard__(
        __guard__(this.me(), (x1) => x1.get('prefs')),
        (x) => x.locale,
      );
      if (locale) {
        return Language.normalizeLocale(locale);
      } else {
        return locale;
      }
    }
    me() {
      // Dependency required at call site to avoid import cycles, do not lift to top of module
      const { ModelCache } = require('app/scripts/db/model-cache');
      let me = ModelCache.get('Member', memberId);
      if (me == null && !this.isLoggedIn()) {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const { Member } = require('app/scripts/models/member');
        me = new Member(
          { id: idNotLoggedIn, notLoggedIn: true },
          { modelCache: ModelCache },
        );
        ModelCache.add(me);
      }
      return me;
    }
    // Returns true if the member or member id passed in is the logged in member
    isMe(memberOrId) {
      if (memberOrId != null ? memberOrId.id : undefined) {
        return this.isMe(memberOrId.id);
      } else {
        return memberOrId === memberId;
      }
    }

    confirmed() {
      return this.me().get('confirmed');
    }

    canLogIn() {
      let left;
      return !_.isEmpty(
        (left = __guard__(this.me(), (x) => x.get('loginTypes'))) != null
          ? left
          : [],
      );
    }

    logoutPost(returnUrl) {
      const form = document.createElement('form');
      form.method = 'post';
      form.action = '/logout';
      form.style = 'display:none';

      const dscInput = document.createElement('input');
      dscInput.name = 'dsc';
      dscInput.value = Cookie.get('dsc');

      form.appendChild(dscInput);

      if (returnUrl != null) {
        const returnUrlInput = document.createElement('input');
        returnUrlInput.name = 'returnUrl';
        returnUrlInput.value = returnUrl;

        form.appendChild(returnUrlInput);
      }

      // A cookie alone is not enough, because that leaves us
      // vulnerable to CSRF.
      return document.body.appendChild(form).submit();
    }

    removeToken() {
      Session.clearCookie();
      return window.location.reload();
    }
  };
  Cls.initClass();
  return Cls;
})())();
