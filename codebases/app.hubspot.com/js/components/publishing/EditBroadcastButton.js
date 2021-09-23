'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProp, broadcastProp } from '../../lib/propTypes';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import { BROADCAST_ACTION_TYPES, ACTIONS_TO_LABEL, EDIT_SUPPORTED_STATUS_TYPES } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
import { openBroadcast } from '../../redux/actions/broadcastGroup';
import { getCanEditBroadcast } from '../../redux/selectors/broadcasts';

function EditBroadcastButton(_ref) {
  var broadcast = _ref.broadcast,
      actions = _ref.actions;

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  var dispatch = useDispatch();
  var canEditBroadcast = useSelector(function (state) {
    return getCanEditBroadcast(state, broadcast.broadcastGuid);
  });
  var onEditBroadcast = useCallback(function () {
    if (EDIT_SUPPORTED_STATUS_TYPES.includes(broadcast.getStatusType()) && canEditBroadcast) {
      trackInteraction('edit broadcast');
      dispatch(openBroadcast(broadcast.broadcastGuid));
    }
  }, [broadcast, canEditBroadcast, trackInteraction, dispatch]);

  if (!actions.get(BROADCAST_ACTION_TYPES.EDIT)) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIButton, {
    use: "tertiary-light",
    size: "sm",
    onClick: onEditBroadcast,
    "data-test-id": "broadcast-action-EDIT",
    children: I18n.text(ACTIONS_TO_LABEL[BROADCAST_ACTION_TYPES.EDIT])
  });
}

EditBroadcastButton.propTypes = {
  broadcast: broadcastProp,
  actions: setProp
};
export default EditBroadcastButton;