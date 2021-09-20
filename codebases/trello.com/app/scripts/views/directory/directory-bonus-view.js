const _ = require('underscore');
const { PowerUpItemType } = require('app/src/components/PowerUp');
const BaseDirectoryView = require('./base-directory-view');
const DirectoryPluginItemView = require('./directory-plugin-item-view');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')('directory');

class DirectoryBonusComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Bonus Power-Ups';

    this.prototype.render = t.renderable(() =>
      t.div('.directory-content-body', function () {
        t.div('.directory-bonus-banner', function () {
          t.h1(() => t.formatText('bonus-powerups'));
          return t.p(() => t.formatText('what-is-a-bonus-powerup'));
        });
        return t.div('.directory-listing');
      }),
    );
  }
}
DirectoryBonusComponent.initClass();

const DirectoryBonusView = class DirectoryBonusView extends BaseDirectoryView {
  eventSource() {
    return 'boardDirectoryBonusScreen';
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

  renderContent() {
    this.bonusPlugins = this.directoryView.getBonusPlugins();
    return <DirectoryBonusComponent />;
  }

  render() {
    super.render(...arguments);
    const contentContainer = this.$el.find('.directory-listing');
    contentContainer.empty();

    const enabledPluginViews = _.map(this.bonusPlugins, (plugin) => {
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

    const enabledPlugins = this.directoryView.getEnabledPlugins();
    const listedPowerUpsEnabled = _.intersection(
      _.map(this.bonusPlugins, 'id'),
      _.map(enabledPlugins, 'id'),
    );

    this.directoryView.trackScreenEvent(
      this.eventSource(),
      {
        totalListed: this.bonusPlugins.length,
        totalListedEnabled: listedPowerUpsEnabled.length,
        totalEnabled: enabledPlugins.length,
        allPowerUpsEnabled: _.map(enabledPlugins, 'id'),
      },
      listedPowerUpsEnabled,
    );

    return this;
  }
};

module.exports = DirectoryBonusView;
