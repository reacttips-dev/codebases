// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('board');

module.exports = function () {
  t.div('.board-main-content', function () {
    t.div(
      `.board-header.u-clearfix.js-board-header${
        t.mustacheVar('isCollapsedWorkspaceNav')
          ? '.collapsed-workspace-nav'
          : ''
      }`,
    );
    t.div('.board-warnings.u-clearfix.js-board-warnings');
    t.div('.board-canvas', function () {
      t.div('.js-board-view-container');
    });
  });

  return t.div('.board-menu.js-fill-board-menu');
};
