'use es6';

import { createAction } from 'flux-actions';
import { getIsOpen } from '../selectors/getIsOpen';
import * as ActionTypes from '../constants/VisitorActionTypes';
import { trackInteraction } from '../usage-tracking/actions/trackInteraction';
import { handleOpenChange } from '../post-message/handleOpenChange';
export var toggleOpenAction = createAction(ActionTypes.TOGGLE_OPEN, function (_ref) {
  var isOpened = _ref.isOpened,
      isUser = _ref.isUser;
  return {
    isOpened: isOpened,
    isUser: isUser || false
  };
});
export function toggleOpen(_ref2) {
  var isOpened = _ref2.isOpened,
      isUser = _ref2.isUser;
  return function (dispatch, getState) {
    if (isOpened !== getIsOpen(getState())) {
      var openActionMessage = isUser ? 'user open widget' : 'system open widget';
      dispatch(trackInteraction('widget-interaction', {
        action: isOpened ? openActionMessage : 'close widget'
      }));
      dispatch(toggleOpenAction({
        isOpened: isOpened,
        isUser: isUser
      }));
      handleOpenChange(isOpened, isUser);
    }
  };
}
export var clickedViralLink = createAction(ActionTypes.CLICK_VIRAL_LINK);