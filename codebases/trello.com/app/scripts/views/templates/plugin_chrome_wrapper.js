// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_chrome',
);

module.exports = t.renderable(function ({ fullscreen, resizable }) {
  if (resizable) {
    return t.div(
      '.js-plugin-chrome-content.plugin-chrome-wrapper.u-relative',
      () =>
        t.div('.js-resize-board-bar.resize-handle-wrapper', () =>
          t.div('.board-bar-resize-handle'),
        ),
    );
  } else if (fullscreen) {
    return t.div('.js-plugin-chrome-content.plugin-chrome-wrapper.fullscreen');
  } else {
    return t.div('.js-plugin-chrome-content.plugin-chrome-wrapper');
  }
});
