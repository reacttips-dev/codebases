// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('embedly');

module.exports = () =>
  t.div(
    {
      class: `embed embed-${t.mustacheVar(
        'type',
      )} embed-provider-${t.mustacheVar('provider_name')}`,
    },
    function () {
      t.mustacheBlockInverted('type_photo', function () {
        t.mustacheBlock('requireHttps', () =>
          t.raw(t.mustacheVar('htmlHttps')),
        );
        return t.mustacheBlockInverted('requireHttps', () =>
          t.raw(t.mustacheVar('html')),
        );
      });
      return t.mustacheBlock('type_photo', () =>
        t.a({ href: t.mustacheVar('originalUrl'), target: '_blank' }, () =>
          t.img({ src: t.mustacheVar('url') }),
        ),
      );
    },
  );
