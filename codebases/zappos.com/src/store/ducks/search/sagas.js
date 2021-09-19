import { call, put, select, takeLatest } from 'redux-saga/effects';

import { getSymphonySearchComponents } from 'apis/mafia';
import { trackError } from 'helpers/ErrorUtils';
import {
  BEGIN_FETCH_SYMPHONY_SEARCH_COMPONENTS,
  FETCH_SYMPHONY_SEARCH_COMPONENTS_ERROR,
  RECEIVE_SYMPHONY_SEARCH_COMPONENTS
} from 'store/ducks/search/types';

export function* workFetchSymphonySearchComponents() {
  try {
    const { environmentConfig: { api: { mafia } }, client: { request }, cookies, filters: { term, breadcrumbs } } = yield select();
    // Currently in the beginning phase of bads, we don't want to display banners if a search terms is filtered down, so bail out early
    if (breadcrumbs?.length > 0) {
      return;
    }
    const response = yield call(getSymphonySearchComponents, mafia, { term }, cookies, request);
    const data = yield response.json();
    yield put({ type: RECEIVE_SYMPHONY_SEARCH_COMPONENTS, payload: { data, term } });
  } catch (error) {
    yield put({ type: FETCH_SYMPHONY_SEARCH_COMPONENTS_ERROR, payload: { error } });
    yield call(trackError, 'NON-FATAL', 'Could not retrieve symphony search components', error);
  }
}

export function* watchFetchSymphonySearchComponents() {
  yield takeLatest(BEGIN_FETCH_SYMPHONY_SEARCH_COMPONENTS, workFetchSymphonySearchComponents);
}

export default [watchFetchSymphonySearchComponents]
;
