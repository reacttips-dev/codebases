/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const React = require('react');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const BoardSidebarPowerUpSlotView = require('app/scripts/views/board-menu/board-sidebar-power-up-slot-view');
const { MemberState } = require('app/scripts/view-models/member-state');
const { featureFlagClient } = require('@trello/feature-flag-client');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const BluebirdPromise = require('bluebird');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_power_up_slot',
);
const {
  renderUpgradePrompt,
} = require('app/src/components/UpgradePrompts/renderUpgradePrompt');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { UpgradeSmartComponent } = require('app/src/components/UpgradePrompts');
const { PrivateIcon } = require('@trello/nachos/icons/private');

const emptySlotUpsell = t.renderable(() =>
  t.li('.board-menu-navigation-item.mod-power-up-slot.js-empty-slot-upsell'),
);

const emptySlot = t.renderable(({ index }) =>
  t.li('.board-menu-navigation-item.mod-power-up-slot', () =>
    t.a(
      '.board-menu-navigation-item-link.js-power-up-empty-slot',
      { href: '#' },
      function () {
        t.span('.board-menu-navigation-item-link-icon', function () {
          if (index != null) {
            return t.text(index);
          }
        });
        t.raw('&nbsp;');
        return t.format('add-power-up');
      },
    ),
  ),
);

const template = t.renderable(function () {
  t.ul('.board-menu-navigation.js-power-up-slots');
  t.ul('.board-menu-navigation.js-upsell-slots');
  return t.ul('.board-menu-navigation', function () {
    t.li(
      '.board-menu-navigation-item.mod-power-up-slot.js-show-fewer.hide',
      () =>
        t.a('.board-menu-navigation-item-link', { href: '#' }, function () {
          t.raw('&nbsp;');
          return t.format('show-fewer-power-ups');
        }),
    );
    return t.li(
      '.board-menu-navigation-item.mod-power-up-slot.js-show-more.hide',
      () =>
        t.a('.board-menu-navigation-item-link', { href: '#' }, function () {
          t.raw('&nbsp;');
          return t.format('view-all-power-ups');
        }),
    );
  });
});

