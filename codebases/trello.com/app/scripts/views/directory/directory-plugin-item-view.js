/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { PowerUp, PowerUpItemType } = require('app/src/components/PowerUp');
const { Auth } = require('app/scripts/db/auth');
const Alerts = require('app/scripts/views/lib/alerts');
const BaseDirectoryView = require('./base-directory-view');
const BusinessClassUpsellView = require('app/scripts/views/directory/business-class-upsell-view');
const { dontUpsell } = require('@trello/browser');
const Confirm = require('app/scripts/views/lib/confirm');
const CustomFieldsButtonView = require('app/scripts/views/custom-field/custom-fields-button-view');
const defaultPowerUpIcon = require('resources/images/directory/icons/customIcon.png');
const directoryLegacyPowerUps = require('./directory-legacy-power-ups');
const { firstPartyPluginsOrg } = require('@trello/config');
const Format = require('app/scripts/lib/markdown/format');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const EditEmailSettingsView = require('app/scripts/views/board-menu/edit-email-settings-view');
const Promise = require('bluebird');
const React = require('react');
const {
  sendPluginScreenEvent,
  sendPluginUIEvent,
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'directory_power_up_item',
);
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const xtend = require('xtend');
const { featureFlagClient } = require('@trello/feature-flag-client');

const {
  customFieldsId,
  mapPowerUpId,
  microsoftTeamsId,
  microsoftTeamsUrl,
  e2bId,
  gmailId,
  gmailUrl,
} = require('@trello/config');

const { PowerUpTestIds } = require('@trello/test-ids');

const powerUpSettings = t.renderable(
  ({
    authorize,
    disable,
    supportsSettings,
    showSettings,
    supportsAuth,
    hasPersonalSettings,
    removeData,
    authStatus,
    showListingOption,
    navigateToListing,
  }) =>
    t.ul('.pop-over-list', function () {
      if (showListingOption) {
        t.li({ onClick: navigateToListing }, () =>
          t.a(() => t.format('view-power-up')),
        );
      }
      if (supportsAuth && authStatus && !authStatus.authorized) {
        t.li({ onClick: authorize }, () =>
          t.a(() => t.format('authorize-account')),
        );
      } else {
        if (supportsSettings) {
          t.li({ onClick: showSettings }, () =>
            t.a(() => t.format('edit-power-up-settings')),
          );
        }
        if (hasPersonalSettings) {
          t.li({ onClick: removeData }, () =>
            t.a(() => t.format('remove-personal-settings')),
          );
        }
      }
      return t.li(
        { 'data-test-id': PowerUpTestIds.DisablePowerUpLink, onClick: disable },
        () => t.a(() => t.format('disable')),
      );
    }),
);

const pupDisableWarning = t.renderable(({ cancel, disable, powerupName }) =>
  t.div('.disable-warning-container', function () {
    if (
      featureFlagClient.get('ecosystem.custom-fields-sku-relocation', false)
    ) {
      t.p('.disable-warning-message-new-sku', () =>
        t.format('disable-warning-message-new-sku', { powerupName }),
      );
    } else {
      t.p('.disable-warning-message', () =>
        t.format('disable-warning-message', { powerupName }),
      );
    }
    t.button(
      '.nch-button.nch-button--danger.directory-warning-disable-button',
      { onClick: disable },
      () => t.format('disable-warning-button', { powerupName }),
    );
    return t.button(
      '.nch-button.nch-button--transparentDark.directory-cancel-button',
      { onClick: cancel },
      () => t.a(() => t.format('cancel')),
    );
  }),
);

const enableButton = t.renderable(({ onClick }) =>
  t.button(
    '.nch-button.nch-button--primary.directory-enable-button',
    { onClick },
    () => t.formatText('add'),
  ),
);

const disabledButton = t.renderable(function ({ enterpriseDisplayName }) {
  const title = t.l('this-power-up-was-disabled-by-the-enterprise', {
    enterpriseDisplayName,
  });
  return t.button(
    '.nch-button.nch-button--disabled.directory-disabled-button',
    { title },
    () => t.formatText('add'),
  );
});

