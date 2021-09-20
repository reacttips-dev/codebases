/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Confirm = require('app/scripts/views/lib/confirm');
const { Dates } = require('app/scripts/lib/dates');
const BluebirdPromise = require('bluebird');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_clean_up',
);
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');

const template = t.renderable(function ({ ageCategories, lists }) {
  const canCleanLists = !_.isEmpty(lists);
  const canCleanOldCards = !_.isEmpty(ageCategories);

  const cardsSummary = function (cards, canSelect) {
    if (canSelect) {
      t.div('.board-clean-up-cards-options', function () {
        t.span('.board-clean-up-cards-option.js-select-all', () =>
          t.format('select-all'),
        );
        return t.span('.board-clean-up-cards-option.js-select-none', () =>
          t.format('select-none'),
        );
      });
    }

    return t.div('.board-clean-up-cards', () =>
      Array.from(cards).map((card) =>
        t.div('.board-clean-up-card', function () {
          if (canSelect) {
            t.div(() =>
              t.span(
                '.board-clean-up-checkbox.js-toggle-checkbox',
                {
                  'data-checked': 'checked',
                  'data-card': card.id,
                },
                () =>
                  t.icon('check', { class: 'board-clean-up-checkbox-check' }),
              ),
            );
          }
          return t.a('.list-card', { href: card.get('url') }, () =>
            t.span('.board-clean-up-card-name', () => t.text(card.get('name'))),
          );
        }),
      ),
    );
  };

  t.div('.window-header.u-clearfix', function () {
    t.span('.window-header-icon.icon-lg.icon-board');

    return t.div('.window-title', () =>
      t.h2('.window-title-text', () => t.format('board-clean-up')),
    );
  });

  return t.div('.window-main-col.window-main-col-full', function () {
    if (canCleanLists) {
      t.p('.board-clean-up-explanation', () =>
        t.format(
          'it-looks-like-you-have-some-lists-that-havent-been-updated-recently',
        ),
      );

      t.table('.board-clean-up-table', () =>
        t.tbody(function () {
          t.tr(function () {
            t.th(() => t.format('list'));
            t.th(() => t.format('cards'));
            t.th(() => t.format('last-updated'));
            return t.th(function () {});
          });

          return (() => {
            const result = [];
            for (const {
              id,
              listName,
              cards,
              cardCount,
              lastModified,
            } of Array.from(lists)) {
              t.tr('.board-clean-up-top', function () {
                t.td(() => t.text(listName));
                t.td(() => t.text(cardCount));
                t.td(() => t.text(Dates.toDateString(lastModified)));
                return t.td('.board-clean-up-button-cell', () =>
                  t.button(
                    '.board-clean-up-button.js-archive-list',
                    { 'data-list': id },
                    () => t.format('archive-list'),
                  ),
                );
              });
              result.push(
                t.tr('.board-clean-up-bottom', () =>
                  t.td({ colspan: 4 }, () => cardsSummary(cards, false)),
                ),
              );
            }
            return result;
          })();
        }),
      );
    }

    if (canCleanLists && canCleanOldCards) {
      t.hr();
    }

    if (canCleanOldCards) {
      t.p('.board-clean-up-explanation', function () {
        if (canCleanLists) {
          return t.format(
            'you-can-also-clean-things-up-by-archiving-cards-that-havent-been-updated-in-a-while',
          );
        } else {
          return t.format(
            'you-can-clean-things-up-by-archiving-cards-that-havent-been-updated-in-a-while',
          );
        }
      });

      t.table('.board-clean-up-table', () =>
        t.tbody(function () {
          t.tr(function () {
            t.th(() => t.format('cards-updated'));
            t.th(() => t.format('cards'));
            return t.th(function () {});
          });

          return (() => {
            const result = [];
            for (const key in ageCategories) {
              const cards = ageCategories[key];
              t.tr(
                '.board-clean-up-top.js-category-heading',
                { 'data-category': key },
                function () {
                  t.td(() => t.format(['more-than', key]));
                  t.td('.js-card-count', () => t.text(cards.length));
                  return t.td('.board-clean-up-button-cell', () =>
                    t.button(
                      '.board-clean-up-button.js-archive-category',
                      { 'data-category': key },
                      () => t.format('archive-selected-cards'),
                    ),
                  );
                },
              );
              result.push(
                t.tr(
                  '.board-clean-up-bottom.js-category-cards',
                  { 'data-category': key },
                  () => t.td({ colspan: 3 }, () => cardsSummary(cards, true)),
                ),
              );
            }
            return result;
          })();
        }),
      );
    }

    if (!(canCleanLists || canCleanOldCards)) {
      return t.p('.board-clean-up-explanation', () =>
        t.format('it-doesnt-look-like-there-are-any-old-cards-to-clean-up'),
      );
    }
  });
});

