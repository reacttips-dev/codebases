'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import { isClientInitializingOutboundCall, isClientRinging, isClientEnding } from 'calling-internal-common/widget-status/operators/getClientState';
import { getShouldShowActiveCallState, getShouldShowEndCallState } from 'calling-internal-common/widget-status/operators/getCallState';
import ActiveCallBar from '../../active-call-bar/components/ActiveCallBar';
import PostCallHeaderContainer from '../../post-call-actions/containers/PostCallHeaderContainer';

function WidgetHeader(_ref) {
  var clientStatus = _ref.clientStatus;
  var showActiveHeader = getShouldShowActiveCallState(clientStatus);
  var showEndHeader = getShouldShowEndCallState(clientStatus);
  var isInDisabledState = isClientInitializingOutboundCall(clientStatus) || isClientRinging(clientStatus) || isClientEnding(clientStatus);

  if (showActiveHeader) {
    return /*#__PURE__*/_jsx(ActiveCallBar, {
      disabled: isInDisabledState
    });
  } else if (showEndHeader) {
    return /*#__PURE__*/_jsx(PostCallHeaderContainer, {
      disabled: isInDisabledState
    });
  }

  return null;
}

WidgetHeader.propTypes = {
  clientStatus: ClientStatusPropType.isRequired
};
export default /*#__PURE__*/memo(WidgetHeader);