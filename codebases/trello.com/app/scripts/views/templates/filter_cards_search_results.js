// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'filter_cards_search_results',
);

const { featureFlagClient } = require('@trello/feature-flag-client');
const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);

module.exports = function () {
  t.mustacheBlock('showHelper', () =>
    t.p('.quiet', { style: 'padding: 10px 8px 2px; margin-bottom: 0;' }, () =>
      t.format('type-to-search-by-term-label-member-or-due-time'),
    ),
  );

  t.mustacheBlock('showLabels', function () {
    t.hr();

    return t.ul(
      {
        class: `label-list${t.mustacheBlock('limitLabels', () => ' limited')}`,
      },
      function () {
        t.mustacheBlock('labels', () =>
          t.li(
            {
              class: `label-list-item${t.mustacheBlock(
                'isActive',
                () => ' is-active',
              )}`,
            },
            () =>
              t.a(
                '.label-list-item-link.js-toggle-label-filter',
                {
                  href: '#',
                  'data-name': t.mustacheVar('color'),
                  'data-idlabel': t.mustacheVar('id'),
                },
                function () {
                  t.div('.label-list-item-link-label', () =>
                    t.span({
                      class: `card-label mod-square card-label-${t.mustacheVar(
                        'color',
                      )}`,
                    }),
                  );
                  t.mustacheBlock('name', () =>
                    t.span('.label-list-item-link-name', () =>
                      t.text(t.mustacheVar('name')),
                    ),
                  );
                  t.mustacheBlockInverted('name', () =>
                    t.span('.label-list-item-link-name.mod-quiet', () =>
                      t.format('color-label-default', {
                        color: t.mustacheVar('defaultColorName'),
                      }),
                    ),
                  );
                  return t.icon('check', {
                    class: 'label-list-item-link-icon',
                  });
                },
              ),
          ),
        );

        return t.mustacheBlock('limitLabels', () =>
          t.li('.label-list-item.js-show-all-labels-elem', () =>
            t.a('.label-list-item-link.js-show-all-labels', { href: '#' }, () =>
              t.span('.label-list-item-link-name.mod-quiet', () =>
                t.format('show-all-labels-remaininglabels-hidden', {
                  remainingLabels: t.mustacheVar('remainingLabels'),
                }),
              ),
            ),
          ),
        );
      },
    );
  });

  t.mustacheBlock('showMembers', function () {
    t.hr();

    t.ul(
      {
        class: `pop-over-member-list checkable js-mem-list${t.mustacheBlock(
          'limitMembers',
          () => ' limited',
        )}`,
      },
      () =>
        t.mustacheBlock('members', () =>
          t.mustachePartial(
            require('app/scripts/views/templates/select_member'),
          ),
        ),
    );

    return t.mustacheBlock('limitMembers', () =>
      t.ul('.pop-over-member-list', () =>
        t.li('.item', () =>
          t.a(
            '.name.quiet.js-show-all-members',
            {
              href: '#',
              style:
                'padding-left: 42px; font-weight: normal; margin-top: 4px;',
            },
            () =>
              t.format('show-all-members-remainingmembers-hidden', {
                remainingMembers: t.mustacheVar('remainingMembers'),
              }),
          ),
        ),
      ),
    );
  });

  t.mustacheBlock('showDueTimes', function () {
    t.hr();

    return t.ul('.pop-over-list.checkable.navigable.inset.normal-weight', () =>
      t.mustacheBlock('dueOptions', () =>
        t.li(
          { class: `item ${t.mustacheBlock('isActive', () => ' active')}` },
          () =>
            t.a(
              '.js-due-filter',
              {
                href: '#',
                time: t.mustacheVar('time'),
                style: 'padding-left: 40px;',
              },
              function () {
                t.text(t.mustacheVar('desc'));
                return t.icon('check');
              },
            ),
        ),
      ),
    );
  });

  t.mustacheBlock('showMatchMode', function () {
    t.hr();

    return t.ul('.pop-over-list.checkable.navigable.inset.normal-weight', () =>
      t.mustacheBlock('modes', () =>
        t.li(
          { class: `item ${t.mustacheBlock('isActive', () => ' active')}` },
          () =>
            t.a(
              '.js-mode-filter',
              {
                href: '#',
                mode: t.mustacheVar('mode'),
                style: 'padding-left: 40px;',
              },
              function () {
                t.text(t.mustacheVar('desc'));
                return t.icon('check');
              },
            ),
        ),
      ),
    );
  });

  if (!isInFilteringExperiment) {
    t.hr();

    return t.ul('.pop-over-list.inset.normal-weight', () =>
      t.li(() =>
        t.a(
          {
            href: '#',
            class: `js-clear-all${t.mustacheBlockInverted(
              'isFiltering',
              () => ' disabled',
            )}`,
            style: 'padding-left: 40px;',
          },
          () => t.format('clear-search'),
        ),
      ),
    );
  }
};
