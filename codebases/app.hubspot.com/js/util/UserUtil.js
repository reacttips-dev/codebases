'use es6';

import userInfo from 'hub-http/userInfo';
import Raven from 'Raven';
var cachedInfo;

function getInfo() {
  return cachedInfo ? Promise.resolve(cachedInfo) : userInfo().then(function (info) {
    Raven.setUserContext({
      id: info.user.user_id,
      email: info.user.email,
      locale: info.user.locale
    });
    cachedInfo = info;
    return info;
  });
}

function getCurrentUser() {
  return getInfo().then(function (info) {
    return info.user;
  });
}

function getGates() {
  return getInfo().then(function (info) {
    return info.gates;
  });
}

export function hasGate(gate) {
  return getGates().then(function (gates) {
    return gates.indexOf(gate) > -1;
  });
}
export function hasGateSync(gate) {
  return cachedInfo && cachedInfo.gates.indexOf(gate) > -1;
}
export function getCurrentUserId() {
  return getCurrentUser().then(function (user) {
    return user.user_id;
  });
}