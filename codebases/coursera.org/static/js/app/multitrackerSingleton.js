// globals COURSERA_APP_VERSION, COURSERA_APP_VERSION_TIMESTAMP
/* eslint-disable */

/**
 * NOTE requiring this has side-effects, trigged on DOM load
 */
import config from 'js/app/config';
import logger from 'js/app/loggerSingleton';
import MultiTracker from 'js/lib/multitracker';
import errorTracker from 'js/app/errorTracker';
import _204 from 'js/lib/204';
import _400 from 'js/lib/400';

var multitracker = MultiTracker({ logger }); // eslint-disable-line new-cap

if (typeof window !== 'undefined') {
  var eventBeacon = window.location.protocol + '//' + window.location.host;
  var inProduction = /production/.test(config.environment);

  errorTracker(
    function (error) {
      multitracker.pushV2(['page.error.javascript', error]);
    },
    {
      logger: logger,
      version: COURSERA_APP_VERSION,
      versionTimestamp: COURSERA_APP_VERSION_TIMESTAMP,
      scriptFilter: new RegExp('^' + config.url.app_chunks),
    }
  );

  multitracker.register('204', _204);
  multitracker.register('400', _400);
  multitracker.register('ga', (window._gaq = window._gaq || []), 'google');

  multitracker.get('204').queue.push(['debug', !inProduction]);
  multitracker.get('204').queue.push(['beacon', eventBeacon + '/eventing/info']);
  multitracker.get('204').queue = _204.batch(window._204);

  multitracker
    .get('400')
    .queue.push(
      [
        'batch',
        ['constant', 'debug', !inProduction],
        ['constant', 'beacon', eventBeacon + '/eventing/info.v2'],
        ['constant', 'beaconBatch', eventBeacon + '/eventing/infoBatch.v2'],
        ['app', 'phoenix'],
        ['clientVersion', COURSERA_APP_VERSION],
      ].concat(window._400)
    );

  if (process.env.NODE_ENV === 'development') {
    // Makes it easier to hook into this tracker in contexts outside of the application
    window.multitracker = multitracker;
  }
}

export default multitracker;
