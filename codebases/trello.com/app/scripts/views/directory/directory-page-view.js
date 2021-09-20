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

class DirectoryPageComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Page';

    this.prototype.render = t.renderable(() =>
      t.div('.directory-content-body', () => {
        return t.div('.directory-listing');
      }),
    );
  }
}
DirectoryPageComponent.initClass();

module.exports = class DirectoryCategoryView extends BaseDirectoryView {
  eventSource() {
    const { title } = this.options;
    if (title === 'custom') {
      return 'boardDirectoryCustomScreen';
    } else if (title === 'made-by-trello') {
      return 'boardDirectoryMadeByTrelloScreen';
    } else {
      return 'boardDirectoryCategoryScreen';
    }
  }

  renderContent() {
    return <DirectoryPageComponent title={this.options.title} />;
  }

  render() {
    super.render(...arguments);
    const contentContainer = this.$el.find('.directory-listing');
    contentContainer.empty();

    const { plugins, currentPage, directoryView, title } = this.options;

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

    const eventPayload = {
      totalListed: plugins.length,
      totalListedEnabled: listedPowerUpsEnabled.length,
      totalEnabled: enabledPlugins.length,
      allPowerUpsEnabled: _.map(enabledPlugins, 'id'),
      listedPowerUpsEnabled,
    };

    const eventName = this.eventSource();
    if (title !== 'custom') {
      eventPayload.categoryid = title;
    }

    directoryView.trackScreenEvent(eventName, eventPayload);

    return this;
  }
};
