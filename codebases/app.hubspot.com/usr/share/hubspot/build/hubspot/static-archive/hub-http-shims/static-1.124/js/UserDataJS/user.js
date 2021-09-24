'use es6';

import { Promise } from 'hub-http/helpers/promise';
import userInfo from 'hub-http/userInfo';
import modelShim from '../modelShim';
var currentUser;

var userShim = function userShim(user) {
  return Object.assign(modelShim(user, 'user_id'), {
    hasScope: function hasScope(scope) {
      if (!this.get('scopes')) throw new Error('User data has not been loaded yet');
      return this.get('scopes').indexOf(scope) !== -1;
    },
    hasRole: function hasRole(role) {
      if (!this.get('roles')) {
        throw new Error('User data has not been loaded yet');
      }

      return this.get('roles').indexOf(role) !== -1;
    },
    hasHostAccess: function hasHostAccess() {
      return this.hasRole('host') || this.hasScope('super-user');
    }
  });
};

var User = {
  get: function get() {
    return currentUser;
  },
  then: function then() {
    var _Promise$resolve, _userInfo$then;

    if (currentUser) return (_Promise$resolve = Promise.resolve(currentUser)).then.apply(_Promise$resolve, arguments);
    return (_userInfo$then = userInfo().then(function (_ref) {
      var user = _ref.user;
      currentUser = userShim(user);
      return currentUser;
    })).then.apply(_userInfo$then, arguments);
  }
};
export default User;