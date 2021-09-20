/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginCardButtonsView;
const _ = require('underscore');
const CardAgingCardButtonView = require('app/scripts/views/card-aging/card-aging-card-button-view');
const CardLocationButtonView = require('app/scripts/views/map/card-location-button-view');
const { Controller } = require('app/scripts/controller');
const CustomFieldCardButtonView = require('app/scripts/views/custom-field/custom-field-card-button-view');
const PluginButtonsView = require('app/scripts/views/plugin/plugin-buttons-view');
const PluginCardButtonView = require('app/scripts/views/plugin/plugin-card-button-view');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  UpgradeSmartComponentConnected,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_detail',
);
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Util } = require('app/scripts/lib/util');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const { Analytics } = require('@trello/atlassian-analytics');

const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;
const { BUTLER_POWER_UP_ID } = require('app/scripts/data/butler-id');

const _placeholderCountCache = {};

const nativeCustomFieldsEnabled = (board) =>
  board.isPluginEnabled(CUSTOM_FIELDS_ID) && board.editable();
const template = t.renderable(function ({
  showGetPups,
  hasButtons,
  placeholders,
}) {
  t.h3('mod-no-top-margin', () => t.format('plugins'));
  t.div('.u-clearfix.js-button-list', function () {
    if (placeholders) {
      return _.times(placeholders, () =>
        t.a('.button-link.disabled', () => t.span('')),
      );
    }
  });

  if (showGetPups) {
    return t.div(function () {
      t.a(
        '.button-link.add-button-link.js-add-pups',
        {
          href: '#',
          title: t.l('add-pups'),
        },
        () => t.format('add-pups'),
      );
      if (!featureFlagClient.get('ecosystem.repackaging-pups', false)) {
        return t.div('.js-card-back-pup-prompt');
      }
    });
  }
});

