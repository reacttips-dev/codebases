'use es6';

import { useEffect, useCallback } from 'react';
/**
 * This implements support for the web visibility API:
 *   https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 *
 * @example
 * function MyPollingComponent() {
 *   // assumes we have startPolling() and stopPolling() methods defined
 *   useVisibilityChange({
 *     onVisible: startPolling,
 *     onHidden: stopPolling,
 *   });
 *   return <Results />;
 * }
 */

export function useVisibilityChange(_ref) {
  var _ref$enabled = _ref.enabled,
      enabled = _ref$enabled === void 0 ? true : _ref$enabled,
      onVisible = _ref.onVisible,
      onHidden = _ref.onHidden;
  var handleVisibilityChange = useCallback(function () {
    if (document.visibilityState !== 'visible') {
      onHidden();
    } else {
      onVisible();
    }
  }, [onHidden, onVisible]); // We only want to trigger the effect if the user has polling enabled, but
  // eslint doesn't like that so we can disable the rule as a workaround.
  // React doesn't care about the conditional return type so neither should we
  // eslint-disable-next-line consistent-return

  useEffect(function () {
    if (enabled) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return function () {
        return document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [enabled, handleVisibilityChange]);
}