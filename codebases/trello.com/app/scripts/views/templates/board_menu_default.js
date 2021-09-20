// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_default',
);

const { featureFlagClient } = require('@trello/feature-flag-client');
const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);

const isBoardHeaderFilterEnabled = featureFlagClient.get(
  'ecosystem.board-header-filter',
  false,
);

const powerUpNavigationItem = t.renderable(
  ({ hasPaidOrgPowerUps, hasGoldPowerUps }) =>
    t.li('.board-menu-navigation-item', () =>
      t.a(
        '.board-menu-navigation-item-link.js-open-power-ups',
        { href: '#' },
        function () {
          t.icon('power-up', 'power-ups', {
            class: 'board-menu-navigation-item-link-icon',
          });
          t.raw('&nbsp;');
          if (hasPaidOrgPowerUps) {
            t.icon('business-class', { class: 'mod-quiet' });
          } else if (hasGoldPowerUps) {
            t.icon('trello-gold', { class: 'icon-trello-gold-color' });
          }
          t.span(
            '.board-menu-navigation-item-link-count.js-enabled-power-up-count',
          );
          t.span('.board-menu-navigation-item-new.js-power-up-new', () =>
            t.format('new'),
          );
          t.span(
            '.board-menu-navigation-item-link-warning.js-power-up-disable-timer',
          );
          return t.div('.board-menu-navigation-item-link-summary', function () {
            t.raw('&nbsp;');
            return t.format('power-ups-explanation');
          });
        },
      ),
    ),
);

