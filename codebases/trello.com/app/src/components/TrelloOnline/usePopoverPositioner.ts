// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import _ from 'underscore';
import { useEffect } from 'react';

const debouncedOnResize = _.debounce(function () {
  PopOver.onWindowResize();
}, 300);

export const usePopoverPositioner = () => {
  useEffect(() => {
    $(window).on('resize.windowEvent', debouncedOnResize);

    return () => {
      $(window).off('resize.windowEvent', debouncedOnResize);
    };
  }, []);
};
