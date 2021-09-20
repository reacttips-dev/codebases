// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import { WindowSize } from 'app/scripts/lib/window-size';
import _ from 'underscore';
import { useEffect } from 'react';

const debouncedOnResize = _.debounce(function () {
  WindowSize.calc();
}, 300);

export const useWindowSizeClass = () => {
  useEffect(() => {
    $(window).on('resize.windowEvent', debouncedOnResize);

    return () => {
      $(window).off('resize.windowEvent', debouncedOnResize);
    };
  }, []);
};
