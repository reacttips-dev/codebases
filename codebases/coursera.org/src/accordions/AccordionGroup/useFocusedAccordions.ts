import React from 'react';

import type {
  AccordionElement,
  AccordionProps,
} from '@core/accordions/Accordion';

export type AccordionFocusProps = Pick<
  AccordionProps,
  'headerRef' | 'onKeyDown'
>;

type HeaderRef = AccordionFocusProps['headerRef'];
type FocusElementRefs = React.MutableRefObject<(HTMLElement | null)[]>;

const moveFocusDirective = (
  focusRefs: FocusElementRefs,
  event: React.KeyboardEvent<HTMLElement>
): { from: number; direction: number } | undefined => {
  const from = focusRefs.current.indexOf(event.currentTarget);

  switch (event.key) {
    case 'ArrowUp': {
      return { from, direction: -1 };
    }
    case 'ArrowDown': {
      return { from, direction: 1 };
    }
    case 'Home': {
      return { from, direction: from * -1 };
    }
    case 'End': {
      return { from, direction: focusRefs.current.length - from - 1 };
    }
    default: {
      return undefined;
    }
  }
};

const createMoveFocusHandler = (focusRefs: FocusElementRefs) => (
  event: React.KeyboardEvent<HTMLElement>
) => {
  const move = moveFocusDirective(focusRefs, event);

  if (!move) {
    return;
  }

  const length = focusRefs.current.length;
  const focusIndex = (move.from + length + move.direction) % length;

  const focusDestination = focusRefs.current[focusIndex];

  if (focusDestination && 'focus' in focusDestination) {
    focusDestination.focus();
    event.preventDefault();
  }
};

/**
 * Creates Accordion props that lets the AccordionGroup support arrow-key
 * navigation between accordions in the group.
 */
const useFocusedAccordions = (
  children: AccordionElement | AccordionElement[]
): AccordionFocusProps[] => {
  const length = React.Children.count(children);

  const focusElementRefs: FocusElementRefs = React.useRef([]);

  const headerRefHandlers: HeaderRef[] = React.useMemo(() => {
    focusElementRefs.current = new Array(length).fill(null);

    return Array.from({ length }, (_, index) => {
      return (node) => {
        focusElementRefs.current[index] = node;
      };
    });
  }, [focusElementRefs, length]);

  const onKeyDownHandler = React.useMemo(
    () => createMoveFocusHandler(focusElementRefs),
    [focusElementRefs]
  );

  return headerRefHandlers.map((headerRefHandler) => ({
    headerRef: headerRefHandler,
    onKeyDown: onKeyDownHandler,
  }));
};

export default useFocusedAccordions;
