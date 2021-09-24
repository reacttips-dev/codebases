'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { setProp, broadcastProp } from '../../lib/propTypes';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import { BROADCAST_ACTION_TYPES, ACTIONS_TO_LABEL } from '../../lib/constants';

function CloneBroadcastButton(_ref) {
  var broadcast = _ref.broadcast,
      actions = _ref.actions,
      onClone = _ref.onClone;
  var onCloneBroadcast = useCallback(function () {
    onClone(broadcast);
  }, [onClone, broadcast]);

  if (!actions.get(BROADCAST_ACTION_TYPES.CLONE)) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIButton, {
    use: "tertiary-light",
    size: "sm",
    onClick: onCloneBroadcast,
    "data-test-id": "broadcast-action-CLONE",
    children: I18n.text(ACTIONS_TO_LABEL[BROADCAST_ACTION_TYPES.CLONE])
  });
}

CloneBroadcastButton.propTypes = {
  broadcast: broadcastProp,
  actions: setProp,
  onClone: PropTypes.func.isRequired
};
export default CloneBroadcastButton;