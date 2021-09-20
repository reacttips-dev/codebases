// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const BaseDirectoryView = require('./base-directory-view');
const directoryLegacyPowerUps = require('./directory-legacy-power-ups');
const DirectoryPluginItemView = require('./directory-plugin-item-view');
const Format = require('app/scripts/lib/markdown/format');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const { PowerUpItemType } = require('app/src/components/PowerUp');
const recupWithHelpers = require('app/scripts/views/internal/recup-with-helpers');
const t = recupWithHelpers('directory');
const powerUpItemDetailsT = recupWithHelpers('power_up_item_details');
const c = recupWithHelpers('directory_data_consent');
const notCompliantIcon = require('resources/images/directory/icons/notCompliant.svg');
const compliantIcon = require('resources/images/directory/icons/compliant.svg');
const React = require('react');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { forTemplate } = require('@trello/i18n');
const format = forTemplate('directory');

class DirectoryListing extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Listing';

    this.prototype.render = t.renderable(function () {
      const {
        supportEmail,
        description,
        displayName,
        isGrandfathered,
        isCompliant,
        privacyPolicy,
        categories,
        onCategoryClick,
        isIntegration,
      } = this.props;

      return t.div('.directory-individual-listing', function () {
        t.div('.js-directory-listing');
        if (supportEmail) {
          let supportLink = supportEmail;

          const EMAIL_REGEX = /^[^@]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i;

          if (EMAIL_REGEX.test(supportLink)) {
            supportLink = `mailto:${supportEmail}?subject=${encodeURIComponent(
              displayName,
            )}`;
          }

          t.div('.directory-listing-support', () =>
            t.div('.support-list', function () {
              t.icon('email', { class: 'icon-lg' });
              t.a('.support-link', { href: supportLink }, () =>
                t.format('contact-support'),
              );
              if (pluginValidators.isValidHttp(privacyPolicy)) {
                t.icon('information', { class: 'icon-lg' });
                return t.a('.support-link', { href: privacyPolicy }, () =>
                  t.format('privacy-policy'),
                );
              }
            }),
          );
        } else {
          t.div('.directory-listing-categories', function () {
            t.icon('information', { class: 'icon-lg' });
            return t.div('.categories-list', () =>
              _.map(categories, (category) =>
                t.a(
                  '.category-link',
                  {
                    href: '#',
                    onClick() {
                      return onCategoryClick(category);
                    },
                  },
                  () => t.format(category),
                ),
              ),
            );
          });
        }

        if (isGrandfathered) {
          t.p('.power-up-grandfathered', function () {
            powerUpItemDetailsT.format(
              'power-up-was-enabled-on-this-board-before-some-recent-changes-we-made',
              {
                name: displayName,
              },
            );
            return t.text(' 🎉');
          });
        }
        if (isIntegration) {
          t.div('.directory-listing-integration', () => {
            t.div(
              '.directory-listing-integration-header',
              { 'data-beta-string': format('beta') },
              () => {
                return t.format('trello-integrations');
              },
            );
            t.format('integration-description', { powerUpName: displayName });
            t.text(' ');
            return t.a(
              '.integration-info-link',
              {
                href: 'https://help.trello.com/article/1094-what-are-power-ups',
                target: '_blank',
              },
              () => t.format('integrations-learn-more'),
            );
          });
        }
        t.div('.directory-listing-content.markeddown', () =>
          t.raw(Format.markdownAsHtml(description)),
        );
        return t.div('.directory-listing-compliance', function () {
          const src = isCompliant === false ? notCompliantIcon : compliantIcon;

          c.img('.directory-listing-compliance-icon', {
            src,
            alt: '',
            role: 'presentation',
          });
          if (isCompliant === false) {
            return c.format(
              'power-up-does-not-comply-with-our-data-privacy-standards',
              { pluginName: displayName },
            );
          } else if (isCompliant === true) {
            return c.format(
              'power-up-stores-data-complies-with-our-data-privacy-standards',
              { pluginName: displayName },
            );
          } else {
            return c.format(
              'power-up-complies-with-our-data-privacy-standards',
              { pluginName: displayName },
            );
          }
        });
      });
    });
  }
}
DirectoryListing.initClass();

class DirectoryListingView extends BaseDirectoryView {
  static initClass() {
    this.prototype.className = 'directory-listing-wrapper';
  }
  eventSource() {
    return 'boardDirectoryPowerUpDetailsScreen';
  }

  initialize({ directoryView, plugin, currentPage }) {
    this.directoryView = directoryView;
    this.plugin = plugin;
    this.currentPage = currentPage;
    super.initialize(...arguments);

    const powerUp = _.findWhere(directoryLegacyPowerUps, {
      id: this.plugin.id,
    });

    if (powerUp) {
      let needle;
      const { name } = powerUp;
      return (this.isGrandfathered =
        ((needle = name),
        Array.from(this.model.get('powerUps')).includes(needle)));
    }
  }

  navigateToCategory(category) {
    return this.directoryView.navigate({ section: 'category', category });
  }

  renderContent() {
    const io = PluginIOCache.get(this.plugin);

    const showIntegrations = featureFlagClient.get(
      'workflowers.show-integrations-in-pup-dir',
      false,
    );

    return (
      <DirectoryListing
        displayName={io.getName()}
        description={io.getDescription()}
        supportEmail={this.plugin.get('supportEmail')}
        privacyPolicy={this.plugin.get('privacyUrl')}
        categories={this.plugin.get('categories')}
        isGrandfathered={this.isGrandfathered}
        // eslint-disable-next-line react/jsx-no-bind
        onCategoryClick={(category) => this.navigateToCategory(category)}
        isCompliant={this.plugin.get('isCompliantWithPrivacyStandards')}
        isIntegration={
          showIntegrations &&
          (this.plugin.get('tags') || []).includes('integration')
        }
      />
    );
  }

  render() {
    super.render(...arguments);

    this.appendSubview(
      this.subview(
        DirectoryPluginItemView,
        this.model,
        {
          atomType: PowerUpItemType.Listing,
          plugin: this.plugin,
          currentPage: this.currentPage,
          directoryView: this.directoryView,
        },
        this.plugin.id,
      ),
      this.$('.js-directory-listing'),
    );

    const enabledPlugins = this.directoryView.getEnabledPlugins();

    this.directoryView.trackScreenEvent(this.eventSource(), {
      powerUpId: this.plugin.id,
      isEnabled: _.some(enabledPlugins, { id: this.plugin.id }) ? true : false,
      tags: this.plugin.get('tags'),
    });

    return this;
  }
}
DirectoryListingView.initClass();

module.exports = DirectoryListingView;
