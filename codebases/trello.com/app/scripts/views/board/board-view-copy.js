// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const CopyBoardView = require('app/scripts/views/board/copy-board-view');

module.exports.copyBoard = function (e) {
  Util.stop(e);
  return PopOver.toggle({
    elem: this.$(e.target).closest('.js-copy-board'),
    view: new CopyBoardView({ model: this.model, modelCache: this.modelCache }),
  });
};
