import { useState, useEffect } from 'react';

// This value must stay in sync with `import { FLAG_GROUP_ID } from '@trello/nachos/experimental-flags';`.
// We duplicate the value because importing it would cause a circular dependency.
const FLAG_GROUP_ID = 'FlagGroup';

export const ELEVATION_ATTR = 'data-elevation';
export const ELEVATION_SELECTOR = `[${ELEVATION_ATTR}]`;

export const getElevation = (element: Element) => {
  const closestElevatedElement = element.closest(ELEVATION_SELECTOR);
  const closestElevation = closestElevatedElement
    ? Number(closestElevatedElement.getAttribute(ELEVATION_ATTR))
    : 0;

  return closestElevation;
};

export const useCurrentElevation = (element: Element | null) => {
  const [elevation, setElevation] = useState(0);

  useEffect(() => {
    if (!element) {
      setElevation(0);
    } else {
      setElevation(getElevation(element));
    }
  }, [element]);

  return elevation;
};

export const getHighestVisibleElevation = () => {
  const elevatedElements = document.querySelectorAll(ELEVATION_SELECTOR);
  let highestElevation = 0;
  for (const elem of elevatedElements) {
    const elevation = elem ? Number(elem.getAttribute(ELEVATION_ATTR)) : 0;
    if (elevation > highestElevation) {
      highestElevation = elevation;
    }
  }

  return highestElevation;
};

/**
 * Determines whether a clicked element was 'outside' a containerElement,
 * only returning 'true' for a container at the highest elevation.
 */
export const wasClickOutside = (
  containerElement: Element | null,
  clickedElement: Element | null,
): boolean => {
  // Ignore clicks that haven't specified a container element
  if (!containerElement || !clickedElement) {
    return false;
  }

  // Ignore clicks inside our element
  if (containerElement.contains(clickedElement)) {
    return false;
  }

  // Ignore clicks outside the <body> element, this happens
  // for some extensions (like Grammarly) that render their
  // own popovers outside the <body>
  if (!document.body.contains(clickedElement)) {
    return false;
  }

  // Ignore clicks on Flags; these shouldn't be layered as visible elevation.
  if (clickedElement.closest(`#${FLAG_GROUP_ID}`)) {
    return false;
  }

  // Get our element's elevation
  const closestElevation = getElevation(containerElement);

  // Get the elevation of the click event
  const clickedElevation = getElevation(clickedElement);

  // Get the highest visible elevation
  const highestElevation = getHighestVisibleElevation();

  // If the element being clicked was at a lower elevation than our element,
  // and our element is at the highest elevation, we want to trigger our handler
  return (
    clickedElevation < closestElevation && closestElevation === highestElevation
  );
};

interface ClickOutsideHandler {
  element: Element;
  onClickOutside: (event: MouseEvent) => void;
}

let handlers: ClickOutsideHandler[] = [];

// We capture the target of a mouse down event so we can prevent
// layers from closing when a mouse down happens _inside_ the layer,
// but the mouse-up happens outside of it
let mouseDownTarget: Element | null = null;
const onMouseDown = (event: MouseEvent) => {
  mouseDownTarget = event.target as Element;
};

const onClick = (event: MouseEvent) => {
  const clickTarget = event.target as Element;

  handlers.forEach((handler) => {
    if (
      wasClickOutside(handler.element, clickTarget) &&
      wasClickOutside(handler.element, mouseDownTarget)
    ) {
      handler.onClickOutside(event);
    }
  });
};

let initialized = false;

const addEventListeners = () => {
  document.addEventListener('click', onClick, true);
  document.addEventListener('mousedown', onMouseDown, true);
  initialized = true;
};

const removeEventListeners = () => {
  document.removeEventListener('click', onClick, true);
  document.removeEventListener('mousedown', onMouseDown, true);
  initialized = false;
};

export const registerClickOutsideHandler = (
  element: Element,
  onClickOutside: (event: MouseEvent) => void,
) => {
  // When a new 'outside click handler' is registered, we want
  // to simulate a click outside on every currently registered layer
  // at higher or equal elevations. This is to ensure that cases like opening
  // a modal while a nested popover is open, will close _all_ the open popovers
  // (not just the top one)
  const newLayerElevation = getElevation(element);
  handlers
    .filter(
      (handler) =>
        handler.element !== element &&
        handler.onClickOutside !== onClickOutside,
    )
    .forEach((handler) => {
      const registeredElevation = getElevation(handler.element);
      if (registeredElevation >= newLayerElevation) {
        const fakeEvent = new MouseEvent('click');
        handler.onClickOutside(fakeEvent);
      }
    });

  handlers.push({
    element,
    onClickOutside,
  });

  if (!initialized) {
    addEventListeners();
  }
};

export const unregisterClickOutsideHandler = (
  element: Element,
  onClickOutside: (event: MouseEvent) => void,
) => {
  handlers = handlers.filter(
    (handler) =>
      handler.element !== element && handler.onClickOutside !== onClickOutside,
  );

  if (initialized && handlers.length === 0) {
    removeEventListeners();
  }
};

interface UseClickOutsideHandlerArgs<T extends HTMLElement> {
  element: T | null;
  handleClickOutside: (e: MouseEvent) => void;
  skip?: boolean;
}

export const useClickOutsideHandler = <T extends HTMLElement>({
  element,
  handleClickOutside,
  skip,
}: UseClickOutsideHandlerArgs<T>) => {
  useEffect(() => {
    if (!skip && element) {
      registerClickOutsideHandler(element, handleClickOutside);
    }

    return () => {
      if (element) {
        unregisterClickOutsideHandler(element, handleClickOutside);
      }
    };
  }, [element, handleClickOutside, skip]);
};

export const reset = () => {
  removeEventListeners();
  handlers = [];
};
