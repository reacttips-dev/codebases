'use es6';

import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { loadStagedThread } from './loadStagedThread';
export function navigateToStagedThread() {
  return function (dispatch) {
    dispatch(loadStagedThread());
    dispatch(trackInteraction('widget-interaction', {
      action: 'create new thread'
    }));
  };
}