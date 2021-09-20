import BulkAnalytics from '../../models/telemetry/BulkAnalytics';

/**
 *
 * @param {*} cb
 */
function bootTelemetry (cb) {
  _.assign(window.pm, {
    bulkAnalytics: new BulkAnalytics()
  });

  pm.logger.info('Telemetry~boot - Success');

  return cb && cb(null);
}

export default bootTelemetry;
