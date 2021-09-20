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
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_chrome',
);

module.exports = t.renderable(function (content) {
  let { accentColor } = content;
  const { url, height, fullscreen, popoverIsVisible } = content;
  if (content.type !== 'iframe') {
    return;
  }
  if (accentColor == null || !/^#[a-fA-F0-9]{6}$/.test(accentColor)) {
    accentColor = '#EDEFF0';
  }

  return t.div(
    {
      class: t.classify({
        'plugin-chrome-content': true,
        'js-plugin-iframe-container': true,
        'plugin-iframe-container-pop-over-shown': popoverIsVisible,
      }),
    },
    function () {
      t.iframe('.plugin-iframe', {
        allow: 'microphone; camera',
        sandbox: sandboxParams,
        src: url,
        style: t.stylify({ height: !fullscreen ? `${height}px` : undefined }),
      });
      return t.div('.plugin-iframe-popover-overlay');
    },
  );
});
