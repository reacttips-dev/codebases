import React, { useEffect, useRef, useState } from 'react';

import { isCardDesktop } from 'helpers/ClientUtils';

const useHover = (node: null | HTMLElement) => {
  const [state, setState] = useState({ hoveredOver: false, isHovered: false });
  const hoveredRef = useRef(state);
  hoveredRef.current = state;

  useEffect(() => {
    const isElement = node instanceof HTMLElement;

    if (!isCardDesktop() || !node || !isElement) {
      return;
    }

    const handleMouseEnter = () => {
      setState(state => ({ ...state, hoveredOver: true }));
      setTimeout(() => {
        if (hoveredRef.current.hoveredOver) {
          setState(state => ({ ...state, isHovered: true }));
        }
      }, 500);
    };

    const handleMouseLeave = () => {
      setState({ hoveredOver: false, isHovered: false });
    };

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [node]);

  return state;
};

export default useHover;
