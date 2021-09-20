// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let BoardSidebarPowerUpSlotView;
const { Analytics } = require('@trello/atlassian-analytics');
const DirectoryPluginItemView = require('app/scripts/views/directory/directory-plugin-item-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_power_up_slot',
);
const { Controller } = require('app/scripts/controller');
const { navigate } = require('app/scripts/controller/navigate');

const MAP_POWER_UP_ID = require('@trello/config').mapPowerUpId;

const powerUpSlot = t.renderable(({ id, name, icon }) =>
  t.a(
    '.board-menu-navigation-item-link.mod-enabled',
    { href: '#' },
    function () {
      t.span('.board-menu-navigation-item-link-icon.mod-enabled', {
        style: `background-image: url(${icon.url})`,
      });
      t.raw('&nbsp;');
      return t.text(name);
    },
  ),
);

module.exports = BoardSidebarPowerUpSlotView = (function () {
  BoardSidebarPowerUpSlotView = class BoardSidebarPowerUpSlotView extends (
    DirectoryPluginItemView
  ) {
    static initClass() {
      this.prototype.tagName = 'li';
      this.prototype.className = 'board-menu-navigation-item mod-power-up-slot';

      this.prototype.events = { click: 'toggleOptions' };
    }

    initialize({ plugin }) {
      this.plugin = plugin;
      return super.initialize(...arguments);
    }

    showListingOption() {
      // Don't show for Map, since it is only grandfathered in and does not exist in the directory
      if (this.plugin.id === MAP_POWER_UP_ID) {
        return false;
      }
      return true;
    }

    navigateToListing() {
      const directoryListingUrl = Controller.getBoardUrl(
        this.model.id,
        'power-up',
        [this.plugin.id],
      );
      navigate(directoryListingUrl, { trigger: true });
      PopOver.hide();
      return Analytics.sendClickedButtonEvent({
        buttonName: 'powerUpSlotButton',
        source: 'boardMenuDrawerDefaultScreen',
        containers: {
          board: {
            id: this.model.id,
          },
        },
        attributes: {
          powerUpId: this.plugin.id,
        },
      });
    }

    render() {
      this.$el.html(
        powerUpSlot({
          id: this.plugin.id,
          name: this.plugin.get('name'),
          icon: this.plugin.get('icon'),
        }),
      );

      return this;
    }
  };
  BoardSidebarPowerUpSlotView.initClass();
  return BoardSidebarPowerUpSlotView;
})();
