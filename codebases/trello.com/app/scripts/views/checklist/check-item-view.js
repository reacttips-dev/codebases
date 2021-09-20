/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const AutoInsertionView = require('app/scripts/views/internal/autocomplete/auto-insertion-view');
const CompleterUtil = require('app/scripts/views/internal/autocomplete/completer-util');
const {
  CheckItemMemberBadge,
} = require('app/src/components/CheckItemMemberBadge');
const {
  CheckItemOverflowMenu,
} = require('app/src/components/CheckItemOverflowMenu/CheckItemOverflowMenu');
const { Feature } = require('app/scripts/debug/constants');
const { sendErrorEvent } = require('@trello/error-reporting');
const { ChecklistTestIds } = require('@trello/test-ids');
const { Dates } = require('app/scripts/lib/dates');
const { CheckItemCheckbox } = require('app/src/components/CheckItemCheckbox');
const { DueDateBadge } = require('app/src/components/DueDateBadge');
const View = require('app/scripts/views/internal/view');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { forNamespace } = require('@trello/i18n');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const TFM = require('app/scripts/lib/markdown/tfm');
const { Util } = require('app/scripts/lib/util');
const friendlyLinks = require('app/scripts/views/internal/friendly-links');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'checklist_item',
);
const {
  toggleAssignPopoverV2,
} = require('app/scripts/views/checklist/toggle-assign-popover');
const {
  toggleDatePopoverV2,
} = require('app/scripts/views/checklist/toggle-date-popover');
const {
  toggleUpsellAdvancedChecklist,
} = require('app/scripts/views/checklist/upsell-advanced-checklist');
const {
  toggleClearPopover,
} = require('app/scripts/views/checklist/toggle-clear-popover');
const _ = require('underscore');
const { Urls } = require('app/scripts/controller/urls');
const {
  getKey,
  Key,
  registerShortcutHandler,
  Scope,
  unregisterShortcutHandler,
} = require('@trello/keybindings');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { ELEVATION_ATTR } = require('@trello/layer-manager');

//Helpers File
const {
  commitCheckItemEdits,
  checkItemEditControlKeydown,
  renderEditItemButtons,
  onCheckItemClick,
  clearEdits,
  checkItemKeydownEvent,
  saveCheckItemDrafts,
  recallCheckItemDrafts,
  validateCheckItemInput,
  getCheckItemEdits,
  _checkItemDraftKey,
  _saveCheckItemDraft,
  _recallCheckItemDraft,
  _discardCheckItemDraft,
  editCheckItem,
} = require('./check-item-edit-helpers');

const viewTitle = forNamespace('view title');

const template = t.renderable(
  ({ editable, showAssignBadge, showDueDateBadge, showNewCheckbox }) => {
    if (showNewCheckbox) {
      t.span('.checklist-item-checkbox-nachos', {
        'data-test-id': 'checklist-item-checkbox',
      });
    } else {
      t.div(
        '.checklist-item-checkbox',
        {
          class: t.classify({
            enabled: editable,
            'js-toggle-checklist-item': editable,
          }),
          'data-test-id': 'checklist-item-checkbox',
        },
        () => {
          t.span({ class: 'checklist-item-checkbox-check' });
        },
      );
    }

    t.div(
      '.checklist-item-details.non-empty.js-checkitem',
      { class: t.classify({ editable }), attr: 'name' },
      () => {
        t.div('.checklist-item-row.js-checkitem-row.current', () => {
          t.div('.checklist-item-text-and-controls.hide-on-edit', () => {
            t.span('.checklist-item-details-text.markeddown.js-checkitem-name');
            t.div('.checklist-item-controls', () => {
              if (showDueDateBadge) {
                t.span(
                  '.checklist-item-due.js-checklist-item-due.js-react-root',
                );
              }
              if (showAssignBadge) {
                t.span(
                  '.checklist-item-assignee.js-checklist-item-assignee.js-react-root',
                );
              }
              if (editable) {
                t.div(
                  '.checklist-item-menu.rmk-new.ignore-editable-view.js-new-overflow-button',
                );
              }
            });
          });

          if (editable) {
            //#CheckItem Edit Controls appended by check-item-edit-helpers
            t.div('.edit.check-item-options-menu', () => {
              t.textarea('.field.full.single-line.js-checkitem-input', {
                type: 'text',
              });
              t.p('.edits-error.error');
            });
          }
        });

        if (editable) {
          t.p('.edits-warning.quiet', () => {
            t.format('you-have-unsaved-edits-on-this-field');
            t.text(' ');
            t.a('.js-view-edits', { href: '#' }, () => {
              t.format('view-edits');
            });
            t.text(' - ');
            t.a('.js-discard-edits', { href: '#' }, () => {
              t.format('discard');
            });
          });
        }
      },
    );
  },
);

