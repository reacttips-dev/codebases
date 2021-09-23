'use es6';

import { loadAndOpenSalesChatInWindow } from 'ui-addon-upgrades/_core/utils/loadAndOpenSalesChat';
import { useEffect } from 'react';
import Raven from 'Raven';
import { tracker } from '../tracker';
import { isCrossOriginFrame } from './parentWindowUtils';
export var useForwardSalesChatEvent = function useForwardSalesChatEvent() {
  useEffect(function () {
    /// This is kinda weird – ui-addon-upgrades fires an event to the parent
    /// so we have to attach a listener there. BUT we can't include
    /// ui-addon-upgrades in the Navbar, so we're firing ANOTHER event to here.
    ///
    /// However, we can't show the chat if the iframe has a different origin
    /// than the root page, so we have to validate that first.
    var crossOrigin = isCrossOriginFrame();

    if (crossOrigin) {
      console.warn('The trial banner is being loaded from a cross-origin domain.\nSome features may not be supported');
    }

    window.addEventListener('message', function (event) {
      if (event.data.type === 'OPEN_CHAT') {
        var _event$data = event.data,
            upgradeData = _event$data.upgradeData,
            isRetail = _event$data.isRetail,
            isAssignable = _event$data.isAssignable;
        tracker.track('interaction', {
          action: 'ttsInModalClick',
          domain: document.domain,
          isCrossOrigin: !!crossOrigin
        });

        if (crossOrigin) {
          Raven.captureMessage('TTS chat activation from cross-origin', {
            extra: {
              'iframe origin': window.location.origin,
              referrer: document.referrer,
              domain: document.domain,
              error: crossOrigin
            }
          });
          return;
        }

        loadAndOpenSalesChatInWindow(window.parent)({
          upgradeData: upgradeData,
          isRetail: isRetail,
          isAssignable: isAssignable
        });
      }
    });
  }, []);
};