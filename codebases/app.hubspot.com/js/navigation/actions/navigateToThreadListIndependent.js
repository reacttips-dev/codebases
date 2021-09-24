'use es6';

import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { clearSelectedThread } from '../../selected-thread/actions/clearSelectedThread';
import { updateView } from '../../current-view/actions/updateView';
import { THREAD_LIST } from '../../current-view/constants/views';
import { trackUserInteraction } from '../../actions/trackUserInteraction';
export function navigateToThreadListIndependent() {
  return function (dispatch) {
    dispatch(trackUserInteraction());
    dispatch(clearSelectedThread());
    dispatch(updateView(THREAD_LIST));
    dispatch(trackInteraction('widget-interaction', {
      action: 'view thread list'
    }));
  };
}