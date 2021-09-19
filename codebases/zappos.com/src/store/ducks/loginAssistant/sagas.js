import { put, takeEvery } from 'redux-saga/effects';

import { LOCATION_ASSIGN } from 'constants/appConstants';
import { CLOSED_LA_COOKIE } from 'constants/cookies';
import { REDIRECT, SET_FEDERATED_LOGIN_MODAL_VISIBILITY } from 'constants/reduxActions';
import { buildAuthenticationRedirectUrl } from 'utils/redirect';
import { setAndStoreCookie } from 'actions/session';
import {
  CLOSE_LA,
  LOGIN_FROM_LA,
  REDIRECT_FROM_LA
} from 'store/ducks/loginAssistant/types';
import marketplace from 'cfg/marketplace.json';
import { ABSOLUTE_URL_RE } from 'common/regex';

const { desktopBaseUrl, hasFederatedLogin } = marketplace;

export function* watchLoginFromLoginAssistant() {
  yield takeEvery(LOGIN_FROM_LA, workLoginFromLoginAssistant);
}

export function* watchRedirectFromLoginAssistant() {
  yield takeEvery(REDIRECT_FROM_LA, workRedirectFromLoginAssistant);
}

export function* workLoginFromLoginAssistant({ redirectPath }) {
  if (hasFederatedLogin) {
    yield put({
      type: SET_FEDERATED_LOGIN_MODAL_VISIBILITY,
      payload:  {
        isFederatedLoginModalShowing: true,
        returnTo: redirectPath
      }
    });
  } else {
    yield put({ type: REDIRECT, location: buildAuthenticationRedirectUrl(redirectPath), method: LOCATION_ASSIGN });
  }
}

export function* workRedirectFromLoginAssistant({ redirectPath }) {
  const isAbsoluteUrl = ABSOLUTE_URL_RE.test(redirectPath);
  const location = isAbsoluteUrl ? redirectPath : `${desktopBaseUrl}${redirectPath}`;
  yield put({ type: REDIRECT, location, method: LOCATION_ASSIGN });
}

export function* watchCloseLoginAssistant() {
  yield takeEvery(CLOSE_LA, workCloseLoginAssistant);
}

export function* workCloseLoginAssistant({ mockDate }) {
  const monthFromNow = mockDate || new Date();
  monthFromNow.setDate(monthFromNow.getDate() + 30);
  yield put(setAndStoreCookie(CLOSED_LA_COOKIE, 1, monthFromNow));
}

export default [
  watchCloseLoginAssistant,
  watchLoginFromLoginAssistant,
  watchRedirectFromLoginAssistant
];
