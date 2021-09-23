'use es6';

import getPreferredUserId from '../lib/getPreferredUserId';
import { getStoredLabsId, setStoredLabsId } from './StoredLabsId';

var _userId = getStoredLabsId();

var _arbitraryProps = {};
export function registerArbitraryProps(key, value) {
  _arbitraryProps[key] = value;
}
export function getArbitraryProps() {
  return _arbitraryProps;
}
export function registerUser(userIdentifier) {
  var preferredId = getPreferredUserId(userIdentifier);
  setStoredLabsId(preferredId);
  _userId = preferredId;
}
export function getUserId() {
  if (!_userId) {
    return getStoredLabsId() || null;
  }

  if (typeof _userId === 'function') {
    return _userId(_arbitraryProps);
  }

  return _userId;
}