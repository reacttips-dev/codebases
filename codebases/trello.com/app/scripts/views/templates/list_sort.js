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
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'list_sort',
);

module.exports = t.renderable(({ canSortByDueDate, pluginListSorters }) =>
  t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a('.js-sort-newest-first', { href: '#' }, () =>
        t.format('sort-newest-first'),
      ),
    );

    t.li(() =>
      t.a('.js-sort-oldest-first', { href: '#' }, () =>
        t.format('sort-oldest-first'),
      ),
    );

    t.li(() =>
      t.a('.js-sort-by-card-name', { href: '#' }, () =>
        t.format('sort-by-card-name'),
      ),
    );

    if (canSortByDueDate) {
      t.li(() =>
        t.a('.js-sort-by-due-date', { href: '#' }, () => t.format('due-date')),
      );
    }

    if (
      (pluginListSorters != null ? pluginListSorters.length : undefined) > 0
    ) {
      t.hr();

      return pluginListSorters.map((pluginSort, index) =>
        t.li(() =>
          t.a(
            '.plugin-list-action.js-plugin-list-sort-action',
            {
              'data-index': index,
              href: '#',
              title: pluginSort.text,
            },
            function () {
              t.span(() => t.text(pluginSort.text));
              if (pluginSort.icon != null) {
                return t.icon(pluginSort.icon);
              } else if (pluginSort.image != null) {
                return t.img({
                  src: pluginSort.image,
                  title: pluginSort.name,
                  height: '18px',
                  width: '18px',
                });
              }
            },
          ),
        ),
      );
    }
  }),
);
