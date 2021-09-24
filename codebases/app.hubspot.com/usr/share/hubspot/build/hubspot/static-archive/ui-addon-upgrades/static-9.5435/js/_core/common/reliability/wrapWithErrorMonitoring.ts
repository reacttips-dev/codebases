import invariant from 'react-utils/invariant';
import logError from 'ui-addon-upgrades/_core/common/reliability/logError'; // Meant to be used sparingly, as high up as possible.
// `label` is not meant to match the function name. It goes to SFX.

export default function wrapWithErrorMonitoring(label, func) {
  invariant(typeof label === 'string', '[wrapWithErrorMonitoring] argument `label` must be a string, got `%s`', typeof label);
  invariant(typeof func === 'function', '[wrapWithErrorMonitoring] argument `func` must be a function, got `%s`', typeof func);
  return function monitoredFunc() {
    return func.apply(void 0, arguments).catch(function (err) {
      logError(label, err);
      throw err;
    });
  };
}