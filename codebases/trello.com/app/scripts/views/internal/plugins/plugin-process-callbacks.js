/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { deepReplace } = require('app/scripts/lib/util/deep-replace');
const pluginOptions = require('app/scripts/views/internal/plugins/plugin-options');
const xtend = require('xtend');

module.exports = (fromPlugin, runCommand) =>
  deepReplace(fromPlugin, function (value) {
    let ref;
    if (value != null && (ref = value._callback) != null) {
      const actionFx = (ref, action) =>
        function (runOptions) {
          if (runOptions == null) {
            runOptions = {};
          }
          return runCommand(
            xtend(runOptions, {
              command: 'callback',
              options: {
                action,
                callback: ref,
                options: pluginOptions(runOptions.options),
              },
            }),
          );
        };
      const fx = actionFx(ref, 'run');
      fx.retain = actionFx(ref, 'retain');
      fx.release = actionFx(ref, 'release');
      return fx;
    }
  });
