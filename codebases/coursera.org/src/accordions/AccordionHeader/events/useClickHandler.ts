import React from 'react';

import { useAccordionContext } from '@core/accordions/context';

export const useClickHandler = (
  onClick?: React.MouseEventHandler<HTMLButtonElement>
): React.MouseEventHandler<HTMLButtonElement> => {
  const context = useAccordionContext();
  const onToggleExpand = context?.onToggleExpanded;

  return React.useCallback(
    (event) => {
      onToggleExpand && onToggleExpand(event);
      onClick && onClick(event);
    },
    [onClick, onToggleExpand]
  );
};
