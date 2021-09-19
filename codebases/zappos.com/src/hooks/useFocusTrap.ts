import { useEffect, useRef } from 'react';

import { TABBABLE_ELEMENTS_SELECTOR } from 'constants/selectors';

const getFocusableElements = (container: Element) => {
  if (container instanceof HTMLElement) {
    const focusableElements: Element[] = Array.from(container.querySelectorAll(TABBABLE_ELEMENTS_SELECTOR));
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    return {
      focusableElements,
      firstFocusableElement,
      lastFocusableElement
    };
  } else {
    return {};
  }
};

const generateTarget = (current: Element, elements: Element[], isShift: boolean) => {
  const currentIndex = elements.indexOf(current);
  let newTargetIndex;
  if (isShift) {
    newTargetIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
  } else {
    newTargetIndex = (currentIndex + 1) % elements.length;
  }
  return elements[newTargetIndex];
};

interface Validation {
  target: Element;
  focusableElements: Element[];
  originalElement: Element;
  isShift: boolean;
}

const validateTrap = ({ target, focusableElements, originalElement, isShift }: Validation) => {
  if (!focusableElements.length) {
    return;
  }
  // we have to manually put this at the end of the call stack so new document.activeElement points to the newly focused item;
  setTimeout(() => {
    const currentElement = document.activeElement;
    const outOfTrap = currentElement && !focusableElements.includes(currentElement);
    const isStuck = originalElement === currentElement;
    if ((outOfTrap || isStuck) && target instanceof HTMLElement) { // If the active element is out of the trap or is stuck, focus the intended target and revalidate
      target.focus();
      const newTarget = generateTarget(target, focusableElements, isShift);
      validateTrap({ target: newTarget, focusableElements, originalElement, isShift }); // we want to make sure future iterations of this point to a new target, since target.focus() has the potential to be have an unfocusable parent
    }
  }, 1); // This has to be set to something > 0 for browser compatibility
};

interface TrapOptions {
  ref: React.MutableRefObject<HTMLElement | null>;
  shouldFocusFirstElement: boolean;
}

const trap = ({ ref, shouldFocusFirstElement }: TrapOptions) => {
  const el = ref.current;

  if (!el) {
    return;
  }

  const returnFocusElement = document.activeElement;

  if (shouldFocusFirstElement) {
    const { firstFocusableElement } = getFocusableElements(el);
    firstFocusableElement instanceof HTMLElement && firstFocusableElement.focus();
  }

  const handleKeydown = (e: KeyboardEvent) => {
    const isTabPressed = e.key === 'Tab';

    if (!isTabPressed) {
      return;
    }

    e.stopPropagation();
    const { firstFocusableElement, lastFocusableElement, focusableElements } = getFocusableElements(el);
    const elements = Array.from(focusableElements || []);
    const { activeElement } = document;
    const isShift = e.shiftKey;
    const target = activeElement && generateTarget(activeElement, elements, isShift);

    if (target instanceof HTMLElement) {
      if ((!isShift && activeElement === lastFocusableElement) || (isShift && activeElement === firstFocusableElement)) {
        e.preventDefault();
        target.focus();
      }

      validateTrap({ focusableElements: elements, target, originalElement: activeElement as HTMLElement, isShift });
    }
  };

  el.addEventListener('keydown', handleKeydown);

  return () => {
    const { focusableElements } = getFocusableElements(el);
    // Don't steal focus if we're clicking outside of the trap to something else
    if (focusableElements && focusableElements.includes(document.activeElement as HTMLElement)) {
      returnFocusElement instanceof HTMLElement && returnFocusElement.focus();
    }
    el.removeEventListener('keydown', handleKeydown);
  };
};

const useFocusTrap = <T extends HTMLElement>({ shouldFocusFirstElement = false, active = true }) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }
    return trap({ ref, shouldFocusFirstElement });
  }, [active, shouldFocusFirstElement]
  );
  return ref;
};

export default useFocusTrap;