const progressTemplate = t.renderable(function ({ count, total }) {
  t.div('.window-header.u-clearfix', function () {
    t.span('.window-header-icon.icon-lg.icon-board');

    return t.div('.window-title', () =>
      t.h2('.window-title-text', () => t.format('board-clean-up')),
    );
  });

  return t.div('.window-main-col.window-main-col-full', () =>
    t.div('.board-clean-up-progress', () =>
      t.format('archiving', { count, total }),
    ),
  );
});

const CATEGORIES = {
  threeMonths: {
    age: Util.getMs({ days: 90 }),
  },
  month: {
    age: Util.getMs({ days: 30 }),
  },
  week: {
    age: Util.getMs({ days: 7 }),
  },
};

// Minimum amount of time to spend per close, to keep from
// hitting rate limits
// With these settings we'd close 300 cards per minute
const MINIMUM_TIME = 1000;
const CONCURRENCY = 5;

const filterByAttr = (attr, value) => (index, el) =>
  el.getAttribute(attr) === value;

class BoardCleanUpView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-archive-category': 'archiveCategory',
      'click .js-archive-list': 'archiveList',
      'click .js-toggle-checkbox'(e) {
        const $checkbox = this.$(e.currentTarget);
        if ($checkbox.is('[data-checked]')) {
          $checkbox.removeAttr('data-checked');
        } else {
          $checkbox.attr('data-checked', 'checked');
        }

        return this._updateCategory(
          $checkbox.closest('.js-category-cards').attr('data-category'),
        );
      },

      'click .js-select-all'(e) {
        const $container = this.$(e.currentTarget).closest(
          '.js-category-cards',
        );
        $container.find('.js-toggle-checkbox').attr('data-checked', 'checked');
        return this._updateCategory($container.attr('data-category'));
      },

      'click .js-select-none'(e) {
        const $container = this.$(e.currentTarget).closest(
          '.js-category-cards',
        );
        $container.find('.js-toggle-checkbox').removeAttr('data-checked');
        return this._updateCategory($container.attr('data-category'));
      },
    };
  }

  initialize() {
    this.progress = null;
    this.aborted = false;
    this.traceId = null;

    this.makeDebouncedMethods('render');

    this.listenTo(
      this.model.listList,
      'add remove reset change:closed change:idBoard',
      this.renderDebounced,
    );
    this.listenForCards();
  }

  _updateCategory(category) {
    const matchesCategory = filterByAttr('data-category', category);
    const $heading = this.$('.js-category-heading').filter(matchesCategory);
    const $cards = this.$('.js-category-cards').filter(matchesCategory);

    const uncheckedCards = $cards.find(
      '.js-toggle-checkbox:not([data-checked])',
    );
    const checkedCards = $cards.find('.js-toggle-checkbox[data-checked]');

    $cards.find('.js-select-all').toggleClass('hide', !uncheckedCards.length);
    $cards.find('.js-select-none').toggleClass('hide', !checkedCards.length);

    $heading.find('.js-card-count').text(checkedCards.length);
    return $heading
      .find('.js-archive-category')
      .toggleClass('hide', !checkedCards.length);
  }

  listenForCards() {
    return this.listenTo(
      this.modelCache,
      'add:Card remove:Card change:Card:closed change:Card:idList',
      this.renderDebounced,
    );
  }

  stopListeningForCards() {
    return this.stopListening(this.modelCache);
  }

  _ageCategories() {
    const visibleCards = this.modelCache.find('Card', (card) => {
      return card.get('idBoard') === this.model.id && card.isVisible();
    });

    return _.chain(CATEGORIES)
      .pairs()
      .map(function (...args) {
        const [key, { age }] = Array.from(args[0]);
        const cards = visibleCards.filter(
          (card) =>
            Date.now() - Dates.parse(card.get('dateLastActivity')) > age,
        );

        return [key, cards];
      })
      .filter(function (...args) {
        const [, cards] = Array.from(args[0]);
        return cards.length > 0;
      })
      .object()
      .value();
  }

  render() {
    Analytics.sendScreenEvent({
      name: 'boardCleanUpModal',
      containers: {
        board: {
          id: this.model.id,
        },
        workspace: {
          id: this.model.getOrganization()?.id,
        },
        enterprise: {
          id: this.model.getEnterprise()?.id,
        },
      },
    });

    if (this.progress != null) {
      this.$el.html(progressTemplate(this.progress));
      return this;
    }

    const lists = this.model.listList
      .chain()
      .filter((list) => list.isOpen())
      .map(function (list) {
        const openCards = list.openCards().models;

        const newestCard = _.chain(openCards)
          .sortBy((card) => card.get('dateLastActivity'))
          .reverse()
          .first()
          .value();

        return {
          id: list.id,
          listName: list.get('name'),
          cardCount: openCards.length,
          cards: openCards,
          lastModified:
            newestCard != null ? newestCard.get('dateLastActivity') : undefined,
        };
      })
      .filter(
        (entry) =>
          entry.lastModified != null &&
          Dates.parse(entry.lastModified) <
            Date.now() - Util.getMs({ days: 30 }),
      )
      .sortBy((entry) => -entry.cardCount)
      .first(5)
      .value();

    this.$el.html(
      template({
        ageCategories: this._ageCategories(),
        lists,
      }),
    );

    _.keys(CATEGORIES).forEach((category) => {
      return this._updateCategory(category);
    });

    return this;
  }

  archiveCategory(e) {
    Util.stop(e);
    const category = this.$(e.currentTarget).attr('data-category');

    const checked = {};

    this.$('.js-category-cards')
      .filter(filterByAttr('data-category', category))
      .find('.js-toggle-checkbox')
      .each((index, el) => {
        const $checkbox = this.$(el);
        const idCard = $checkbox.attr('data-card');
        checked[idCard] = $checkbox.is('[data-checked]');
      });

    const cards = this._ageCategories()[category].filter(
      (card) => checked[card.id],
    );

    if (cards != null) {
      const boardModel = this.model;
      return Confirm.toggle('archive cards', {
        elem: e.target,
        model: this.model,
        fxConfirm: (e) => {
          this.stopListeningForCards();
          this.progress = {
            count: 0,
            total: cards.length,
          };
          this.render();

          this.traceId = Analytics.startTask({
            taskName: 'archive-cards',
            source: 'boardCleanUpModal',
          });

          this.aborted = false;
          return BluebirdPromise.map(
            cards,
            (card) => {
              if (this.aborted) {
                return;
              }

              const started = Date.now();

              return BluebirdPromise.fromNode((callback) =>
                card.close(callback),
              )
                .then(function () {
                  Analytics.sendTrackEvent({
                    action: 'archived',
                    actionSubject: 'card',
                    actionSubjectId: card.id,
                    source: 'boardCleanUpModal',
                    containers: {
                      board: {
                        id: boardModel.id,
                      },
                      workspace: {
                        id: boardModel.getOrganization()?.id,
                      },
                      enterprise: {
                        id: boardModel.getEnterprise()?.id,
                      },
                    },
                    attributes: {
                      isBulkAction: true,
                    },
                  });

                  const elapsed = Date.now() - started;
                  const remaining = MINIMUM_TIME - elapsed;
                  if (remaining > 0) {
                    return BluebirdPromise.delay(remaining);
                  }
                })
                .then(() => {
                  this.progress.count++;
                  return this.render();
                });
            },
            { concurrency: CONCURRENCY },
          )
            .then(() => {
              Analytics.taskSucceeded({
                taskName: 'archive-cards',
                source: 'boardCleanUpModal',
                traceId: this.traceId,
              });
            })
            .catch(() => {
              Analytics.taskFailed({
                taskName: 'archive-cards',
                source: 'boardCleanUpModal',
                traceId: this.traceId,
              });
            })
            .then(() => {
              this.progress = null;
              this.listenForCards();
              return this.render();
            })
            .done();
        },
      });
    }
  }

  archiveList(e) {
    Util.stop(e);
    const idList = this.$(e.currentTarget).attr('data-list');

    const list = this.model.listList.get(idList);

    Analytics.sendTrackEvent({
      action: 'archived',
      actionSubject: 'list',
      actionSubjectId: idList,
      source: 'boardCleanUpModal',
      containers: {
        board: {
          id: this.model.id,
        },
        workspace: {
          id: this.model.getOrganization()?.id,
        },
        enterprise: {
          id: this.model.getEnterprise()?.id,
        },
      },
    });

    return list.close();
  }

  abort() {
    this.aborted = true;
    if (this.progress) {
      Analytics.taskAborted({
        taskName: 'archive-cards',
        source: 'boardCleanUpModal',
        traceId: this.traceId,
      });
    }
  }
}

BoardCleanUpView.initClass();
module.exports = BoardCleanUpView;
