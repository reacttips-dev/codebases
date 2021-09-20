/* eslint-disable
    @typescript-eslint/no-this-alias,
    default-case,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Board } = require('app/scripts/models/board');
const { Card } = require('app/scripts/models/card');
const { getKey, Key } = require('@trello/keybindings');
const limitExceededTemplate = require('app/scripts/views/templates/popover_limit_exceeded');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { parseTrelloUrl } = require('app/scripts/lib/util/url/parse-trello-url');
const Payloads = require('app/scripts/network/payloads').default;
const Promise = require('bluebird');
const { Recents } = require('app/scripts/lib/recents');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const selectBoardTemplate = require('app/scripts/views/templates/select_board');
const selectCardTemplate = require('app/scripts/views/templates/select_card');
const { SidebarState } = require('app/scripts/view-models/sidebar-state');
const template = require('app/scripts/views/templates/popover_trello_completer');
const { Analytics } = require('@trello/atlassian-analytics');
const { ApiError } = require('app/scripts/network/api-error');
const { isShortId } = require('@trello/shortlinks');

class TrelloCompleterView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'add card or board';

    this.prototype.events = {
      'mouseenter .js-select-card,.js-select-board': 'hoverItem',
      'click .js-select-card': 'selectCard',
      'click .js-select-board': 'selectBoard',
      keydown: 'keydownEvent',
      'keyup .js-search': 'keyupEvent',
      'input .js-search': 'updateSearch',
    };
  }

  initialize() {
    this.items = [];
    this.debouncedSearch = this.debounce(this.search, 350).bind(this);
    return this.search('');
  }

  render() {
    const data = {};

    if (!this.model.canAttach()) {
      if (this.model.isOverLimit('attachments', 'perCard')) {
        this.$el.html(limitExceededTemplate('perCard'));
      } else if (this.model.getBoard().isOverLimit('attachments', 'perBoard')) {
        this.$el.html(limitExceededTemplate('perBoard'));
      }
      return this;
    }

    this.$el.html(template(data));

    Promise.resolve(this._lastRenderPromise)
      .then(() => {
        return this.renderItems();
      })
      .done();

    return this;
  }

  renderItems() {
    let data, board;
    this.$('.js-loading').addClass('hide');

    const hiddenCards = new Set([this.model.get('shortLink')]);
    const hiddenBoards = new Set();

    this.model.attachmentList.forEach(function (attachment) {
      const url = attachment.get('url');
      const { type, shortLink } = parseTrelloUrl(url);
      switch (type) {
        case 'card':
          return hiddenCards.add(shortLink);
        case 'board':
          return hiddenBoards.add(shortLink);
      }
    });

    const cards = this.items.filter(
      (item) => item instanceof Card && !hiddenCards.has(item.get('shortLink')),
    );
    const boards = this.items.filter(
      (item) =>
        item instanceof Board && !hiddenBoards.has(item.get('shortLink')),
    );

    const $cardList = this.$('.js-card-list').empty();
    const $boardList = this.$('.js-board-list').empty();

    if (cards.length > 0) {
      const cardHtml = (() => {
        const result = [];
        for (const card of Array.from(cards)) {
          data = card.toJSON();
          board = card.getBoard();

          if (board != null) {
            data.boardName = board.get('name');
          }

          result.push(selectCardTemplate(data));
        }
        return result;
      })();

      $cardList.append(cardHtml);
    }

    if (boards.length > 0) {
      const boardHtml = (() => {
        const result1 = [];
        for (board of Array.from(boards)) {
          const org = board.getOrganization();
          data = board.toJSON();

          if (org != null) {
            data.orgName = org.get('displayName');
          }

          result1.push(selectBoardTemplate(data));
        }
        return result1;
      })();

      $boardList.append(boardHtml);
    }

    if (this.items.length > 0) {
      Util.selectMenuItem(this.$el, '.item', this.$el.find('.item').first());
    }

    const hideCardResults = !this._lastQuery && cards.length === 0;
    const hideBoardResults = !this._lastQuery && boards.length === 0;
    this.$('.js-card-results').toggleClass('hide', hideCardResults);
    this.$('.js-board-results').toggleClass('hide', hideBoardResults);
    this.$('.js-no-card-results').toggleClass('hide', cards.length > 0);
    this.$('.js-no-board-results').toggleClass('hide', boards.length > 0);

    return this;
  }

  keyupEvent(e) {
    const key = getKey(e);

    if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      Util.stop(e);
      Util.navMenuList(this.$el, '.item', key);
    }
  }

  updateSearch(e) {
    const query = this.$('.js-search').val();
    return this.debouncedSearch(query);
  }

  keydownEvent(e) {
    let needle;
    if (((needle = getKey(e)), [Key.Enter, Key.Tab].includes(needle))) {
      Util.stop(e);
      const $item = this.$el
        .find('.item.selected:first')
        .find('.js-select-card,.js-select-board');
      if ($item.length > 0) {
        return $item.click();
      }
    }
  }

  getTextInput() {
    return $(this.options.target);
  }

  _renderSettledItems(query, eventualItems) {
    if (query !== this._lastQuery) {
      return;
    }

    return (this._lastRenderPromise = Promise.resolve(eventualItems)
      .then(function (items) {
        if (_.isArray(items)) {
          return items;
        } else {
          return [items];
        }
      })
      .catch(ApiError, () => [])
      .tap((items) => {
        this.items = items;
        return this.renderItems();
      })
      .finally(() => {
        return (this._lastRenderPromise = null);
      }));
  }

  search(query) {
    if (query === this._lastQuery) {
      return;
    }

    this._lastQuery = query;

    this.$('.js-card-results').addClass('hide');
    this.$('.js-board-results').addClass('hide');
    this.$('.js-loading').removeClass('hide');

    if (query === '') {
      const RECENT_COUNT = 5;

      const idRecentCards = _.chain(Recents.get('card', RECENT_COUNT + 1))
        .without(this.model.id)
        .first(RECENT_COUNT)
        .value();

      const idRecentBoards = _.chain(SidebarState.getRecentBoards())
        .without(this.model.get('idBoard'))
        .first(RECENT_COUNT)
        .value();

      const recentItems = Promise.props({
        recentCards: Promise.map(idRecentCards, (idCard) => {
          return this.modelCache.getOrLoad({
            type: 'Card',
            id: idCard,
            payload: Payloads.cardCompleter,
            loader(id) {
              return ModelLoader.loadCardCompleterData(id);
            },
          });
        }),

        recentBoards: Promise.map(idRecentBoards, (idBoard) => {
          return this.modelCache.getOrLoad({
            type: 'Board',
            id: idBoard,
            payload: Payloads.boardCompleter,
            loader(id) {
              return ModelLoader.loadBoardCompleterData(id);
            },
          });
        }),
      }).then(({ recentCards, recentBoards }) =>
        _.compact([...Array.from(recentCards), ...Array.from(recentBoards)]),
      );

      this._renderSettledItems(query, recentItems);
      return;
    }

    // See if they're just putting in a URL
    const parsedTrello = parseTrelloUrl(query.trim());
    if (parsedTrello.type === 'card') {
      this._renderSettledItems(
        query,
        ModelLoader.loadCardCompleterData(parsedTrello.shortLink),
      );
      return;
    } else if (parsedTrello.type === 'board') {
      this._renderSettledItems(
        query,
        ModelLoader.loadBoardCompleterData(parsedTrello.shortLink),
      );
      return;
    }

    // Search for a card short id
    if (isShortId(query)) {
      const { card } = this.options;
      const board = card != null ? card.getBoard() : undefined;
      if (board != null) {
        let referencedCard;
        if ((referencedCard = board.getCard(query)) != null) {
          this._renderSettledItems(query, referencedCard);
        } else {
          this._renderSettledItems(
            query,
            ModelLoader.loadCardData(board.id, query),
          );
        }
        return;
      }
    }

    // Search for a phrase
    const searchOptions = {
      query,
      board_fields: 'name,idOrganization,url',
      modelTypes: 'cards,boards',
      partial: true,
      card_board: true,
    };

    ModelLoader.loadSearchData(searchOptions).nodeify((err, results) => {
      if (err == null) {
        const cards = _.chain(results.cards)
          .map((card) => {
            return this.modelCache.get('Card', card.id);
          })
          .sortBy((card) => {
            if (card.get('idBoard') === this.model.get('idBoard')) {
              return 0;
            } else {
              return 1;
            }
          })
          .value();

        const boards = _.chain(results.boards)
          .map((board) => {
            return this.modelCache.get('Board', board.id);
          })
          .sortBy((board) => {
            // Why would you attach a card's board to itself?
            if (board.get('id') === this.model.get('idBoard')) {
              return 1;
            } else {
              return 0;
            }
          })
          .value();

        return this._renderSettledItems(query, [
          ...Array.from(cards),
          ...Array.from(boards),
        ]);
      } else {
        this.items = [];
        return this.renderItems();
      }
    });
  }

  hoverItem(e) {
    const $elem = $(e.target).closest('.item');
    return Util.selectMenuItem(this.$el, '.item', $elem);
  }

  selectCard(e) {
    Util.stop(e);
    const idCard = this.$(e.target).closest('.js-select-card').attr('data-id');
    const card = this.modelCache.get('Card', idCard);
    if (card != null) {
      this.insertItem(card);
    }
  }

  selectBoard(e) {
    Util.stop(e);
    const idBoard = this.$(e.target)
      .closest('.js-select-board')
      .attr('data-id');
    const board = this.modelCache.get('Board', idBoard);
    if (board != null) {
      this.insertItem(board);
    }
  }

  insertItem(item) {
    let word;
    if (this.options.onStartUpload) {
      this.options.onStartUpload(item);
      return;
    }

    const url = item.get('url');
    const $textInput = this.getTextInput();
    const caretPosition = Util.getCaretPosition($textInput);
    if (caretPosition != null) {
      word = {
        start: caretPosition,
        end: caretPosition,
      };
    }

    Util.insertSelection(
      $textInput,
      `${url} `,
      word != null ? word.start : undefined,
      word != null ? word.end : undefined,
    );
    let actionSubject = 'board';
    const containers = {};

    const isCard = item instanceof Card;

    if (isCard) {
      actionSubject = 'card';
      containers.card = {
        id: item.id,
      };
    } else {
      containers.board = {
        id: item.id,
      };
    }

    return Analytics.sendTrackEvent({
      action: 'added',
      actionSubject,
      source: 'trelloAddCardInlineDialog',
      containers,
    });
  }
}

TrelloCompleterView.initClass();
module.exports = TrelloCompleterView;
