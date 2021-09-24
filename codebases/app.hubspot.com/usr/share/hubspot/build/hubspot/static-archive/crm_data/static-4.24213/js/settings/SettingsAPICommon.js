'use es6';

import invariant from 'react-utils/invariant';
export function enforceKey(key) {
  invariant(typeof key === 'string' && key.length > 0, 'SettingsAPI: expected key to be a non-empty string but got "%s"', key);
}
export function enforcePortalId(portalId) {
  invariant(typeof portalId === 'number', 'SettingsAPI: expected portalId to be a number but got %s', portalId);
}