// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'attachment_viewer_frame_details',
);

module.exports = () =>
  t.div('.attachment-viewer-frame-details', function () {
    t.h2('.attachment-viewer-frame-details-title', () =>
      t.text(t.mustacheVar('name')),
    );

    t.p(function () {
      t.mustacheBlock('date', () =>
        t.format('added', { date: t.mustacheVar('date') }),
      );
      return t.mustacheBlock('meta', function () {
        t.text(' - ');
        return t.text(t.mustacheVar('meta'));
      });
    });

    return t.p(function () {
      t.span('.js-meta', function () {
        const opts = { href: t.mustacheVar('url'), target: '_blank' };
        t.a(opts, function () {
          t.span({
            class: `icon-sm icon-${t.mustacheVar(
              'openIconClass',
            )} light attachment-viewer-option-icon`,
          });
          return t.text(t.mustacheVar('openText'));
        });

        return t.mustacheBlock('__ed', function () {
          t.span(
            {
              class: `js-cover-options${t.mustacheBlockInverted(
                'canMakeCover',
                () => ' hide',
              )}`,
            },
            function () {
              t.span(
                {
                  class: `js-make-cover-box${t.mustacheBlock(
                    'isCover',
                    () => ' hide',
                  )}`,
                },
                () =>
                  t.a('.js-make-cover', { href: '#' }, function () {
                    t.icon('card-cover', {
                      class: 'light attachment-viewer-option-icon',
                    });
                    return t.format('make-cover');
                  }),
              );

              return t.span(
                {
                  class: `js-remove-cover-box${t.mustacheBlockInverted(
                    'isCover',
                    () => ' hide',
                  )}`,
                },
                () =>
                  t.a('.js-remove-cover', { href: '#' }, function () {
                    t.icon('card-cover', {
                      class: 'light attachment-viewer-option-icon',
                    });
                    return t.format('remove-cover');
                  }),
              );
            },
          );

          return t.a('.js-open-delete-confirm', { href: '#' }, function () {
            t.icon('close', { class: 'light attachment-viewer-option-icon' });
            return t.text(t.mustacheVar('removeButtonText'));
          });
        });
      });

      return t.span('.js-confirm-delete.hide', function () {
        t.text(t.mustacheVar('removeMessageText'));
        t.a('.attachment-viewer-delete-link.js-delete', { href: '#' }, () =>
          t.text(t.mustacheVar('removeConfirmText')),
        );
        return t.a(
          '.attachment-viewer-delete-link.js-close-delete-confirm',
          { href: '#' },
          () => t.text(t.mustacheVar('removeCancelText')),
        );
      });
    });
  });
