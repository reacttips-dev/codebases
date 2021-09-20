// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { PowerUpItemType } = require('app/src/components/PowerUp');
const BaseDirectoryView = require('./base-directory-view');
const DirectoryPluginItemView = require('./directory-plugin-item-view');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'directory_enabled',
);

class DirectoryEnabledComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Enabled Power-Ups';

    this.prototype.render = t.renderable(() =>
      t.div('.directory-content-body', () => t.div('.directory-listing')),
    );
  }
}
DirectoryEnabledComponent.initClass();

class DirectoryEnabledEmptyComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Enabled Power-Ups Empty State';

    this.prototype.render = t.renderable(() =>
      t.div('.directory-content-body.directory-enabled-empty', function () {
        t.div('.directory-enabled-empty-text', function () {
          t.p(() =>
            t.formatText('there-are-no-power-ups-enabled-for-this-board'),
          );
          return t.p(() =>
            t.formatText('get-started-with-these-great-power-ups'),
          );
        });
        return t.div('.directory-listing');
      }),
    );
  }
}
DirectoryEnabledEmptyComponent.initClass();

module.exports = class DirectoryEnabledView extends BaseDirectoryView {
  eventSource() {
    return 'boardDirectoryEnabledScreen';
  }

  initialize({ plugins, currentPage, directoryView }) {
    this.plugins = plugins;
    this.currentPage = currentPage;
    this.directoryView = directoryView;
    super.initialize(...arguments);
    this.listenTo(
      this.model,
      'change:idOrganization change:powerUps',
      this.frameDebounce(this.render),
    );
    return this.listenTo(
      this.model.boardPluginList,
      'add remove reset',
      this.frameDebounce(this.render),
    );
  }

  // Returns 3 random plugins, but filter hidden/moderated ones first
  getPluginSuggestions() {
    const filteredPlugins = this.directoryView.filterOutHiddenPlugins(
      this.plugins,
    );
    return _.sample(filteredPlugins, 3);
  }

  renderContent() {
    this.enabledPlugins = this.directoryView.getEnabledPlugins();
    if (this.enabledPlugins.length) {
      return <DirectoryEnabledComponent />;
    } else {
      return <DirectoryEnabledEmptyComponent />;
    }
  }

  render() {
    let listedPlugins;
    super.render(...arguments);
    const contentContainer = this.$el.find('.directory-listing');
    contentContainer.empty();

    if (this.enabledPlugins.length > 0) {
      listedPlugins = this.enabledPlugins;
      const enabledPluginViews = _.map(this.enabledPlugins, (plugin) => {
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

      this.appendSubviews(enabledPluginViews, contentContainer);
    } else {
      const pluginSuggestions = this.getPluginSuggestions();
      listedPlugins = pluginSuggestions;
      const powerUpSuggestionViews = _.map(pluginSuggestions, (plugin) => {
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

      this.appendSubviews(powerUpSuggestionViews, contentContainer);
    }

    const listedPowerUpsEnabled = _.intersection(
      _.map(listedPlugins, 'id'),
      _.map(this.enabledPlugins, 'id'),
    );

    this.directoryView.trackScreenEvent(
      this.eventSource(),
      {
        totalListed: listedPlugins.length,
        totalListedEnabled: listedPowerUpsEnabled.length,
        totalEnabled: this.enabledPlugins.length,
        allPowerUpsEnabled: _.map(this.enabledPlugins, 'id'),
      },
      listedPowerUpsEnabled,
    );

    return this;
  }
};
