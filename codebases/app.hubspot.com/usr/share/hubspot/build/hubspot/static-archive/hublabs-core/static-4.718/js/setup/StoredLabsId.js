'use es6';

import { getCookie, setCookie } from '../lib/cookieHelper';
import getPreferredUserId from '../lib/getPreferredUserId';
var LABS_LOCAL_ID = 'LocalSettings:Sales:LID';
var LABS_COOKIE_ID = '__hssluid';
export function setStoredLabsId() {
  var labsId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  setCookie(LABS_COOKIE_ID, labsId);

  try {
    if (window.localStorage) {
      window.localStorage[LABS_LOCAL_ID] = labsId;
    }
  } catch (e) {
    /* do nothing */
  }

  return labsId;
}
export function getStoredLabsId() {
  var labsId;

  try {
    labsId = window.localStorage[LABS_LOCAL_ID];
  } catch (e) {
    labsId = getCookie(LABS_COOKIE_ID);
  }

  if (!labsId) {
    labsId = setStoredLabsId(getPreferredUserId());
  }

  return labsId;
}