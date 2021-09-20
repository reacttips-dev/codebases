/* eslint-disable
    @typescript-eslint/no-this-alias,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const template = require('app/scripts/views/templates/popover_add_list');
const { Analytics } = require('@trello/atlassian-analytics');

class AddListPopoverView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'add list';

    this.prototype.events = {
      'change .js-select-list-pos': 'renderValue',
      'click .js-add-list': 'addList',
      'submit form': 'addList',
    };
  }

  initialize({ didAddList }) {
    this.didAddList = didAddList;
    return super.initialize(...arguments);
  }

  getLists() {
    this.lists = this.model.listList;
    return (this.listsLength = this.lists.length + 1);
  }

  render() {
    this.$el.html(
      template({
        tooManyTotalLists: this.model.isOverLimit('lists', 'totalPerBoard'),
        tooManyOpenLists: this.model.isOverLimit('lists', 'openPerBoard'),
      }),
    );

    // We need to use setTimeout so that PopOver.calcPos() will finish and we
    // can reliably get this element's left offset in @getClosestListPos().
    this.setTimeout(() => {
      this.getClosestListPos();
      this.getLists();
      return this.updateListList();
    }, 10);

    return this;
  }

  getClosestListPos() {
    // find closest list
    const elLists = $('.js-list');
    const listxdiffs = [];
    this.closestListIdx = 0;

    elLists.each((i) => {
      const diff = parseInt(
        Math.abs(
          $(elLists[i]).offset().left +
            $(elLists[i]).width() / 2 -
            this.$el.offset().left,
        ),
        10,
      );
      return listxdiffs.push(diff);
    });

    this.closestListIdx = _.indexOf(listxdiffs, _.min(listxdiffs));

    const $closestList = $(elLists[this.closestListIdx]);
    if (
      $closestList.length > 0 &&
      this.$el.offset().left >
        $closestList.offset().left + $closestList.width() / 2 &&
      this.closestListIdx < elLists.length
    ) {
      return (this.closestListIdx += 1);
    }
  }

  updateListList() {
    const view = this;

    const $el = $(view.el);
    const $selectList = $el.find('.js-select-list-pos');

    for (
      let i = 0, end = this.listsLength, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      $('<option>')
        .val(i)
        .text(i + 1)
        .appendTo($selectList);
    }

    let $option = $selectList.find('option:last');

    $option = $selectList.find(`option:eq(${this.closestListIdx})`);

    $option.attr('selected', 'selected');

    return this.renderValue();
  }

  renderValue() {
    const num = parseInt(this.$('.js-select-list-pos').val(), 10) + 1;
    $('.js-pos-value').text(num.toString());
  }

  addList(e) {
    let changedPos;
    Util.stop(e);
    const listName = this.$('.js-list-name').val().trim();
    if (listName === '') {
      this.$('.js-list-name').focus().select();
      return;
    }

    const $selectListPos = this.$('.js-select-list-pos');

    const listPosSelected = parseInt(
      $selectListPos.find('option:selected').val(),
      10,
    );

    if (listPosSelected === this.listsLength - 1) {
      changedPos = false;
    } else {
      changedPos = true;
    }

    PopOver.hide();

    this.createList(
      {
        name: listName,
        pos: this.model.calcPos(listPosSelected),
        closed: false,
      },
      changedPos,
    ).catch(() => {
      return Alerts.flash('could not connect', 'error', 'addListAlert');
    });
  }

  createList(createListDetails, changedPos) {
    return new Promise((resolve, reject) => {
      const createdList = this.model.listList.create(createListDetails, {
        success: (model) => {
          Analytics.sendTrackEvent({
            action: 'created',
            actionSubject: 'list',
            source: 'addListInlineDialog',
            containers: {
              board: {
                id: this.model.id,
              },
              list: {
                id: model.id,
              },
            },
            attributes: {
              changedPosition: changedPos,
            },
          });
          return this.didAddList(model);
        },
        error: () => {
          this.model.listList.remove(createdList);
          return reject();
        },
      });
    });
  }
}

AddListPopoverView.initClass();
module.exports = AddListPopoverView;
