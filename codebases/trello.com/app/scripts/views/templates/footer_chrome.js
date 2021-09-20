// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'footer_chrome',
);

module.exports = t.renderable(function ({ url }) {
  t.a('.footer-chrome-logo', { href: '/', 'aria-label': t.l('trello-home') });
  return t.div('.footer-chrome-links', function () {
    t.a(
      '.dark-hover',
      { href: url, target: '_blank', rel: 'noopener' },
      function () {
        t.format('open-in-new-window');
        return t.span('.icon-sm.icon-external-link');
      },
    );
  });
});