class BoardSidebarPowerUpSlotsView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-show-fewer': 'showFewer',
      'click .js-show-more': 'showMore',
    };
  }

  initialize() {
    this.collapsed = false;

    this.makeDebouncedMethods('renderPowerUpSlots');

    this.listenTo(this.model, {
      'change:idOrganization': this.renderPowerUpSlotsDebounced,
    });

    this.listenTo(this.model.boardPluginList, {
      'add remove reset': (e) => {
        return this.renderPowerUpSlotsDebounced();
      },
    });

    this.subscribe(pluginsChangedSignal(this.model), () => {
      return this.renderPowerUpSlotsDebounced();
    });

    this.listenTo(MemberState, {
      'change:idBoardCollapsedPowerUps': this.renderPowerUpSlotsDebounced,
    });
  }

  remove() {
    if (typeof this.unmountPupPrompt === 'function') {
      this.unmountPupPrompt();
    }
    return super.remove(...arguments);
  }

  showFewer(e) {
    Util.stop(e);
    Analytics.sendClickedButtonEvent({
      buttonName: 'showFewerPowerUpsButton',
      source: 'boardMenuDrawerDefaultScreen',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });
    return MemberState.pushBoardCollapsedPowerUps(this.model.id);
  }

  showMore(e) {
    Util.stop(e);
    Analytics.sendClickedButtonEvent({
      buttonName: 'showAllPowerUpsButton',
      source: 'boardMenuDrawerDefaultScreen',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });
    return MemberState.pullBoardCollapsedPowerUps(this.model.id);
  }

  isCollapsed() {
    return MemberState.inSet('idBoardCollapsedPowerUps', this.model.id);
  }

  renderPowerUpSlots() {
    const collapsed = this.isCollapsed();
    const countCustomFields = featureFlagClient.get(
      'ecosystem.custom-fields-sku-relocation',
      false,
    );
    const unlimitedPups = featureFlagClient.get(
      'ecosystem.repackaging-pups',
      false,
    );

    let boardPlugins = this.model.boardPluginList.models;

    // filter out Butler, Map, and Custom Fields.
    boardPlugins = boardPlugins.filter(
      (boardPlugin) =>
        !(this.model.isButlerCore() && boardPlugin.isButler()) &&
        !(this.model.isMapCore() && boardPlugin.isMap()) &&
        !(countCustomFields && boardPlugin.isCustomFields()),
    );

    return BluebirdPromise.map(boardPlugins, (boardPlugin) => {
      return PluginRunner.getOrLoadPlugin(
        this.model,
        boardPlugin.get('idPlugin'),
      );
    })
      .map((plugin) => {
        return this.subview(
          BoardSidebarPowerUpSlotView,
          this.model,
          {
            plugin,
            currentPage: 'board view',
          },
          plugin.id,
        );
      })
      .then((subviews) => {
        let subviewsToRender = subviews;

        if (collapsed & (subviews.length > 3)) {
          subviewsToRender = _.first(subviews, 3);
        }

        return this.ensureSubviews(
          subviewsToRender,
          this.$('.js-power-up-slots'),
        );
      })
      .finally(() => {
        let left;
        const $powerUpSlotUpsellContainer = this.$('.js-upsell-slots');
        if (typeof this.unmountPupPrompt === 'function') {
          this.unmountPupPrompt();
        }
        $powerUpSlotUpsellContainer.empty();

        const powerUpsCount = this.model.powerUpsCount();

        const isShowFewerVisible = powerUpsCount > 3 && !collapsed;
        this.$('.js-show-fewer').toggleClass('hide', !isShowFewerVisible);

        const isShowMoreVisible = powerUpsCount > 3 && collapsed;
        this.$('.js-show-more').toggleClass('hide', !isShowMoreVisible);

        const me = Auth.me();
        const org = this.model.getOrganization();
        const isPremium =
          (left = org != null ? org.isPremium() : undefined) != null
            ? left
            : false;

        if (this.model.canEnableAdditionalPowerUps()) {
          let numberOfEmptySlots = 1;

          if (me.isFeatureEnabled('threePlugins')) {
            numberOfEmptySlots = 3 - powerUpsCount;
          }

          if (me.getPowerUpsLimit(org) >= 3) {
            if (powerUpsCount < 3) {
              numberOfEmptySlots = 3 - powerUpsCount;
            } else {
              numberOfEmptySlots = 1;
            }
          }

          _.times(numberOfEmptySlots, (i) =>
            $powerUpSlotUpsellContainer.append(
              emptySlot({
                index:
                  isPremium || unlimitedPups
                    ? undefined
                    : i + 1 + powerUpsCount,
              }),
            ),
          );
        }

        const orgId = org ? org.id : undefined;
        $powerUpSlotUpsellContainer.append(emptySlotUpsell());
        if (
          !featureFlagClient.get(
            'ecosystem.custom-fields-sku-relocation',
            false,
          )
        ) {
          if (orgId) {
            const upgradePrompt = (
              <span className="board-menu-navigation-item-link disabled">
                <span className="board-menu-navigation-item-link-icon mod-upsell-slot">
                  <PrivateIcon size="small" />
                </span>
                <UpgradeSmartComponent
                  orgId={orgId || ''}
                  promptId="boardMenuDrawerPromptFull"
                />
              </span>
            );
            renderUpgradePrompt(
              upgradePrompt,
              $powerUpSlotUpsellContainer.find('.js-empty-slot-upsell')[0],
              { boardModel: this.model },
            );
          }
        }
      });
  }

  render() {
    this.$el.html(template());
    this.renderPowerUpSlots();
    return this;
  }
}

BoardSidebarPowerUpSlotsView.initClass();
module.exports = BoardSidebarPowerUpSlotsView;
