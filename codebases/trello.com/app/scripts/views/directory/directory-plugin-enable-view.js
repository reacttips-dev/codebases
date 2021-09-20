// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let DirectoryListingView;
const _ = require('underscore');
const { PowerUp, PowerUpItemType } = require('app/src/components/PowerUp');
const { atlassianPowerUps } = require('app/scripts/data/directory');
const Alerts = require('app/scripts/views/lib/alerts');
const BaseDirectoryView = require('./base-directory-view');
const recupWithHelpers = require('app/scripts/views/internal/recup-with-helpers');
const c = recupWithHelpers('directory_data_consent');
const notCompliantIcon = require('resources/images/directory/icons/notCompliant.svg');
const compliantIcon = require('resources/images/directory/icons/compliant.svg');
const directoryLegacyPowerUps = require('./directory-legacy-power-ups');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const {
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const t = recupWithHelpers('directory_power_up_item');
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const xtend = require('xtend');

const PermissionsList = c.renderable(({ pluginName }) =>
  c.div(function () {
    c.p(() => c.format('by-you-clicking-add', { pluginName }));
    return c.ul(function () {
      c.li(() => c.format('access-this-board'));
      c.li(() =>
        c.format('add-content-to-this-board-such-as-attachments-to-cards'),
      );
      c.li(() =>
        c.format(
          'take-actions-on-this-board-such-as-moving-sorting-filtering-cards-or-lists',
        ),
      );
      return c.li(() =>
        c.format(
          'access-user-information-such-as-username-avatar-initials-and-full-name-for-users-on-this-board',
        ),
      );
    });
  }),
);

const PrivacyPolicy = c.renderable(function ({ pluginName, privacyPolicyUrl }) {
  if (privacyPolicyUrl) {
    return c.format(
      'for-more-information-please-see-power-ups-privacy-policy',
      {
        pluginName,
        privacyPolicyUrl,
      },
    );
  }

  return c.format(
    'for-more-information-please-see-power-ups-privacy-practices',
    { pluginName },
  );
});

const AtlassianDataConsent = c.renderable(({ pluginName, privacyPolicyUrl }) =>
  c.div('.directory-data-consent', function () {
    c.p(() =>
      c.format(
        'power-up-is-developed-and-maintained-by-another-company-within-the-atlassian-corporate-family',
        { pluginName },
      ),
    );
    c.tag(PermissionsList, { pluginName });
    return c.tag(PrivacyPolicy, { pluginName, privacyPolicyUrl });
  }),
);

const PersonalDataCompliance = c.renderable(({ pluginName, isCompliant }) => {
  return c.div('.directory-compliance', () =>
    c.p(function () {
      const src = isCompliant === false ? notCompliantIcon : compliantIcon;

      c.img('.directory-compliance-icon', {
        src,
        alt: '',
        role: 'presentation',
      });
      if (isCompliant === false) {
        return c.format(
          'power-up-does-not-comply-with-our-data-privacy-standards',
          { pluginName },
        );
      } else if (isCompliant === true) {
        return c.format(
          'power-up-stores-data-complies-with-our-data-privacy-standards',
          { pluginName },
        );
      } else {
        return c.format('power-up-complies-with-our-data-privacy-standards', {
          pluginName,
        });
      }
    }),
  );
});

const ThirdPartyDataConsent = c.renderable(
  ({ pluginName, privacyPolicyUrl, isPublic, isCompliant }) =>
    c.div('.directory-data-consent', function () {
      c.p(() =>
        c.format('power-up-is-not-developed-or-maintained-by-trello', {
          pluginName,
        }),
      );

      if (isPublic) {
        c.tag(PersonalDataCompliance, { pluginName, isCompliant });
      }
      c.tag(PermissionsList, { pluginName });
      return c.tag(PrivacyPolicy, { pluginName, privacyPolicyUrl });
    }),
);

module.exports = DirectoryListingView = (function () {
  DirectoryListingView = class DirectoryListingView extends BaseDirectoryView {
    static initClass() {
      this.prototype.className = 'directory-listing-wrapper';

      this.prototype.renderContent = t.renderable(function () {
        const pluginName = this.io.getName();
        const iconUrl = this.io.getIconUrl();
        const author = this.plugin.get('author');
        const privacyPolicyUrl = this.plugin.get('privacyUrl');
        const isAtlassianOwned = Array.from(atlassianPowerUps).includes(
          this.plugin.id,
        );
        const isPublic = this.plugin.get('public');
        const isCompliant = this.plugin.get('isCompliantWithPrivacyStandards');

        return t.div('.directory-individual-listing', () => {
          t.div('.directory-listing-powerup', () => {
            return t.tag(PowerUp, {
              type: PowerUpItemType.Listing,
              atomProps: {
                subtitle: author,
                icon: {
                  url: iconUrl,
                },
                name: pluginName,
              },
            });
          });
          if (isAtlassianOwned) {
            t.tag(AtlassianDataConsent, {
              pluginName,
              privacyPolicyUrl,
            });
          } else {
            t.tag(ThirdPartyDataConsent, {
              pluginName,
              privacyPolicyUrl,
              isPublic,
              isCompliant,
            });
          }
          return t.div('.directory-enable-page-buttons', () => {
            t.button('.button.link', { onClick: this.cancel.bind(this) }, () =>
              t.formatText('cancel'),
            );
            return t.button(
              '.nch-button.nch-button--primary.mt-4.mr-4',
              { onClick: this.enable.bind(this) },
              () => t.formatText('add'),
            );
          });
        });
      });
    }

    eventSource() {
      return 'powerUpAddDetailsScreen';
    }

    initialize({ directoryView, plugin, currentPage }) {
      let needle;
      this.directoryView = directoryView;
      this.plugin = plugin;
      this.tags = this.plugin.get('tags');
      this.currentPage = currentPage;
      super.initialize(...arguments);
      this.io = PluginIOCache.get(this.plugin);

      this.pluginDetails = {
        isLegacy:
          ((needle = this.plugin.id),
          Array.from(_.pluck(directoryLegacyPowerUps, 'id')).includes(needle)),
      };

      if (this.pluginDetails.isLegacy) {
        const legacyPlugin = _.findWhere(directoryLegacyPowerUps, {
          id: this.plugin.id,
        });
        return (this.pluginDetails = xtend(this.pluginDetails, legacyPlugin));
      }
    }

    isGrandfathered() {
      let needle;
      return (
        this.pluginDetails.isLegacy &&
        ((needle = this.pluginDetails.name),
        Array.from(this.model.get('powerUps')).includes(needle))
      );
    }

    enable(e) {
      Util.stop(e);
      const pluginAttributes = {
        pluginId: this.plugin.id,
        pluginName: this.plugin.name,
        pluginTags: this.tags,
        installSource: 'boardDirectory',
      };
      const traceId = Analytics.startTask({
        taskName: 'enable-plugin',
        source: 'addPowerUpButton',
      });

      const elem = e.target;

      this.model.enablePluginWithTracing(this.plugin.id, {
        traceId,
        attributes: pluginAttributes,
        taskName: 'enable-plugin',
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
                attributes: pluginAttributes,
                taskName: 'disable-plugin',
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
          }
        },
      });

      if (this.io.supports('on-enable')) {
        return PluginRunner.one({
          plugin: this.plugin,
          command: 'on-enable',
          board: this.model,
          el: elem,
        })
          .catch((err) => {
            return typeof console !== 'undefined' && console !== null
              ? console.warn('Failed to handle on-enable command.', {
                  error: err.message,
                  id: this.plugin.id,
                })
              : undefined;
          })
          .finally(() => {
            return this.pluginEnabled(traceId);
          });
      } else {
        return this.pluginEnabled(traceId);
      }
    }

    pluginEnabled(traceId) {
      sendPluginTrackEvent({
        idPlugin: this.plugin.id,
        idBoard: this.model.id,
        event: {
          action: 'added',
          actionSubject: 'powerUp',
          attributes: {
            installSource: 'boardDirectory',
            tags: this.tags,
            taskId: traceId,
          },
          source: 'addPowerUpButton',
        },
      });

      return this.directoryView.navigate({ idPlugin: this.plugin.id });
    }

    cancel() {
      return this.directoryView.navigateBack();
    }
    render() {
      super.render(...arguments);

      this.directoryView.trackScreenEvent(this.eventSource(), {
        powerUpId: this.plugin.id,
        tags: this.tags,
      });

      return this;
    }
  };
  DirectoryListingView.initClass();
  return DirectoryListingView;
})();