const settingsButton = t.renderable(({ onClick }) =>
  t.a('.button.directory-settings-button', { onClick }, function () {
    t.icon('gear');
    return t.formatText('settings');
  }),
);

const configureButton = t.renderable(({ onClick, href }) =>
  t.a(
    '.nch-button.nch-button--primary.directory-enable-button',
    { onClick, href, target: '_blank' },
    function () {
      return t.formatText('configure');
    },
  ),
);

class DirectoryPluginItemView extends BaseDirectoryView {
  static initClass() {
    this.prototype.className = 'directory-listing-powerup';

    this.prototype.events = {
      click(e) {
        if (this.options.atomType === PowerUpItemType.Listing) {
          return;
        }
        if (!this.$(e.target).is('a, button')) {
          sendPluginUIEvent({
            idPlugin: this.plugin.id,
            idBoard: this.model.id,
            event: {
              action: 'clicked',
              actionSubject: 'card',
              actionSubjectId: 'powerUpCard',
              source: 'boardDirectory',
              attributes: {
                tags: this.tags,
              },
            }, // Will need to figure out the exact screen here
          });
        }
        return this.navigateToListing(e);
      },
    };
  }

  initialize({ plugin, currentPage, directoryView }) {
    let needle;
    this.plugin = plugin;
    this.tags = this.plugin.get('tags');
    this.currentPage = currentPage;
    this.directoryView = directoryView;
    super.initialize(...arguments);
    this.canEnable = this.model.editable();

    this.initialData = {
      canEnable: this.model.editable(),
      isLegacy:
        ((needle = this.plugin.id),
        Array.from(_.pluck(directoryLegacyPowerUps, 'id')).includes(needle)),
    };

    this.io = PluginIOCache.get(this.plugin);

    this.pluginDetails = {
      displayName: this.io.getName(),
      description: this.io.getDescription(),
      iconUrl: this.io.getIconUrl(),
      overview: this.io.getOverview(),
      author: this.plugin.get('author'),
      moderatedState: this.plugin.get('moderatedState'),
    };

    if (this.initialData.isLegacy) {
      const legacyPlugin = _.findWhere(directoryLegacyPowerUps, {
        id: this.plugin.id,
      });
      this.pluginDetails = xtend(this.pluginDetails, legacyPlugin);
    }

    this.listenTo(
      this.model,
      'change:idOrganization change:powerUps',
      this.frameDebounce(this.render),
    );
    this.listenTo(
      this.model.boardPluginList,
      'add remove reset',
      this.frameDebounce(this.render),
    );
    this.listenTo(this.model, 'cancel-add-to-team', () => PopOver.hide());
    this.subscribe(
      this.model.boardPluginList.snoop(),
      this.frameDebounce(this.render),
    );
    return this.subscribe(
      pluginsChangedSignal(this.model),
      this.frameDebounce(this.render),
    );
  }

  showListingOption() {
    return false;
  }

  navigateToListing(e) {
    if (!this.$(e.target).is('a, button')) {
      if (PopOver.isVisible) {
        PopOver.hide();
      }

      return this.directoryView?.navigate({ idPlugin: this.plugin.id });
    }
  }

