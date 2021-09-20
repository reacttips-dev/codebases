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
const t = require('app/scripts/views/internal/recup-with-helpers')('directory');

class DirectorySearchComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Search';

    this.prototype.render = t.renderable(function () {
      return t.div('.directory-content-body', () => {
        if (this.props.isEmpty) {
          return t.div('.directory-search-empty', () => {
            return t.p(() => {
              t.formatText('bummer-no-search-results-for');
              return t.span(() => {
                return t.text(`"${this.props.searchTerm}"`);
              });
            });
          });
        } else {
          return t.div('.directory-listing');
        }
      });
    });
  }
}
DirectorySearchComponent.initClass();

module.exports = class DirectorySearchView extends BaseDirectoryView {
  eventSource() {
    return 'boardDirectorySearch';
  }

  renderContent() {
    return (
      <DirectorySearchComponent
        searchTerm={this.options.searchTerm}
        isEmpty={_.isEmpty(this.options.plugins)}
      />
    );
  }

  render() {
    super.render(...arguments);
    const contentContainer = this.$el.find('.directory-listing');
    contentContainer.empty();

    const { plugins, currentPage, directoryView } = this.options;

    const pluginViews = _.map(plugins, (plugin) => {
      return this.subview(
        DirectoryPluginItemView,
        this.model,
        {
          atomType: PowerUpItemType.Description,
          currentPage,
          plugin,
          directoryView,
        },
        plugin.id,
      );
    });

    this.appendSubviews(pluginViews, contentContainer);

    const enabledPlugins = directoryView.getEnabledPlugins();
    const listedPowerUpsEnabled = _.intersection(
      _.map(plugins, 'id'),
      _.map(enabledPlugins, 'id'),
    );

    directoryView.trackScreenEvent(
      this.eventSource(),
      {
        totalListed: plugins.length,
        totalListedEnabled: listedPowerUpsEnabled.length,
        totalEnabled: enabledPlugins.length,
        allPowerUpsEnabled: _.map(enabledPlugins, 'id'),
      },
      listedPowerUpsEnabled,
    );
    return this;
  }
};
