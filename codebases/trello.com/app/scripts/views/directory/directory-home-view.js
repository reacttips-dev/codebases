/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { PowerUpItemType } = require('app/src/components/PowerUp');
const BaseDirectoryView = require('./base-directory-view');
const DirectoryPluginItemView = require('./directory-plugin-item-view');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'directory_home',
);
const {
  sortFeaturedPowerUps,
} = require('app/src/components/PowerUpDirectory/HomePage');
const { featureFlagClient } = require('@trello/feature-flag-client');

class DirectoryHomeComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Home';

    this.prototype.render = t.renderable(function () {
      return t.div(() =>
        t.div('.directory-content-body', function () {
          t.div('.directory-heading-wrapper', () =>
            t.h2(() => t.formatText('featured-power-ups')),
          );
          t.div('.directory-featured-powerups.js-featured-power-ups-container');
          if (
            featureFlagClient.get(
              'workflowers.show-integrations-in-pup-dir',
              false,
            )
          ) {
            t.div('.directory-heading-wrapper', () =>
              t.h2(() => t.formatText('integrations')),
            );
            t.div('.directory-featured-powerups.js-integrations-container');
          }
          t.div('.directory-heading-wrapper', () =>
            t.h2(() => t.formatText('essential-power-ups')),
          );
          t.div(
            '.directory-featured-powerups.js-essential-power-ups-container',
          );
          t.div('.directory-heading-wrapper', () =>
            t.h2(() => t.formatText('other-great-power-ups')),
          );
          return t.div(
            '.directory-featured-powerups.js-other-power-ups-container',
          );
        }),
      );
    });
  }
}
DirectoryHomeComponent.initClass();

module.exports = class DirectoryHomeView extends BaseDirectoryView {
  initialize({ directoryView, currentPage }) {
    this.directoryView = directoryView;
    this.currentPage = currentPage;
    return super.initialize(...arguments);
  }

  eventSource() {
    return 'boardDirectoryFeaturedScreen';
  }

  renderContent() {
    return <DirectoryHomeComponent boardId={this.model.id} />;
  }

  getPluginsByTags(tags) {
    return _.filter(this.directoryView.plugins, (plugin) =>
      _.every(tags, (tag) => _.contains(plugin.get('tags'), tag)),
    );
  }

  getFeaturedPlugins() {
    const featuredPlugins = this.getPluginsByTags(['featured']);
    const sortedPluginsJSON = sortFeaturedPowerUps(
      _.map(featuredPlugins, (plugin) => plugin.toJSON()),
    );
    const sortedPlugins = _.map(sortedPluginsJSON, (pluginJSON) =>
      _.find(featuredPlugins, (plugin) => plugin.id === pluginJSON.id),
    );
    return (this.featuredPlugins = sortedPlugins);
  }

  getEssentialPlugins() {
    return (
      this.essentialPlugins ??
      (this.essentialPlugins = this.getPluginsByTags(['essential']))
    );
  }

  getIntegrations() {
    if (this.integrations != null) {
      return this.integrations;
    }
    const integrations = featureFlagClient.get(
      'workflowers.show-integrations-in-pup-dir',
      false,
    )
      ? this.getPluginsByTags(['integration'])
      : [];
    return (this.integrations = integrations);
  }

  getOtherPowerUps() {
    const excludeFeaturedAndEssential = _.filter(
      this.directoryView.plugins,
      function (plugin) {
        let needle;
        return (
          !_.contains(plugin.get('tags'), 'featured') &&
          !_.contains(plugin.get('tags'), 'essential') &&
          !_.contains(plugin.get('tags'), 'integration') &&
          !((needle = plugin.get('moderatedState')),
          ['hidden', 'moderated'].includes(needle))
        );
      },
    );
    return _.sample(excludeFeaturedAndEssential, 12);
  }

  render() {
    super.render(...arguments);

    const featuredPlugins = this.directoryView.filterOutHiddenPlugins(
      this.getFeaturedPlugins(),
    );
    const essentialPlugins = this.directoryView.filterOutHiddenPlugins(
      this.getEssentialPlugins(),
    );
    const integrations = this.directoryView.filterOutHiddenPlugins(
      this.getIntegrations(),
    );
    const otherPlugins = this.getOtherPowerUps();
    const enabledPlugins = this.directoryView.getEnabledPlugins();
    const listedPlugins = _.flatten([
      featuredPlugins,
      integrations,
      essentialPlugins,
      otherPlugins,
    ]);
    const showIntegrations = featureFlagClient.get(
      'workflowers.show-integrations-in-pup-dir',
      false,
    );

    const featuredPluginItemSubviews = _.map(featuredPlugins, (plugin) => {
      return this.subview(
        DirectoryPluginItemView,
        this.model,
        {
          atomType: PowerUpItemType.Featured,
          currentPage: this.currentPage,
          plugin,
          directoryView: this.directoryView,
        },
        plugin.id,
      );
    });

    const essentialPluginItemSubviews = _.map(essentialPlugins, (plugin) => {
      return this.subview(
        DirectoryPluginItemView,
        this.model,
        {
          atomType: PowerUpItemType.Featured,
          currentPage: this.currentPage,
          plugin,
          directoryView: this.directoryView,
        },
        plugin.id,
      );
    });

    const integrationItemSubviews = _.map(integrations, (plugin) => {
      return this.subview(
        DirectoryPluginItemView,
        this.model,
        {
          atomType: PowerUpItemType.Featured,
          currentPage: this.currentPage,
          plugin,
          directoryView: this.directoryView,
        },
        plugin.id,
      );
    });

    const otherPluginItemSubviews = _.map(otherPlugins, (plugin) => {
      return this.subview(
        DirectoryPluginItemView,
        this.model,
        {
          atomType: PowerUpItemType.Description,
          currentPage: this.currentPage,
          plugin,
          directoryView: this.directoryView,
        },
        plugin.id,
      );
    });

    this.appendSubviews(
      featuredPluginItemSubviews,
      this.$el.find('.js-featured-power-ups-container'),
    );
    this.appendSubviews(
      essentialPluginItemSubviews,
      this.$el.find('.js-essential-power-ups-container'),
    );
    if (showIntegrations) {
      this.appendSubviews(
        integrationItemSubviews,
        this.$el.find('.js-integrations-container'),
      );
    }
    this.appendSubviews(
      otherPluginItemSubviews,
      this.$el.find('.js-other-power-ups-container'),
    );

    const listedPowerUpsEnabled = _.intersection(
      _.map(listedPlugins, 'id'),
      _.map(enabledPlugins, 'id'),
    );

    this.directoryView.trackScreenEvent(
      this.eventSource(),
      {
        totalListed: listedPlugins.length,
        totalListedEnabled: listedPowerUpsEnabled.length,
        totalEnabled: enabledPlugins.length,
        allPowerUpsEnabled: _.map(enabledPlugins, 'id'),
      },
      listedPowerUpsEnabled,
    );

    return this;
  }
};
