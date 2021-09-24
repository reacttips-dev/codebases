'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import UILayer from 'UIComponents/layer/UILayer';
import UIAbstractProgress from 'UIComponents/progress/UIAbstractProgress';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import UIIFrame from 'ui-addon-iframeable/host/UIIFrame';
import { URANUS_LAYER } from 'HubStyleTokens/sizes';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
var fadeInAnimation = keyframes(["from{opacity:0}to{opacity:1}"]); // Transparent "sheet of glass" overlay that covers the entire window
// Rendered at a sill
// See https://git.hubteam.com/HubSpot/hub-details-ui/blob/master/static/js/components/DetailsView/FullScreenExpandable.js

export var FullScreenOverlay = styled.div.withConfig({
  displayName: "ModalIFrameLayer__FullScreenOverlay",
  componentId: "hurqo3-0"
})(["position:fixed;top:0;left:0;bottom:0;right:0;z-index:", ";opacity:0;animation-name:", ";animation-duration:100ms;animation-fill-mode:forwards;", ";", ";"], URANUS_LAYER, fadeInAnimation, function (_ref) {
  var show = _ref.show;
  return !show && 'display: none';
}, function (_ref2) {
  var loading = _ref2.loading;
  return loading && "background-color: rgba(45,62,80,0.79)";
});
/**
 * `ModalIFrameLayer` simulates a `UIModalIFrame` in a fullscreen transparent
 * iframe covering the window.
 *
 * To support components like `UIPanel` that can render inside the embedded
 * app, but require access to the full window aread, show a fullscreen
 * transparent `UIIFrame`, and have the embedded app render the `UIModal`.
 *
 * This allows components rendered inside the iframe to "break out" of
 * the modal's box, which they wouldn't be able to with `UIModalIFrame`.
 *
 * UIComponents has no officially supported way of rendering a fullscreen
 * transparent layer. For instance, `<UIModal use="fullscreen">` shows an
 * opaque white sheet with a shadow underneath it. Instead we use a custom
 * "sheet of glass" layer (a transparent div in a portal, at a high z-index,
 * covering the entire window) and render a 100% `UIIFrame` inside that.
 *
 * Coordination with the embedded app is required to rebuild the
 * convenience features of `UIModalIFrame`:
 *
 * 1. show a progress bar while the iframe loads
 * 2. show a translucent gray background while the iframe loads (to
 *    give the user immediate feedback, and to approximate the background that
 *    will be shown behind the modal)
 * 3. interpret the special `MSG_TYPE_MODAL_DIALOG_CLOSE` message and
 *    convert it to an `onClose` call
 */

var ModalIFrameLayer = function ModalIFrameLayer(_ref3) {
  var actionButtons = _ref3.actionButtons,
      embeddedPassthruProps = _ref3.embeddedPassthruProps,
      height = _ref3.height,
      iframePassthruProps = _ref3.iframePassthruProps,
      onClose = _ref3.onClose,
      onInitError = _ref3.onInitError,
      onMessage = _ref3.onMessage,
      onReady = _ref3.onReady,
      onReadyError = _ref3.onReadyError,
      show = _ref3.show,
      showProgressIndicator = _ref3.showProgressIndicator,
      src = _ref3.src,
      title = _ref3.title,
      width = _ref3.width;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isModalOpen = _useState4[0],
      setIsModalOpen = _useState4[1];

  var handleMessage = useCallback(function (msg) {
    var _msg$payload = msg.payload,
        type = _msg$payload.type,
        restPayload = _objectWithoutProperties(_msg$payload, ["type"]);

    switch (type) {
      case MSG_TYPE_MODAL_DIALOG_CLOSE:
        onClose(Object.assign({}, restPayload));
        break;

      case 'ON_OPEN_START':
        setIsModalOpen(true);
        break;

      case 'ON_CLOSE_COMPLETE':
        setIsModalOpen(false);
        break;

      default:
        if (onMessage) {
          onMessage(msg);
        }

        break;
    }
  }, [onClose, onMessage]); // communication established with embedded app; stop showing gray background
  // (the embedded app's /layer route is responsible for rendering its own)

  var handleReady = useCallback(function () {
    setLoading(false);

    if (onReady) {
      onReady();
    }
  }, [onReady]);
  return /*#__PURE__*/_jsx(UILayer, {
    children: /*#__PURE__*/_jsxs(FullScreenOverlay, {
      loading: loading,
      show: show || isModalOpen,
      children: [showProgressIndicator && loading && /*#__PURE__*/_jsx(UIAbstractProgress, {
        render: function render(_ref4) {
          var value = _ref4.value,
              done = _ref4.done;
          return /*#__PURE__*/_jsx(UINanoProgress, {
            value: value,
            animateOnComplete: done
          });
        }
      }), /*#__PURE__*/_jsx(UIIFrame, {
        width: "100%",
        height: "100%",
        iframePassthruProps: iframePassthruProps,
        embeddedPassthruProps: Object.assign({}, embeddedPassthruProps, {
          title: title,
          actionButtons: actionButtons,
          height: height,
          width: width,
          show: show
        }),
        onInitError: onInitError,
        onMessage: handleMessage,
        onReady: handleReady,
        onReadyError: onReadyError,
        src: src
      })]
    })
  });
};

ModalIFrameLayer.propTypes = {
  actionButtons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    props: PropTypes.object
  })).isRequired,
  embeddedPassthruProps: PropTypes.object,
  height: PropTypes.number,
  iframePassthruProps: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onInitError: PropTypes.func,
  onMessage: PropTypes.func,
  onReady: PropTypes.func,
  onReadyError: PropTypes.func,
  show: PropTypes.bool,
  showProgressIndicator: PropTypes.bool,
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.number
};
export default ModalIFrameLayer;