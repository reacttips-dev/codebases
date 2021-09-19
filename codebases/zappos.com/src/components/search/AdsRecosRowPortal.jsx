import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { deepEqual } from 'fast-equals';

import useWindowSize from 'hooks/useWindowSize';
import { PRODUCT_CARD_BREAKPOINT_MAX, PRODUCT_CARD_BREAKPOINT_MIN } from 'constants/appConstants';

// Factory for creating portals that avoid server-client dom mismatch
const AdsRecosRowPortal = ({ wrapperEl = 'div', attributes, className, rowIndex = 1, cardCount, debounceWait = 500, children }) => {
  const portalRoot = useRef();
  const portalWrapper = useRef();
  const attributesRef = useRef(attributes);
  const [productCardIndex, setProductCardIndex] = useState(null);
  const { width: windowWidth } = useWindowSize(debounceWait);

  if (!deepEqual(attributesRef.current, attributes)) {
    attributesRef.current = attributes;
  }

  useEffect(() => {
    if (!portalRoot.current) {
      portalRoot.current = document.body;
    }
    if (!portalWrapper.current) {
      portalWrapper.current = document.createElement(wrapperEl);
    }
    if (className) {
      portalWrapper.current.className = className;
    }
    if (attributesRef.current) {
      for (const attr in attributesRef.current) {
        portalWrapper.current.setAttribute(attr, attributesRef.current[attr]);
      }
    }
    portalRoot.current.appendChild(portalWrapper.current);
  }, [className, wrapperEl]);

  useEffect(() => {
    const getProductCardIndex = (width, count) => {
      if (width <= PRODUCT_CARD_BREAKPOINT_MIN) {
        return count < 2 ? count - 1 : rowIndex * 2 - 1;
      }
      if (width <= PRODUCT_CARD_BREAKPOINT_MAX) {
        return count < 3 ? count - 1 : rowIndex * 3 - 1;
      }
      return count < 4 ? count - 1 : rowIndex * 4 - 1;
    };

    const wrapper = portalWrapper.current;

    if (wrapper && windowWidth) {
      const cardIndex = rowIndex ? getProductCardIndex(windowWidth, cardCount) : 0;
      if (cardIndex !== productCardIndex) {
        const productCardElem = document.querySelectorAll('[data-adsrecos-card="true"]')[cardIndex];
        rowIndex ? productCardElem?.after(wrapper) : productCardElem?.before(wrapper);
        setProductCardIndex(cardIndex);
      }
    }
  }, [windowWidth, cardCount, productCardIndex, rowIndex]);

  if (portalRoot.current && portalWrapper.current) {
    return createPortal(children, portalWrapper.current);
  } else {
    return null;
  }
};

export default AdsRecosRowPortal;
