import React, { useLayoutEffect, useRef } from 'react';
import cn from 'classnames';

export default function Media({ element, visible }) {
  const ref = useRef();

  useLayoutEffect(() => {
    while (ref.current.firstChild) {
      ref.current.removeChild(ref.current.firstChild);
    }
    if (element) {
      ref.current.appendChild(element);
    }
  }, [element]);

  return <section className={cn('media-wrap', { hidden: !visible })} ref={ref} />;
}