module.exports = t.renderable(function ({
  hasPaidOrgPowerUps,
  hasGoldPowerUps,
  editable,
  showEnterpriseUpsell,
  isTemplate,
  isCustomFieldsCore,
  isCustomFieldsPluginEnabled,
}) {
  t.p(
    '.error.js-file-too-large',
    { style: 'margin: 12px 0 6px; display:none;' },
    () => t.format('file-too-large-10mb-limit'),
  );

  t.ul('.board-menu-navigation', function () {
    t.li('.board-menu-navigation-item', () =>
      t.a(
        '.board-menu-navigation-item-link.js-about-this-board',
        { href: '#' },
        function () {
          t.span('.board-menu-navigation-item-link-icon.icon-lg.icon-board');
          t.raw('&nbsp;');
          if (isTemplate) {
            t.format('about-this-template');
          } else {
            t.format('about-this-board');
          }
          return t.div(
            '.board-menu-navigation-item-link-summary.board-menu-about-this-board-summary',
            function () {
              t.raw('&nbsp;');
              if (isTemplate) {
                return t.format('add-a-description-to-your-template');
              } else {
                return t.format('add-a-description-to-your-board');
              }
            },
          );
        },
      ),
    );
    if (editable) {
      t.li('.board-menu-navigation-item.mod-background', () =>
        t.a(
          '.board-menu-navigation-item-link.js-change-background',
          { href: '#' },
          function () {
            t.span(
              '.board-menu-navigation-item-link-icon.js-fill-background-preview',
            );
            t.raw('&nbsp;');
            return t.format('change-background');
          },
        ),
      );
    }

    if (!isInFilteringExperiment && !isBoardHeaderFilterEnabled) {
      t.li('.board-menu-navigation-item', () =>
        t.a(
          '.board-menu-navigation-item-link.js-open-card-filter',
          { href: '#' },
          () =>
            t.icon('search', 'search-cards', {
              class: 'board-menu-navigation-item-link-icon',
            }),
        ),
      );
    }

    if (editable) {
      if (
        featureFlagClient.get('ecosystem.custom-fields-sku-relocation', false)
      ) {
        if (
          isCustomFieldsCore &&
          featureFlagClient.get('ecosystem.suggested-custom-fields', false)
        ) {
          t.li('.board-menu-navigation-item', () =>
            t.div('.js-board-custom-fields'),
          );
        } else if (isCustomFieldsCore || isCustomFieldsPluginEnabled) {
          t.li('.board-menu-navigation-item', () =>
            t.a(
              '.board-menu-navigation-item-link.js-board-custom-fields-old',
              { href: '#' },
              () =>
                t.icon('custom-field', 'custom-fields', {
                  class: 'board-menu-navigation-item-link-icon',
                }),
            ),
          );
        } else {
          t.li('.board-menu-navigation-item.disabled', function () {
            t.span('.board-menu-navigation-item-link.', function () {
              t.icon('custom-field', 'custom-fields', {
                class: 'board-menu-navigation-item-link-icon',
              });
              return t.div(
                '.board-menu-pill-upgrade.js-board-menu-pill-custom-fields-upgrade',
              );
            });
            return t.div('.js-board-menu-prompt-custom-fields');
          });
        }
      }
    }

    if (editable) {
      t.li('.board-menu-navigation-item', () =>
        t.a(
          '.board-menu-navigation-item-link.js-open-stickers',
          { href: '#' },
          () =>
            t.icon('sticker', 'stickers', {
              class: 'board-menu-navigation-item-link-icon',
            }),
        ),
      );
    }
    t.li('.board-menu-navigation-item', () =>
      t.a('.board-menu-navigation-item-link.js-open-more', { href: '#' }, () =>
        t.icon('overflow-menu-horizontal', 'more', {
          class: 'board-menu-navigation-item-link-icon',
        }),
      ),
    );

    if (editable) {
      return t.div('.js-butler-button.hide', function () {
        t.hr();
        return t.li('.board-menu-navigation-item', () =>
          t.a(
            '.board-menu-navigation-item-link.js-open-butler',
            { href: '#' },
            function () {
              t.icon('automation', 'automation', {
                class: 'board-menu-navigation-item-link-icon',
              });
              return t.div(
                '.board-menu-navigation-item-link-summary',
                function () {
                  t.raw('&nbsp;');
                  return t.format('butler-description');
                },
              );
            },
          ),
        );
      });
    }
  });

  if (editable) {
    t.hr();
    if (showEnterpriseUpsell) {
      t.div('.enterprise-up-sell.on-board', function () {
        t.div('.enterprise-up-sell-body', () =>
          t.div('.enterprise-up-sell-copy', function () {
            t.h2('.enterprise-up-sell-header', function () {
              t.span('.icon-lg.icon-power-up');
              return t.format('ads-ent-title');
            });
            return t.div('.enterprise-up-sell-description', () =>
              t.format('ads-ent-description'),
            );
          }),
        );
        return t.div('.enterprise-up-sell-footer', () =>
          t.div('.enterprise-up-sell-actions', function () {
            t.button('.js-enterprise-upsell-dismiss', () =>
              t.format('ads-ent-dismiss'),
            );
            return t.button(
              '.js-enterprise-upsell-learn-more.nch-button.nch-button--primary',
              () => t.format('ads-ent-learn-more'),
            );
          }),
        );
      });
    }

    t.ul('.board-menu-navigation', () =>
      powerUpNavigationItem({ hasPaidOrgPowerUps, hasGoldPowerUps }),
    );
    if (!featureFlagClient.get('ecosystem.pup-header-cleanup', false)) {
      t.div('.js-power-up-slots-container');
    }
  }

  if (!isTemplate) {
    t.hr();

    t.a(
      '.board-menu-section-header.js-open-activity',
      { href: '#' },
      function () {
        t.span('.board-menu-section-header-icon.icon-lg.icon-activity');
        t.span('.board-menu-section-header-title', () => t.format('activity'));
        return t.span(
          '.board-menu-section-header-count.js-unread-activity-count',
        );
      },
    );

    t.div('.js-menu-action-list');

    return t.a('.show-more.js-fill-activity-button.js-open-activity', {
      href: '#',
    });
  }
});
