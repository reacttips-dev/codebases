import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { useUpgradeModal } from './useUpgradeModal';
import { UpgradeMessageEventKeys } from 'ui-addon-upgrades/_core/common/constants/upgradeMessageEventKeys';

/**
 * `useUpgradeEventListener` should be called in the top window of your
 * application when using `useUpgradeModal` inside of an iframe. This will
 * mount an event listener to listen for upgrade events, which will in turn
 * open the upgrade modal in the parent window instead of the iframe.
 *
 * @example
 * ```tsx
 * const WrapperComponent = () => {
 *   useUpgradeEventListener();
 *
 *   return <iframe src="your-source.hubspot.com" />;
 * }
 * ```
 */
export var useUpgradeEventListener = function useUpgradeEventListener() {
  // We store this item in state as an object in order
  // to re-evaluate this component on every message.
  // This is because when the modal key changes,
  // we need `useUpgradeModal` to re-run so that
  // `openUpgradeModal` opens for the right upgrade point.
  var _useState = useState({
    inner: ''
  }),
      _useState2 = _slicedToArray(_useState, 2),
      key = _useState2[0],
      setModalKey = _useState2[1];

  var _useUpgradeModal = useUpgradeModal(key.inner),
      openUpgradeModal = _useUpgradeModal.openUpgradeModal;

  useEffect(function () {
    var handleMessage = function handleMessage(messageEvent) {
      var _messageEvent$data = messageEvent.data,
          modalKey = _messageEvent$data.modalKey,
          event = _messageEvent$data.event;

      switch (event) {
        case UpgradeMessageEventKeys.OPEN_MODAL:
          setModalKey({
            inner: modalKey
          });
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return function () {
      return window.removeEventListener('message', handleMessage);
    };
  }, []);
  useEffect(function () {
    if (!!key.inner) {
      openUpgradeModal();
    }
  }, [key, openUpgradeModal]);
};