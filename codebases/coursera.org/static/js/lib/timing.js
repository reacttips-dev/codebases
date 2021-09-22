/**
 * Singleton of bundles/page/lib/timing
 */

import Timing from 'bundles/page/lib/Timing';

import multitracker from 'js/app/multitrackerSingleton';

const record = multitracker.pushV2.bind(multitracker);

let timing;
if (typeof window === 'undefined') {
  // no timing in server context
  const stub = {};
  const identity = (x) => x;
  Object.keys(Timing.prototype).forEach((name) => (stub[name] = identity));
  timing = stub;
} else {
  const performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
  const singleton = new Timing(performance, record, {
    eventingKey: 'page.time.web_page_load.time',
  });
  timing = singleton;
}

export default timing;
