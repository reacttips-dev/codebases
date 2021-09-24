import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useState, useEffect, useMemo } from 'react';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import ModalFrame from './ModalFrame';
import PortalIdParser from 'PortalIdParser';
import { parse } from 'hub-http/helpers/params';
import { getIframeModalHost } from 'ui-addon-upgrades/_core/utils/getIframeModalHost';
import { useModalFrameReducer } from 'ui-addon-upgrades/useModalFrameReducer';
import { upgradeDataPropsInterface } from 'ui-addon-upgrades/_core/common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { LoadingModal } from 'ui-addon-upgrades/_core/common/components/LoadingModal';
import { FrameAction } from '../useModalFrameReducer';

function createSource(upgradeData) {
  var app = upgradeData.app,
      screen = upgradeData.screen,
      uniqueId = upgradeData.uniqueId;
  return app + "-" + screen + "-locked-feature-" + uniqueId;
}

function createFrameSrc(upgradeData, modalKey) {
  var feature = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var app = upgradeData.app,
      screen = upgradeData.screen,
      uniqueId = upgradeData.uniqueId,
      upgradeProduct = upgradeData.upgradeProduct;
  var source = createSource(upgradeData);
  var queryParams = "upgradeProduct=" + upgradeProduct + "&app=" + app + "&screen=" + screen + "&uniqueId=" + uniqueId + "&modalKey=" + modalKey + "&source=" + source + "&feature=" + feature;
  var copyMachineVariant = parse(window.location.search.substring(1))['copy_machine_variant'];

  if (copyMachineVariant) {
    queryParams = queryParams + "&copy_machine_variant=" + copyMachineVariant;
  }

  return getIframeModalHost() + "/modal/" + PortalIdParser.get() + "?" + queryParams;
}

function UpgradeModal(_ref) {
  var upgradeData = _ref.upgradeData,
      modalKey = _ref.modalKey,
      feature = _ref.feature,
      children = _ref.children;
  var frameSrc = useMemo(function () {
    return createFrameSrc(upgradeData, modalKey, feature);
  }, [upgradeData, modalKey, feature]);

  var _useState = useState(Object.assign({}, upgradeData, {
    source: createSource(upgradeData)
  })),
      _useState2 = _slicedToArray(_useState, 2),
      eventProperties = _useState2[0],
      setEventProperties = _useState2[1];

  var _useModalFrameReducer = useModalFrameReducer(),
      _useModalFrameReducer2 = _slicedToArray(_useModalFrameReducer, 2),
      _useModalFrameReducer3 = _useModalFrameReducer2[0],
      loadFrame = _useModalFrameReducer3.loadFrame,
      frameReady = _useModalFrameReducer3.frameReady,
      showParentModal = _useModalFrameReducer3.showParentModal,
      frameDimensions = _useModalFrameReducer3.frameDimensions,
      dispatchFrameAction = _useModalFrameReducer2[1];

  var app = upgradeData.app,
      screen = upgradeData.screen,
      upgradeProduct = upgradeData.upgradeProduct,
      uniqueId = upgradeData.uniqueId;
  useEffect(function () {
    var newUpgradeData = {
      app: app,
      screen: screen,
      upgradeProduct: upgradeProduct,
      uniqueId: uniqueId
    };
    var newEventProperties = Object.assign({}, newUpgradeData, {
      source: createSource(newUpgradeData)
    });
    setEventProperties(Object.assign({}, newEventProperties));
    tracker.track('lockedFeatureInteraction', Object.assign({
      action: 'viewed'
    }, newEventProperties));
  }, [app, screen, upgradeProduct, uniqueId]);

  var handleClick = function handleClick() {
    dispatchFrameAction({
      type: FrameAction.LOAD_FRAME
    });
    tracker.track('lockedFeatureInteraction', Object.assign({
      action: 'clicked'
    }, eventProperties));
  };

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [children({
      openUpgradeModal: handleClick,
      preloadUpgradeModal: function preloadUpgradeModal() {}
    }), loadFrame && /*#__PURE__*/_jsx(LoadingModal, {
      frameReady: frameReady,
      showParentModal: showParentModal,
      modalWidth: frameDimensions.width,
      modalHeight: frameDimensions.height
    }), loadFrame && /*#__PURE__*/_jsx(ModalFrame, {
      src: frameSrc,
      frameReady: frameReady,
      dispatchFrameAction: dispatchFrameAction
    })]
  });
}

UpgradeModal.propTypes = Object.assign({
  modalKey: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  feature: PropTypes.string
}, upgradeDataPropsInterface);
export default UpgradeModal;