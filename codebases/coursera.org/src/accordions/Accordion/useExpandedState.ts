import React from 'react';

import { useControlled } from '@core/utils';

type UseExpandedStateArgs = {
  expanded: boolean | undefined;
  defaultExpanded: boolean | undefined;
  onChange?: (event: React.ChangeEvent<unknown>, expanded: boolean) => void;
};

type UseExpandedStateReturn = [
  expanded: boolean,
  toggleExpanded: (event: React.ChangeEvent<unknown>) => void
];

export const useExpandedState = (
  args: UseExpandedStateArgs
): UseExpandedStateReturn => {
  const { onChange, expanded, defaultExpanded } = args;

  const [expandedState, setExpandedState] = useControlled({
    controlled: expanded,
    default: defaultExpanded,
    name: 'Accordion',
    state: 'expanded',
  });

  return [
    expandedState,
    React.useCallback(
      (event: React.ChangeEvent<unknown>) => {
        setExpandedState(!expandedState);
        onChange && onChange(event, !expandedState);
      },
      [expandedState, setExpandedState, onChange]
    ),
  ];
};
