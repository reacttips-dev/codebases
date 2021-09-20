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
const _ = require('underscore');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'list_menu',
);

module.exports = t.renderable(function ({
  editable,
  subscribed,
  canCopyList,
  hasSortableCards,
  pluginActions,
  listLimitsEnabled,
  isTemplate,
}) {
  t.ul('.pop-over-list', function () {
    if (editable) {
      t.li(() =>
        t.a('.js-add-card', { href: '#' }, () => t.format('add-card-ellipsis')),
      );
      if (canCopyList) {
        t.li(() =>
          t.a('.js-copy-list', { href: '#' }, () =>
            t.format('copy-list-ellipsis'),
          ),
        );
      }
      t.li(() =>
        t.a('.js-move-list', { href: '#' }, () =>
          t.format('move-list-ellipsis'),
        ),
      );
    }
    if (!isTemplate) {
      return t.li(() =>
        t.a('.highlight-icon.js-list-subscribe', { href: '#' }, () =>
          t.check(subscribed, 'watch'),
        ),
      );
    }
  });

  if (editable) {
    if (hasSortableCards) {
      t.hr();
      t.ul('.pop-over-list', () =>
        t.li(() =>
          t.a('.js-sort-cards', { href: '#' }, () => t.format('sort-by')),
        ),
      );
    }

    t.div('.js-list-menu-butler-section');

    if ((pluginActions != null ? pluginActions.length : undefined) > 0) {
      t.hr();

      t.ul('.pop-over-list', () =>
        pluginActions.map((action, index) =>
          t.li(function () {
            if (_.isFunction(action.callback)) {
              return t.a(
                '.plugin-list-action.js-plugin-list-action',
                { href: '#', 'data-index': index, title: action.text },
                function () {
                  t.span(() => t.text(action.text));
                  return t.img({
                    src: action.icon,
                    title: action.name,
                    height: '18px',
                    width: '18px',
                  });
                },
              );
            }
          }),
        ),
      );
    }

    if (listLimitsEnabled) {
      t.hr();
      t.ul('.pop-over-list', () =>
        t.li(() =>
          t.a('.js-set-list-limit', { href: '#' }, () =>
            t.format('set-list-limit'),
          ),
        ),
      );
    }

    t.hr();

    t.ul('.pop-over-list', function () {
      t.li(() =>
        t.a('.js-move-cards', { href: '#' }, () =>
          t.format('move-all-cards-in-this-list-ellipsis'),
        ),
      );
      return t.li(() =>
        t.a('.js-archive-cards', { href: '#' }, () =>
          t.format('archive-all-cards-in-this-list-ellipsis'),
        ),
      );
    });

    t.hr();

    return t.ul('.pop-over-list', () =>
      t.li(() =>
        t.a('.js-close-list', { href: '#' }, () =>
          t.format('archive-this-list'),
        ),
      ),
    );
  }
});