  enable(e) {
    Util.stop(e);

    const elem = e.target;

    // Enable the Power-Up for the board
    const promotional = (this.tags || []).includes('promotional');
    if (this.model.canEnableAdditionalPowerUps() || promotional) {
      if (this.plugin.get('idOrganizationOwner') === firstPartyPluginsOrg) {
        const pluginAttributes = {
          pluginName: this.plugin.get('name'),
          pluginId: this.plugin.id,
          pluginTags: this.tags,
          installSource: 'boardDirectory',
        };
        const traceId = Analytics.startTask({
          taskName: 'enable-plugin',
          source: 'addPowerUpButton',
          attributes: pluginAttributes,
        });
        this.model.enablePluginWithTracing(this.plugin.id, {
          traceId,
          taskName: 'enable-plugin',
          attributes: pluginAttributes,
          source: 'addPowerUpButton',
          next: (err) => {
            if (err) {
              const errorMessage = err.serverMessage;
              Analytics.taskAborted({
                taskName: 'enable-plugin',
                source: 'addPowerUpButton',
                error: new Error(errorMessage),
                attributes: {
                  ...pluginAttributes,
                },
                traceId,
              });
              if (this.isGrandfathered()) {
                this.model.pull('powerUps', this.pluginDetails.name);
              } else {
                const disableTraceId = Analytics.startTask({
                  taskName: 'disable-plugin',
                  source: 'addPowerUpButton',
                  attributes: pluginAttributes,
                });
                this.model.disablePluginWithTracing(this.plugin.id, {
                  traceId: disableTraceId,
                  taskName: 'disable-plugin',
                  attributes: pluginAttributes,
                  source: 'addPowerUpButton',
                });
              }
              if (errorMessage === 'PLUGIN_NOT_ALLOWED') {
                Alerts.show(
                  'plugin not allowed',
                  'error',
                  'addpluginerror',
                  4000,
                );
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
                idPlugin: this.plugin.id,
                idBoard: this.model.id,
                event: {
                  action: 'added',
                  actionSubject: 'powerUp',
                  source: 'pupConfigurationInlineDialog',
                  taskId: traceId,
                },
              });
            }
          },
        });

        if (this.io.supports('on-enable')) {
          PluginRunner.one({
            plugin: this.plugin,
            command: 'on-enable',
            board: this.model,
            el: elem,
          }).catch((err) => {
            return typeof console !== 'undefined' && console !== null
              ? console.warn('Failed to handle on-enable command.', {
                  error: err.message,
                  id: this.plugin.id,
                })
              : undefined;
          });
        }
      } else {
        this.directoryView.navigate({
          idPlugin: this.plugin.id,
          isEnabling: true,
        });
      }
    } else {
      // Show business class ad.
      PopOver.toggle({
        autoPosition: true,
        hideHeader: true,
        elem,
        view: new BusinessClassUpsellView({ model: this.model }),
        displayType: 'directory-upgrade-prompt-popover',
      });
    }
  }

  isGrandfathered() {
    let needle;
    return (
      this.initialData.isLegacy &&
      ((needle = this.pluginDetails.name),
      Array.from(this.model.get('powerUps')).includes(needle))
    );
  }

  disable(elem) {
    if (this.isGrandfathered()) {
      const removePowerUp = () => {
        return this.model.pull('powerUps', this.pluginDetails.name);
      };

      if (this.model.getOrganization()?.isFeatureEnabled('plugins')) {
        removePowerUp();
      } else {
        Confirm.pushView('disable power up', {
          elem,
          model: this.model,
          confirmBtnClass: 'nch-button nch-button--danger',
          fxConfirm: removePowerUp,
        });
      }
    } else {
      const traceId = Analytics.startTask({
        taskName: 'disable-plugin',
        source: 'pupConfigurationInlineDialog',
        attributes: {
          pluginName: this.plugin.get('name'),
          pluginId: this.plugin.id,
          pluginTags: this.tags,
        },
      });
      const disableWithTracing = () => {
        return this.model.disablePluginWithTracing(this.plugin.id, {
          traceId,
          taskName: 'disable-plugin',
          source: 'pupConfigurationInlineDialog',
          attributes: {
            pluginName: this.plugin.get('name'),
            pluginId: this.plugin.id,
            pluginTags: this.tags,
          },
          next: (err) => {
            if (!err) {
              sendPluginTrackEvent({
                idPlugin: this.plugin.id,
                idBoard: this.model.id,
                event: {
                  action: 'disabled',
                  actionSubject: 'powerUp',
                  source: 'pupConfigurationInlineDialog',
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        });
      };
      if (this.io.supports('on-disable')) {
        PluginRunner.one({
          plugin: this.plugin,
          command: 'on-disable',
          board: this.model,
          timeout: 500,
        }).finally(() => {
          return disableWithTracing();
        });
      } else {
        return disableWithTracing();
      }
    }
  }

  getEnabledState() {
    if (this.initialData.isLegacy) {
      return this.model.isPowerUpEnabled(this.pluginDetails.name);
    } else {
      return this.model.isPluginEnabled(this.plugin.id);
    }
  }

  hasPersonalSettings() {
    const pluginData = _.extend(
      Auth.me().getPluginData(this.plugin.id),
      this.model.getPluginData(this.plugin.id),
    );
    return _.any(pluginData, ({ private: privateData }) => privateData != null);
  }

  disablePopover = (e) => {
    PopOver.hide();
    return this.disable(e);
  };

  showDisableWarning(elem) {
    const powerupName = this.io.getName();
    PopOver.pushView({
      elem,
      autoPosition: true,
      getViewTitle: () => t.l('disable-warning-header', { powerupName }),
      reactElement: React.createElement(pupDisableWarning, {
        key: this.plugin.id,
        cancel: () => {
          PopOver.popView();
        },
        disable: this.disablePopover,
        powerupName,
      }),
    });
  }

  showPowerUpSettings(elem) {
    sendPluginUIEvent({
      idPlugin: this.plugin.id,
      idBoard: this.model.id,
      event: {
        action: 'clicked',
        actionSubject: 'option',
        actionSubjectId: 'editSettingsOption',
        source: this.showListingOption()
          ? 'boardSidebarPupInlineDialog'
          : 'boardDirectoryPUpInlineDialog',
      },
    });

    if (this.directoryView) {
      this.directoryView.trackScreenEvent('powerUpEditInlineDialog', {
        powerUpId: this.plugin.id,
      });
    }

    if (this.initialData.isLegacy) {
      PopOver.pushView({
        elem,
        view: this.pluginDetails.settingsView(this.model),
        autoPosition: true,
      });
    } else if (this.plugin.id === customFieldsId) {
      PopOver.pushView({
        elem,
        view: CustomFieldsButtonView,
        autoPosition: true,
        options: { board: this.model },
      });
    } else {
      PluginRunner.one({
        plugin: this.plugin,
        command: 'show-settings',
        board: this.model,
        el: elem,
      })
        .catch((err) => {
          return typeof console !== 'undefined' && console !== null
            ? console.warn('Failed to handle show-settings.', {
                error: err.message,
                id: this.plugin.id,
              })
            : undefined;
        })
        .done();
    }
  }

  showAuthorization(elem) {
    sendPluginUIEvent({
      idPlugin: this.plugin.id,
      idBoard: this.model.id,
      event: {
        action: 'clicked',
        actionSubject: 'option',
        actionSubjectId: 'authorizeAccountOption',
        source: this.showListingOption()
          ? 'boardSidebarPupInlineDialog'
          : 'boardDirectoryPUpInlineDialog',
      },
    });
    PluginRunner.one({
      plugin: this.plugin,
      command: 'show-authorization',
      board: this.model,
      el: elem,
    })
      .then(() => {
        return sendPluginScreenEvent({
          idPlugin: this.plugin.id,
          idBoard: this.model.id,
          screenName: 'pupAuthorizationInlineDialog',
        });
      })
      .catch((err) => {
        return typeof console !== 'undefined' && console !== null
          ? console.warn('Failed to handle show-authorization.', {
              error: err.message,
              id: this.plugin.id,
            })
          : undefined;
      })
      .done();
  }

  clearData(elem) {
    sendPluginUIEvent({
      idPlugin: this.plugin.id,
      idBoard: this.model.id,
      event: {
        action: 'clicked',
        actionSubject: 'option',
        actionSubjectId: 'removeDataOption',
        source: this.showListingOption()
          ? 'boardSidebarPupInlineDialog'
          : 'boardDirectoryPUpInlineDialog',
      },
    });
    Confirm.pushView('clear plugin data', {
      elem,
      model: this.model,
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: (e) => {
        sendPluginTrackEvent({
          idPlugin: this.plugin.id,
          idBoard: this.model.id,
          event: {
            action: 'removed',
            actionSubject: 'pluginData',
            source: this.showListingOption()
              ? 'boardSidebarPupInlineDialog'
              : 'boardDirectoryPUpInlineDialog',
          },
        });
        if (this.io.supports('remove-data')) {
          return PluginRunner.one({
            board: this.model,
            plugin: this.plugin,
            command: 'remove-data',
            timeout: 1000,
          }).finally(() => {
            this.model.clearPluginData(this.plugin.id);
            return Auth.me().clearPluginData(this.plugin.id);
          });
        } else {
          this.model.clearPluginData(this.plugin.id);
          return Auth.me().clearPluginData(this.plugin.id);
        }
      },
    });
  }

  toggleOptions(e) {
    Util.stop(e);
    const elem = e.target;

    const bindElemAction = (action) => _.bind(action, this, elem);

    if (this.directoryView) {
      this.directoryView.trackScreenEvent('pupConfigurationInlineDialog', {
        powerUpId: this.plugin.id,
      });
    }

    return Promise.props({
      supportsAuth: this.io.supports('show-authorization'),
      supportsSettings:
        this.pluginDetails.settingsView || this.io.supports('show-settings'),
      hasPersonalSettings: this.hasPersonalSettings(),
    })
      .then((data) => {
        if (data.supportsAuth) {
          return PluginRunner.one({
            timeout: 1000,
            plugin: this.plugin,
            command: 'authorization-status',
            board: this.model,
          })
            .then((authStatus) => xtend(data, { authStatus }))
            .catch((err) => {
              if (typeof console !== 'undefined' && console !== null) {
                console.warn('Failed to get authorization-status.', {
                  error: err.message,
                  id: this.plugin.id,
                });
              }
              return data;
            });
        }
        return data;
      })
      .then((data) => {
        const isPupTransitionEnabled = featureFlagClient.get(
          'ecosystem.pups-views-transition',
          false,
        );
        const isCustomFieldsCore = featureFlagClient.get(
          'ecosystem.custom-fields-sku-relocation',
          false,
        );
        const disablePowerUp =
          (isPupTransitionEnabled && this.plugin.id === mapPowerUpId) ||
          (isCustomFieldsCore && this.plugin.id === customFieldsId)
            ? bindElemAction(this.showDisableWarning)
            : this.disablePopover;
        PopOver.toggle({
          autoPosition: true,
          getViewTitle: () => this.io.getName(),
          elem,
          reactElement: React.createElement(powerUpSettings, {
            key: this.plugin.id,
            disable: disablePowerUp,
            authorize: bindElemAction(this.showAuthorization),
            showSettings: bindElemAction(this.showPowerUpSettings),
            removeData: bindElemAction(this.clearData),
            supportsSettings: data.supportsSettings,
            supportsAuth: data.supportsAuth,
            hasPersonalSettings: data.hasPersonalSettings,
            authStatus: data.authStatus,
            showListingOption: this.showListingOption(),
            navigateToListing: bindElemAction(this.navigateToListing),
          }),
        });

        return sendPluginScreenEvent({
          idPlugin: this.plugin.id,
          idBoard: this.model.id,
          screenName: 'pupConfigurationInlineDialog',
        });
      });
  }

  getIntegrationButton(powerUpItemType) {
    const eventSource =
      powerUpItemType === PowerUpItemType.Listing
        ? 'boardDirectoryPowerUpDetailsScreen'
        : 'powerUpCard';

    if (this.plugin.id === e2bId) {
      return React.createElement(configureButton, {
        onClick: (e) => {
          sendPluginUIEvent({
            idPlugin: this.plugin.id,
            idBoard: this.model.id,
            event: {
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'powerUpEditButton',
              source: eventSource,
            },
          });
          Util.stop(e);
          PopOver.toggle({
            elem: e.target,
            view: new EditEmailSettingsView({
              model: this.model,
              modelCache: this.modelCache,
              fromPowerUpDirectory: true,
            }),
          });
        },
      });
    }

    let configUrl;
    if (this.plugin.id === microsoftTeamsId) {
      configUrl = microsoftTeamsUrl;
    } else if (this.plugin.id === gmailId) {
      configUrl = gmailUrl;
    } else {
      return '';
    }

    return React.createElement(configureButton, {
      onClick: (e) => {
        sendPluginUIEvent({
          idPlugin: this.plugin.id,
          idBoard: this.model.id,
          event: {
            action: 'clicked',
            actionSubject: 'button',
            actionSubjectId: 'powerUpEditButton',
            source: eventSource,
          },
        });
      },
      href: configUrl,
    });
  }

  getButton(powerUpItemType) {
    // Specifically checking for BC2 orgs to not show upsell banner
    const isPremiumOrg = this.model.getOrganization()?.isPremium();

    if (
      featureFlagClient.get(
        'workflowers.show-integrations-in-pup-dir',
        false,
      ) &&
      this.tags?.includes('integration')
    ) {
      return this.getIntegrationButton(powerUpItemType);
    }
    // for desktop, we can't upsell members, so we hide the
    // "Enable" button if the member can't enable more power-ups
    // Also adapted for use with BC2 where we don't want to tell
    // them to upgrade to BC as technically they already are on BC
    if (
      (dontUpsell() || isPremiumOrg) &&
      !this.model.canEnableAdditionalPowerUps() &&
      !this.isEnabled &&
      !(this.tags || []).includes('promotional')
    ) {
      return;
    }

    // If the board is an enterprise board and the enterprise doesn't allow
    // the plugin to be enabled, show the disabled button.
    if (
      this.model.isEnterpriseBoard() &&
      this.model.getEnterprise() != null &&
      !this.model.getEnterprise().isPluginAllowed(this.plugin.id)
    ) {
      return React.createElement(disabledButton, {
        enterpriseDisplayName: this.model.getEnterprise()?.get('displayName'),
      });
    }

    let eventSource = 'powerUpCard';
    if (powerUpItemType === PowerUpItemType.Listing) {
      eventSource = 'boardDirectoryPowerUpDetailsScreen';
    }

    if (this.isEnabled) {
      return React.createElement(settingsButton, {
        onClick: (e) => {
          sendPluginUIEvent({
            idPlugin: this.plugin.id,
            idBoard: this.model.id,
            event: {
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'powerUpEditButton',
              source: eventSource,
            },
          });
          return this.toggleOptions(e);
        },
      });
    }

    return React.createElement(enableButton, {
      onClick: (e) => {
        sendPluginUIEvent({
          idPlugin: this.plugin.id,
          idBoard: this.model.id,
          event: {
            action: 'clicked',
            actionSubject: 'button',
            actionSubjectId: 'powerUpAddButton',
            source: eventSource,
            attributes: {
              tags: this.tags,
            },
          },
        });

        return this.enable(e);
      },
    });
  }

  renderContent() {
    const {
      author,
      iconUrl,
      displayName,
      description,
      overview,
    } = this.pluginDetails;
    this.isEnabled = this.getEnabledState({ id: this.plugin.id });
    const atomType = this.options.atomType || PowerUpItemType.Basic;

    return (
      <PowerUp
        type={atomType}
        atomProps={{
          subtitle: atomType === PowerUpItemType.Listing ? author : undefined,
          overview: Format.markdownAsText(overview || description),
          icon: {
            url: iconUrl || defaultPowerUpIcon,
          },
          heroImageUrl: this.plugin.get('heroImageUrl'),
          name: displayName,
          button: this.getButton(atomType),
          usage: this.plugin.get('usageBrackets')?.boards || 0,
          promotional: (this.tags || []).includes('promotional'),
          staffPick: (this.tags || []).includes('staff-pick'),
          integration: (this.tags || []).includes('integration'),
        }}
      />
    );
  }

  render() {
    super.render(...arguments);
    this.$el.data('idPlugin', this.plugin.id);
    return this;
  }
}
DirectoryPluginItemView.initClass();
module.exports = DirectoryPluginItemView;
