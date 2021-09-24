import { useEffect, useCallback } from 'react';
import { tracker } from '../_core/common/eventTracking/tracker';
import { getFrameSrc, getUpgradePointPromise, getTrackingProperties, upgradePointViews } from './utils';
import { useModalFrame } from '../useModalFrame';
import { LoadingModal } from 'ui-addon-upgrades/_core/common/components/LoadingModal';
import { UpgradeMessageEventKeys } from 'ui-addon-upgrades/_core/common/constants/upgradeMessageEventKeys';
/**
 * ## Upgrade Management System
 *
 * `useUpgradeModal` takes your upgrade key as an argument and returns a callback
 * to open the upgrade modal. Upgrade keys can be created and managed in the
 * [Upgrade Management System](<https://tools.hubteamqa.com/ums>) (`go/ums`).
 *
 *
 * _Note that if you are using `useUpgradeModal` from inside of an iframe,
 * you will need to call `useUpgradeEventListener` in the top-most window
 * of your application. This will allow your upgrade modal to open in the
 * top window instead of opening inside of the iframe._
 *
 * @example
 * ```tsx
 * const YourComponent = () => {
 *  const { openUpgradeModal } = useUpgradeModal('your-upgrade-key');
 *
 *  return <UIButton onClick={openUpgradeModal} />;
 * }
 * ```
 */

export function useUpgradeModal(upgradeKey) {
  var frameSrc = getFrameSrc(upgradeKey);
  var upgradePointPromise = getUpgradePointPromise(upgradeKey);

  var _useModalFrame = useModalFrame({
    id: 'ui-addon-upgrade-modal-frame',
    src: frameSrc,
    renderLoadingModal: LoadingModal
  }),
      setLoadFrame = _useModalFrame.setLoadFrame; // Fetch upgrade config and track view


  useEffect(function () {
    upgradePointPromise.then(function (upgradePoint) {
      if (!upgradePoint) return;

      if (!upgradePointViews[upgradeKey]) {
        upgradePointViews[upgradeKey] = true;
        tracker.track('interaction', Object.assign({
          action: 'viewed upgrade point'
        }, getTrackingProperties(upgradePoint)));
      }
    });
  }, [upgradeKey, upgradePointPromise]); // Track click and set state

  var openUpgradeModal = useCallback(function () {
    // In iframes, opening the modal has to be
    // handled by the top window, which must be
    // listening using `useUpgradeEventListener`
    var isInIframe = window.self !== window.top;

    if (isInIframe) {
      window.top.postMessage({
        modalKey: upgradeKey,
        event: UpgradeMessageEventKeys.OPEN_MODAL
      }, '*');
      return;
    }

    setLoadFrame(true);
    upgradePointPromise.then(function (upgradePoint) {
      if (!upgradePoint) return;
      tracker.track('interaction', Object.assign({
        action: 'clicked upgrade point'
      }, getTrackingProperties(upgradePoint)));
    });
  }, [setLoadFrame, upgradeKey, upgradePointPromise]);
  return {
    openUpgradeModal: openUpgradeModal
  };
}