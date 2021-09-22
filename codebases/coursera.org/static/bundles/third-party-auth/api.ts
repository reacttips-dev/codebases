import Q from 'q';
import _ from 'underscore';
import constants from 'bundles/third-party-auth/constants';
import memoize from 'js/lib/memoize';
import path from 'js/lib/path';
import api from 'pages/auth/common/api/api';

const _apiCall = function (method: keyof typeof api, ...args: $TSFixMe) {
  // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
  return Q(api[method](...args))
    .then((response) => {
      try {
        return _.isString(response) ? JSON.parse(response) : response;
      } catch (e) {
        return response;
      }
    })
    .catch((xhr) => {
      try {
        return Q.reject(JSON.parse(xhr.responseText));
      } catch (e) {
        return Q.reject({ code: xhr.responseText });
      }
    });
};

const exported = {
  list: memoize(function () {
    return _apiCall('get', constants.naptimeResource);
  }),

  login(data: $TSFixMe): Q.Promise<{ isRegistration: boolean; userId: number }> {
    return _apiCall('post', constants.authApi, { data }) as $TSFixMe;
  },

  link(data: $TSFixMe) {
    return _apiCall('post', constants.linkApi, { data });
  },

  delink(id: $TSFixMe, data: $TSFixMe) {
    const apiPath = path.join(constants.naptimeResource, id);
    return _apiCall('delete', apiPath, { data });
  },

  addAlternateEmail(data: $TSFixMe) {
    return _apiCall('post', constants.alternateEmailApi, { data });
  },

  findIdFromEmail(email: $TSFixMe, data?: $TSFixMe): Q.Promise<{ elements: { userId: number }[] }> {
    const apiPath = path.join(constants.userEmailsApi, `${email}?fields=userId`);
    return _apiCall('get', apiPath, { data }) as $TSFixMe;
  },

  updateProfileName(userId: $TSFixMe, fullName: string) {
    const apiPath = path.join(constants.profilesApi, userId);
    const data = {
      userId,
      externalId: '',
      fullName,
    };

    return _apiCall('put', apiPath, { data });
  },
};

export default exported;

export const { list, login, link, delink, addAlternateEmail, findIdFromEmail } = exported;