class CheckItemView extends View {
  static initClass() {
    this.prototype.className = 'checklist-item';

    this.prototype.allowNewlines = false;

    this.prototype.events = {
      //Editable Helper Events
      'click .js-checkitem-row': 'onCheckItemClick',
      'click .js-cancel-edit': 'clearEdits',
      'click .js-discard-edits': 'clearEdits',
      'click .js-view-edits': 'onCheckItemClick',
      'click .js-save-edit': 'commitCheckItemEdits',
      'keydown .field': 'checkItemKeydownEvent',
      'keydown .edit-controls': 'checkItemEditControlKeydown',

      'click textarea': Util.stopPropagation,

      //CheckItem In File
      'keyup .field'(e) {
        if (getKey(e) === Key.Escape) {
          // Don't let the keyup propagate; we want to handle PopOvers differently;
          // (we wait until keydown so we won't cancel editing if a PopOver is open)
          Util.stop(e);

          if (PopOver.isVisible) {
            PopOver.hide();
          } else {
            this.clearEdits(e);
          }
        }

        this.keyAutoMention(e);
      },

      'click .js-toggle-checklist-item': 'toggleState',

      'click .js-open-mention-selector': 'commentMentionMember', //#in completer-util
      'click .js-open-emoji-selector': 'commentAddEmoji', //#in completer-util
      movecheckitem: 'moveCheckItem',

      mouseenter() {
        if (!this.model.editable()) {
          return;
        }

        const board = this.model.getBoard();
        if (!board || !board.hasAdvancedChecklists()) {
          return;
        }

        registerShortcutHandler(this.onShortcut, {
          scope: Scope.DialogSection,
          clearScope: true,
        });
      },

      mouseleave() {
        unregisterShortcutHandler(this.onShortcut);
      },

      // Advanced Checklists Editable View Template
      'click .js-assign:not([disabled])'(e) {
        const board = this.model.getBoard();
        if (board && board.hasAdvancedChecklists()) {
          this.toggleAssignPopover(e);
        } else if (this._hasUpsell()) {
          this.toggleUpsellPopover(e);
        }
      },

      'click .js-due:not([disabled])'(e) {
        const board = this.model.getBoard();
        if (board && board.hasAdvancedChecklists()) {
          this.toggleSetDuePopover(e);
        } else if (this._hasUpsell()) {
          this.toggleUpsellPopover(e);
        }
      },
    };

    //Edit Helper Function Mapping
    this.prototype.validateCheckItemInput = validateCheckItemInput; //#called in commitCheckItemEdits
    this.prototype.onCheckItemClick = onCheckItemClick;
    this.prototype.saveCheckItemDrafts = saveCheckItemDrafts;
    this.prototype.recallCheckItemDrafts = recallCheckItemDrafts;
    this.prototype.getCheckItemEdits = getCheckItemEdits;
    this.prototype.checkItemKeydownEvent = checkItemKeydownEvent;
    this.prototype.clearEdits = clearEdits;
    this.prototype.commitCheckItemEdits = commitCheckItemEdits;
    this.prototype.renderEditItemButtons = renderEditItemButtons;
    this.prototype.editCheckItem = editCheckItem; //#called in onCheckItemClick
    this.prototype.checkItemEditControlKeydown = checkItemEditControlKeydown;
    this.prototype._checkItemDraftKey = _checkItemDraftKey;
    this.prototype._saveCheckItemDraft = _saveCheckItemDraft;
    this.prototype._recallCheckItemDraft = _recallCheckItemDraft;
    this.prototype._discardCheckItemDraft = _discardCheckItemDraft;
  }

