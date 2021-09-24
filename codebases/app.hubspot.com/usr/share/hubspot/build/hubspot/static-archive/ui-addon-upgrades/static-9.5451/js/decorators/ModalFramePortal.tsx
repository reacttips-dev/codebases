import { useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

function ModalFramePortal(_ref) {
  var children = _ref.children;
  var modalRef = useRef(document.createElement('div'));
  useLayoutEffect(function () {
    var currentModalRef = modalRef.current;
    document.body.appendChild(currentModalRef);
    return function () {
      document.body.removeChild(currentModalRef);
    };
  }, []);
  return /*#__PURE__*/ReactDOM.createPortal(children, modalRef.current);
}

export default ModalFramePortal;