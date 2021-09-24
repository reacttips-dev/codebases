'use es6';

import enviro from 'enviro';
import once from 'transmute/once';

function logGridRenderTiming() {
  if (enviro.debug('GRID_TIMING')) {
    // eslint-disable-next-line no-console
    console.log('Grid rendered at: ', performance.now());
  }

  if (window.newrelic) {
    window.newrelic.setCustomAttribute('grid-render-time', performance.now());
  }
}

export default once(logGridRenderTiming);