import React from 'react';

import { useAccordionContext } from '@core/accordions/context';

export const useFocusHandler = (
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
): React.FocusEventHandler<HTMLButtonElement> => {
  const context = useAccordionContext();
  const contextFocusHandler = context?.onFocusChange;

  return React.useCallback(
    (event) => {
      contextFocusHandler && contextFocusHandler(event, true);
      onFocus && onFocus(event);
    },
    [onFocus, contextFocusHandler]
  );
};