  constructor(options) {
    super(options);
    this.onShortcut = this.onShortcut.bind(this);
    this.onClickMemberBadge = this.onClickMemberBadge.bind(this);
    this.onClickDueBadge = this.onClickDueBadge.bind(this);
    this.toggleState = this.toggleState.bind(this);
  }

  initialize() {
    this._reactContainers = new Set();

    this.listenTo(this.model, {
      'change:name'() {
        this.renderName();
        this.renderAssignee();
        this.renderDue();
      },
      'change:state'() {
        this.renderState();
        this.renderDue();
      },
      'change:due'() {
        this.renderDue();
        this.renderEditItemButtons();
      },
      'change:idMember'() {
        this.renderAssignee();
        this.renderEditItemButtons();
      },
    });

    super.initialize(...arguments);

    $(window).on(`beforeunload.EditableView-${this.model.cid}`, () => {
      this.saveCheckItemDrafts('unload');
    });
  }

  toggleSetDuePopover(event) {
    toggleDatePopoverV2({
      title: viewTitle('change due date'),
      setDate: (date) => this._setDue(date),
      getInitialDate: () => this.model.get('due'),
      trackingMethod: 'checkItemView',
    })(event);
  }

  toggleAssignPopover(event) {
    const card = this.model.getCard();
    const board = this.model.getBoard();

    toggleAssignPopoverV2({
      title: viewTitle('assign'),
      getCardMembers: () =>
        card.memberList
          .filterDeactivated({ force: true, model: board })
          .toJSON(),
      getBoardMembers: () =>
        board.memberList.filterDeactivated({ force: true }).toJSON(),
      trackingMethod: 'checkItemView',
      getInitialMember: () => this.model.get('idMember'),
      setMember: (idMember) => {
        this._setMember(idMember);
      },
    })(event);
  }

  toggleUpsellPopover(event) {
    const workspace = this.model?.getBoard()?.getOrganization();
    const workspaceName = workspace?.get('name');

    toggleUpsellAdvancedChecklist({
      trackingMethod: 'checkItemView',
      billingUrl: this.getBillingUrl(),
      teamName: workspaceName,
      orgId: workspace?.id,
    })(event);
  }

  toggleClearDuePopover(event) {
    toggleClearPopover({
      title: viewTitle('change due date'),
      message: t.l('clear-due-message'),
      removeText: t.l('clear-due'),
      clear: () => this._setDue(null),
      upsell: this._hasUpsell(),
    })(event);
  }

  toggleClearAssignPopover(event) {
    toggleClearPopover({
      title: viewTitle('assign'),
      message: t.l('clear-assignment-message'),
      removeText: t.l('clear-assignment'),
      clear: () => this._setMember(null),
      upsell: this._hasUpsell(),
    })(event);
  }

