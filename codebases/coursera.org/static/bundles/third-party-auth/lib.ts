/* eslint-disable camelcase */
import Q from 'q';
import _ from 'underscore';
import api from 'bundles/third-party-auth/api';
import facebook from 'bundles/third-party-auth/facebook';
import apple from 'bundles/third-party-auth/apple';
import google from 'bundles/third-party-auth/google';
import googleOneTap from 'bundles/third-party-auth/googleOneTap';

export { facebook, apple, google };

/**
 *
 * Logs into Facebook / Apple and then either creates or links a Coursera account.
 *
 * @param {String} authType must be 'facebook' or 'apple'
 * @param {Object} [additionalData] e.g. {email} or {password}
 */
export const connect = (authType: $TSFixMe, additionalData?: $TSFixMe) => {
  if (authType === 'facebook') {
    return Q(facebook.getStatusOrLogin()).then((response) => {
      const authResponse = response?.authResponse;
      const authData = _({
        authType,
        token: authResponse?.accessToken,
      }).extend(additionalData || {});
      const grantedScopes = (authResponse?.grantedScopes || '').split(',');
      const grantedEmail = _(grantedScopes).contains('email') || _(grantedScopes).contains('contact_email');
      if (
        // if grantedScopes is not in authResponse, then this means the user has given permission to our app in the
        // past, and we don't need to request email again. This is the result of facebook.getLoginStatus
        !_(authResponse || {}).has('grantedScopes') ||
        // If grantedScopes is in authResponse, and the email permission was granted. This is the result of
        // facebook.login
        grantedEmail ||
        // If the email is supplied by the requestEmail form, after we requested an email from the user
        authData.email ||
        // If the password is supplied by the requestState, which mean we are linking accounts
        authData.password
      ) {
        return api.login(authData).then((userData) => {
          // TODO: Make sure user's full name is set on signup
          return _(userData).extend({ authType, authResponse });
        });
      } else {
        // The person has rejected giving us the permission for their email
        return Q.reject({ code: 'noEmailAvailable' });
      }
    });
  } else if (authType === 'apple') {
    return Q(apple.getStatusOrLogin()).then((response) => {
      const code = response?.authorization?.code;
      const email = response?.user?.email;
      const name = response?.user?.name;

      // Names only come in from response separately, so we need to concatenate them into one full name
      const fullName = [name?.firstName, name?.middleName, name?.lastName].filter(Boolean).join(' ');

      const authDataObj = email
        ? {
            authType,
            token: code,
            email,
          }
        : {
            authType,
            token: code,
          };

      const authData = _(authDataObj).extend(additionalData || {});

      if (authData?.token) {
        return api.login(authData).then((userData) => {
          const { isRegistration, userId } = userData;

          // Only update user's full name on initial signup
          if (isRegistration === true && !!fullName) {
            api.updateProfileName(userId, fullName);
          }

          return _(userData).extend({ authType });
        });
      } else {
        return Q.reject({ code: 'unknownStatus' });
      }
    });
  } else if (authType === 'google') {
    return Q(google.getStatusOrLogin()).then((response) => {
      const { code, email } = response;
      const authData = _({
        authType,
        token: code,
        email,
      }).extend(additionalData || {});

      const grantedEmail = authData.email || email;

      if (grantedEmail) {
        return api.login({ ...authData, email: grantedEmail }).then(function (userData) {
          return _(userData).extend({ authType, response });
        });
      } else {
        // The person has rejected giving us the permission for their email
        return Q.reject({ code: 'noEmailAvailable' });
      }
    });
  } else if (authType === 'googleOneTap') {
    return Q(googleOneTap.getStatusOrLogin()).then((response) => {
      const { code } = response;
      const authData = _({
        authType,
        token: code,
      }).extend(additionalData || {});

      if (authData?.token) {
        return api.login(authData).then(function (userData) {
          return _(userData).extend({ authType, response });
        });
      } else {
        // The person has rejected giving us the permission for their email
        return Q.reject({ code: 'noEmailAvailable' });
      }
    });
  } else if (authType === 'saml' || authType === 'jwt' || authType === 'jwtInvite') {
    const authData = Object.assign(
      {
        authType,
        token: additionalData.token,
      },
      additionalData || {}
    );
    return api.login(authData).then((userData) => {
      return _(userData).extend({ authType });
    });
  } else {
    return Q.reject({ code: 'unknownAuthType', authType });
  }
};

export const getLinkedAccounts = () => {
  return api.list();
};

// Used to link existing coursera accounts with a third party account
export const link = (authType: $TSFixMe, additionalData?: $TSFixMe): Q.Promise<{ returnTo: string }> => {
  if (authType === 'facebook') {
    return Q(facebook.getStatusOrLogin()).then((response) => {
      const authResponse = response.authResponse;
      const authData = _({
        authType,
        token: authResponse.accessToken,
      }).extend(additionalData || {});
      return api.link(authData) as any;
    });
  } else if (authType === 'apple') {
    return Q(apple.getStatusOrLogin()).then((response) => {
      const code = response?.authorization?.code;

      const authData = _({
        authType,
        token: code,
      }).extend(additionalData || {});

      return api.link(authData) as $TSFixMe;
    });
  } else if (authType === 'google') {
    return Q(google.getStatusOrLogin()).then((response) => {
      const { code, email } = response;
      const authData = _({
        authType,
        token: code,
        email,
      }).extend(additionalData || {});

      return api.link(authData) as $TSFixMe;
    });
  } else if (authType === 'saml' || authType === 'jwt' || authType === 'jwtInvite') {
    const authData = Object.assign(
      {
        authType,
        token: additionalData.token,
      },
      additionalData || {}
    );
    return api.link(authData) as $TSFixMe;
  } else if (authType === 'zoom') {
    // TODO: (billy) construct data needed for API call when BE is ready.
    return Q.reject({ code: 'zoom', authType });
  } else {
    return Q.reject({ code: 'unknownAuthType', authType });
  }
};

export const delink = (authType: $TSFixMe, additionalData: $TSFixMe) => {
  return api.delink(authType, additionalData);
};

export const addAlternateEmail = (authType: $TSFixMe, additionalData: $TSFixMe, email: string) => {
  if (authType === 'saml' || authType === 'jwt' || authType === 'jwtInvite') {
    return api.findIdFromEmail(email).then((response) => {
      const userId = response.elements[0].userId;
      const newData = Object.assign({ userId }, additionalData);
      return api.addAlternateEmail(newData);
    });
  } else {
    return Q.reject();
  }
};

export default {
  facebook,
  apple,
  connect,
  getLinkedAccounts,
  link,
  delink,
  addAlternateEmail,
};
