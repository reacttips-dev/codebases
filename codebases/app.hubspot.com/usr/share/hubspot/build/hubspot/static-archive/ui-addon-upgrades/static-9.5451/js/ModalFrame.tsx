import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { verifyMessage, matchMessage } from './ums/utils';
import { EXPECTED_MESSAGES, useModalFrameReducer } from './useModalFrameReducer';
var Frame = styled.iframe.withConfig({
  displayName: "ModalFrame__Frame",
  componentId: "pktcpj-0"
})(["display:", ";top:", "px;height:100%;width:100%;border:0;position:absolute;z-index:9999999;"], function (props) {
  return props.frameReady ? undefined : 'none';
}, function (props) {
  return props.scrollTop;
});

function ModalFrame(_ref) {
  var src = _ref.src,
      onMessage = _ref.onMessage,
      renderLoadingModal = _ref.renderLoadingModal,
      setLoadFrame = _ref.setLoadFrame,
      id = _ref.id;
  var frameRef = useRef(null);
  var scrollTop = useRef(0);

  var _useModalFrameReducer = useModalFrameReducer(),
      _useModalFrameReducer2 = _slicedToArray(_useModalFrameReducer, 2),
      _useModalFrameReducer3 = _useModalFrameReducer2[0],
      frameReady = _useModalFrameReducer3.frameReady,
      showParentModal = _useModalFrameReducer3.showParentModal,
      frameDimensions = _useModalFrameReducer3.frameDimensions,
      dispatchFrameAction = _useModalFrameReducer2[1]; // Handle post messages


  useEffect(function () {
    var handlePostMessage = function handlePostMessage(event) {
      if (verifyMessage(frameRef, event)) {
        if (matchMessage(event, 'FRAME_READY')) {
          scrollTop.current = document.documentElement.scrollTop;
        }

        if (matchMessage(event, 'CLOSE_FRAME')) {
          setLoadFrame(false);
        }

        if (matchMessage(event, 'RELOAD_PARENT')) {
          window.location.reload(true);
        }

        if (typeof event.data === 'string' && EXPECTED_MESSAGES.includes(event.data)) {
          dispatchFrameAction({
            type: event.data
          });
        } else if (typeof event.data === 'object' && EXPECTED_MESSAGES.includes(event.data.type)) {
          dispatchFrameAction({
            type: event.data.type,
            payload: Object.assign({}, event.data.dimensions, {}, event.data.data)
          });
        }

        if (onMessage) {
          onMessage(event);
        }
      }
    };

    window.addEventListener('message', handlePostMessage);
    return function () {
      window.removeEventListener('message', handlePostMessage);
    };
  }, [onMessage, dispatchFrameAction, setLoadFrame]);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [renderLoadingModal && renderLoadingModal({
      frameReady: frameReady,
      modalWidth: frameDimensions.width,
      modalHeight: frameDimensions.height,
      showParentModal: showParentModal,
      wrapContentSize: true
    }), /*#__PURE__*/_jsx(Frame, {
      id: id,
      src: src,
      ref: frameRef,
      frameReady: frameReady,
      scrollTop: scrollTop.current
    })]
  });
}

export default ModalFrame;