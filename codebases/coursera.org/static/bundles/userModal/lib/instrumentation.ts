import Q from 'q';
import _ from 'underscore';
import adsTracker from 'bundles/ads-tracking/lib';
import thirdPartyAuth from 'bundles/third-party-auth/lib';
import Multitracker from 'js/app/multitrackerSingleton';

const _trackV2 = function (event: $TSFixMe, data: $TSFixMe) {
  const deferred = Q.defer();
  Multitracker.pushV2([
    event,
    _(data || {}).extend({
      facebook_enabled: thirdPartyAuth.facebook.enabled,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'AppleID' does not exist on type 'Global'... Remove this comment to see the full error message
      apple_enabled: !!global.AppleID,
    }),
    deferred.resolve,
  ]);
  return deferred.promise;
};

const track = function (event: $TSFixMe) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  return _trackV2.bind(this, event);
};

const trackForAccountType = function (event: $TSFixMe) {
  return function (accountType?: string) {
    return _trackV2(event, { account_type: accountType || 'coursera' });
  };
};

const trackErrorWithNamespace = function (event: $TSFixMe, namespace: $TSFixMe) {
  return function (module: $TSFixMe, error: $TSFixMe) {
    const code = (error && (error.code || error.errorCode)) || error;
    return _trackV2(
      event,
      _(error)
        .chain()
        .omit('errorCode')
        .extend({
          code,
          module,
          namespace,
        })
        .value()
    );
  };
};

const trackUserModalError = trackErrorWithNamespace('system.error.emit', 'userModal');

const trackUserModalErrorForModule = function (module: $TSFixMe) {
  return trackUserModalError.bind(null, module);
};

const trackErrorForAccountType = function (module: $TSFixMe) {
  const _trackError = trackUserModalErrorForModule(module);
  return function (accountType: $TSFixMe, error: $TSFixMe) {
    _trackError(_({}).extend(error, { account_type: accountType }));
  };
};

const _allSettled = function (promises: $TSFixMe) {
  const promise = Q.allSettled(promises);
  promise.done();
  return promise;
};

const Instrumentation = {
  closeModal: track('account.wall.click.close'),

  loginLinkClick: track('account.wall.click.login'),
  loginSubmit: trackForAccountType('account.login_detail.click.submit'),
  loginSuccess: trackForAccountType('account.login_detail.emit.submit_success'),
  loginView: track('account.login_detail.render'),
  loginError: trackUserModalErrorForModule('login'),

  signupLinkClick: track('account.wall.click.signup'),
  signupSubmit: trackForAccountType('account.signup_detail.click.submit'),
  signupSuccess: trackForAccountType('account.signup_detail.emit.submit_success'),
  signupView: track('account.signup_detail.render'),
  signupError: trackUserModalErrorForModule('signup'),

  thirdPartyAllow: trackForAccountType('account.signup_social.click.allow'),
  thirdPartyLoginSubmit: trackForAccountType('account.wall_login.click.submit'),
  thirdPartySignupSubmit: trackForAccountType('account.wall_signup.click.submit'),
  thirdPartyError: trackErrorForAccountType('signup_social'),

  oneTapClose: track('account.one_tap.click.close'),
  oneTapView: track('account.one_tap.render'),

  requestEmailView: trackForAccountType('account.signup_social_request_email.render'),
  requestEmailSubmit: trackForAccountType('account.signup_social_request_email.click.submit'),
  requestEmailError: trackErrorForAccountType('signup_social_request_email'),

  requestPasswordView: trackForAccountType('account.signup_social_request_password.render'),
  requestPasswordSubmit: trackForAccountType('account.signup_social_request_password.click.submit'),
  requestPasswordError: trackErrorForAccountType('signup_social_request_password'),

  passwordResetRequestLinkClick: track('account.login_detail.click.recover_password'),
  passwordResetRequestSubmit: track('account.recover_password.click.submit'),
  passwordResetRequestView: track('account.forget_password.render'),
  passwordResetRequestError: trackUserModalErrorForModule('forget_password'),
  passwordCreateRequestView: track('account.create_password.render'),

  register: (userId: $TSFixMe, authType?: $TSFixMe) => {
    Multitracker.get('204').queue.push(['user', userId]);
    return _allSettled([Instrumentation.signupSuccess(authType), adsTracker.trackSignup(userId)]);
  },

  login: (authType?: $TSFixMe) => {
    return _allSettled([Instrumentation.loginSuccess(authType)]);
  },

  thirdPartyAuth: (authTypeArg: $TSFixMe, response: $TSFixMe) => {
    const userId = response?.userId;
    const authType = authTypeArg || response?.authType;
    const authResponse = response?.authResponse;
    const promises: Array<Q.Promise<any>> = [];
    if (response?.isRegistration) {
      promises.push(Instrumentation.register(userId, authType));
    } else {
      promises.push(Instrumentation.login(authType));
    }

    if (authType && _(authResponse || {}).has('grantedScopes')) {
      promises.push(Instrumentation.thirdPartyAllow(authType));
    }

    return _allSettled(promises);
  },
};

export default Instrumentation;
