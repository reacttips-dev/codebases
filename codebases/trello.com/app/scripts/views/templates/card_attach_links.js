// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_attach_links',
);

module.exports = t.renderable((links) =>
  t.div('.card-attach-link-list', () =>
    (() => {
      const result = [];
      for (const { url, text, domain, attached } of Array.from(links)) {
        result.push(
          t.div(
            '.card-attach-link-list-item',
            { class: t.classify({ attached }) },
            function () {
              t.div('.card-attach-link-list-item-title', function () {
                if (text) {
                  return t.text(text);
                } else {
                  return t.format('link to domain', { domain });
                }
              });

              t.div('.card-attach-link-list-item-url.quiet', () => t.text(url));

              if (!attached) {
                return t.button(
                  '.card-attach-link-list-item-attach.js-attach',
                  { 'data-url': url, 'data-text': text },
                  () => t.format('attach'),
                );
              } else {
                return t.div('.card-attach-link-list-item-attached.quiet', () =>
                  t.span('.icon-lg.icon-check'),
                );
              }
            },
          ),
        );
      }
      return result;
    })(),
  ),
);
