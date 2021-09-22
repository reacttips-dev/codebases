import React from 'react';

import { useAccordionContext } from '@core/accordions/context';

export const useMouseEnterHandler = (
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
): React.MouseEventHandler<HTMLButtonElement> => {
  const context = useAccordionContext();
  const contextHoverHandler = context?.onHoverChange;

  return React.useCallback(
    (event) => {
      contextHoverHandler && contextHoverHandler(event, true);
      onMouseEnter && onMouseEnter(event);
    },
    [onMouseEnter, contextHoverHandler]
  );
};