  onShortcut(event) {
    const key = getKey(event);

    const sendShortcutEvent = (shortcutName) => {
      Analytics.sendPressedShortcutEvent({
        shortcutName,
        source: 'cardDetailScreen',
        keyValue: key,
        containers: {
          card: {
            id: this.model.getCard().id,
          },
          board: {
            id: this.model.getBoard().id,
          },
        },
      });
    };

    switch (key) {
      case Key.Space: {
        const myId = Auth.myId();
        this._setMember(this.model.get('idMember') === myId ? null : myId);
        sendShortcutEvent('assignCheckItemSelfShortcut');
        break;
      }
      case Key.a:
      case Key.m:
        this.$('.js-checklist-item-assignee button').click();
        sendShortcutEvent('assignCheckItemMembersShortcut');
        break;
      case Key.d:
        this.$('.js-checklist-item-due button').click();
        sendShortcutEvent('assignCheckItemDueShortcut');
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  getCard() {
    return this.model.getCard();
  }

  getBillingUrl() {
    const org = this.model.getBoard().getOrganization();
    if (org) {
      return Urls.getOrganizationBillingUrl(org);
    }
  }

  getOrgId() {
    const org = this.model.getBoard().getOrganization();
    if (org) {
      return org.id;
    }
  }

  getTeamName() {
    const org = this.model.getBoard().getOrganization();
    if (org) {
      return org.get('name');
    }
  }

  advancedCheckItemFromModel() {
    const board = this.model.getBoard();
    const org = board && board.getOrganization();
    return {
      name: this.model.get('name'),
      validAssigneeUsernames: board.memberList.map((member) =>
        member.get('username'),
      ),
      orgProductNumber: org ? org.getProduct() : undefined,
    };
  }

  render() {
    try {
      const editable = this.model.editable();

      const shouldShowNewCheckbox = featureFlagClient.get(
        'remarkable.checkitem-checkbox-rewrite',
        false,
      );
      const board = this.model.getBoard();
      const _hasAdvancedChecklists = Boolean(
        board && board.hasAdvancedChecklists(),
      );
      const _hasUpsell = this._hasUpsell();

      this.$el.html(
        template({
          showAssignBadge:
            _hasAdvancedChecklists ||
            _hasUpsell ||
            Boolean(this.model.get('idMember')),
          showDueDateBadge:
            _hasAdvancedChecklists ||
            _hasUpsell ||
            Boolean(this.model.get('due')),
          editable,
          showNewCheckbox: shouldShowNewCheckbox,
        }),
      );
      if (shouldShowNewCheckbox) {
        this.renderCheckbox();
      }
      this.renderAssignee();
      this.renderDue();
      this.renderName();
      this.renderState();
      this.recallCheckItemDrafts();

      const newOverflowButton = this.el.querySelector(
        '.js-new-overflow-button',
      );

      this.renderOverflowButton(newOverflowButton, { editableView: false });

      this.unmountUnusedReactComponents();

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

  //getTextInput, getMentionTarget, getEmoji Target all used for CompleteUtil and AutoInsertion
  getTextInput() {
    return this.$('.js-checkitem-input');
  }

  getMentionTarget() {
    return this.$('.js-open-mention-selector')[0];
  }

  getEmojiTarget() {
    return this.$('.js-open-emoji-selector')[0];
  }

  _hasUpsell() {
    const board = this.model.getBoard();
    return Boolean(board && board.upsellAdvancedChecklists());
  }

  renderName(e) {
    const name = this.model.get('name');

    this.$('.js-checkitem-row').data('unmarkeddown', name);

    const nameHtml = TFM.checkItems.format(name, {
      textData: this.model.get('nameData'),
    }).output;
    const $name = this.$('.js-checkitem-name');
    $name.empty().append(nameHtml);
    const containers = {
      ...(this.model?.getCard?.()?.getAnalyticsContainers?.() ?? {}),
      ...(this.model?.getBoard?.()?.getAnalyticsContainers?.() ?? {}),
    };

    friendlyLinks($name[0], this.model.getBoard(), {
      analyticsContext: {
        source: 'cardDetailScreen',
        containers,
        attributes: {
          fromSection: 'checkItem',
        },
      },
    });
  }

  getMember() {
    const idMember = this.model.get('idMember');
    const board = this.model.getBoard();

    const predicate =
      // If there is a member in model.get('idMember'), check for that
      idMember ? (member) => member.id === idMember : undefined;

    const memberModel = predicate && board.memberList.find(predicate);
    return memberModel?.toJSON();
  }

  memberBadgeMode() {
    if (this.model.editable()) {
      const board = this.model.getBoard();

      if (board && board.hasAdvancedChecklists()) {
        return 'set';
      } else if (this.getMember()) {
        return 'clear';
      } else if (this._hasUpsell()) {
        return 'upsell';
      }
    }
    return 'disabled';
  }

  onClickMemberBadge(e) {
    switch (this.memberBadgeMode()) {
      case 'set':
        return this.toggleAssignPopover(e);
      case 'clear':
        return this.toggleClearAssignPopover(e);
      case 'upsell':
        return this.toggleUpsellPopover(e);
      default:
        return;
    }
  }

  renderAssignee() {
    const elAssign = this.el.querySelector('.js-checklist-item-assignee');

    if (!elAssign) {
      return;
    }

    const member = this.getMember();
    const badgeMode = this.memberBadgeMode();

    if (badgeMode !== 'disabled' || member) {
      const board = this.model.getBoard();
      const assigned = Boolean(member);

      this.mountReactComponent(
        <CheckItemMemberBadge
          assigned={assigned}
          avatarSource={assigned ? member.avatarSource : null}
          initials={assigned ? member.initials : null}
          avatarUrl={assigned ? member.avatarUrl : null}
          deactivated={
            assigned ? Boolean(board && board.isDeactivated(member)) : null
          }
          onClick={
            badgeMode !== 'disabled' ? this.onClickMemberBadge : undefined
          }
          testId={
            assigned
              ? ChecklistTestIds.ChecklistItemEditMemberButton
              : ChecklistTestIds.ChecklistItemSetMemberButton
          }
        />,
        elAssign,
      );
    } else {
      this.unmountReactComponent(elAssign);
    }

    elAssign.classList.toggle('unset', !member);
    this.el.classList.toggle('no-assignee', !member);
  }

  dueBadgeMode() {
    if (this.model.editable()) {
      const board = this.model.getBoard();

      if (board && board.hasAdvancedChecklists()) {
        return 'set';
      } else if (this.model.get('due')) {
        return 'clear';
      } else if (this._hasUpsell()) {
        return 'upsell';
      }
    }
    return 'disabled';
  }

  onClickDueBadge(e) {
    switch (this.dueBadgeMode()) {
      case 'set':
        return this.toggleSetDuePopover(e);
      case 'clear':
        return this.toggleClearDuePopover(e);
      case 'upsell':
        return this.toggleUpsellPopover(e);
      default:
        return;
    }
  }

  renderDue() {
    const elDue = this.el.querySelector('.js-checklist-item-due');

    if (!elDue) {
      return;
    }

    const due = this.model.get('due');
    const badgeMode = this.dueBadgeMode();

    if (badgeMode !== 'disabled' || due) {
      this.mountReactComponent(
        <DueDateBadge
          complete={this.model.get('state') === 'complete'}
          due={due && Dates.parse(due)}
          onClick={badgeMode !== 'disabled' ? this.onClickDueBadge : undefined}
          testId={
            due
              ? ChecklistTestIds.ChecklistItemEditDueButton
              : ChecklistTestIds.ChecklistItemSetDueButton
          }
        />,
        elDue,
      );
    } else {
      this.unmountReactComponent(elDue);
    }

    elDue.classList.toggle('unset', !due);
    this.el.classList.toggle('no-due', !due);
  }

  renderCheckbox() {
    const el = this.el.querySelector('.checklist-item-checkbox-nachos');
    if (!el) {
      return;
    }

    this.mountWrappedReactComponent(
      <CheckItemCheckbox
        model={this.model}
        className="checkbox-icon"
        onChange={this.toggleState}
        isDisabled={!this.model.editable()}
      />,
      el,
    );
  }

  renderState() {
    const data = this.model.toJSON();
    data.checked = data.state === 'complete';
    this.$el.toggleClass('checklist-item-state-complete', data.checked);
  }

  toggleState() {
    if (!this.model.editable()) {
      return;
    }
    const isComplete = this.model.get('state') === 'complete';
    const newState = isComplete ? 'incomplete' : 'complete';

    const traceId = Analytics.startTask({
      taskName: 'edit-checkItem/state',
      source: 'cardDetailScreen',
    });

    this.model.update(
      { state: newState, traceId },
      tracingCallback(
        {
          taskName: 'edit-checkItem/state',
          source: 'cardDetailScreen',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'updated',
              actionSubject: 'checkItem',
              actionSubjectId: 'state',
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
                taskId: traceId,
                state: newState,
              },
            });
          }
        },
      ),
    );
  }

