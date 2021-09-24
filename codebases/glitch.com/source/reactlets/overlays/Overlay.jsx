import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import useClickOut from '../../hooks/useClickOut';

export default function Overlay({ children, className, dialogClassName, ariaLabelledby, onClickOut }) {
  const overlayEl = useRef();
  const container = useRef(null);

  useClickOut(overlayEl, onClickOut);

  if (container.current === null) {
    container.current = document.createElement('div');
  }

  useEffect(() => {
    document.getElementById('__react-overlay-container').appendChild(container.current);

    return () => {
      document.getElementById('__react-overlay-container').removeChild(container.current);
    };
  }, []);

  return ReactDOM.createPortal(
    <div className={`overlay-background ${className}`}>
      <dialog className={dialogClassName} aria-modal="true" aria-labelledby={ariaLabelledby} ref={overlayEl}>
        {children}
      </dialog>
    </div>,
    container.current,
  );
}
