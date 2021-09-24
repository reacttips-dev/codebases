'use es6';

import { createAction } from 'flux-actions';
import { TRACK_USER_INTERACTION } from '../constants/VisitorActionTypes';
import { getUserInteractedWithWidget } from '../selectors/getUserInteractedWithWidget';
export function trackUserInteraction() {
  return function (dispatch, getState) {
    if (!getUserInteractedWithWidget(getState())) {
      if (window.newrelic && window.newrelic.addPageAction && window.newrelic.setCustomAttribute) {
        window.newrelic.addPageAction('userInteractedWithWidget');
        window.newrelic.setCustomAttribute('interactedWithWidget', true);
      }
    }

    dispatch(createAction(TRACK_USER_INTERACTION)());
  };
}