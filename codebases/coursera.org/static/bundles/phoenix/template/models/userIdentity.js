/**
 * Immutable Singleton UserIdentity contains information about the user's idenity.
 *
 * attributes:
 *  authenticated: String, whether the user has authenticated
 *  id: Optional Number, the user's id (if authenticated)
 *  full_name: Optional String, the user's full name (if authenticated)
 *  email_address: Optional String, the user's email (if authenticated)
 */

import Backbone from 'backbone';

import Q from 'q';
import _ from 'lodash';
import { config } from 'bundles/phoenix/constants';
import Multitracker from 'js/app/multitrackerSingleton';
import api from 'pages/auth/common/api/api';
import userJson from 'bundles/user-account/common/user';

const UserIdentity = Backbone.Model.extend({
  initialize() {
    if (this.get('authenticated')) {
      const userId = this.get('id');
      Multitracker.get('204').queue.push(['user', userId]);
    }
  },

  hasProfile() {
    return this.get('privacy') !== -1 && this.has('external_id');
  },

  getProfileUrl() {
    const url = this.hasProfile() ? 'user/' + this.get('external_id') : 'account-profile';
    return config.dir.home + url;
  },

  // Parses the user.json returned by django.
  parse(userJsonData) {
    if (_.isEmpty(userJsonData)) {
      // user is not authenticated
      return {
        authenticated: false,
      };
    } else {
      // user is authenticated
      return _.extend(
        _.pick(userJsonData, [
          'display_name',
          'email_address',
          'external_id',
          'full_name',
          'id',
          'is_superuser',
          'privacy',
          'photo',
          'photo_120',
          'email_verified',
          'generated_password',
        ]),
        {
          authenticated: true,
        }
      );
    }
  },

  /**
   * Can be used to update the user identity without refreshing the page.
   */
  update() {
    const deferred = Q.defer();
    api
      .get(config.url.origin + 'api/user/info')
      .then(
        function (userData) {
          this.set(this.parse(userData));
          deferred.resolve(this);
        }.bind(this)
      )
      .fail(function (err) {
        deferred.reject(err);
      });

    return deferred.promise;
  },
});

const userIdentitySingleton = new UserIdentity(userJson, {
  parse: true,
});
export default userIdentitySingleton;
