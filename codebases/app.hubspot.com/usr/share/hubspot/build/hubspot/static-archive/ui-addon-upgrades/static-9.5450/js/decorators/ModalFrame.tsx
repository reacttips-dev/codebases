import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { matchMessage, verifyMessage } from '../ums/utils';
import ModalFramePortal from './ModalFramePortal';
var ModalFrameFrame = styled.iframe.withConfig({
  displayName: "ModalFrame__ModalFrameFrame",
  componentId: "yjxjgq-0"
})(["height:100%;width:100%;border:0;position:absolute;z-index:9999999;top:", "px;display:", ";"], function (_ref) {
  var scrollTop = _ref.scrollTop;
  return scrollTop;
}, function (_ref2) {
  var frameReady = _ref2.frameReady;
  return frameReady ? null : 'none';
});

function ModalFrame(_ref3) {
  var src = _ref3.src,
      frameReady = _ref3.frameReady,
      dispatchFrameAction = _ref3.dispatchFrameAction;
  var scrollTop = useRef(0);
  var modalRef = useRef(null);
  useEffect(function () {
    var handlePostMessage = function handlePostMessage(event) {
      if (verifyMessage(modalRef, event)) {
        if (matchMessage(event, 'FRAME_READY')) {
          scrollTop.current = document.documentElement.scrollTop;
        }

        if (matchMessage(event, 'RELOAD_PARENT')) {
          window.location.reload(true);
        }

        if (typeof event.data === 'string') {
          dispatchFrameAction({
            type: event.data
          });
        } else if (typeof event.data === 'object') {
          dispatchFrameAction({
            type: event.data.type,
            payload: Object.assign({}, event.data.dimensions, {}, event.data.data)
          });
        }
      }
    };

    window.addEventListener('message', handlePostMessage);
    return function () {
      window.removeEventListener('message', handlePostMessage);
    };
  }, [dispatchFrameAction]);
  return /*#__PURE__*/_jsx(Fragment, {
    children: /*#__PURE__*/_jsx(ModalFramePortal, {
      children: /*#__PURE__*/_jsx(ModalFrameFrame, {
        id: "ui-addon-upgrade-modal-frame",
        src: src,
        ref: modalRef,
        frameReady: frameReady,
        scrollTop: scrollTop.current
      })
    })
  });
}

export default ModalFrame;