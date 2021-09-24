import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ModalFrame from './ModalFrame';
export function useModalFrame(_ref) {
  var src = _ref.src,
      onMessage = _ref.onMessage,
      renderLoadingModal = _ref.renderLoadingModal,
      id = _ref.id;
  var rootRef = useRef(document.createElement('div'));

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loadFrame = _useState2[0],
      setLoadFrame = _useState2[1];

  useEffect(function () {
    if (loadFrame) {
      var currentRootRef = rootRef.current;
      document.body.appendChild(currentRootRef);
      ReactDOM.render( /*#__PURE__*/_jsx(ModalFrame, {
        id: id,
        setLoadFrame: setLoadFrame,
        src: src,
        onMessage: onMessage,
        renderLoadingModal: renderLoadingModal
      }), currentRootRef);
      return function () {
        ReactDOM.unmountComponentAtNode(currentRootRef);
        document.body.removeChild(currentRootRef);
      };
    }

    return function () {};
  }, [src, loadFrame, onMessage, renderLoadingModal, id]);
  return {
    setLoadFrame: setLoadFrame
  };
}