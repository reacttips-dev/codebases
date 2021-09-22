import React from 'react';

import { useAccordionContext } from '@core/accordions/context';

export const useKeyDownHandler = (
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>
): React.KeyboardEventHandler<HTMLButtonElement> => {
  const context = useAccordionContext();
  const contextKeydownHandler = context?.onKeyDown;

  return React.useCallback(
    (event) => {
      contextKeydownHandler && contextKeydownHandler(event);
      onKeyDown && onKeyDown(event);
    },
    [onKeyDown, contextKeydownHandler]
  );
};
