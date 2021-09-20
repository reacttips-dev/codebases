/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');

class ComposerPosSelectorView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'select position';

    this.prototype.events = {
      'change .js-select-list': 'changeList',
      'change .js-select-position': 'changePosition',
      'mouseenter .js-pos-results li': 'hoverPosResultsSelect',

      'click .js-select-pos-keyword': 'selectPosResult',
      'click .js-select-pos-pos': 'selectPosResult',
      'click .js-select-pos-list': 'selectPosResult',
    };
  }

  initialize() {
    Analytics.sendScreenEvent({
      name: 'cardComposerPositionSelectorInlineDialog',
      containers: {
        list: {
          id: this.model.getList()?.id,
        },
        board: {
          id: this.model.getBoard()?.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });
  }

  populateResults(results) {
    return (this.data = {
      filtered: true,
      keywordList: results.keywordList.map((kw) => {
        return {
          value: kw,
          indexString: kw,
          listName: this.model.get('list').get('name'),
        };
      }),
      indexList: results.indexList.map((index) => {
        return {
          value: index,
          indexString: String(index),
          listName: this.model.get('list').get('name'),
        };
      }),
      listList: results.listList.map((list) => {
        return {
          value: list.get('id'),
          indexString: String(this.model.get('index') + 1),
          listName: list.get('name'),
        };
      }),
    });
  }

  render() {
    if (this.data) {
      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/popover_filter_pos_results'),
          this.data,
        ),
      );
    } else {
      const data = { hideBoard: true };

      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/move_card_controls'),
          data,
        ),
      );

      this.updateListList();
    }

    return this;
  }

  hoverPosResultsSelect(e) {
    const elem = $(e.target).closest('li');
    return Util.selectMenuItem(this.$('.js-pos-results'), 'li', elem);
  }

  selectPosResult(e) {
    Util.stop(e);

    const parent = $(e.target).closest('a');
    const value = parent.attr('name');
    const list = this.model.getList();
    const cardCount = list.openCards().length;
    const bottomPos = cardCount + 1;

    if (parent.hasClass('js-select-pos-keyword')) {
      if (value === 'top') {
        this.model.set('index', 0);
      } else if (value === 'bottom') {
        this.model.set('index', bottomPos);
      }
    } else if (parent.hasClass('js-select-pos-pos')) {
      this.model.set('index', parseInt(value, 10) - 1);
    } else if (parent.hasClass('js-select-pos-list')) {
      const isBottom = cardCount === this.model.get('pos');

      this.model.set('list', this.model.getBoard().getList(value));

      if (isBottom) {
        this.model.set('index', cardCount);
      }
      // GAS migration cleanup: this is likely dead code
      // https://bitbucket.org/trello/web/pull-requests/5317/
      Analytics.sendUIEvent({
        action: 'selected',
        actionSubject: 'list',
        actionSubjectId: 'cardComposerList',
        source: 'cardComposerPositionSelectorInlineDialog',
        attributes: {
          isAtTopofList: value === 'top',
          isAtBottomOfList: value === 'top',
        },
        containers: {
          list: {
            id: this.model.getList()?.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });
    }

    if (
      parent.hasClass('js-select-pos-keyword') ||
      parent.hasClass('js-select-pos-pos')
    ) {
      Analytics.sendUIEvent({
        action: 'selected',
        actionSubject: 'position',
        actionSubjectId: 'cardComposerPosition',
        source: 'cardComposerPositionSelectorInlineDialog',
        attributes: {
          isAtTopofList: value === 'top',
          isAtBottomOfList: value === 'top',
        },
        containers: {
          list: {
            id: this.model.getList()?.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });
    }

    PopOver.hide();
  }

  filterPos(term) {
    const termRe = new RegExp(`^${Util.escapeForRegex(term)}`);
    const numRe = new RegExp(`^${Util.escapeForRegex(term)}$`);

    const currentListCards = this.model.getList().openCards();

    const idMatchNames = {
      keywordList: (() => {
        const result = [];
        for (const keyword of ['top', 'bottom']) {
          if (termRe.test(keyword)) {
            result.push(keyword);
          }
        }
        return result;
      })(),
      indexList: (() => {
        const result1 = [];
        for (
          let index = 1, end = currentListCards.length + 1, asc = 1 <= end;
          asc ? index <= end : index >= end;
          asc ? index++ : index--
        ) {
          if (numRe.test(String(index))) {
            result1.push(index);
          }
        }
        return result1;
      })(),
      listList: [],
    };

    for (const list of Array.from(this.model.getBoard().listList.models)) {
      const splitNames = _.compact(list.get('name').toLowerCase().split(/\s+/));
      if (_.find(splitNames, (name) => termRe.test(name))) {
        idMatchNames.listList.push(list);
      }
    }

    idMatchNames.hasData =
      !_.isEmpty(idMatchNames.keywordList) ||
      !_.isEmpty(idMatchNames.indexList) ||
      !_.isEmpty(idMatchNames.listList);

    return idMatchNames;
  }

  updateListList() {
    let list = this.model.getList();
    const idListSelected = list.id;
    const board = this.model.getBoard();
    const $selectList = this.$('.js-select-list');

    $selectList.empty();

    for (list of Array.from(
      _.sortBy(board.listList.models, (list) => list.get('pos')),
    )) {
      const name = list.get('name');
      const desc =
        list.id === idListSelected
          ? l('selected list', { listName: name })
          : name;

      const $option = $('<option>').val(list.id).text(desc);
      $selectList.append($option);
      if (list.id === idListSelected) {
        $option.attr('selected', 'selected');
        this.$('.js-list-value').text(name);
      }
    }

    return this.updatePositionList();
  }

  updatePositionList() {
    let $option;
    const $selectPos = this.$('.js-select-position');

    $selectPos.empty();
    const list = this.model.getList();

    const { cardList } = list;

    if (this.model.get('index') > cardList.length) {
      this.model.set('index', cardList.length);
    }

    if (cardList.length === 0) {
      $option = $('<option>').val('0').text('1').appendTo($selectPos);
      this.$('.js-pos-value').text('1');
      return;
    }

    for (
      let i = 0, end = cardList.length, asc = 0 <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      const desc = String(i + 1);

      $option = $('<option>').val(i).text(desc).appendTo($selectPos);

      if (i === this.model.get('index')) {
        $option.attr('selected', 'selected');
      }
    }

    this.$('.js-pos-value').text(this.model.get('index').toString());
  }

  changeList() {
    const index = this.model.get('index');
    const cardCount = this.model.getList().openCards().length;
    const isBottom = cardCount === index;
    const listSourceId = this.model.getList()?.id;
    const $selectList = this.$('.js-select-list');
    const idListSelected = $selectList.find('option:selected').val();
    const newList = this.model.getBoard().getList(idListSelected);

    this.model.set('list', newList);

    const newCardCount = newList.openCards().length;

    if (isBottom) {
      this.model.set('index', newCardCount);
    } else {
      this.model.set('index', Math.min(newCardCount, index));
    }

    Analytics.sendUIEvent({
      action: 'moved',
      actionSubject: 'cardComposer',
      source: 'cardComposerPositionSelectorInlineDialog',
      attributes: {
        isAtBottomOfList: isBottom,
        listSourceId,
      },
      containers: {
        list: {
          id: this.model.getList()?.id,
        },
        board: {
          id: this.model.getBoard()?.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });

    PopOver.hide();
  }

  changePosition() {
    const $selectPos = this.$('.js-select-position');
    const posSelected = parseInt($selectPos.find('option:selected').val(), 10);

    this.model.set('index', posSelected);

    Analytics.sendUIEvent({
      action: 'moved',
      actionSubject: 'cardComposer',
      source: 'cardComposerPositionSelectorInlineDialog',
      attributes: {
        posSelected,
      },
      containers: {
        list: {
          id: this.model.getList()?.id,
        },
        board: {
          id: this.model.getBoard()?.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });

    PopOver.hide();
  }
}

ComposerPosSelectorView.initClass();
module.exports = ComposerPosSelectorView;
