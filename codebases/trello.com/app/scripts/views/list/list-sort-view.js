/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ListSortView;
const _ = require('underscore');
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const template = require('app/scripts/views/templates/list_sort');
const { Util } = require('app/scripts/lib/util');
const { l } = require('app/scripts/lib/localize');
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;

const calculateMoves = ({ list, posBefore, posAfter }) =>
  Array.from(list).map((card, cardIndex) => ({
    card,
    pos:
      posBefore +
      ((cardIndex + 1) * (posAfter - posBefore)) / (list.length + 1),
  }));
// Figure out what moves need to happen to make all the cards in the list sort
// before the last item
const getMovesUp = function (list, idToPos) {
  let index = list.length - 1;

  return _.flatten(
    (() => {
      const result = [];
      while (index >= 0) {
        // Find the first card with a pos < posAfter
        const endIndex = index;
        index--;
        while (
          index >= 0 &&
          idToPos[list[index].id] > idToPos[list[endIndex].id]
        ) {
          index--;
        }

        result.push(
          calculateMoves({
            list: list.slice(index + 1, endIndex),
            posBefore: index >= 0 ? idToPos[list[index].id] : 0,
            posAfter: idToPos[list[endIndex].id],
          }),
        );
      }

      return result;
    })(),
  );
};

// Figure out what moves need to happen to make all the cards in the list sort
// after the first item
const getMovesDown = function (list, idToPos) {
  let index = 0;

  return _.flatten(
    (() => {
      const result = [];
      while (index < list.length) {
        // Find the first card with a pos > posBefore
        const startIndex = index;
        index++;
        while (
          index < list.length &&
          idToPos[list[index].id] < idToPos[list[startIndex].id]
        ) {
          index++;
        }

        result.push(
          calculateMoves({
            list: list.slice(startIndex + 1, index),
            posBefore: idToPos[list[startIndex].id],
            posAfter:
              index < list.length
                ? idToPos[list[index].id]
                : idToPos[list[startIndex].id] +
                  Util.spacing * (index - startIndex),
          }),
        );
      }

      return result;
    })(),
  );
};

const throttled = function (list, { fx, updatesPerMinute, concurrency }) {
  // What's the least time we should spend on a concurrent
  // request to make sure we don't send more than
  // updatesPerMinute requests per minute
  const msWait = concurrency * ((60 * 1000) / updatesPerMinute);

  return Promise.map(
    list,
    function (entry) {
      const start = Date.now();

      return Promise.resolve(fx(entry)).then(function () {
        // Delay a bit so we don't send too many updates
        const msRemaining = msWait - (Date.now() - start);
        if (msRemaining > 0) {
          return Promise.delay(msRemaining);
        }
      });
    },
    { concurrency },
  );
};

