import React from 'react';

import { useAccordionContext } from '@core/accordions/context';

export const useMouseLeaveHandler = (
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
): React.MouseEventHandler<HTMLButtonElement> => {
  const context = useAccordionContext();
  const contextHoverHandler = context?.onHoverChange;

  return React.useCallback(
    (event) => {
      contextHoverHandler && contextHoverHandler(event, false);
      onMouseLeave && onMouseLeave(event);
    },
    [onMouseLeave, contextHoverHandler]
  );
};
