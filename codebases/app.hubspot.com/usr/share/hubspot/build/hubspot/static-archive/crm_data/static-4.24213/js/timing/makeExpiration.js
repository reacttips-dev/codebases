'use es6';

import invariant from 'react-utils/invariant';
export default function makeExpiration(milliseconds) {
  var lastCheck = 0;
  invariant(typeof milliseconds === 'number', 'makeExpiration: milliseconds must be a number, but got type "%s"', typeof milliseconds);
  return function isExpired() {
    var now = Date.now();
    var expired = now - lastCheck > milliseconds;
    lastCheck = now;
    return expired;
  };
}