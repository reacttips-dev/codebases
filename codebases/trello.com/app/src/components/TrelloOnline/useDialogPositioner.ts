// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import Dialog from 'app/scripts/views/lib/dialog';
import _ from 'underscore';
import { useEffect } from 'react';

const debouncedOnResize = _.debounce(function () {
  if (Dialog.isVisible) {
    Dialog.calcPos('');
  }
}, 300);

export const useDialogPositioner = () => {
  useEffect(() => {
    $(window).on('resize.windowEvent', debouncedOnResize);

    return () => {
      $(window).off('resize.windowEvent', debouncedOnResize);
    };
  }, []);
};