module.exports = ListSortView = (function () {
  ListSortView = class ListSortView extends PluginView {
    static initClass() {
      this.prototype.viewTitleKey = 'sort list';

      this.prototype.events = {
        'click .js-sort-by-due-date': 'sortByDueDate',
        'click .js-sort-newest-first': 'sortNewestFirst',
        'click .js-sort-oldest-first': 'sortOldestFirst',
        'click .js-sort-by-card-name': 'sortByCardName',
        'click .js-plugin-list-sort-action': 'sortByPluginSort',
      };
    }

    initialize() {
      Analytics.sendScreenEvent({
        name: 'sortListInlineDialog',
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });

      return this.retain(this.options.pluginListSorters);
    }

    render() {
      let pluginListSorters = _.chain(this.options.pluginListSorters)
        .filter(
          (s) =>
            _.isString(s.text) && s.text.length && _.isFunction(s.callback),
        )
        .map((s) =>
          _.extend(s, {
            image: PluginIOCache.fromId(s.idPlugin).getIconUrl(),
            name: PluginIOCache.fromId(s.idPlugin).getName(),
          }),
        )
        .value();

      pluginListSorters = pluginListSorters.concat(this.getCustomFieldSorts());
      if (this.model.getBoard().isPowerUpEnabled('voting')) {
        pluginListSorters.push({
          callback: this.sortByVotes(),
          text: l('templates.list_sort.most-votes'),
          image: require('resources/images/powerups/voting-icon.svg'),
          name: l('power ups.voting.name'),
        });
      }

      this.pluginListSorters = _.sortBy(pluginListSorters, 'text');

      this.$el.html(
        template({
          canSortByDueDate: this.model.cardList.any((card) => card.get('due')),
          pluginListSorters: this.pluginListSorters,
        }),
      );

      return this;
    }

    getCustomFieldSorts() {
      if (!this.model.getBoard().isCustomFieldsEnabled()) {
        return [];
      }

      return _.chain(this.model.getBoard().customFieldList.models)
        .filter((cf) => cf.isSortable() && cf.visible())
        .map((cf) => {
          if (cf.get('type') === 'number') {
            return [
              {
                callback: this.sortByCustomField(cf.id),
                text: l('templates.list_sort.field-ascending', {
                  field: cf.get('name'),
                }),
                image: PluginIOCache.fromId(CUSTOM_FIELDS_ID).getIconUrl(),
                name: l('view title.custom fields'),
              },
              {
                callback: this.sortByCustomField(cf.id, true),
                text: l('templates.list_sort.field-descending', {
                  field: cf.get('name'),
                }),
                image: PluginIOCache.fromId(CUSTOM_FIELDS_ID).getIconUrl(),
                name: l('view title.custom fields'),
              },
            ];
          } else {
            return {
              callback: this.sortByCustomField(cf.id),
              text: cf.get('name'),
              image: PluginIOCache.fromId(CUSTOM_FIELDS_ID).getIconUrl(),
              name: l('view title.custom fields'),
            };
          }
        })
        .flatten()
        .value();
    }

    sortByDueDate(e) {
      Util.stop(e);
      PopOver.hide();

      Analytics.sendTrackEvent({
        action: 'sorted',
        actionSubject: 'list',
        source: 'sortListInlineDialog',
        attributes: {
          method: 'by due date',
        },
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });

      return this.applySort(() => {
        return this.model.cardList.sortBy(function (card) {
          const due = card.get('due');
          const dueComplete = card.get('dueComplete');

          return [
            due ? (dueComplete ? '1' : '0') : '2',

            due != null ? due : '',
          ].join(':');
        });
      });
    }

    sortNewestFirst(e) {
      Util.stop(e);
      PopOver.hide();

      Analytics.sendTrackEvent({
        action: 'sorted',
        actionSubject: 'list',
        source: 'sortListInlineDialog',
        attributes: {
          method: 'by newest first',
        },
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });

      return this.applySort(
        () => this.model.cardList.sortBy((card) => card.id),
        { reverse: true },
      );
    }

    sortOldestFirst(e) {
      Util.stop(e);
      PopOver.hide();

      Analytics.sendTrackEvent({
        action: 'sorted',
        actionSubject: 'list',
        source: 'sortListInlineDialog',
        attributes: {
          method: 'by oldest first',
        },
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });

      return this.applySort(() => {
        return this.model.cardList.sortBy((card) => card.id);
      });
    }

    sortByCardName(e) {
      Util.stop(e);
      PopOver.hide();

      Analytics.sendTrackEvent({
        action: 'sorted',
        actionSubject: 'list',
        source: 'sortListInlineDialog',
        attributes: {
          method: 'by card name',
        },
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });

      return this.applySort(() => {
        // we'll need to restore the original comparator later, or else every new
        // card will not be inserted at the bottom of the list, but instead
        // alphabetically.
        const originalComparator = this.model.cardList.comparator;
        this.model.cardList.comparator = (card1, card2) =>
          card1.get('name').localeCompare(card2.get('name'));
        this.model.cardList.sort();
        this.model.cardList.comparator = originalComparator;
        return this.model.cardList.models;
      });
    }

    sortByCustomField(idCustomField, descending) {
      return () => {
        Analytics.sendTrackEvent({
          action: 'sorted',
          actionSubject: 'list',
          source: 'sortListInlineDialog',
          attributes: {
            method: 'by custom fields',
          },
          containers: {
            list: {
              id: this.model.id,
            },
            board: {
              id: this.model.getBoard()?.id,
            },
            organization: {
              id: this.model.getBoard()?.getOrganization()?.id,
            },
          },
        });

        const withValue = [];
        const withoutValue = [];
        _.forEach(this.model.cardList.models, function (c) {
          const fieldItem = c.customFieldItemList.find(
            (cfi) => cfi.get('idCustomField') === idCustomField,
          );
          if (fieldItem != null && !fieldItem.isEmpty()) {
            return withValue.push({
              id: c.id,
              value: fieldItem.getParsedValue(),
            });
          } else {
            return withoutValue.push(c.id);
          }
        });

        let sorted = _.chain(withValue)
          .sortBy((c) => c.value)
          .map((c) => c.id)
          .value();

        if (descending) {
          sorted = sorted.reverse();
        }

        sorted = sorted.concat(withoutValue);

        sorted = _.chain(sorted)
          .map((idCard, idx) => [idCard, idx])
          .object()
          .value();

        return this.applySort(() => {
          return this.model.cardList.sortBy((card) => sorted[card.id]);
        });
      };
    }

    sortByVotes() {
      return () => {
        Analytics.sendTrackEvent({
          action: 'sorted',
          actionSubject: 'list',
          source: 'sortListInlineDialog',
          attributes: {
            method: 'by votes',
          },
          containers: {
            list: {
              id: this.model.id,
            },
            board: {
              id: this.model.getBoard()?.id,
            },
            organization: {
              id: this.model.getBoard()?.getOrganization()?.id,
            },
          },
        });

        return this.applySort(() => {
          return this.model.cardList.sortBy(
            (card) => card.get('badges').votes * -1,
          );
        });
      };
    }

    sortByPluginSort(e) {
      Util.stop(e);

      const index = this.$(e.target)
        .closest('.js-plugin-list-sort-action')
        .data('index');
      const sort = this.pluginListSorters[index];

      if (sort.idPlugin) {
        sendPluginUIEvent({
          idPlugin: sort.idPlugin,
          idBoard: this.model.getBoard().id,
          event: {
            action: 'clicked',
            actionSubject: 'option',
            actionSubjectId: 'powerUpListSorter',
            source: 'listMenuInlineDialog',
          },
        });
        Alerts.show('sorting list', 'warning', 'listsort');
        sort
          .callback({
            options: {
              cards: PluginModelSerializer.cards(this.model.cardList.models, [
                'all',
              ]),
            },
          })
          .catch(() => ({}))
          .then((results) => {
            const sorted = results != null ? results.sortedIds : undefined;
            const actualCards = this.model.cardList.models;
            if (
              sorted == null ||
              !_.all(
                sorted,
                (idCard) => _.isString(idCard) && /^[a-f0-9]{24}$/.test(idCard),
              ) ||
              !_.all(actualCards, (c) => Array.from(sorted).includes(c.id))
            ) {
              Alerts.hide('listsort');
              Alerts.show(
                'invalid sort order returned',
                'warning',
                'listsort',
                5000,
              );
              PopOver.hide();
              return;
            }

            const sortLookup = _.chain(sorted)
              .map((idCard, index) => [idCard, index])
              .object()
              .value();
            return this.applySort(() => {
              return this.model.cardList.sortBy((card) => sortLookup[card.id]);
            });
          });
        return PopOver.hide();
      } else {
        sort.callback();
        return PopOver.hide();
      }
    }

    applySort(getDesiredCards, options) {
      if (options == null) {
        options = {};
      }
      if (this.model.cardList.length <= 1) {
        return;
      }

      Alerts.show('sorting list', 'warning', 'listsort');

      const desiredCards = getDesiredCards();
      if (options.reverse) {
        desiredCards.reverse();
      }

      // We're doing a lot of pos lookups, so use a simple hash
      const idToPos = _.chain(desiredCards)
        .map((card) => [card.id, card.get('pos')])
        .object()
        .value();

      // We want to optimize for changing as few positions as possible
      // so we'll choose PIVOT_COUNT cards where we sort everything before
      // and everything after, choose the pivot that results in the
      // fewest pos changes
      const PIVOT_COUNT = 10;

      const bestMoves = _.chain(__range__(0, PIVOT_COUNT, true))
        .map((index) => {
          return Math.round(((desiredCards.length - 1) * index) / PIVOT_COUNT);
        })
        .uniq()
        .map((index) => [
          ...Array.from(
            getMovesUp(desiredCards.slice(0, +index + 1 || undefined), idToPos),
          ),
          ...Array.from(getMovesDown(desiredCards.slice(index), idToPos)),
        ])
        .sortBy((entry) => entry.length)
        .first()
        .value();

      // Immediately update the UI
      for (const { card, pos } of Array.from(bestMoves)) {
        card.set('pos', pos);
      }

      // Throttle updates so we aren't sending too many at once
      // Lock the model cache so if another sort is started
      // while this one is still running, we don't end up with
      // cards jumping around when the previous updates complete
      return Promise.using(this.modelCache.getLock(), () =>
        throttled(bestMoves, {
          fx({ card, pos }) {
            return Promise.fromNode((next) =>
              card.update('pos', card.get('pos'), next),
            );
          },
          updatesPerMinute: 300,
          concurrency: 5,
        }),
      ).then(function () {
        Alerts.hide('listsort');
        return Alerts.show('list sorted', 'info', 'listsort', 3000);
      });
    }
  };
  ListSortView.initClass();
  return ListSortView;
})();

function __range__(left, right, inclusive) {
  const range = [];
  const ascending = left < right;
  const end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
