// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/list_add');
const { Analytics } = require('@trello/atlassian-analytics');

class InlineListComposerView extends View {
  className() {
    return 'js-add-list list-wrapper mod-add is-idle';
  }

  events() {
    return {
      'click .js-open-add-list': 'setOpen',
      'click .js-cancel-edit': 'setClose',
      submit: 'addList',
    };
  }

  initialize() {
    this.listenTo(
      this.model.viewState,
      'change:listComposerOpen',
      this.frameDebounce(this.renderListComposer),
    );

    this.listenTo(this.model, 'change:limits', this.render);

    this.listenTo(this.model.listList, 'add remove', this.render);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    $(document).on('click', this.handleClickOutside);
  }

  remove() {
    $(document).off('click', this.handleClickOutside);
    return super.remove(...arguments);
  }

  handleClickOutside(event) {
    // We aren't interested in this event if the list composer is not open
    if (!this.model.viewState.get('listComposerOpen')) {
      return;
    }

    const $target = $(event.target);
    const wasClickOutside = $target.closest('.js-add-list').length === 0;
    if (wasClickOutside) {
      return this.setClose(event);
    }
  }

  render() {
    const isFirstList = this.model.listList.length === 0;

    this.$el.html(
      template({
        tooManyTotalLists: this.model.isOverLimit('lists', 'totalPerBoard'),
        tooManyOpenLists: this.model.isOverLimit('lists', 'openPerBoard'),
        isFirstList,
      }),
    );

    this.renderListComposer();

    if (this.model.editable()) {
      this.$el.removeClass('fade hide');
    }

    return this;
  }

  setOpen(e) {
    Analytics.sendClickedButtonEvent({
      buttonName: 'addAnotherListButton',
      source: 'boardScreen',
      containers: {
        board: {
          id: this.model?.id,
        },
        organization: {
          id: this.model?.getOrganization()?.id,
        },
      },
    });

    this.$('.js-open-add-list').attr('tabindex', '-1');
    Util.stop(e);
    this.model.viewState.set('listComposerOpen', true);
  }

  setClose(e) {
    this.$('.js-open-add-list').removeAttr('tabindex');
    Util.stop(e);
    this.model.viewState.set('listComposerOpen', false);
  }

  renderListComposer() {
    if (
      this.model.viewState.get('listComposerOpen') &&
      !this.model.isOverLimit('lists', 'totalPerBoard') &&
      !this.model.isOverLimit('lists', 'openPerBoard')
    ) {
      Analytics.sendScreenEvent({
        name: 'inlineListComposerInlineDialog',
        containers: {
          board: {
            id: this.model?.id,
          },
          organization: {
            id: this.model?.getOrganization()?.id,
          },
        },
      });
      return this.renderOpen();
    } else {
      return this.renderClose();
    }
  }

  renderOpen(e) {
    Util.stop(e);

    this.$el.removeClass('is-idle');

    this.defer(() => this.$('.list-name-input').blur().focus().select());

    PopOver.hide();
  }

  renderClose(e) {
    Util.stop(e);
    this.$el.addClass('is-idle');
  }

  createList(createListDetails) {
    return new Promise((resolve, reject) => {
      const createdList = this.model.listList.create(createListDetails, {
        success: (model) => {
          Analytics.sendTrackEvent({
            action: 'created',
            actionSubject: 'list',
            source: 'inlineListComposerInlineDialog',
            containers: {
              board: {
                id: this.model?.id,
              },
              organization: {
                id: this.model?.getOrganization()?.id,
              },
            },
          });

          return resolve();
        },
        error: () => {
          this.model.listList.remove(createdList);
          return reject();
        },
      });
    });
  }

  addList(e) {
    Util.stop(e);

    const $input = this.$('.list-name-input');
    const lists = this.model.listList;
    const listsLength = lists.length + 1;
    const listName = $input.val().trim();

    if (listName === '') {
      $input.focus().select();
      return;
    }

    this.createList({
      name: listName,
      pos: this.model.calcPos(listsLength),
      closed: false,
    })
      .then(() => {
        $input.val('');
        this.renderOpen();
        return this;
      })
      .catch(() => {
        return Alerts.flash('could not connect', 'error', 'list-composer');
      });
  }
}

module.exports = InlineListComposerView;
