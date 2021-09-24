'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useCallback, memo } from 'react';
import CallingWidgetErrorMessage from './CallingWidgetErrorMessage';
import { RELOAD_EMBED_MSG } from 'calling-internal-common/iframe-events/InternalIframeEventTypes';
import { logPageAction } from 'calling-error-reporting/report/error';
import { VIEWED_INITIALIZATION_ERROR } from '../../constants/pageActionKeys';

function CallingWidgetError(_ref) {
  var embeddedContext = _ref.embeddedContext;
  useEffect(function () {
    logPageAction({
      key: VIEWED_INITIALIZATION_ERROR
    });
  }, []);
  var handleResetWidget = useCallback(function () {
    embeddedContext.sendMessage(RELOAD_EMBED_MSG);
  }, [embeddedContext]);
  return /*#__PURE__*/_jsx(CallingWidgetErrorMessage, {
    onReset: handleResetWidget
  });
}

export default /*#__PURE__*/memo(CallingWidgetError);