// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const BusinessClassUpsellView = require('app/scripts/views/directory/business-class-upsell-view');
const { Controller } = require('app/scripts/controller');
const { firstPartyPluginsOrg } = require('@trello/config');
const Format = require('app/scripts/lib/markdown/format');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const {
  sendPluginScreenEvent,
  sendPluginUIEvent,
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const View = require('app/scripts/views/internal/view');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_power_ups',
);
const { navigate } = require('app/scripts/controller/navigate');

class PluginSuggestionPopOver extends View {
  static initClass() {
    this.prototype.className = 'plugin-suggestion-pop-over';

    this.prototype.events = {
      'click .js-enable-power-up': 'enablePowerUp',
      'click .js-open-listing': 'openListing',
    };
  }

  initialize({ board, card }) {
    this.board = board;
    this.card = card;
    return (this.powerUpEnablementInProgress = false);
  }

  enablePowerUp(e) {
    Util.stop(e);
    const pluginAttributes = {
      pluginId: this.model.id,
      pluginName: this.model.get('name'),
      pluginTags: this.model.get('tags'),
      installSource: 'attachmentGetPowerUpInlineDialog',
    };

    const traceId = Analytics.startTask({
      taskName: 'enable-plugin',
      source: 'attachmentGetPowerUpInlineDialog',
      attributes: pluginAttributes,
    });

    sendPluginUIEvent({
      idPlugin: this.model.id,
      idBoard: this.board.id,
      idCard: this.card.id,
      event: {
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'attachmentGetPowerEnableButton',
        source: 'attachmentGetPowerUpInlineDialog',
      },
    });

    if (
      !this.board.canEnableAdditionalPowerUps() &&
      !(this.model.get('tags') || []).includes('promotional')
    ) {
      Analytics.taskAborted({
        taskName: 'enable-plugin',
        source: 'attachmentGetPowerUpInlineDialog',
        error: new Error('plugin limit reached'),
        attributes: {
          ...pluginAttributes,
        },
        traceId,
      });
      PopOver.pushView({
        autoPosition: true,
        displayType: 'directory-upgrade-prompt-popover',
        elem: this.$(e.target),
        hideHeader: true,
        view: new BusinessClassUpsellView({ model: this.board }),
      });

      sendPluginScreenEvent({
        idPlugin: this.model.id,
        idBoard: this.board.id,
        idCard: this.card.id,
        screenName: 'attachmentsGetPowerUpUpgradeInlineDialog',
      });

      return;
    }

    if (this.board.isPluginEnabled(this.model.id)) {
      Analytics.taskAborted({
        taskName: 'enable-plugin',
        source: 'attachmentGetPowerUpInlineDialog',
        error: new Error('plugin not allowed'),
        attributes: {
          ...pluginAttributes,
        },
        traceId,
      });
      PopOver.hide();
      return;
    }

    // For third party Power-Ups, send them to the /enable page for data consent flow.
    if (this.model.get('idOrganizationOwner') !== firstPartyPluginsOrg) {
      Analytics.taskAborted({
        taskName: 'enable-plugin',
        source: 'attachmentGetPowerUpInlineDialog',
        error: new Error('need data consent'),
        attributes: {
          ...pluginAttributes,
        },
        traceId,
      });
      PopOver.hide();
      const boardView = Controller.getCurrentBoardView();
      boardView.directoryReturnCard = this.card;
      const listingUrl = Controller.getBoardUrl(this.board.id, 'power-up', [
        this.model.id,
        'enable',
      ]);
      navigate(listingUrl, { trigger: true });
      return;
    }

    this.powerUpEnablementInProgress = true;
    this.render();
    this.board.enablePluginWithTracing(this.model.id, {
      traceId,
      attributes: pluginAttributes,
      taskName: 'enable-plugin',
      source: 'attachmentsGetPowerUpUpgradeInlineDialog',
      next: (err) => {
        if (err) {
          const errorMessage = err.serverMessage;
          Analytics.taskAborted({
            taskName: 'enable-plugin',
            source: 'attachmentsGetPowerUpUpgradeInlineDialog',
            error: new Error(errorMessage),
            attributes: {
              ...pluginAttributes,
            },
            traceId,
          });
          const disableTraceId = Analytics.startTask({
            taskName: 'disable-plugin',
            source: 'attachmentGetPowerUpUpgradeInlineDialog',
            attributes: pluginAttributes,
          });
          this.powerUpEnablementInProgress = false;
          this.render();
          this.board.disablePluginWithTracing(this.model.id, {
            traceId: disableTraceId,
            attributes: pluginAttributes,
            taskName: 'disable-plugin',
            source: 'attachmentsGetPowerUpUpgradeInlineDialog',
          });

          if (errorMessage === 'PLUGIN_NOT_ALLOWED') {
            Alerts.show('plugin not allowed', 'error', 'addpluginerror', 4000);
          } else {
            Alerts.show(
              'could not add plugin',
              'error',
              'addpluginerror',
              2000,
            );
          }
        } else {
          sendPluginTrackEvent({
            idPlugin: this.model.id,
            idBoard: this.board.id,
            idCard: this.card.id,
            event: {
              action: 'added',
              actionSubject: 'powerUp',
              source: 'attachmentGetPowerUpInlineDialog',
              attributes: {
                installSource: 'attachmentSuggestion',
                tags: this.model.get('tags'),
                taskId: traceId,
              },
            },
          });

          this.powerUpEnablementInProgress = false;
          return PopOver.hide();
        }
      },
    });
  }

  openListing(e) {
    Util.stop(e);

    sendPluginUIEvent({
      idPlugin: this.model.id,
      idBoard: this.board.id,
      idCard: this.card.id,
      event: {
        action: 'clicked',
        actionSubject: 'link',
        actionSubjectId: 'attachmentGetPowerLearnMoreLink',
        source: 'attachmentGetPowerUpInlineDialog',
      },
    });
    PopOver.hide();

    const boardView = Controller.getCurrentBoardView();
    boardView.directoryReturnCard = this.card;

    const listingUrl = Controller.getBoardUrl(this.board.id, 'power-up', [
      this.model.id,
    ]);
    return navigate(listingUrl, { trigger: true });
  }

  render() {
    const { description } = this.model.get('listing');
    this.$el.html(
      t.render(() => {
        t.div('.plugin-description-container', () => {
          return t.div('.markeddown', () => {
            return t.raw(Format.markdownAsHtml(description));
          });
        });
        t.p(() => {
          if (!this.powerUpEnablementInProgress) {
            return t.button(
              '.nch-button.nch-button--primary.js-enable-power-up',
              () => {
                return t.format('enable-power-up');
              },
            );
          } else {
            return t.button('.nch-button.nch-button--primary', () => {
              return t.format('power-up-enablement-in-progress');
            });
          }
        });
        return t.p('.secondary-links.quiet', () => {
          return t.a('.js-open-listing', { href: '#' }, () => {
            return t.format('learn-more');
          });
        });
      }),
    );
    return this;
  }
}
PluginSuggestionPopOver.initClass();

module.exports = PluginSuggestionPopOver;
