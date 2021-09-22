import React from 'react';

import { useAccordionContext } from '@core/accordions/context';

export const useBlurHandler = (
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
): React.FocusEventHandler<HTMLButtonElement> => {
  const context = useAccordionContext();
  const contextFocusHandler = context?.onFocusChange;

  return React.useCallback(
    (event) => {
      contextFocusHandler && contextFocusHandler(event, false);
      onBlur && onBlur(event);
    },
    [onBlur, contextFocusHandler]
  );
};
