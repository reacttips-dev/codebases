/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Util } = require('app/scripts/lib/util');
const { rpc } = require('app/scripts/network/rpc');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.SessionStatus = {
  start() {
    rpc.on('ready', () => {
      return $(window).on('beforeunload', () => {
        this.markCurrentBoardAsViewed();
      });
    });

    return rpc.on('updateModels deleteModels', ({ idModelChannel }) => {
      if (
        idModelChannel != null &&
        idModelChannel ===
          __guard__(currentModelManager.getCurrentBoard(), (x) => x.id)
      ) {
        this.scheduleMarkCurrentBoardAsViewed();
      }
    });
  },

  markCurrentBoardAsViewed() {
    clearTimeout(this._markAsViewedTimeout);
    return __guard__(currentModelManager.getCurrentBoard(), (x) =>
      x.markAsViewed(),
    );
  },

  scheduleMarkCurrentBoardAsViewed() {
    // We're depending on the fact that the timeout will be cleared on view changes,
    // so the timeout won't fire if the current board changes in the next minute.
    clearTimeout(this._markAsViewedTimeout);

    return (this._markAsViewedTimeout = setTimeout(
      () => this.markCurrentBoardAsViewed(),
      Util.getMs({ minutes: 5 }),
    ));
  },
};
