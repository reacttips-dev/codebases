import React from 'react';

import type { AccordionProps } from '@core/accordions/Accordion';

export type ExpandedAccordionProps = Pick<AccordionProps, 'expanded'>;

const getExpandedIndices = (
  accordionProps: ExpandedAccordionProps[]
): number[] => {
  return accordionProps.reduce(
    (expandedIndices, { expanded }, index) =>
      expanded ? [...expandedIndices, index] : expandedIndices,
    [] as number[]
  );
};

/**
 * Invokes the onChange callback if the set of expanded accordions changed since
 * the previous render cycle.
 *
 * onChange will not be called after initial render.
 *
 * @param accordionProps
 * @param onChange
 */
const useOnChangeHandler = (
  accordionProps: ExpandedAccordionProps[],
  onChange?: (expanded: number[]) => void
) => {
  const expandedIndices = React.useRef<number[] | undefined>();

  React.useEffect(() => {
    if (!onChange) {
      return;
    }

    const currentIndices = getExpandedIndices(accordionProps);
    const previousIndices = expandedIndices.current;
    const isInitialRender = previousIndices === undefined;

    if (isInitialRender) {
      expandedIndices.current = currentIndices;
      return;
    }

    expandedIndices.current = currentIndices;
    onChange(currentIndices);
  }, [accordionProps, expandedIndices, onChange]);
};

export default useOnChangeHandler;
