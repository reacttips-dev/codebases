/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const {
  maybeDisplayLimitsErrorOnCardAdd,
} = require('app/scripts/views/card/card-limits-error');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { Analytics } = require('@trello/atlassian-analytics');

class ListBulkMoveCardsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'move all cards in list';

    this.prototype.events = { 'click .js-select-list': 'selectList' };
  }

  initialize() {
    Analytics.sendScreenEvent({
      name: 'moveAllCardsInListInlineDialog',
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
  }

  render() {
    const data = this.model.toJSON();
    data.lists = [];

    const lists = this.model.getBoard().listList.models;
    for (const list of Array.from(lists)) {
      const _list = _.clone(list.toJSON());
      if (_list.id === this.model.id) {
        _list.current = true;
      }
      data.lists.push(_list);
    }

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/list_bulk_card_move'),
        data,
      ),
    );

    return this;
  }

  selectList(e) {
    const $targetList = $(e.target).closest('.js-select-list');
    const targetListId = $targetList.attr('name');

    if ($targetList.hasClass('disabled')) {
      return;
    }

    const listDest = this.modelCache.get('List', targetListId);
    // Copy the original list, since moving the cards will cause the list to
    // change
    const cards = _.clone(this.model.openCards().models);

    if (cards.length > 0) {
      const options = {
        $elem: $(e.target),
        destinationList: listDest,
      };
      if (maybeDisplayLimitsErrorOnCardAdd(options)) {
        return;
      }

      Analytics.sendTrackEvent({
        action: 'moved',
        actionSubject: 'card',
        source: 'moveAllCardsInListInlineDialog',
        attributes: {
          listSourceId: this.model.id || '',
        },
        containers: {
          list: {
            id: targetListId || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });

      for (const card of Array.from(cards)) {
        card.moveToList(listDest, 1000);
      }
    }

    PopOver.hide();
  }
}

ListBulkMoveCardsView.initClass();
module.exports = ListBulkMoveCardsView;
