/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { googleMapsApi } = require('app/scripts/lib/google-maps-api');
const { Key, getKey } = require('@trello/keybindings');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_location',
);
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const outerTemplate = t.renderable(() =>
  t.div(function () {
    t.input('.js-autofocus.js-location-search', {
      type: 'text',
      placeholder: t.l('search-placeholder'),
      autocomplete: 'off',
    });

    return t.div('.js-results');
  }),
);

const resultsTemplate = t.renderable(function ({
  noSearchResults,
  items,
  selectedIndex,
}) {
  if (noSearchResults) {
    t.p('.empty.plugin-pop-over-search-empty', function () {
      t.format('no-results');
    });
  }

  return t.ul('.pop-over-list.js-list.navigable', () =>
    (() => {
      const result = [];
      for (const { text, index, placeId } of Array.from(items)) {
        const selected = index === selectedIndex;
        result.push(
          t.li({ class: t.classify({ selected }) }, () =>
            t.a('.js-location-item', { 'data-place-id': placeId }, () =>
              t.text(text),
            ),
          ),
        );
      }
      return result;
    })(),
  );
});

class SetCardLocationPopoverView extends View {
  static initClass() {
    this.prototype.events = {
      'keyup .js-location-search': 'keyUp',
      'click .js-location-item': 'setLocation',
    };
  }

  viewTitleKey() {
    if (this.model.get('coordinates')) {
      return 'change location';
    }

    return 'add location';
  }

  initialize() {
    return googleMapsApi.load().then(() => {
      return this.render();
    });
  }

  getSessionToken() {
    return (
      this.sessionToken ??
      (this.sessionToken = googleMapsApi.createPlacesSessionToken())
    );
  }

  setLocation(e) {
    const placeId = this.$(e.currentTarget).attr('data-place-id');

    const traceId = Analytics.startTask({
      taskName: 'edit-card/location',
      source: 'cardDetailScreen',
    });

    googleMapsApi
      .getPlaceDetails({
        placeId,
        sessionToken: this.getSessionToken(),
        fields: ['name', 'geometry.location', 'formatted_address'],
      })
      .then((place) => {
        return this.model.update(
          {
            traceId,
            coordinates: {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            },
            locationName: place.name,
            address: place.formatted_address,
          },
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
      });

    return PopOver.hide();
  }

  keyUp(e) {
    const key = getKey(e);

    const $list = this.$('.js-list');

    if ([Key.ArrowLeft, Key.ArrowRight].includes(key)) {
      return;
    }

    if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      Util.stop(e);
      Util.navMenuList($list, 'li', key);
      return;
    } else if ([Key.Enter, Key.Tab].includes(key)) {
      Util.stop(e);
      $list.find('li.selected a').click();
      return;
    }

    const input = this._searchVal();

    if (!input.length) {
      this.$el.find('.js-results').empty();
      return;
    }

    return googleMapsApi
      .autocomplete({
        input,
        sessionToken: this.getSessionToken(),
      })
      .then((predictions) => {
        return this.renderResults(predictions);
      })
      .catch(() => {
        return this.renderResults([]);
      });
  }

  renderResults(predictions) {
    const $results = this.$el.find('.js-results');

    const items = predictions.map((prediction, index) => ({
      index,
      text: prediction.description,
      placeId: prediction.place_id,
    }));

    const noSearchResults = !items.length;
    const selectedIndex = items[0]?.index ?? -1;

    return $results.html(
      resultsTemplate({ noSearchResults, items, selectedIndex }),
    );
  }

  _searchVal() {
    return this.$('.js-location-search').val().trim() ?? '';
  }

  render() {
    this.$el.html(outerTemplate());

    return this;
  }
}

SetCardLocationPopoverView.initClass();
module.exports = SetCardLocationPopoverView;
