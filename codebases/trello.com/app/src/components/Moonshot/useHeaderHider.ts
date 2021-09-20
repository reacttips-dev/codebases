import { useEffect } from 'react';
// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';

interface UseHeaderHider {
  (args: { hide: boolean }): void;
}

export const useHeaderHider: UseHeaderHider = ({ hide }) => {
  useEffect(() => {
    if (hide) {
      $('[data-js-id="header-container"]').hide();
    }

    return () => {
      $('[data-js-id="header-container"]').show();
    };
  }, [hide]);
};
