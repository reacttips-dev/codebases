// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_share',
);

module.exports = t.renderable(
  ({
    hasCsvExport,
    csvURL,
    jsonURL,
    needsUpgradeForCsv,
    upgradeUrl,
    hasOrganization,
    upsellEnabled,
    isAdDismissed,
    featureFlag,
  }) =>
    t.ul('.pop-over-list', function () {
      t.li(() =>
        t.a(
          '.js-print',
          {
            href: '#',
            title: t.l(
              'print-using-the-browser-s-print-function-you-can-use-file',
            ),
          },
          () => t.format('print-ellipsis'),
        ),
      );
      if (featureFlag) {
        t.li(() => {
          if (hasCsvExport) {
            return t.a('.js-export', { href: '#' }, () =>
              t.format('export-board'),
            );
          } else {
            return t.a(
              '.js-export-json',
              {
                href: jsonURL,
                title: t.l('export-the-board-data-in-json-format'),
              },
              () => t.format('export-json'),
            );
          }
        });
      } else {
        t.li(() => {
          if (hasCsvExport) {
            return t.a(
              '.js-export-csv',
              {
                href: csvURL,
                title: t.l('export-the-board-data-in-csv-format'),
              },
              () => t.format('export-csv'),
            );
          } else {
            return t.a(
              '.disabled',
              { href: '#', title: t.l('export-the-board-data-in-csv-format') },
              function () {
                t.format('export-csv');
                return t.div({
                  class: 'export-csv-update-pill',
                  id: 'js-export-csv-pill-update-prompt',
                });
              },
            );
          }
        });

        t.li(() =>
          t.a(
            '.js-export-json',
            {
              href: jsonURL,
              title: t.l('export-the-board-data-in-json-format'),
            },
            () => t.format('export-json'),
          ),
        );
      }

      if (!hasCsvExport && upsellEnabled) {
        return t.div('.popover-share-ads-container', () => {
          return t.div('.print-and-export-upgrade-prompt-wrapper');
        });
      }
    }),
);
