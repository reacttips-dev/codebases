// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_background_selection',
);

module.exports = () =>
  t.span(
    {
      class: `background-box ${t.mustacheBlock(
        'pending',
        () => 'background-box-unselectable',
      )}${t.mustacheBlock('tile', () => ' background-tile')}`,
      style: ` ${t.mustacheBlock(
        'backgroundImageThumbnail',
        () =>
          `background-image: url("${t.mustacheVar(
            'backgroundImageThumbnail',
          )}")`,
      )}; ${t.mustacheBlock(
        'color',
        () => `background-color: ${t.mustacheVar('color')};`,
      )} `,
    },
    function () {
      t.mustacheBlock('attribution', () =>
        t.a(
          '.background-option.js-background-attribution',
          {
            href: t.mustacheVar('url'),
            target: '_blank',
            title: t.mustacheVar('url'),
          },
          function () {
            t.img({
              src: require('resources/images/cc.png'),
              style: 'height: 14px; width: 14px; vertical-align: text-top;',
              title: t.mustacheVar('license'),
            });
            return t.span('.text', { style: 'margin-left: 2px;' }, () =>
              t.text(t.mustacheVar('name')),
            );
          },
        ),
      );

      t.mustacheBlock('id', () =>
        t.a('.background-option.js-options', function () {
          t.icon('overflow-menu-horizontal', {
            class: 'light',
            style: 'vertical-align: bottom;',
          });
          return t.span('.text', () => t.format('options'));
        }),
      );

      t.mustacheBlock('error', () =>
        t.span('.background-info', () =>
          t.span('.text', () => t.text(t.mustacheVar('error'))),
        ),
      );

      return t.mustacheBlock('pending', () =>
        t.span('.background-info', function () {
          t.span('.spinner.small.u-float-left', {
            style: 'margin-right: 4px;',
          });
          return t.span('.text', () => t.format('uploading-ellipsis'));
        }),
      );
    },
  );
