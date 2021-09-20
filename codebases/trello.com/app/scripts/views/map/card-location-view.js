/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const _ = require('underscore');
const CardLocationMenuPopoverView = require('app/scripts/views/map/card-location-menu-popover-view');
const { Controller } = require('app/scripts/controller');
const Dialog = require('app/scripts/views/lib/dialog');
const { googleMapsApi } = require('app/scripts/lib/google-maps-api');
const { getKey, Key } = require('@trello/keybindings');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { CardStaticMap } = require('app/src/components/CardStaticMap');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_location',
);
const { removeAllRanges } = require('app/scripts/lib/util/removeAllRanges');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const {
  sendPluginScreenEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { formatLatLng } = require('app/common/lib/util/format-coordinates');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { featureFlagClient } = require('@trello/feature-flag-client');

const MAP_POWER_UP_ID = require('@trello/config').mapPowerUpId;

const MAX_LOCATION_NAME_LENGTH = 16384;

const template = t.renderable(
  ({ staticMapImage, address, externalUrl, editable }) =>
    t.div('.card-back-location.js-open-in-map', function () {
      if (featureFlagClient.get('ecosystem.sign-static-map-url', false)) {
        t.div('#js-static-map');
      } else {
        t.img('.card-back-static-map', { src: staticMapImage });
      }
      return t.div('.card-back-location-footer', function () {
        t.div('.card-back-location-details', function () {
          const inputClasses = {
            'mod-card-back-location-name': true,
            'js-card-location-name-input': true,
          };
          t.textarea({
            class: t.classify(inputClasses),
            disabled: !editable,
            dir: 'auto',
          });
          if (address) {
            return t.div('.quiet', () => t.text(address));
          }
        });
        return t.div('.card-back-location-controls', function () {
          t.a(
            '.card-back-location-controls-option.js-track-external-link',
            { href: externalUrl, target: '_blank', rel: 'noopener noreferrer' },
            () => t.icon('external-link', { class: 'icon-sm' }),
          );
          if (editable) {
            return t.a('.card-back-location-controls-option.js-open-menu', () =>
              t.icon('overflow-menu-horizontal', { class: 'icon-sm' }),
            );
          }
        });
      });
    }),
);

class CardLocationView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-open-in-map': 'openInMap',
      'click .js-open-menu': 'openMenu',
      'click .js-track-external-link': 'trackExternalLinkClick',

      'click .js-card-location-name-input': 'locationNameClick',
      'keydown .js-card-location-name-input': 'locationNameKeyDownEvent',
      'focus .js-card-location-name-input'(e) {
        return this.startLocationNameEditing({ focus: false });
      },

      'blur .js-card-location-name-input': 'saveLocationNameEditing',
    };
  }

  initialize() {
    this.makeDebouncedMethods('render', 'renderLocationName');

    this.listenTo(this.model, {
      'change:coordinates': this.renderDebounced,
      'change:locationName': this.renderLocationNameDebounced,
    });

    return sendPluginScreenEvent({
      idPlugin: MAP_POWER_UP_ID,
      idBoard: this.model.getBoard().id,
      idCard: this.model.id,
      screenName: 'pupCardBackSectionInlineDialog',
    });
  }

  locationNameKeyDownEvent(e) {
    if (getKey(e) === Key.Enter) {
      Util.stop(e); // prevents new lines
      this.saveLocationNameEditing();
    }

    if (getKey(e) === Key.Escape) {
      Util.stop(e); // don't close the overlay…
      this.cancelLocationNameEditing();
    }
  }

  startLocationNameEditing(options) {
    if (options == null) {
      options = {};
    }
    const $input = this.$('.js-card-location-name-input');

    if (!$input.hasClass('is-editing')) {
      $input.addClass('is-editing');

      if (options.focus) {
        $input.focus().select();
      }
    }
  }

  saveLocationNameEditing() {
    const $input = this.$('.js-card-location-name-input');
    if ($input.hasClass('is-editing')) {
      this.stopLocationNameEditing();
      return this.saveLocationName();
    }
  }

  cancelLocationNameEditing() {
    this.stopLocationNameEditing();
    return this.renderLocationName();
  }

  stopLocationNameEditing() {
    const $input = this.$('.js-card-location-name-input');
    if ($input.hasClass('is-editing')) {
      $input.removeClass('is-editing');
      $input.blur();
      removeAllRanges();
    }
  }

  renderLocationName() {
    const $input = this.$('.js-card-location-name-input');

    if (!$input.hasClass('is-editing')) {
      let name = this.model.get('locationName');

      if (name == null || !name.length) {
        const { latitude, longitude } = this.model.get('coordinates');
        name = formatLatLng(latitude, longitude);
      }

      return $input.val(name).trigger('autosize.resize', false);
    }
  }

  locationNameClick(e) {
    return Util.stopPropagation(e);
  }

  saveLocationName() {
    const $input = this.$('.js-card-location-name-input');
    let newValue = $input.val();
    const locationName = this.model.get('locationName');

    // remove whitespace
    newValue = newValue.replace(/\s+/g, ' ').trim();

    // if it's the same name, don't save
    if (newValue === locationName) {
      return;
    }

    // if it's too long, don't save
    if (newValue.length > MAX_LOCATION_NAME_LENGTH) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-card/locationName',
      source: 'cardDetailScreen',
    });

    // if it's empty then clear the name
    if (newValue.length === 0) {
      newValue = null;
    }

    this.model.update(
      {
        traceId,
        locationName: newValue,
      },
      tracingCallback(
        {
          taskName: 'edit-card/locationName',
          traceId,
          source: 'cardDetailScreen',
        },
        (err, card) => {
          if (card) {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'locationName',
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
  }

  openMenu(e) {
    Util.stopPropagation(e);
    return PopOver.toggle({
      elem: this.$('.js-open-menu'),
      view: CardLocationMenuPopoverView,
      options: { model: this.model, modelCache: this.modelCache },
    });
  }

  trackExternalLinkClick(e) {
    Util.stopPropagation(e);

    return Analytics.sendClickedLinkEvent({
      linkName: 'cardMapExternalLink',
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
  }

  openInMap(e) {
    Util.stop(e);

    Analytics.sendClickedLinkEvent({
      linkName: 'mapLocationPowerUpLink',
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

    const { latitude, longitude } = this.model.get('coordinates');
    const center = {
      lat: latitude,
      lng: longitude,
    };

    const boardView = Controller.getCurrentBoardView();

    // The map is already open;
    // Make the map zoom into the location.
    if (boardView.mapView != null) {
      Dialog.hide();
      boardView.mapView.centerTo(center, 17);
      return;
    }

    return boardView.navigateToMap(center, this.model);
  }

  renderCardStaticMap() {
    const container = this.$('#js-static-map')[0];
    if (container) {
      renderComponent(
        React.createElement(CardStaticMap, {
          cardId: this.model.id,
        }),
        container,
      );
    }
  }

  render() {
    const coordinates = this.model.get('coordinates');
    const data = {
      staticMapImage: googleMapsApi.getStaticMap({
        zoom: 14,
        width: 676,
        height: 200,
        scale: 2,
        markers: [coordinates],
      }),
      address: this.model.get('address'),
      locationName: this.model.get('locationName'),
      externalUrl: googleMapsApi.getUrl(
        coordinates.latitude,
        coordinates.longitude,
      ),
      editable: this.model.editable(),
    };

    this.$el.html(template(data));

    this.renderLocationName();

    this.renderCardStaticMap();

    _.defer(() => {
      return this.$('.js-card-location-name-input').autosize({
        append: false,
      });
    });

    return this;
  }
}

CardLocationView.initClass();
module.exports = CardLocationView;
