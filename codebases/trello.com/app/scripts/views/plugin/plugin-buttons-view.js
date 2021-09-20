/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginButtonsView;
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const PluginView = require('app/scripts/views/plugin/plugin-view');

module.exports = PluginButtonsView = (function () {
  PluginButtonsView = class PluginButtonsView extends PluginView {
    static initClass() {
      this.prototype.buttonsSelector = '.js-button-list';
      this.prototype.buttonView = null;

      this.prototype.vigor = this.VIGOR.NONE;
    }

    initialize() {
      return (this.requestButtonsDebounced = _.debounce(() => {
        return this.requestButtons();
      }, 500));
    }

    hideContainer(pluginButtons) {
      return pluginButtons == null || pluginButtons.length === 0;
    }

    renderContainer() {
      return this.$el;
    }

    runnerOptions() {
      throw Error('runnerOptions not specified');
    }

    renderButtons(pluginButtons) {
      const $target = this.renderContainer(pluginButtons);
      this.$el.toggleClass('hide', this.hideContainer(pluginButtons));
      this.removeSubviews();

      const subviews = _.sortBy(pluginButtons, 'text').map(
        (pluginButton, index) => {
          if (pluginButton.view != null) {
            return this.subview(pluginButton.view, this.model, {}, index);
          }

          return this.subview(
            this.buttonView,
            this.model,
            { pluginButton },
            index,
          );
        },
      );
      return this.appendSubviews(subviews, $target);
    }

    requestButtons() {
      return PluginRunner.all(this.runnerOptions())
        .then((pluginButtons) => {
          // filter buttons down based on condition prop
          pluginButtons = _.filter(pluginButtons, (pluginButton) => {
            // drop anything that doesn't appear to be a button object
            if (
              _.isArray(pluginButton) ||
              !_.isObject(pluginButton) ||
              !pluginButton?.text
            ) {
              return false;
            }

            if (pluginButton.condition == null) {
              return this.model.editable();
            }

            switch (pluginButton.condition) {
              case 'admin':
                if (this.model.typeName === 'Card') {
                  return this.model.getBoard().owned();
                } else if (this.model.typeName === 'Board') {
                  return this.model.owned();
                } else {
                  return false;
                }
              case 'edit':
                return this.model.editable();
              case 'readOnly':
                return !this.model.editable();
              case 'signedIn':
                return Auth.isLoggedIn();
              case 'signedOut':
                return !Auth.isLoggedIn();
              case 'always':
                return true;
              default:
                return false;
            }
          }); // unknown condition

          return this.renderButtons(pluginButtons);
        })
        .catch(() =>
          typeof console !== 'undefined' && console !== null
            ? console.warn('Failed to request Power-Up buttons.')
            : undefined,
        );
    }
    renderOnce() {
      const options = this.runnerOptions();

      this.subscribe(
        pluginsChangedSignal(options.board, options.card),
        this.requestButtonsDebounced,
      );

      return this;
    }
  };
  PluginButtonsView.initClass();
  return PluginButtonsView;
})();
