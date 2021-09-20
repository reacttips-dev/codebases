// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_menu_meta',
);

module.exports = function () {
  t.hr();

  return t.div(function () {
    t.div(function () {
      t.label(function () {
        t.format('link-to-this-card');
        t.text(' ');
        return t.icon(t.mustacheVar('pLevelClass'), {
          title: t.mustacheVar('pLevelAltText'),
        });
      });
      t.input('.js-short-url.js-autofocus', {
        type: 'text',
        readonly: 'readonly',
        value: t.mustacheVar('shortUrl'),
      });
      return t.div('.js-qr-code');
    });

    t.div(function () {
      t.label(() => t.format('embed-this-card'));
      return t.input('.js-embed', {
        type: 'text',
        readonly: 'readonly',
        value: t.mustacheVar('embed'),
      });
    });

    t.mustacheBlock('email', () =>
      t.mustacheBlock('__ed', () =>
        t.div(function () {
          t.label(() => t.format('email-for-this-card'));
          t.input('.js-email', {
            type: 'text',
            readonly: 'readonly',
            value: t.mustacheVar('email'),
          });
          return t.p('.quiet', { stlye: 'margin: 0 4px;' }, () =>
            t.l(
              'emails-sent-to-this-address-will-appear-as-a-comment-by-you-on-the-card',
            ),
          );
        }),
      ),
    );

    t.hr();

    return t.div('.quiet', function () {
      // guide/hacks/id-short
      t.mustacheBlock('idShort', () =>
        t.p(
          { style: 'display: inline-block; margin: 0 8px 0 0;' },
          function () {
            t.format('card-idshort', { idShort: t.mustacheVar('idShort') });
            return t.text(' ');
          },
        ),
      );

      return t.p({ style: 'display: inline-block; margin: 0;' }, function () {
        t.mustacheBlock('dateAdded', () =>
          t.format('added', { dateAdded: t.mustacheVar('dateAdded') }),
        );

        return t.mustacheBlock('__ed', function () {
          t.text(' - ');
          return t.a('.js-delete', { href: '#' }, () => t.format('delete'));
        });
      });
    });
  });
};
