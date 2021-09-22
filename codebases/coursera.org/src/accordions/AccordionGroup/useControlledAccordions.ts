import React, { SetStateAction } from 'react';

import type {
  AccordionElement,
  AccordionProps,
} from '@core/accordions/Accordion';

export type ControlledAccordionProps = Pick<
  AccordionProps,
  'expanded' | 'onChange'
>;

type AccordionOnChange = ControlledAccordionProps['onChange'];

type StateConfiguration = {
  readonly createInitialState: (
    expandedIndices: number[],
    length: number
  ) => () => boolean[];

  readonly createNextState: (
    accordionIndex: number,
    expanded: boolean
  ) => SetStateAction<boolean[]>;
};

const getSingleExpandStateConfig = (): StateConfiguration => ({
  createInitialState: (expandedIndices, length) => () => {
    const expandedIndex = expandedIndices.find((index) => index < length);
    return Array.from({ length }, (_, idx: number) => idx === expandedIndex);
  },

  createNextState: (accordionIndex, expanded) => (prevState) => {
    return expanded
      ? prevState.map((_, index) => index === accordionIndex)
      : prevState.map(() => false);
  },
});

const getMultiExpandStateConfig = (): StateConfiguration => ({
  createInitialState: (expandedIndices, length) => () => {
    return Array.from({ length }, (_, idx: number) =>
      expandedIndices.includes(idx)
    );
  },

  createNextState: (accordionIndex, expanded) => (prevState) => {
    const nextState = [...prevState];
    nextState[accordionIndex] = expanded;
    return nextState;
  },
});

const useControlledStateConfig = (useMultiExpandState: boolean) =>
  React.useMemo(
    () =>
      useMultiExpandState
        ? getMultiExpandStateConfig()
        : getSingleExpandStateConfig(),
    [useMultiExpandState]
  );

/**
 * Creates Accordion props that lets the AccordionGroup to control their expanded state.
 *
 * State will not reset if props change after initial render and will become invalid.
 *
 */
const useControlledAccordions = (props: {
  defaultExpanded: number[];
  multiExpand: boolean;
  children: AccordionElement | AccordionElement[];
}): ControlledAccordionProps[] => {
  const { defaultExpanded, children, multiExpand } = props;
  const length = React.Children.count(children);

  const { createInitialState, createNextState } = useControlledStateConfig(
    multiExpand
  );

  const [expandedStates, setExpandedStates] = React.useState(
    createInitialState(defaultExpanded, length)
  );

  const onChangeHandlers: AccordionOnChange[] = React.useMemo(
    () =>
      Array.from({ length }, (_, index) => (_, expanded) => {
        setExpandedStates(createNextState(index, expanded));
      }),
    [length, setExpandedStates, createNextState]
  );

  return expandedStates.map((expanded, index) => ({
    expanded,
    onChange: onChangeHandlers[index],
  }));
};

export default useControlledAccordions;
