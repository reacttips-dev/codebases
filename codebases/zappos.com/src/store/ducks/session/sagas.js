import { call, put, select, takeEvery } from 'redux-saga/effects';

import { SESSION_RECEIVED } from './types';

import {
  MAFIA_SESSION_ID,
  MAFIA_SESSION_TOKEN,
  MAFIA_UBID_MAIN
} from 'constants/apis';
import { sessionExpiration, setAndStoreCookie } from 'actions/session';

export function* withSession(args) {
  const result = yield call(...args);
  const { session } = result;
  yield put({ type: SESSION_RECEIVED, session });
  return result;
}

export function* watchSessionReceived() {
  yield takeEvery(SESSION_RECEIVED, action => setSession(action));
}

export function* setSession(action) {
  const { session } = action;
  const state = yield select();
  const responseUbidMain = session.get(MAFIA_UBID_MAIN);
  const responseSessionId = session.get(MAFIA_SESSION_ID);
  const responseSessionToken = session.get(MAFIA_SESSION_TOKEN);
  if (state.cookies && responseUbidMain && responseSessionId && responseSessionToken) {
    const { cookies: { 'session-id': sessionId, 'ubid-main': ubidMain, 'session-token': sessionToken } } = state;

    // mafia and marty sessions match - so don't set cookies
    if (ubidMain === responseUbidMain && sessionId === responseSessionId && sessionToken === responseSessionToken) {
      return;
    }
  }

  const expiration = sessionExpiration();
  if (responseSessionId) {
    yield put(setAndStoreCookie('session-id', responseSessionId, expiration));
  }

  if (responseSessionToken) {
    yield put(setAndStoreCookie('session-token', responseSessionToken, expiration));
  }

  if (responseUbidMain) {
    yield put(setAndStoreCookie('ubid-main', responseUbidMain, expiration));
  }
}

export default [watchSessionReceived];
