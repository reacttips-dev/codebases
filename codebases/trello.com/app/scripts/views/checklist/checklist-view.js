/* eslint-disable
    @typescript-eslint/no-this-alias,
    no-undef,
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
const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const AutoInsertionView = require('app/scripts/views/internal/autocomplete/auto-insertion-view');
const AutoMentionerView = require('app/scripts/views/internal/autocomplete/auto-mentioner-view');
const CheckItemListView = require('app/scripts/views/checklist/check-item-list-view');
const {
  ChecklistEducationBanner,
} = require('app/src/components/ChecklistEducationBanner');
const CompleterUtil = require('app/scripts/views/internal/autocomplete/completer-util');
const Confirm = require('app/scripts/views/lib/confirm');
const { Dates } = require('app/scripts/lib/dates');
const DragSort = require('app/scripts/views/lib/drag-sort');
const EmojiCompleterView = require('app/scripts/views/internal/autocomplete/emoji-completer-view');
const { Feature } = require('app/scripts/debug/constants');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { forNamespace } = require('@trello/i18n');
const {
  hasSelectionIn,
} = require('app/scripts/lib/util/selection/has-selection-in');
const { isSubmitEvent } = require('@trello/keybindings');
const Layout = require('app/scripts/views/lib/layout');
const { MemberState } = require('app/scripts/view-models/member-state');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const BluebirdPromise = require('bluebird');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { sendErrorEvent } = require('@trello/error-reporting');
const { TrelloStorage } = require('@trello/storage');
const {
  toggleAssignPopoverV2,
} = require('app/scripts/views/checklist/toggle-assign-popover');
const {
  toggleDatePopoverV2,
} = require('app/scripts/views/checklist/toggle-date-popover');
const {
  toggleUpsellAdvancedChecklist,
} = require('app/scripts/views/checklist/upsell-advanced-checklist');
const { Urls } = require('app/scripts/controller/urls');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { applyMarkdownShortcuts } = require('../lib/markdown-transform');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'checklist',
);
const confetti = require('canvas-confetti').default;
const {
  shouldFireConfetti,
} = require('app/scripts/views/card/should-fire-confetti');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const viewTitle = forNamespace('view title');

const assignTemplate = t.renderable((fullName) => {
  t.icon('add-member');
  if (fullName) {
    t.text(fullName);
  } else {
    t.format('assign');
  }
});

const dueTemplate = t.renderable((dueText) => {
  t.icon('clock');
  if (dueText) {
    t.text(dueText);
  } else {
    t.format('due-date');
  }
});

const CHECKLIST_EDUCATION_BANNER = 'checklist-education-banner';

function dismissEducationBanner() {
  return Auth.me().dismiss(CHECKLIST_EDUCATION_BANNER);
}
class ChecklistView extends View {
  static initClass() {
    this.prototype.className = 'checklist';

    this.prototype.events = {
      // new checklist item stuff
      'keydown .js-new-checklist-item-input': 'keydownChecklistEvent',
      'keydown .js-checklist-title': 'keydownChecklistNameEvent',
      'click .js-add-checklist-item': 'submitTask',
      'click .js-cancel-checklist-item': 'cancelItemEditing',
      'click .js-new-checklist-item-button': 'editNewChecklistItem',

      // options
      'click .js-confirm-delete': 'confirmDeleteChecklist',

      'click .js-hide-checked-items': 'hideCheckedItems',
      'click .js-show-checked-items': 'showCheckedItems',

      'click .js-toggle-checklist-state': 'toggleChecklistState',

      // reorder checklist and checklist items
      'sortstop .js-checklist-items-list': 'sortStop',
      'sortreceive .js-checklist-items-list': 'sortReceive',
      movechecklist: 'moveChecklist',

      // autocomplete stuff
      'keyup .js-new-checklist-item-input': 'keyAutoMention',
      'click .js-open-mention-selector': 'commentMentionMember',
      'click .js-open-emoji-selector': 'commentAddEmoji',

      // advanced checklists
      'click .js-assign': 'assignUpsellOrPopover',
      'click .js-due': 'dueDateUpsellOrPopover',

      // Editable View Port
      'click .js-checklist-title': 'editChecklistName',
      'click .js-save-checklist-title': 'commitNameEdits',
      'click .js-cancel-checklist-title': 'clearEdits',
      'click .js-discard-edits': 'clearEdits',
      'click .js-view-edits': 'editField',
      'click input': (e) => {
        if ($(e.target).closest('.checklist-item-checkbox-nachos').length) {
          return;
        }
        Util.stopPropagation(e);
      },
      'click textarea': Util.stopPropagation,
    };
  }

  initialize() {
    this.makeDebouncedMethods('renderCheckedState', 'renderBanners');

    this.listenTo(this.model.checkItemList, {
      'add remove reset change:state'() {
        this.renderProgress();
        return this.renderCheckedStateDebounced();
      },
      'add remove reset': this.renderBannersDebounced,
      'change:state': this.checkIfComplete,
    });

    this.listenTo(MemberState, {
      'change:idCollapsedChecklists': this.renderCheckedStateDebounced,
    });

    this.listenTo(this.model, {
      'change:name': this.renderName,
      'change:limits': this.renderInput,
    });

    this.listenTo(
      this.model.getCard().checklistList,
      'add remove reset sort',
      // We're using this.callback here to avoid a situation when a
      // checklist gets deleted - in that case the remove event
      // would cause this view to be removed and also cause
      // this.renderBannersDebounced to fire (the removal of the
      // view stops existing listeners, but this one would still happen
      // because it's the same event).  If renderBanners is run
      // after the model has been deleted, it can error out.
      this.callback(this.renderBannersDebounced),
    );

    return this.listenTo(
      Auth.me(),
      'change:oneTimeMessagesDismissed',
      this.renderBannersDebounced,
    );
  }

  render() {
    try {
      this.$el.html(
        templates.fillFromModel(
          require('app/scripts/views/templates/checklist'),
          this.model,
        ),
      );
      const $checkItemList = this.$('.js-checklist-items-list');

      if (this.getCard()?.editable()) {
        DragSort.refreshCardSortable($checkItemList, {
          axis: 'y',
          delay: '75',
          distance: '7',
          tolerance: 'pointer',
          placeholder: 'checklist-item placeholder',
          items: '.checklist-item',
          connectWith: '.js-checklist-items-list',
          start(event, ui) {
            DragSort.sorting = true;
            const _height = $(ui.helper).outerHeight();
            return $(ui.placeholder).height(_height);
          },
          stop: () =>
            // Must defer this for the glory of Firefox!
            this.defer(() => (DragSort.sorting = false)),
        });
      }
      this.$newCheckItemInput = this.$('.js-new-checklist-item-input');
      this.$newCheckItemButton = this.$('.js-new-checklist-item-button');
      _.defer(() => {
        this.$newCheckItemInput.autosize();
      });

      this.renderName();
      this.renderCheckItems();
      this.renderInput();
      this.renderBanners();

      this.renderCheckedState();

      return this;
    } catch (err) {
      sendErrorEvent(err, {
        tags: {
          ownershipArea: 'trello-panorama',
          feature: Feature.Checklists,
        },
      });
    }
  }

  renderInput() {
    const overLimit = this.model.isOverLimit('checkItems', 'perChecklist');
    this.$('.js-new-checklist-item').toggleClass('hide', overLimit);
    this.$('.js-new-checklist-item-limit-exceeded').toggleClass(
      'hide',
      !overLimit,
    );

    return this;
  }

  renderName() {
    this.$('div.js-checklist-title[attr=name] .current').text(
      this.model.get('name'),
    );
    return this;
  }

  renderProgress() {
    const countComplete = this.model.getCompletedCount(this.getCard());
    const countTotal = this.model.getCheckItemCount();
    const newPercentComplete =
      countTotal > 0 ? Math.round((100.0 * countComplete) / countTotal) : 0;
    const complete = countComplete === countTotal && countTotal > 0;

    const shouldTriggerAnimationDelay = (newPercentComplete) =>
      newPercentComplete >
      parseInt(this.$('.js-checklist-progress-bar').prop('style').width, 10);

    this.$('.js-checklist-progress-bar')
      .toggleClass(
        'checklist-progress-bar-current-delay',
        shouldTriggerAnimationDelay(newPercentComplete),
      )
      .width(newPercentComplete + '%')
      .toggleClass('checklist-progress-bar-current-complete', complete);

    this.$('.js-checklist-progress-percent').text(newPercentComplete + '%');

    return this;
  }

  _showEducationBanner() {
    if (!this.model.editable()) {
      return false;
    }

    if (Auth.me().isDismissed(CHECKLIST_EDUCATION_BANNER)) {
      return false;
    }

    // Only show it on the first checklist (that isn't empty)
    const firstChecklistWithItems = this.model
      .getCard()
      .checklistList.find((checklist) => checklist.checkItemList.length > 0);

    if (this.model !== firstChecklistWithItems) {
      return false;
    }

    return Boolean(this.model.getBoard()?.hasAdvancedChecklists());
  }

  renderBanners() {
    if (this._showEducationBanner()) {
      const banner = (
        <ChecklistEducationBanner
          onDismiss={dismissEducationBanner}
          idCard={this.model.get('idCard')}
          idBoard={this.model.get('idBoard')}
          idOrganization={this.model.getBoard()?.get('idOrganization')}
        />
      );

      return ReactDOM.render(
        banner,
        this.el.querySelector('.js-checklist-banners'),
      );
    } else {
      return this.clearBanners();
    }
  }

  clearBanners() {
    return ReactDOM.unmountComponentAtNode(
      this.el.querySelector('.js-checklist-banners'),
    );
  }

  renderCheckItems() {
    const $checkItemList = this.$('.js-checklist-items-list');

    const checkItemListView = this.collectionSubview(
      CheckItemListView,
      this.model.checkItemList,
      { el: $checkItemList },
    );
    checkItemListView.render();

    DragSort.refreshIfInitialized($checkItemList);
    this.renderProgress();
    return this;
  }

  isChecklistCollapsed() {
    return MemberState.inSet('idCollapsedChecklists', this.model.id);
  }

  renderCheckedState(e) {
    const countItems = this.model.getCheckItemCount();
    const countComplete = this.model.getCompletedCount(this.getCard());
    const hasCheckItems = countItems > 0;
    const complete = countItems === countComplete && countItems > 0;
    const $checkIcon = this.$('.js-toggle-checklist-state');

    this.$('.js-show-checked-items').text(
      l('show checked items', { count: countComplete.toString() }),
    );

    this.$('.js-completed-message').addClass('hide');

    if (countComplete === 0 || !hasCheckItems) {
      this.$el.removeClass('hide-completed-items');
      this.$('.js-show-checked-items').addClass('hide');
      this.$('.js-hide-checked-items').addClass('hide');
      this;
    } else if (this.isChecklistCollapsed()) {
      this.$el.addClass('hide-completed-items');
      this.$('.js-show-checked-items').removeClass('hide');
      this.$('.js-hide-checked-items').addClass('hide');
      this.$('.js-completed-message').toggleClass('hide', !complete);
    } else {
      this.$el.removeClass('hide-completed-items');
      this.$('.js-show-checked-items').addClass('hide');
      this.$('.js-hide-checked-items').removeClass('hide');
    }

    if (featureFlagClient.get('treehouse.web.checklist-toggles', false)) {
      if (this.model.editable() && hasCheckItems) {
        $checkIcon.addClass('editable');
        if (countItems === countComplete) {
          $checkIcon
            .addClass('icon-checkbox-checked')
            .removeClass('icon-checkbox-unchecked');
        } else {
          $checkIcon
            .addClass('icon-checkbox-unchecked')
            .removeClass('icon-checkbox-checked');
        }
      } else {
        $checkIcon
          .removeClass('editable')
          .removeClass(
            'icon-checkbox-checked icon-checkbox-unchecked icon-checkbox-checked',
          )
          .addClass('icon-checkbox-checked');
      }
    }

    return this;
  }

  hideCheckedItems(e) {
    Util.stop(e);
    MemberState.pushCollapsedChecklist(this.model.id);

    Analytics.sendClickedButtonEvent({
      buttonName: 'showHideCheckedItemsButton',
      source: 'cardDetailScreen',
      containers: {
        card: {
          id: this.model.getCard().id,
        },
        board: {
          id: this.model.getBoard().id,
        },
      },
      attributes: {
        hide: true,
      },
    });
  }

  showCheckedItems(e) {
    Util.stop(e);
    MemberState.pullCollapsedChecklist(this.model.id);

    Analytics.sendClickedButtonEvent({
      buttonName: 'showHideCheckedItemsButton',
      source: 'cardDetailScreen',
      containers: {
        card: {
          id: this.model.getCard().id,
        },
        board: {
          id: this.model.getBoard().id,
        },
      },
      attributes: {
        hide: false,
      },
    });
  }

  toggleChecklistState() {
    if (
      !this.model.editable() ||
      !featureFlagClient.get('treehouse.web.checklist-toggles', false)
    ) {
      return;
    }

    const countItems = this.model.getCheckItemCount();
    const countComplete = this.model.getCompletedCount(this.getCard());

    // Uncheck all
    if (countItems === countComplete) {
      this.model.toggleCheckItemsState('incomplete');

      Analytics.sendClickedButtonEvent({
        buttonName: 'bulkToggleCheckItemStateButton',
        source: 'cardDetailScreen',
        containers: {
          card: {
            id: this.model.getCard().id,
          },
          board: {
            id: this.model.getBoard().id,
          },
        },
        attributes: {
          checkAll: false,
        },
      });
    } else {
      // Check all
      this.model.toggleCheckItemsState('complete');

      Analytics.sendClickedButtonEvent({
        buttonName: 'bulkToggleCheckItemStateButton',
        source: 'cardDetailScreen',
        containers: {
          card: {
            id: this.model.getCard().id,
          },
          board: {
            id: this.model.getBoard().id,
          },
        },
        attributes: {
          checkAll: true,
        },
      });
    }
  }

  dueDateUpsellOrPopover(e) {
    const editable = this.model.editable();
    if (!editable) {
      return;
    }

    const board = this.model.getBoard();

    if (board?.hasAdvancedChecklists()) {
      return toggleDatePopoverV2({
        title: viewTitle('change due date'),
        setDate: (date) => {
          this._newCheckitemAttributes.due = date;
          this.renderNewItemButtons();
          return this.$('.js-new-checklist-item-input').focus();
        },
        getInitialDate: () => this._newCheckitemAttributes?.due,
        trackingMethod: 'checkItemComposer',
      })(e);
    } else if (board?.upsellAdvancedChecklists()) {
      return toggleUpsellAdvancedChecklist({
        trackingMethod: 'checkItemComposer',
        orgId: this.getOrgId(),
        teamName: this.getTeamName(),
      })(e);
    }
  }

  assignUpsellOrPopover(e) {
    const editable = this.model.editable();
    if (!editable) {
      return;
    }

    let board = this.model.getBoard();

    if (board?.hasAdvancedChecklists()) {
      const card = this.model.getCard();
      board = this.model.getBoard();

      return toggleAssignPopoverV2({
        title: viewTitle('assign'),
        getCardMembers: () =>
          card.memberList
            .filterDeactivated({ force: true, model: board })
            .toJSON(),
        getBoardMembers: () =>
          board.memberList.filterDeactivated({ force: true }).toJSON(),
        trackingMethod: 'checkItemComposer',
        getInitialMember: () => this._newCheckitemAttributes?.idMember,
        setMember: (idMember) => {
          this._newCheckitemAttributes.idMember = idMember;
          this.renderNewItemButtons();
          return this.$('.js-new-checklist-item-input').focus();
        },
      })(e);
    } else if (board?.upsellAdvancedChecklists()) {
      return toggleUpsellAdvancedChecklist({
        trackingMethod: 'checkItemComposer',
        orgId: this.getOrgId(),
        teamName: this.getTeamName(),
      })(e);
    }
  }

  getBillingUrl() {
    const org = this.model.getBoard().getOrganization();
    if (org /* eslint-disable-line eqeqeq */ != null) {
      return Urls.getOrganizationBillingUrl(org);
    }
  }

  getOrgId() {
    const org = this.model.getBoard().getOrganization();
    if (org /* eslint-disable-line eqeqeq */ != null) {
      return org.id;
    }
  }

  getTeamName() {
    const org = this.model.getBoard().getOrganization();
    if (org /* eslint-disable-line eqeqeq */ != null) {
      return org.get('name');
    }
  }

  editNewChecklistItem(e) {
    Util.stop(e);

    const board = this.model.getBoard();
    const showButtons = Boolean(
      board?.hasAdvancedChecklists() || board?.upsellAdvancedChecklists(),
    );

    this.$('.js-new-checklist-item')
      .find('.js-assign,.js-due')
      .toggleClass('hide', !showButtons);

    this._newCheckitemAttributes = {
      idMember: undefined,
      due: undefined,
    };
    this.renderNewItemButtons();

    return this.edit('newItem');
  }

  renderNewItemButtons() {
    const { idMember, due } = this._newCheckitemAttributes;

    const fullName = this.modelCache.get('Member', idMember)?.get('fullName');
    this.$('.js-new-checklist-item .js-assign').html(assignTemplate(fullName));

    const dueText = due && Dates.toDateString(due);
    this.$('.js-new-checklist-item .js-due').html(dueTemplate(dueText));

    return this;
  }

  getCard() {
    return this.options.card;
  }

  cancelItemEditing(e) {
    Layout.cancelEdits();
    return false;
  }

  newChecklistItemInputVisible() {
    if (this.$('.js-new-checklist-item-input').css('display') === 'none') {
      return false;
    } else {
      return true;
    }
  }

  focusNewTaskInput(e) {
    if (!this.newChecklistItemInputVisible()) {
      this.editNewChecklistItem(e);
    }
    this.$('.js-new-checklist-item-input').select();
  }

  keydownChecklistNameEvent(e) {
    if ($(e.target).hasClass('js-cancel-checklist-title')) {
      return this.clearEdits();
    } else if (isSubmitEvent(e)) {
      Util.stop(e);
      return this.commitNameEdits(e);
    }
  }

  keydownChecklistEvent(e) {
    applyMarkdownShortcuts(e, true);

    if ($(e.target).hasClass('js-new-checklist-item-input')) {
      if (
        PopOver.view instanceof EmojiCompleterView ||
        PopOver.view instanceof AutoMentionerView
      ) {
        return this.checkInsert(e);
      } else if (isSubmitEvent(e)) {
        return this.submitTask(e);
      }
    }
  }

  getTextInput() {
    return this.$('.js-new-checklist-item-input');
  }

  getMentionTarget() {
    return this.$('.js-open-mention-selector')[0];
  }

  getEmojiTarget() {
    return this.$('.js-open-emoji-selector')[0];
  }

  submitTask(e) {
    Util.stop(e);
    const s = this.$newCheckItemInput.val().trim();

    if (/^\s*$/.test(s)) {
      Util.stop(e);
      this.focusNewTaskInput();
      return false;
    }

    const taskNames = _.compact(s.split(/\r\n|\r|\n/));
    const checklist = this.model;

    // [LOCK]
    BluebirdPromise.using(checklist.modelCache.getLock(), () =>
      BluebirdPromise.resolve(taskNames).each((name) => {
        let pos;
        if (checklist.checkItemList.length > 0) {
          pos = checklist.checkItemList.last().get('pos') + Util.spacing;
        } else {
          pos = Util.spacing;
        }

        const traceId = Analytics.startTask({
          taskName: 'create-checkItem',
          source: 'cardDetailScreen',
        });
        // Also add a little bit of randomness to make it unlikely that another
        // client would send a checkitem with the exact same pos
        pos += Math.floor(Math.random() * 1024);

        const idMember = this._newCheckitemAttributes?.idMember;
        const due = this._newCheckitemAttributes?.due;

        return BluebirdPromise.fromNode((next) => {
          let checkItem;

          return (checkItem = checklist.checkItemList.createWithTracing(
            {
              name: name.trim(),
              pos,
              nameData: {
                emoji: Auth.me().allCustomEmoji(),
              },
              idMember,
              due,
            },
            {
              traceId,
              success: () => {
                Analytics.sendTrackEvent({
                  action: 'created',
                  actionSubject: 'checkItem',
                  source: 'cardDetailScreen',
                  containers: {
                    card: { id: checklist.getCard().id },
                    board: { id: checklist.getBoard().id },
                  },
                  attributes: {
                    taskId: traceId,
                    hasAdvancedChecklists: this.model
                      .getBoard()
                      ?.hasAdvancedChecklists(),
                    usedAdvancedChecklists: idMember || due ? true : false,
                  },
                });

                Analytics.taskSucceeded({
                  taskName: 'create-checkItem',
                  traceId,
                  source: 'cardDetailScreen',
                });
              },
              error: (model, error) => {
                checklist.checkItemList.remove(checkItem);

                throw Analytics.taskFailed({
                  taskName: 'create-checkItem',
                  traceId,
                  source: 'cardDetailScreen',
                  error,
                });
              },
            },
            next,
          ));
        });
      }),
    ).done();

    this.$newCheckItemInput.val('').trigger('autosize.resize');
    this.focusNewTaskInput();

    PopOver.hide();
  }

  sortStop(e, ui) {
    Util.stopPropagation(e);
    ui.item.trigger('movecheckitem', [ui, this.model, false]);
  }

  sortReceive(e, ui) {
    Util.stopPropagation(e);
    ui.item.trigger('movecheckitem', [ui, this.model, true]);
  }

  confirmDeleteChecklist(e) {
    Util.stop(e);

    const checklistName = this.model.get('name');

    Confirm.toggle('delete checklist', {
      elem: this.$(e.target).closest('.js-confirm-delete'),
      model: this.model,
      title: l('confirm.delete checklist.title', { checklistName }),
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: () => {
        const traceId = Analytics.startTask({
          taskName: 'delete-checklist',
          source: 'cardDetailScreen',
        });

        return this.model.destroyWithTracing(
          {
            traceId,
          },
          tracingCallback(
            {
              taskName: 'delete-checklist',
              source: 'cardDetailScreen',
              traceId,
            },
            (err) => {
              if (!err) {
                Analytics.sendTrackEvent({
                  action: 'deleted',
                  actionSubject: 'checklist',
                  source: 'cardDetailScreen',
                  attributes: {
                    taskId: traceId,
                  },
                });
              }
            },
          ),
        );
      },
    });
  }

  isComplete() {
    return (
      this.model.getCheckItemCount() ===
      this.model.getCompletedCount(this.getCard())
    );
  }

  checkIfComplete(checkItem) {
    // Did we just finish the whole list?
    if (
      checkItem.get('state') === 'complete' &&
      checkItem.previous('state') === 'incomplete' &&
      this.isComplete()
    ) {
      const index = this.model.checkItemList.indexOf(checkItem);
      this.congratulations(index);
    }
  }

  congratulations(origin) {
    if (this._congratulationsResetTimeout) {
      // Another one is still in progress
      return;
    }
    const $checkitems = this.$(
      '.checklist-item-checkbox,.checklist-item-checkbox-nachos',
    );

    const animations = ['pop-checkbox', 'shake-checkbox', 'spin-checkbox'];
    $checkitems
      .css('animation-delay', (index) => {
        const distance = Math.abs(index - origin);
        return `${distance * 100}ms`;
      })
      .addClass(animations[Math.floor(Math.random() * animations.length)]);

    if (
      shouldFireConfetti(this.model.get('name')) ||
      shouldFireConfetti(this.model.getCard().get('name')) ||
      shouldFireConfetti(this.model.getCard().getList().get('name'))
    ) {
      const $checklist = this.$('.checklist-items-list');
      confetti({
        angle: _.random(55, 125),
        spread: _.random(50, 70),
        particleCount: _.random(40, 75),
        origin: {
          x: $checklist.offset().left / window.innerWidth,
          y: $checklist.offset().top / window.innerHeight,
        },
      });
    }

    // Prevent another animation from starting while this one is still
    // in progress (also reduces weirdness that can come in from rapidly
    // checking and unchecking the last item)
    return (this._congratulationsResetTimeout = this.setTimeout(() => {
      this._congratulationsResetTimeout = null;
      return $checkitems
        .removeClass('pop-checkbox shake-checkbox spin-checkbox')
        .css('animation-delay', '');
    }, 5000));
  }

  moveChecklist(e, ui) {
    const card = this.model.getCard();
    if (card /* eslint-disable-line eqeqeq */ != null) {
      const checkItems = ui.item.parent().children();
      const index = checkItems.index(ui.item);
      const traceId = Analytics.startTask({
        taskName: 'edit-checklist/pos',
        source: 'cardDetailView',
      });
      this.model.update(
        {
          pos: card.calcChecklistPos(index, this.model),
          traceId,
        },
        tracingCallback(
          {
            taskName: 'edit-checklist/pos',
            source: 'cardDetailView',
            traceId,
          },
          (err) => {
            if (!err) {
              Analytics.sendTrackEvent({
                action: 'updated',
                actionSubject: 'checklist',
                actionSubjectId: 'pos',
                source: 'cardDetailView',
                containers: {
                  card: {
                    id: this.model.getCard().id,
                  },
                  board: {
                    id: this.model.getBoard().id,
                  },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
      this.model.collection.sort({ silent: true });
    }
  }

  editChecklistName(e) {
    if (DragSort.sorting) {
      return;
    }

    const $container = $(e.target).closest('.editable');

    if ($container.length === 0) {
      return;
    }

    if (hasSelectionIn($container)) {
      return;
    }

    Util.stop(e);
    PopOver.hide();

    const attr = $container.attr('attr');

    return this.edit(attr);
  }

  edit(sAttr) {
    let parts;
    if (sAttr.indexOf('.') > -1) {
      parts = sAttr.split('.');
      sAttr = parts[1];
    }

    const allEditableWithAttr = this.$(`[attr=${sAttr}]`);
    const noEdits = this.$(`.js-no-higher-edits [attr=${sAttr}]`);
    const container = allEditableWithAttr.not(noEdits);
    if (container.length === 0) {
      return;
    }

    Layout.cancelEdits();
    const edit = container.find('.edit:first');
    if (edit.length === 0) {
      return;
    }

    const input = container.find('.field:first');

    container.addClass('editing');

    if (input.val() === '') {
      input.val(Util.traverse(this.model.attributes, parts ?? sAttr));
    }

    this.waitForId(this.model, () =>
      input.data('draftKey', this._draftKey(sAttr)),
    );

    input.focus().select();

    input.autosize({ append: false });
  }

  clearEdits(e) {
    Util.stop(e);
    const $editable = $(e.target).closest('.editable[attr]');
    const attr = $editable.attr('attr');
    if (attr /* eslint-disable-line eqeqeq */ != null) {
      this._discardDraft(attr);
    }
    $editable.find('.field').val('');
    $editable.find('.edits-warning').hide();
    $editable.find('.edits-error').hide();
    $editable.removeClass('editing');
    Layout.cancelEdits();
    return false;
  }

  commitNameEdits(e) {
    if (e) {
      Util.stop(e);
    }

    const $editable = $(e.target).closest('.editable.editing[attr=name]');
    $editable.find('.edits-error').hide();

    if (!this.validate()) {
      return;
    }

    const view = this;
    const { model } = this;

    // Remove buttons
    $editable.remove('input[type=submit]');

    // Remove buttons and commit all other edits
    $editable
      .removeClass('editing')
      .each(function () {
        let newValue = $(this).find('.field').val();

        if (!view.allowNewlines) {
          newValue = newValue.replace(/[\r\n]+/g, ' ');
        }

        // if the newValue is all whitespace, replace it with the empty string
        if ($.trim(newValue).length === 0) {
          newValue = '';
        }

        if (model.get('name') === newValue) {
          return view._discardDraft('name');
        } else {
          const traceId = Analytics.startTask({
            taskName: 'edit-checklist/name',
            source: 'cardDetailScreen',
          });
          return model.update(
            { name: newValue, traceId },
            tracingCallback(
              {
                taskName: 'edit-checklist/name',
                source: 'cardDetailScreen',
                traceId,
              },
              (err) => {
                if (err /* eslint-disable-line eqeqeq */ != null) {
                  $editable.find('.edits-error').text(err.message).show();
                  view._saveDraft('name', newValue);
                } else {
                  view._discardDraft('name');
                  Analytics.sendTrackEvent({
                    action: 'updated',
                    actionSubject: 'checklist',
                    actionSubjectId: 'name',
                    source: 'cardDetailView',
                    containers: {
                      card: {
                        id: model.getCard().id,
                      },
                      board: {
                        id: model.getBoard().id,
                      },
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
      })
      .find('.field')
      .val('');

    $editable.find('.edits-warning').hide();

    return true;
  }

  validate() {
    let field;
    for (field of Array.from(this.$('.editing.non-empty .field'))) {
      if (/^\s*$/.test($(field).val())) {
        return false;
      }
    }

    for (field of Array.from(this.$('.editing .field'))) {
      const fieldLength = ($(field).val() ?? '').length;
      if (fieldLength > 16384) {
        $('.editing')
          .find('.edits-error')
          .text(l('text too long', { over: asNumber(fieldLength - 16384) }))
          .show();
        return false;
      }
    }

    return true;
  }

  editField(e) {
    const $link = $(e.target).closest('a');
    if ($link.length > 0 && $link.attr('href') !== '#') {
      return;
    }
    if (DragSort.sorting) {
      return;
    }

    const $container = $(e.target).closest('.editable');
    if ($container.length === 0) {
      return;
    }

    // If they've selected some text, they're probably trying to copy it
    if (hasSelectionIn($container)) {
      return;
    }

    Util.stop(e);
    PopOver.hide();

    const attr = $container.attr('attr');

    return this.edit(attr);
  }

  _draftKey(attr) {
    return `draft_${this.model.id}_${attr}`;
  }
  _saveDraft(attr, value) {
    return TrelloStorage.set(this._draftKey(attr), value);
  }
  _recallDraft(attr) {
    return TrelloStorage.get(this._draftKey(attr));
  }
  _discardDraft(attr) {
    return TrelloStorage.unset(this._draftKey(attr));
  }

  saveDrafts(invokeSource) {
    if (this.model.id /* eslint-disable-line eqeqeq */ == null) {
      return false;
    }
    return (() => {
      const result = [];
      for (const $el of Array.from(this.getEdits())) {
        const attr = $el.attr('attr');
        const val = $el.find('.field:first').val();
        if ($.trim(val).length === 0) {
          continue;
        } // Not in edit mode
        if (this.model.get(attr) !== val && val !== this._recallDraft(attr)) {
          if (invokeSource) {
            Analytics.sendTrackEvent({
              action: 'saved',
              actionSubjectId: 'checkItemDraft',
              source: 'cardDetailScreen',
              containers: {
                card: {
                  id: this.model.getCard().id,
                },
                board: {
                  id: this.model.getBoard().id,
                },
              },
              attributes: {
                invokeSource: invokeSource,
              },
            });
          }
          result.push(this._saveDraft(attr, val));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  getEdits() {
    const $allEdits = this.$('[attr]');
    // Make sure we don't process other editables that are nested
    // inside this one
    const $noEdits = this.$('.js-no-higher-edits [attr]');

    return $allEdits.not($noEdits).map((index, el) => $(el));
  }

  remove() {
    this.clearBanners();
    this.saveDrafts('removing view');
    $(window).off(`.EditableView-${this.model.cid}`);
    return super.remove(...arguments);
  }
}
ChecklistView.initClass();

_.extend(ChecklistView.prototype, AutoInsertionView, CompleterUtil);

module.exports = ChecklistView;

//
// This looks unnecessary, since `create` is going to lock the modelCache as
// well. However, there is a brief period of time in between creations where it
// will unlock, then map a potentially old delta (that contains the entire list
// of checkitems, of course, because that's how checkitem deltas work), then the
// next time around the function that calculates the new pos will have stale
// data, as by mapping an older delta we've effectively "uncreated" the previous
// check item in the list. The net effect is that, without this outer lock,
// check items can show up in the wrong order.
