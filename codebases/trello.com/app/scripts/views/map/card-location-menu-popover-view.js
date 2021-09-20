// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let CardLocationMenuPopoverView;
const { PopOver } = require('app/scripts/views/lib/pop-over');
const SetCardLocationPopoverView = require('app/scripts/views/map/set-card-location-popover-view');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_location',
);
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { formatLatLng } = require('app/common/lib/util/format-coordinates');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const template = t.renderable(() =>
  t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a('.js-change-location', { href: '#' }, () =>
        t.format('change-location'),
      ),
    );
    return t.li(() =>
      t.a('.js-delete-location', { href: '#' }, () => t.format('remove')),
    );
  }),
);

const deleteLocationTemplate = t.renderable(() =>
  t.div(function () {
    t.p(() => t.format('removing-a-location-is-permanent-there-is-no-undo'));
    return t.div(() =>
      t.button(
        '.nch-button.nch-button--danger.nch-button--fullwidth.js-delete-location',
        () => t.format('remove'),
      ),
    );
  }),
);

class CardLocationDeleteView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'remove location';

    this.prototype.events = { 'click .js-delete-location': 'deleteLocation' };
  }

  deleteLocation(e) {
    Util.stop(e);

    const traceId = Analytics.startTask({
      taskName: 'edit-card/location',
      source: 'cardDetailScreen',
    });

    this.model.removeLocation(
      traceId,
      tracingCallback(
        {
          taskName: 'edit-card/location',
          traceId,
          source: 'cardDetailScreen',
        },
        (err, card) => {
          if (card) {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'location',
              source: 'cardDetailScreen',
              containers: {
                card: { id: card.id },
                board: { id: card.idBoard },
                list: { id: card.idList },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      ),
    );

    return PopOver.hide();
  }

  render() {
    this.$el.html(deleteLocationTemplate());

    return this;
  }
}
CardLocationDeleteView.initClass();

module.exports = CardLocationMenuPopoverView = (function () {
  CardLocationMenuPopoverView = class CardLocationMenuPopoverView extends View {
    static initClass() {
      this.prototype.events = {
        'click .js-change-location': 'changeLocation',
        'click .js-delete-location': 'deleteLocation',
      };
    }

    getViewTitle() {
      let title = this.model.get('locationName') || this.model.get('address');

      if (!title) {
        const { latitude, longitude } = this.model.get('coordinates');
        title = formatLatLng(latitude, longitude);
      }

      return title;
    }

    changeLocation(e) {
      Util.stop(e);

      Analytics.sendClickedButtonEvent({
        buttonName: 'cardMapEditLocationButton',
        source: 'cardDetailScreen',
        containers: {
          card: {
            id: this.model.id,
          },
          list: {
            id: this.model.getList().id,
          },
          board: {
            id: this.model.getBoard().id,
          },
        },
      });

      return PopOver.pushView({
        view: SetCardLocationPopoverView,
        options: {
          model: this.model,
          modelCache: this.modelCache,
          trackingMethod: 'by clicking on the location overflow menu item',
        },
      });
    }

    deleteLocation(e) {
      Util.stop(e);

      return PopOver.pushView({
        view: CardLocationDeleteView,
        options: { model: this.model, modelCache: this.modelCache },
      });
    }

    render() {
      this.$el.html(template());

      return this;
    }
  };
  CardLocationMenuPopoverView.initClass();
  return CardLocationMenuPopoverView;
})();
