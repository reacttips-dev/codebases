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
const { getKey, Key } = require('@trello/keybindings');
const {
  maybeDisplayLimitsErrorOnCardAdd,
} = require('app/scripts/views/card/card-limits-error');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/list_copy');
const { Analytics } = require('@trello/atlassian-analytics');

class ListCopyView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'copy list';

    this.prototype.tagName = 'form';

    this.prototype.events = {
      'click .js-submit': 'submit',
      submit: 'submit',
      'keydown textarea[name="name"]': 'keydownEvent',
    };
  }

  initialize() {
    Analytics.sendScreenEvent({
      name: 'copyListInlineDialog',
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

    return this.listenTo(this.model.getBoard(), 'change:limits', this.render);
  }

  render() {
    const board = this.model.getBoard();
    this.$el.html(
      template({
        canCopyTotal: !board.isOverLimit('lists', 'totalPerBoard'),
        canCopyOpen: !board.isOverLimit('lists', 'openPerBoard'),
        name: this.model.get('name'),
      }),
    );

    return this;
  }

  keydownEvent(e) {
    if (getKey(e) === Key.Enter) {
      Util.stop(e);
      this.submit(e);
      return;
    }
  }

  submit(e) {
    Util.stop(e);
    const nameInput = this.$('textarea[name="name"]');

    // return if the user hasn't entered a title
    if (nameInput.val().trim() === '') {
      nameInput.focus().select();
      return;
    }

    const board = this.model.getBoard();
    const isOverLimit =
      board.isOverLimit('lists', 'totalPerBoard') ||
      board.isOverLimit('lists', 'openPerBoard');
    this.$('.js-limit-exceeded').toggleClass('hide', !isOverLimit);
    if (isOverLimit) {
      return;
    }

    if (this.model.cardList.length > 0) {
      let hasChecklists;
      let hasAttachments = (hasChecklists = false);
      this.model.cardList.forEach(function (card) {
        hasAttachments = hasAttachments || card.attachmentList.length > 0;
        return (hasChecklists = hasChecklists || card.checklistList.length > 0);
      });

      const options = {
        $elem: this.$(e.target),
        hasChecklists,
        hasAttachments,
        destinationBoard: board,
      };
      if (maybeDisplayLimitsErrorOnCardAdd(options)) {
        return;
      }
    }

    const listPos = board.listList.calcPos(
      this.model.getIndexInList() + 1,
      this.model,
      true,
    );
    const newListParams = {
      idListSource: this.model.id,
      idBoard: this.model.get('idBoard'),
      pos: listPos,
      name: nameInput.val().trim(),
      closed: false,
    };

    const newList = board.listList.create(newListParams, {
      error: () => {
        return board.listList.remove(newList);
      },
    });

    PopOver.hide();

    Analytics.sendTrackEvent({
      action: 'copied',
      actionSubject: 'list',
      source: 'copyListInlineDialog',
      attributes: {
        listSourceId: this.model.id || '',
      },
      containers: {
        board: {
          id: this.model.getBoard()?.id || '',
        },
        list: {
          id: newList.get('idListSource') || '',
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id || '',
        },
      },
    });
  }
}

ListCopyView.initClass();
module.exports = ListCopyView;
