'use es6';

import { Set as ImmutableSet } from 'immutable';
import once from 'transmute/once';
import userInfo from 'hub-http/userInfo';
var userScopes = once(function () {
  return userInfo().then(function (_ref) {
    var scopes = _ref.user.scopes;
    return ImmutableSet(scopes);
  });
});
export { userScopes };