import { useCallback, useState } from 'react';

export const useCallbackRef = <TElement extends HTMLElement>(): [
  TElement | null,
  (node: TElement | null) => void,
] => {
  const [element, setElement] = useState<TElement | null>(null);
  const callbackRef = useCallback(
    (node: TElement | null) => {
      setElement(node);
    },
    [setElement],
  );

  return [element, callbackRef];
};
