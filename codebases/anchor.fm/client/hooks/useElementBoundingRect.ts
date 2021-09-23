import React from 'react';
import { debounce } from '../modules/debounce';

export function useElementBoundingRect(element: HTMLElement) {
  const [
    elementBoundingRect,
    setElementBoundingRect,
  ] = React.useState<ClientRect | null>(null);
  React.useEffect(() => {
    if (element) {
      const handleSetElementBoundingRect = debounce(() => {
        setElementBoundingRect(element.getBoundingClientRect());
      }, 50);
      setElementBoundingRect(element.getBoundingClientRect());
      window.addEventListener('resize', () => {
        handleSetElementBoundingRect();
      });
      return () => {
        window.removeEventListener('resize', () => {
          handleSetElementBoundingRect();
        });
      };
    }
  }, [element]);
  return elementBoundingRect;
}