module.exports = PluginCardButtonsView = (function () {
  PluginCardButtonsView = class PluginCardButtonsView extends (
    PluginButtonsView
  ) {
    static initClass() {
      this.prototype.tagName = 'div';
      this.prototype.className = 'window-module u-clearfix hide';
      this.prototype.buttonsSelector = '.js-button-list';
      this.prototype.buttonView = PluginCardButtonView;
      this.prototype.events = { 'click .js-add-pups': 'addPowerUpsOnClick' };
    }

    remove() {
      if (typeof this.unmountPupPrompt === 'function') {
        this.unmountPupPrompt();
      }
      return super.remove(...arguments);
    }

    _getPlaceholderCountCacheKey() {
      return `${
        this.model.getBoard().id
      }:${this.model.getBoard().idPluginsEnabled().sort().join(':')}`;
    }

    getPlaceholderCount() {
      let placeholders = 0;

      const placeholderCountCacheKey = this._getPlaceholderCountCacheKey();
      if (_placeholderCountCache[placeholderCountCacheKey]) {
        placeholders = _placeholderCountCache[placeholderCountCacheKey];
      } else {
        // we are going to make a guesstimate on how many buttons we can expect
        // our assumption is that a plugin that declares it supports the 'card-buttons'
        // capability is most likely to give us back exactly one button
        // NOTE: plugins are loading asynchronously from the board and speed here matters
        // that means if a person loads a card directly, its possible the actual plugins
        // haven't loaded yet, so we won't wait on them, we'll skip them
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        if (!this.model.getBoard().editable()) {
          return placeholders;
        }
        const { ModelCache } = require('app/scripts/db/model-cache');

        const includeIf = (plugin) =>
          plugin != null &&
          _.contains(plugin.get('capabilities'), 'card-buttons') &&
          // https://trello.com/c/xozF2u4V: by default, Butler does not return card buttons,
          // but is also always enabled for every user, so we ignore it
          // to prevent a more common "off by one" placeholder issue
          plugin.id !== BUTLER_POWER_UP_ID;
        placeholders = this.model
          .getBoard()
          .idPluginsEnabled()
          .map((idPlugin) => ModelCache.get('Plugin', idPlugin))
          .filter(includeIf).length;
      }

      return placeholders;
    }

    hideContainer(pluginButtons) {
      if (pluginButtons == null) {
        // no placeholders and not editable
        return this.placeholderCount === 0 && !this.model.getBoard().editable();
      } else {
        // no buttons and not editable
        return pluginButtons.length === 0 && !this.model.getBoard().editable();
      }
    }

    renderContainer(pluginButtons, loading) {
      if (loading == null) {
        loading = false;
      }
      const board = this.model.getBoard();
      const hasButtons = pluginButtons.length > 0;
      const showGetPups = board.editable();
      const placeholders = !loading ? 0 : this.getPlaceholderCount();

      if (loading) {
        this.placeholderCount = placeholders;
      }

      this.$el.html(template({ hasButtons, showGetPups, placeholders }));

      const reactRoot = this.$el.find('.js-card-back-pup-prompt')[0];
      if (reactRoot) {
        this.unmountPupPrompt = () =>
          reactRoot && ReactDOM.unmountComponentAtNode(reactRoot);
        renderComponent(
          <UpgradeSmartComponentConnected
            orgId={this.model.getBoard().getOrganization()?.id}
            promptId="pupUpgradePromptPill"
          />,
          reactRoot,
        );
      }

      return this.$('.js-button-list');
    }

    renderButtons(pluginButtons) {
      const board = this.model.getBoard();

      if (
        !featureFlagClient.get(
          'ecosystem.custom-fields-sku-relocation',
          false,
        ) &&
        nativeCustomFieldsEnabled(board)
      ) {
        pluginButtons.push({
          text: t.l('custom-fields'),
          view: CustomFieldCardButtonView,
        });
      }

      if (
        !board.isMapCore() &&
        board.isMapPowerUpEnabled() &&
        board.editable()
      ) {
        pluginButtons.push({
          text: t.l('location'),
          view: CardLocationButtonView,
        });
      }

      if (board.isPowerUpEnabled('cardAging') && board.editable()) {
        pluginButtons.push({
          text: t.l('card-aging'),
          view: CardAgingCardButtonView,
        });
      }

      super.renderButtons(pluginButtons);

      const actualCount = this.$('.js-button-list').children().length;
      return (_placeholderCountCache[
        this._getPlaceholderCountCacheKey()
      ] = actualCount);
    }

    runnerOptions() {
      return {
        command: 'card-buttons',
        board: this.model.getBoard(),
        card: this.model,
        list: this.model.getList(),
      };
    }

    renderOnce() {
      this.renderContainer([], true);
      this.$el.toggleClass('hide', this.hideContainer());
      return super.renderOnce(...arguments);
    }

    showPowerUpDirectory() {
      if (!currentModelManager.onAnyBoardView()) {
        window.open('/power-ups', '_blank');
        return;
      }

      if (!this.model?.getBoard()?.canEnableAdditionalPowerUps()) {
        Analytics.sendTrackEvent({
          action: 'exceeded',
          actionSubject: 'powerUpLimit',
          source: 'inBoardPowerUpDirectory',
          containers: {
            board: {
              id: this.model.getBoard()?.id,
            },
            organization: {
              id: this.model.getBoard()?.getOrganization()?.id,
            },
            enterprise: {
              id: this.model.getBoard()?.getEnterprise()?.id,
            },
          },
          attributes: {
            fromBoardMenu: false,
            fromCard: true,
          },
        });
      }

      const boardView = Controller.getCurrentBoardView();
      boardView.navigateToDirectory(this.model);
    }

    addPowerUpsOnClick(e) {
      Util.stop(e);
      Analytics.sendClickedButtonEvent({
        buttonName: 'addPowerUpsButton',
        source: 'cardDetailScreen',
        containers: {
          card: { id: this.model.id },
          board: { id: this.model.get('idBoard') },
          organization: {
            id: this.model.getBoard()?.get('idOrganization'),
          },
          enterprise: { id: this.model.getBoard()?.get('idEnterprise') },
        },
      });

      this.showPowerUpDirectory();
    }
  };

  PluginCardButtonsView.initClass();
  return PluginCardButtonsView;
})();