  moveCheckItem(e, ui, checklist, toDifferentChecklist) {
    if (!toDifferentChecklist && this.model.getChecklist() !== checklist) {
      // We've already handled this as a move to a different checklist
      return;
    }

    const checkItems = ui.item.parent().children();
    const index = checkItems.index(ui.item);
    const pos = checklist.calcPos(index, this.model);

    if (toDifferentChecklist) {
      const traceId = Analytics.startTask({
        taskName: 'edit-checkItem/idChecklist',
        source: 'cardDetailScreen',
      });
      this.model.update(
        { pos, idChecklist: checklist.id, traceId },
        tracingCallback(
          {
            taskName: 'edit-checkItem/idChecklist',
            source: 'cardDetailScreen',
            traceId,
          },
          (err) => {
            if (!err) {
              Analytics.sendTrackEvent({
                action: 'updated',
                actionSubject: 'checkItem',
                actionSubjectId: 'idChecklist',
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
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
      this.model.collection.remove(this.model);
      checklist.checkItemList.add(this.model);
    } else {
      const traceId = Analytics.startTask({
        taskName: 'edit-checkItem/pos',
        source: 'cardDetailScreen',
      });

      this.model.update(
        { pos, traceId },
        tracingCallback(
          {
            taskName: 'edit-checkItem/pos',
            source: 'cardDetailScreen',
            traceId,
          },
          (err) => {
            if (!err) {
              Analytics.sendTrackEvent({
                action: 'updated',
                actionSubject: 'checkItem',
                actionSubjectId: 'pos',
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
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
    }

    checklist.checkItemList.sort({ silent: true });
  }

  _setDue(date) {
    const prevDate = this.model.get('due');
    const action =
      !prevDate && date ? 'added' : !date && prevDate ? 'removed' : 'changed';

    const traceId = Analytics.startTask({
      taskName: 'edit-checkItem/due',
      source: 'cardDetailScreen',
    });

    this.model.update(
      { due: date, traceId },
      tracingCallback(
        {
          taskName: 'edit-checkItem/due',
          source: 'cardDetailScreen',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action,
              actionSubject: 'checkItem',
              actionSubjectId: 'due',
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
                taskId: traceId,
              },
            });
          }
        },
      ),
    );
  }

  _setMember(idMember) {
    const prevMember = this.model.get('idMember');

    const action =
      !prevMember && idMember
        ? 'added'
        : !idMember && prevMember
        ? 'removed'
        : 'changed';

    const traceId = Analytics.startTask({
      taskName: 'edit-checkItem/idMember',
      source: 'cardDetailScreen',
    });

    this.model.update(
      { idMember: idMember, traceId },
      tracingCallback(
        {
          taskName: 'edit-checkItem/idMember',
          source: 'cardDetailScreen',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action,
              actionSubject: 'checkItem',
              actionSubjectId: 'idMember',
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
                taskId: traceId,
              },
            });
          }
        },
      ),
    );
  }

  remove() {
    unregisterShortcutHandler(this.onShortcut);
    this.unmountAllReactComponents();
    this.saveCheckItemDrafts('removing view');
    $(window).off(`.EditableView-${this.model.cid}`);

    return super.remove(...arguments);
  }

  // Wrapper around `renderComponent` that also "keeps track" of the mount point
  renderOverflowButton(el, props) {
    if (el) {
      //#The new stack races the old stack and often believes the closest elevation is 0
      //#This makes sure that it always finds the card back button correctly at Elevation 1
      el.setAttribute(ELEVATION_ATTR, 1);
      this.mountWrappedReactComponent(
        <CheckItemOverflowMenu model={this.model} {...props} />,
        el,
      );
    }

    return this;
  }

  mountReactComponent(component, el) {
    ReactDOM.render(component, el);
    this._reactContainers.add(el);
  }

  mountWrappedReactComponent(component, el) {
    renderComponent(component, el);
    this._reactContainers.add(el);
  }

  // Unmounts any react components whose containers are no longer contained by the backbone view
  unmountUnusedReactComponents() {
    Array.from(this._reactContainers)
      .filter((container) => !this.el.contains(container))
      .forEach((container) => {
        this.unmountReactComponent(container);
      });
  }

  unmountAllReactComponents() {
    Array.from(this._reactContainers).forEach((container) => {
      this.unmountReactComponent(container);
    });
  }

  unmountReactComponent(container) {
    ReactDOM.unmountComponentAtNode(container);
    this._reactContainers.delete(container);
  }
}
CheckItemView.initClass();

_.extend(CheckItemView.prototype, AutoInsertionView, CompleterUtil);

module.exports = CheckItemView;
