import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const root = document.getElementById('__react-pop-root');

// The children of this component are rendered into a div inside
// '#__react-pop-root', which is outside the application root.
// This makes z-index easier and can improve accessibility.
export default function PopPortal({ children }) {
  const el = useRef(null);

  if (el.current === null) {
    el.current = document.createElement('div');
  }

  useLayoutEffect(() => {
    root.appendChild(el.current);
    return () => {
      root.removeChild(el.current);
    };
  }, []);

  return createPortal(children, el.current);
}
