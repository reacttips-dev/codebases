/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const ActionListView = require('app/scripts/views/action/action-list-view');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const AutoInsertionView = require('app/scripts/views/internal/autocomplete/auto-insertion-view');
const CardDetailMoreMenuView = require('app/scripts/views/card/card-detail-more-menu-view');
const {
  showDetails,
  hideDetails,
  showAllActions,
  renderShowAllActionsButton,
  renderActionList,
  renderSuggestedActions,
} = require('app/scripts/views/card/card-detail-view-actions');
const CardViewHelpers = require('app/scripts/views/card/card-view-helpers');
const CompleterUtil = require('app/scripts/views/internal/autocomplete/completer-util');
const { Controller } = require('app/scripts/controller');
const { Dates } = require('app/scripts/lib/dates');
const DescriptionView = require('app/scripts/views/description/description-view');
const Dialog = require('app/scripts/views/lib/dialog');
require('app/scripts/views/internal/data-transfer/drag-drop-events');
const EditableView = require('app/scripts/views/internal/editable-view');
const {
  featureFlagClient,
  seesVersionedVariation,
} = require('@trello/feature-flag-client');
const {
  getKey,
  Key,
  registerShortcutHandler,
  Scope,
  unregisterShortcutHandler,
} = require('@trello/keybindings');
const LabelKeyHelper = require('app/scripts/views/label/label-key-helper');
const { MemberState } = require('app/scripts/view-models/member-state');
const { ModelCache } = require('app/scripts/db/model-cache');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Monitor } = require('app/scripts/lib/monitor');
const PasteInput = require('app/scripts/views/internal/paste-input');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const { TrelloStorage } = require('@trello/storage');
const Tooltip = require('app/scripts/views/lib/tooltip');
const {
  undoAction,
  redoAction,
  repeatAction,
} = require('app/scripts/lib/last-action');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const f = require('effing');
const cardDetailTemplate = require('app/scripts/views/templates/card_detail');
const cardDetailListTemplate = require('app/scripts/views/templates/card_detail_list');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const { trelloClipboard } = require('app/scripts/lib/trello-clipboard');
const {
  UpgradeSmartComponentConnected,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const {
  toggleSuggestionsSettings,
} = require('app/scripts/views/suggestions-settings/toggle-suggestions-settings');
const { animateRender, animateRemove } = require('./animate-card');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const React = require('react');
const { CardBackBanner } = require('app/src/components/CardBackBanner');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const {
  LazyVideoRecordButton,
  SpotlightLoomCommentButton,
  isLoomIntegrationEnabled,
} = require('app/src/components/VideoRecordButton');

const {
  saveCardName,
  nameKeyDownEvent,
  startNameEditing,
  saveNameEditing,
  cancelNameEditing,
  stopNameEditing,
  renderName,
  editTitle,
} = require('./card-detail-view-name');
let { isOnBoardTemplate } = require('./card-detail-view-template');
const {
  convertToTemplate,
  convertToCard,
  renderCardTemplate,
} = require('./card-detail-view-template');
const {
  openCoverInViewer,
  showCover,
  checkShowCover,
  clearCover,
  renderCover,
  cardCoverChooserSidebar,
  resizeFullCover,
} = require('./card-detail-view-cover');
const {
  renderSubscribe,
  subscribeToCard,
  unsubscribeFromCard,
} = require('./card-detail-view-subscribe');
const {
  showVotes,
  renderVotes,
  vote,
  unvote,
} = require('./card-detail-view-vote');
const {
  archiveCard,
  unarchiveCard,
  renderArchived,
  renderDelete,
  deleteCardSidebar,
} = require('./card-detail-view-archive');
const {
  openMoveMenu,
  openMoveFromHeader,
  moveCard,
  copyCard,
  renderCopyCard,
  openMoveFromBadge,
} = require('./card-detail-view-copy-move');
const {
  openLabelsPopOver,
  editLabelsMainSingleLabel,
  editLabelsMain,
  editLabelsSidebar,
  renderLabels,
  _openEditLabelsSidebar,
} = require('./card-detail-view-label');
const {
  renderAddChecklists,
  renderDueDate,
  sortChecklists,
  removeChecklist,
  renderChecklists,
  sortStop,
  onChecklistClick,
  onChecklistShortcut,
  addChecklistSidebar,
  showDueDateBadgeMenu,
  toggleDueDateComplete,
  dueDateSidebar,
  focusChecklistAdd,
  renderStartDate,
  editStartDatePopOver,
  renderDateRangePickerButton,
  showDateRangePicker,
} = require('./card-detail-view-checklist');
const {
  renderCustomFieldsButton,
  renderCustomFieldsBadges,
  renderCustomFieldsDisabled,
} = require('./card-detail-view-custom-fields');
const {
  renderEditing,
  openEditMembersPopOver,
  editMembersMain,
  changeMembersSidebar,
  join,
  renderMembers,
} = require('./card-detail-view-members');
const {
  incrementNumAttachmentsProcessing,
  decrementNumAttachmentsProcessing,
  incrementNumTrelloAttachmentsProcessing,
  decrementNumTrelloAttachmentsProcessing,
  attachComment,
  openAttachPicker,
  openAttachTrelloPicker,
  renderAddAttachments,
  showFewerAttachments,
  showMoreAttachments,
  showFewerTrelloAttachments,
  showMoreTrelloAttachments,
  renderAttachments,
  dragenter,
  dragleave,
  dropFiles,
  dropUrl,
  enableAttachmentSorting,
  getTrelloAttachments,
  sortStopAttachments,
} = require('./card-detail-view-attachment');
const {
  _commentDraftKey,
  saveCommentDraft,
  keydownCommentEvent,
  _isCommentTooLong,
  renderCommentSubmitAbility,
  renderCommentControls,
  renderCommentAndSubscribeBox,
  _cancelEditing,
  commentInputEvent,
  clearComment,
  submitComment,
  subscribeOnComment,
  truncateComment,
  inputComment,
  clickAwayFromComment,
  collapseComment,
  replyToAction,
  replyToAllAction,
  replyToAttachment,
  replyToComment,
} = require('./card-detail-view-comment');
const {
  highlight,
  interceptHighlightLink,
  scrollToHighlight,
} = require('./card-detail-view-highlight');
const {
  renderPluginButtons,
  renderButlerCardButtons,
  renderCustomFieldBadges,
  renderPluginBadges,
  renderStickers,
  renderAging,
  dismissPluginSuggestionSection,
  enableSuggestedPluginPrompt,
  renderPluginSections,
  editFieldsSidebar,
  editLocationSidebar,
  renderLocation,
  cardAgingSidebar,
} = require('./card-detail-view-plugins');
const {
  markNotificationsReadOnActive,
  markRelatedNotificationsRead,
} = require('./card-detail-view-notifications');
const {
  commentInputFocusedState,
} = require('app/src/components/VideoRecordButton');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class CardDetailView extends EditableView {
  static initClass() {
    this.prototype.className = 'card-detail-window u-clearfix';
    this.prototype.defaultActionLimit = 50;
    this.prototype.maxActionLimit = 1000;
    this.prototype.maximumCommentLength = 16384; // This is the most the API accepts for a string
    this.prototype.maxDescLength = 1800;

    this.prototype.events = {
      // sidebar
      'click .js-edit-labels': 'editLabelsSidebar',
      'click .js-change-card-members': 'changeMembersSidebar',
      'click .js-add-checklist-menu': 'onChecklistClick',
      'click .js-add-due-date': 'dueDateSidebar',
      'click .js-add-start-date': 'editStartDatePopOver',
      'click .js-card-cover-chooser': 'cardCoverChooserSidebar',
      'click .js-attach': 'openAttachPicker',
      'click .js-attach-trello-attachment': 'openAttachTrelloPicker',
      'click .js-join': 'join',
      'click .js-suggested-actions-settings': toggleSuggestionsSettings(
        'Card Detail',
      ),

      'click .js-edit-fields': 'editFieldsSidebar',
      'click .js-edit-location': 'editLocationSidebar',
      'click .js-card-aging-card-button': 'cardAgingSidebar',

      'click .js-move-card': 'moveCard',
      'click .js-copy-card': 'copyCard',
      'click .js-subscribe': 'subscribeToCard',
      'click .js-unsubscribe': 'unsubscribeFromCard',
      'click .js-vote': 'vote',
      'click .js-unvote': 'unvote',
      'click .js-convert-to-template': 'convertToTemplate',
      'click .js-convert-to-card': 'convertToCard',

      'click .js-archive-card': 'archiveCard',
      'click .js-unarchive-card': 'unarchiveCard',
      'click .js-delete-card': 'deleteCardSidebar',

      'click .js-more-menu': 'showMoreMenu',

      // title
      'keydown  .js-card-detail-title-input': 'nameKeyDownEvent',
      'focus    .js-card-detail-title-input'(e) {
        if (this.$(e.target).hasClass('full-cover-card-detail-title')) {
          this.$('.js-card-cover-box').addClass('title-input-focused');
        }

        return this.startNameEditing({ focus: false });
      },

      'blur     .js-card-detail-title-input'(e) {
        this.$('.js-card-cover-box').removeClass('title-input-focused');

        return this.saveNameEditing();
      },

      // main col
      'click .js-open-card-cover-in-viewer': 'openCoverInViewer',
      'click .js-open-move-from-header': 'openMoveFromHeader',
      'click .js-card-detail-list-badge-button': 'openMoveFromBadge',
      'click .js-details-edit-members': 'editMembersMain',
      'click .js-details-edit-labels': 'editLabelsMain',
      'click .js-edit-label .card-label': 'editLabelsMainSingleLabel',
      'click .js-details-edit-due-date': 'showDueDateBadgeMenu',
      'click .js-details-edit-start-date': 'editStartDatePopOver',
      'click .js-details-toggle-due-date-complete': 'toggleDueDateComplete',
      'click .js-show-votes': 'showVotes',
      'click .js-member-on-card-menu': 'openMemberOnCardMenu',
      // For https://hello.atlassian.net/wiki/spaces/TRELLO/pages/1251426504/New+Profile+Card
      'click .atMention': 'recordAtMentionClick',

      'click .js-view-some-attachments': 'showFewerAttachments',
      'click .js-view-all-attachments': 'showMoreAttachments',
      'click .js-view-some-trello-attachments': 'showFewerTrelloAttachments',
      'click .js-view-all-trello-attachments': 'showMoreTrelloAttachments',
      'click .js-show-all-actions': 'showAllActions',

      // comments
      'keydown .js-new-comment-input': 'keydownCommentEvent',
      'input .js-new-comment-input': 'commentInputEvent',
      'mutated .js-new-comment-input': 'commentInputEvent',
      'click .js-add-comment:not(:disabled)': 'submitComment',
      'click .js-comment-subscribe': 'subscribeOnComment',
      'click .js-attach-comment': 'attachComment',
      'click .js-truncate-comment': 'truncateComment',
      'click .js-new-comment': 'inputComment',
      'focus .js-new-comment-input': 'inputComment',
      'keyup .js-new-comment-input': 'keyAutoMention',
      click: 'clickAwayFromComment',

      'click .js-new-comment .js-comment-add-attachment':
        'commentAddAttachment',
      'click .js-new-comment .js-comment-mention-member':
        'commentMentionMember',
      'click .js-new-comment .js-comment-add-emoji': 'commentAddEmoji',
      'click .js-new-comment .js-comment-add-card': 'commentAddCard',

      'click .js-show-details': 'showDetails',
      'click .js-hide-details': 'hideDetails',

      'click a[href]': 'interceptHighlightLink',

      // attachments
      'dd-enter:files': 'dragenter',
      'dd-leave:files': 'dragleave',
      'dd-drop:files': 'dropFiles',
      'dd-enter:url': 'dragenter',
      'dd-leave:url': 'dragleave',
      'dd-drop:url': 'dropUrl',
      'pasteinput:files': 'dropFiles',
      'pasteinput:url': 'dropUrl',

      // checklist sort
      'sortstop .js-checklist-list': 'sortStop',

      'sortstop .js-attachment-list': 'sortStopAttachments',

      replyToAction: 'replyToAction',
      replyToAllAction: 'replyToAllAction',

      // Watch via comment tooltip
      'mouseenter .js-comment-subscribe'(e) {
        const $el = this.$(e.currentTarget);
        return Tooltip.show(
          $el.attr('aria-label'),
          $el,
          false,
          Tooltip.STYLE.MENU,
        );
      },

      'mouseleave .js-comment-subscribe'(e) {
        return Tooltip.hide();
      },
      //Overrides the default handler in EditableView
      'click input': (e) => {
        if ($(e.target).closest('.checklist-item-checkbox-nachos').length) {
          return;
        }
        Util.stopPropagation(e);
      },

      // update the comment input focused state to true
      // when transition is complete
      'transitionend .comment-box-options': (e) => {
        if (
          e.originalEvent.propertyName === 'transform' &&
          $(e.target).hasClass('comment-box-options')
        ) {
          commentInputFocusedState.setValue(true);
        }
      },
    };

    this.prototype.saveCommentDraft = saveCommentDraft;
    this.prototype.keydownCommentEvent = keydownCommentEvent;
    this.prototype._isCommentTooLong = _isCommentTooLong;
    this.prototype.renderCommentSubmitAbility = renderCommentSubmitAbility;
    this.prototype.renderCommentControls = renderCommentControls;
    this.prototype.renderCommentAndSubscribeBox = renderCommentAndSubscribeBox;
    this.prototype._cancelEditing = _cancelEditing;
    this.prototype.commentInputEvent = commentInputEvent;
    this.prototype.clearComment = clearComment;
    this.prototype.submitComment = submitComment;
    this.prototype.subscribeOnComment = subscribeOnComment;
    this.prototype.replyToComment = replyToComment;
    this.prototype.truncateComment = truncateComment;
    this.prototype.attachComment = attachComment;
    this.prototype.inputComment = inputComment;
    this.prototype.clickAwayFromComment = clickAwayFromComment;
    this.prototype.collapseComment = collapseComment;
    this.prototype.replyToAction = replyToAction;
    this.prototype.replyToAllAction = replyToAllAction;
    this.prototype.replyToAttachment = replyToAttachment;
    this.prototype._commentDraftKey = _commentDraftKey;

    // Notifications functions
    this.prototype.markNotificationsReadOnActive = markNotificationsReadOnActive;
    this.prototype.markRelatedNotificationsRead = markRelatedNotificationsRead;

    // Attachment functions
    this.prototype.incrementNumAttachmentsProcessing = incrementNumAttachmentsProcessing;
    this.prototype.decrementNumAttachmentsProcessing = decrementNumAttachmentsProcessing;
    this.prototype.incrementNumTrelloAttachmentsProcessing = incrementNumTrelloAttachmentsProcessing;
    this.prototype.decrementNumTrelloAttachmentsProcessing = decrementNumTrelloAttachmentsProcessing;
    this.prototype.enableAttachmentSorting = enableAttachmentSorting;
    this.prototype.getTrelloAttachments = getTrelloAttachments;

    // Highlight functions
    this.prototype.scrollToHighlight = scrollToHighlight;
    this.prototype.highlight = highlight;
    this.prototype.interceptHighlightLink = interceptHighlightLink;

    // Card name functions
    this.prototype.saveCardName = saveCardName;
    this.prototype.nameKeyDownEvent = nameKeyDownEvent;
    this.prototype.startNameEditing = startNameEditing;
    this.prototype.saveNameEditing = saveNameEditing;
    this.prototype.cancelNameEditing = cancelNameEditing;
    this.prototype.stopNameEditing = stopNameEditing;
    this.prototype.renderName = renderName;
    this.prototype.editTitle = editTitle;

    // Archiving/deleting functions
    this.prototype.archiveCard = archiveCard;
    this.prototype.unarchiveCard = unarchiveCard;
    this.prototype.deleteCardSidebar = deleteCardSidebar;
    this.prototype.renderArchived = renderArchived;
    this.prototype.renderDelete = renderDelete;

    // Copy/move functions
    this.prototype.renderCopyCard = renderCopyCard;
    this.prototype.openMoveMenu = openMoveMenu;
    this.prototype.openMoveFromBadge = openMoveFromBadge;
    this.prototype.openMoveFromHeader = openMoveFromHeader;
    this.prototype.moveCard = moveCard;
    this.prototype.copyCard = copyCard;

    // Label functions
    this.prototype.renderLabels = renderLabels;
    this.prototype.openLabelsPopOver = openLabelsPopOver;
    this.prototype.editLabelsMainSingleLabel = editLabelsMainSingleLabel;
    this.prototype.editLabelsMain = editLabelsMain;
    this.prototype.editLabelsSidebar = editLabelsSidebar;
    this.prototype._openEditLabelsSidebar = _openEditLabelsSidebar;

    // Voting functions
    this.prototype.showVotes = showVotes;
    this.prototype.renderVotes = renderVotes;
    this.prototype.vote = vote;
    this.prototype.unvote = unvote;

    // Cover functions
    this.prototype.showCover = showCover;
    this.prototype.checkShowCover = checkShowCover;
    this.prototype.clearCover = clearCover;
    this.prototype.renderCover = renderCover;
    this.prototype.cardCoverChooserSidebar = cardCoverChooserSidebar;
    this.prototype.resizeFullCover = resizeFullCover;

    // Checklist functions
    this.prototype.renderAddChecklists = renderAddChecklists;
    this.prototype.renderDueDate = renderDueDate;
    this.prototype.renderStartDate = renderStartDate;
    this.prototype.sortChecklists = sortChecklists;
    this.prototype.removeChecklist = removeChecklist;
    this.prototype.renderChecklists = renderChecklists;
    this.prototype.sortStop = sortStop;

    // Member functions
    this.prototype.renderMembers = renderMembers;
    this.prototype.renderEditing = renderEditing;
    this.prototype.openEditMembersPopOver = openEditMembersPopOver;
    this.prototype.editMembersMain = editMembersMain;
    this.prototype.changeMembersSidebar = changeMembersSidebar;
    this.prototype.join = join;

    // Checklist functions
    this.prototype.onChecklistClick = onChecklistClick;
    this.prototype.onChecklistShortcut = onChecklistShortcut;
    this.prototype.addChecklistSidebar = addChecklistSidebar;
    this.prototype.showDueDateBadgeMenu = showDueDateBadgeMenu;
    this.prototype.toggleDueDateComplete = toggleDueDateComplete;
    this.prototype.dueDateSidebar = dueDateSidebar;
    this.prototype.editStartDatePopOver = editStartDatePopOver;
    this.prototype.renderDateRangePickerButton = renderDateRangePickerButton;
    this.prototype.showDateRangePicker = showDateRangePicker;
    this.prototype.focusChecklistAdd = focusChecklistAdd;

    // Custom Fields
    this.prototype.renderCustomFieldsButton = renderCustomFieldsButton;
    this.prototype.renderCustomFieldsBadges = renderCustomFieldsBadges;
    this.prototype.renderCustomFieldsDisabled = renderCustomFieldsDisabled;

    // Attachment functions
    this.prototype.renderAttachments = renderAttachments;
    this.prototype.sortStopAttachments = sortStopAttachments;
    this.prototype.renderAddAttachments = renderAddAttachments;
    this.prototype.showFewerAttachments = showFewerAttachments;
    this.prototype.showMoreAttachments = showMoreAttachments;
    this.prototype.showFewerTrelloAttachments = showFewerTrelloAttachments;
    this.prototype.showMoreTrelloAttachments = showMoreTrelloAttachments;
    this.prototype.openCoverInViewer = openCoverInViewer;
    this.prototype.openAttachPicker = openAttachPicker;
    this.prototype.openAttachTrelloPicker = openAttachTrelloPicker;
    this.prototype.dragenter = dragenter;
    this.prototype.dragleave = dragleave;
    this.prototype.dropFiles = dropFiles;
    this.prototype.dropUrl = dropUrl;

    // Subscribe/unsubscribe functions
    this.prototype.subscribeToCard = subscribeToCard;
    this.prototype.unsubscribeFromCard = unsubscribeFromCard;
    this.prototype.renderSubscribe = renderSubscribe;

    // Action functions
    this.prototype.showAllActions = showAllActions;
    this.prototype.renderShowAllActionsButton = renderShowAllActionsButton;
    this.prototype.renderActionList = renderActionList;
    this.prototype.renderSuggestedActions = renderSuggestedActions;
    this.prototype.showDetails = showDetails;
    this.prototype.hideDetails = hideDetails;

    // Plugin functions
    this.prototype.renderAging = renderAging;
    this.prototype.dismissPluginSuggestionSection = dismissPluginSuggestionSection;
    this.prototype.enableSuggestedPluginPrompt = enableSuggestedPluginPrompt;
    this.prototype.renderPluginSections = renderPluginSections;
    this.prototype.editFieldsSidebar = editFieldsSidebar;
    this.prototype.editLocationSidebar = editLocationSidebar;
    this.prototype.renderLocation = renderLocation;
    this.prototype.renderPluginButtons = renderPluginButtons;
    this.prototype.renderButlerCardButtons = renderButlerCardButtons;
    this.prototype.renderCustomFieldBadges = renderCustomFieldBadges;
    this.prototype.renderPluginBadges = renderPluginBadges;
    this.prototype.renderStickers = renderStickers;
    this.prototype.cardAgingSidebar = cardAgingSidebar;

    // Template functions
    this.prototype.convertToTemplate = convertToTemplate;
    this.prototype.convertToCard = convertToCard;
    this.prototype.renderCardTemplate = renderCardTemplate;
    this.prototype.isOnBoardTemplate = isOnBoardTemplate;

    // When to truncate the desc and show "Show full description."
  }

  constructor(options) {
    super(options);
    this.onShortcut = this.onShortcut.bind(this);
    registerShortcutHandler(this.onShortcut, { scope: Scope.Dialog });

    // This prevents users from holding shortcuts and spamming the API and tracking
    const keypressThrottleWaitMs = 500;
    this.throttledJoin = this.throttle(this.onJoin, keypressThrottleWaitMs);
    this.throttledClose = this.throttle(this.onClose, keypressThrottleWaitMs);
    this.throttledMoveToNextList = this.throttle(
      this.onMoveToNextList,
      keypressThrottleWaitMs,
    );
    this.throttledMoveToPrevList = this.throttle(
      this.onMoveToPrevList,
      keypressThrottleWaitMs,
    );
    this.throttledSubscribe = this.throttle(
      this.onSubscribe,
      keypressThrottleWaitMs,
    );

    this.isLoomIntegrationEnabled = isLoomIntegrationEnabled(
      this.model.getBoard()?.get('idEnterprise'),
    );

    this.insertRecording = this.insertRecording.bind(this);
    this.setOneTimeMessagesToDismiss = this.setOneTimeMessagesToDismiss.bind(
      this,
    );
  }

  addListListener() {
    // Do not listen to the list if the view was opened outside of a board view.
    if (this.isOpenedOutsideOfBoardOfOrigin()) {
      return;
    }

    // Archived lists may be loaded later so listening to @model.getList() won't
    // work until the data is loaded.

    // Clean up any old event listeners.

    const idOldList = this.model.previous('idList');

    if (idOldList) {
      this.stopListening(this.modelCache, `add:List:${idOldList}`);

      const oldList = this.modelCache.get('List', idOldList);
      this.stopListening(oldList, 'change:closed');
    }

    // Render list, add new listeners.

    const handleList = () => {
      this.renderListDebounced();
      this.renderArchivedDebounced();
      this.renderDeleteDebounced();
      return this.listenTo(this.model.getList(), {
        'change:closed': () => {
          this.renderArchivedDebounced();
          return this.renderDeleteDebounced();
        },
      });
    };

    if (this.model.getList()) {
      handleList();
    } else {
      this.listenToOnce(
        this.modelCache,
        `add:List:${this.model.get('idList')}`,
        handleList,
      );
    }
  }

  isOpenedOutsideOfBoardOfOrigin() {
    const currentBoard = currentModelManager.getCurrentBoard();

    if (currentBoard == null) {
      return true;
    }

    return currentBoard.id !== this.model.get('idBoard');
  }

  initialize() {
    super.initialize(...arguments);
    //Create array to track oneTimeDismissedMessage ids
    //Currently only used in CardBackBanner for remarkable.bc-trial-views-upsells
    this._messagesToDismissOnClose = new Array();

    this.makeDebouncedMethods(
      'render',
      'renderAddAttachments',
      'renderAddChecklists',
      'renderCover',
      'renderStickers',
      'renderName',
      'renderArchived',
      'renderDelete',
      'renderLabels',
      'renderList',
      'renderVotes',
      'renderDueDate',
      'renderStartDate',
      'renderSubscribe',
      'renderAttachments',
      'renderMembers',
      'renderAging',
      'renderCustomFieldBadges',
      'renderPluginSections',
      'renderLocation',
      'renderCardTemplate',
      'renderDateRangePickerButton',
    );

    this.listenTo(this.model, {
      'change:name': this.renderNameDebounced,
      'change:closed': () => {
        this.renderArchivedDebounced();
        return this.renderDeleteDebounced();
      },
      'change:isTemplate': () => {
        this.renderArchivedDebounced();
        this.renderDeleteDebounced();
        this.renderCardTemplateDebounced();
        this.renderDueDateDebounced();
        this.renderStartDateDebounced();
        this.renderDateRangePickerButtonDebounced();
        return this.renderVotesDebounced();
      },
      'change:labels': this.renderLabelsDebounced,
      'change:limits': () => {
        this.renderAddAttachmentsDebounced();
        return this.renderAddChecklistsDebounced();
      },
      'change:idList': () => {
        this.renderListDebounced();
        return this.addListListener();
      },
      'change:idMembersVoted': this.renderVotesDebounced,
      'change:start': () => {
        this.renderStartDateDebounced();
        this.renderDueDateDebounced();
        this.renderDateRangePickerButtonDebounced();
      },
      'change:due change:dueComplete': () => {
        this.renderStartDateDebounced();
        this.renderDueDateDebounced();
        this.renderDateRangePickerButtonDebounced();
      },
      'change:dueReminder': () => {
        this.renderDateRangePickerButtonDebounced();
      },
      'change:subscribed': this.renderSubscribeDebounced,
      'change:dateLastActivity': () => {
        this.renderAgingDebounced();
        this.renderCoverDebounced();
        return this.renderPluginSectionsDebounced();
      },
      'change:idAttachmentCover change:cover'() {
        return this.renderCoverDebounced();
      },
      destroy: this.closeDialog,
      'change:badges.votes'() {
        return ModelLoader.loadCardVoters(this.model.id).done();
      },
      'change:coordinates': this.renderLocationDebounced,
      'change:idBoard': this.closeDialog,
    });

    this.addListListener();

    this.listenTo(
      this.model.customFieldItemList,
      'add remove reset change',
      () => {
        return this.renderCustomFieldBadgesDebounced();
      },
    );

    this.listenTo(this.model.labelList, 'add remove reset change', () => {
      return this.renderLabelsDebounced();
    });

    this.listenTo(this.model.memberList, {
      'add remove reset': this.renderMembersDebounced,
    });

    this.listenTo(this.model.memberList, {
      'change:initials change:avatarUrl change:avatarSource change:fullName change:username': this
        .renderMembersDebounced,
    });

    this.listenTo(this.model.memberVotedList, {
      'add remove reset': this.renderVotesDebounced,
    });

    this.listenTo(this.model.checklistList, {
      'add reset': this.renderChecklists,
      remove: this.removeChecklist,
      sort: this.sortChecklists,
    });

    this.listenTo(this.model.attachmentList, {
      'add remove reset sort': this.renderAttachmentsDebounced,
    });

    this.listenTo(this.model.stickerList, {
      'add remove reset change sort': this.renderStickersDebounced,
    });

    this.listenTo(this.model.memberEditingList, {
      'add remove reset change:action': this.renderEditing,
    });

    const board = this.model.getBoard();
    this.listenTo(board, {
      'change:labelNames': this.renderLabelsDebounced,
      'change:labels': this.renderLabelsDebounced,
      'change:limits': this.renderAddChecklistsDebounced,
      'change:prefs'(changedBoard) {
        const changed = (pref) =>
          __guard__(changedBoard.get('prefs'), (x) => x[pref]) !==
          __guard__(changedBoard.previous('prefs'), (x1) => x1[pref]);
        // Try to be as specific as possible about what we rerender
        if (changed('cardCovers')) {
          this.renderCoverDebounced();
        }

        // Re-rendering the whole card will mess up in-progress edits, so don't
        // ever do that if there is an edit in progress
        const requiresFullRender =
          changed('cardAging') ||
          changed('comments') ||
          changed('voting') ||
          changed('isTemplate');
        if (requiresFullRender && this.$('.editing').length === 0) {
          this.renderDebounced();
        }

        if (changed('hideVotes')) {
          return this.renderVotesDebounced();
        }
      },
    });

    this.listenTo(board.customFieldList, 'add remove reset change', () => {
      return this.renderCustomFieldBadgesDebounced();
    });

    this.listenTo(board.boardPluginList, 'add remove reset change', () => {
      this.renderCustomFieldBadgesDebounced();
      this.renderAgingDebounced();
      return this.renderLocationDebounced();
    });

    // Some members might be in the card but not have made it to the board yet.
    // In that case, they won't be rendered, as being in a card but not its
    // board is considered an invalid state. When that is resolved - when the
    // member finally makes it to the board - rerender all members to get the
    // complete list.
    this.listenTo(board.memberList, {
      'add remove reset': this.renderMembersDebounced,
    });

    this.listenTo(MemberState, 'change:showSuggestions', () => {
      return this.renderSuggestedActions();
    });

    // subscribing to these continuous signals will fire once immediately
    // in this case we don't want that as it will be a duplicate call
    this.subscribe(
      pluginsChangedSignal(board, this.model),
      _.after(2, () => {
        this.renderCoverDebounced();
        this.renderAttachmentsDebounced();
        this.renderPluginSectionsDebounced();
        this.renderLocationDebounced();
        return this.renderAgingDebounced();
      }),
    );

    this.getData();

    this.numAttachmentsProcessing = this.slot(0);
    this.watch(
      'numAttachmentsProcessing',
      _.after(2, () => {
        return this.renderAttachmentsDebounced();
      }),
    );

    this.numTrelloAttachmentsProcessing = this.slot(0);
    this.watch(
      'numTrelloAttachmentsProcessing',
      _.after(2, () => {
        return this.renderAttachmentsDebounced();
      }),
    );

    // It's possible, if a card was just created, that it won't have the
    // desc specified yet
    this.fHideFullDescription =
      __guard__(this.model.get('desc'), (x) => x.length) > this.maxDescLength;

    this.actionListView = this.collectionSubview(
      ActionListView,
      this.model.actionList,
      {
        renderOpts: {
          context: this.model,
          compact: false,
          source: 'cardDetailScreen',
        },
      },
    );

    this.markNotificationsReadOnActive();
    this.listenTo(
      Monitor,
      'setStatus visibilitychange',
      this.markNotificationsReadOnActive,
    );
    this.listenTo(ModelCache, 'add:Notification', (notification) => {
      if (
        notification != null &&
        __guard__(
          __guard__(notification.get('data'), (x2) => x2.card),
          (x1) => x1.id,
        ) === this.model.id
      ) {
        return this.markNotificationsReadOnActive();
      }
    });

    $(window).on(
      `beforeunload.CardDetailView-${this.model.cid}`,
      f(this, 'saveCommentDraft', true),
    );

    this.pluginThumbTrackCache = {};

    // Pre-set the clipboard to contain the card URL so if the user copies, the cards URL will
    // make it to their clipboard even if the user is directly navigating to a card route.
    trelloClipboard.set(this.model.getFullUrl());

    this.listenTo(
      Auth.me().boardList,
      'add remove reset change:closed',
      this.renderCopyCard,
    );

    this.descView = this.subview(DescriptionView, this.model, {
      maxDescLength: this.maxDescLength,
      card: this.model,
      board: this.model.getBoard(),
      placeholderKey: 'add-a-more-detailed-description',
      source: 'cardDetailScreen',
    }); // for GAS analytics

    PasteInput.addHandler(this, { scope: 'dialog' });

    if (featureFlagClient.get('dataeng.gasv3-core-event-tracking', false)) {
      Analytics.sendScreenEvent({
        name: 'cardDetailScreen',
        containers: this.model.getAnalyticsContainers(),
      });
    }

    //###############################
    // START - Card back transition #
    //###############################

    if (featureFlagClient.get('animations', false)) {
      return animateRender(this);
    }
  }

  //###############################
  // END - Card back transition   #
  //###############################

  remove() {
    this.rendered = false;
    this.saveCommentDraft(true);
    $(window).off(`.CardDetailView-${this.model.cid}`);
    unregisterShortcutHandler(this.onShortcut);
    PasteInput.removeHandler(this);

    //###############################
    // START - Card back transition #
    //###############################
    if (featureFlagClient.get('animations', false)) {
      animateRemove(this);
    }
    //###############################
    // END - Card back transition   #
    //###############################

    this.removeBanner();
    this.removeButlerCardButtons();
    this.removeDateRangePicker();
    this.removeCustomFieldsButton();

    if (this.isLoomIntegrationEnabled) {
      this.removeCardRecordButton();
    }

    commentInputFocusedState.setValue(false);

    super.remove(...arguments);
  }

  onClose(event, sendShortcutEvent, editable) {
    if (editable) {
      this.archiveCard();
      event.preventDefault();
      sendShortcutEvent('archiveCardShortcut');
    }
  }

  onMoveToNextList(event, key, sendShortcutEvent, editable) {
    if (editable) {
      this.model.moveToNextList(key === Key.AngleRight ? 'top' : 'bottom');
      event.preventDefault();
      sendShortcutEvent('moveToNextListShortcut');
    }
  }

  onMoveToPrevList(event, key, sendShortcutEvent, editable) {
    if (editable) {
      this.model.moveToPrevList(key === Key.AngleLeft ? 'top' : 'bottom');
      event.preventDefault();
      sendShortcutEvent('moveToPreviousListShortcut');
    }
  }

  onSubscribe(event, sendShortcutEvent, loggedIn) {
    if (loggedIn && !isOnBoardTemplate) {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/subscribed',
        source: 'cardDetailScreen',
      });
      const subscribed = this.model.get('subscribed');
      this.model.subscribeWithTracing(
        !subscribed,
        traceId,
        tracingCallback(
          {
            taskName: 'edit-card/subscribed',
            source: 'cardDetailScreen',
            traceId,
          },
          (_err, response) => {
            if (response) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'subscribed',
                source: 'cardDetailScreen',
                containers: {
                  card: { id: response.id },
                  board: { id: response.idBoard },
                  list: { id: response.idList },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
      event.preventDefault();
      sendShortcutEvent('subscribeShortcut', {
        toggleValue: subscribed ? 'unsubscribe' : 'subscribe',
      });
    }
  }

  onJoin(event, board, sendShortcutEvent, editable) {
    if (
      editable &&
      !isOnBoardTemplate &&
      (board.hasActiveMembership(Auth.me()) ||
        board.isEditableByTeamMemberAndIsNotABoardMember())
    ) {
      if (board.isEditableByTeamMemberAndIsNotABoardMember()) {
        Alerts.show(
          'woohoo-you-are-now-a-member-of-this-board',
          'info',
          'join-board',
          4000,
        );

        board.optimisticJoinBoard();
      }

      const source = 'cardDetailScreen';
      const traceId = Analytics.startTask({
        taskName: 'edit-card/idMembers',
        source,
      });
      this.model.toggleMemberWithTracing(
        Auth.myId(),
        { traceId },
        tracingCallback(
          {
            taskName: 'edit-card/idMembers',
            traceId,
            source,
          },
          (_err, res) => {
            if (res) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'idMembers',
                source,
                containers: {
                  card: { id: this.model.id },
                  board: { id: this.model.get('idBoard') },
                  list: { id: this.model.get('idList') },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );

      event.preventDefault();
      sendShortcutEvent('assignSelfShortcut', {
        shortcutKey: 'Space',
        toggleValue: this.model.hasMember(Auth.myId()) ? 'add' : 'remove',
      });
    }
  }

  onShortcut = (event) => {
    let nextCard, prevCard;
    const board = this.model.getBoard();
    const editable = this.model.editable();
    const isTemplate = !!this.model.get('isTemplate');
    const loggedIn = Auth.isLoggedIn();
    isOnBoardTemplate = this.isOnBoardTemplate();
    const key = getKey(event);

    const sendShortcutEvent = (
      shortcutName,
      { shortcutKey = key, toggleValue } = {},
    ) => {
      Analytics.sendPressedShortcutEvent({
        shortcutName,
        source: 'cardDetailScreen',
        keyValue: shortcutKey,
        containers: this.model.getAnalyticsContainers(),
        attributes: {
          toggleValue:
            toggleValue !== undefined ? toggleValue.toLowerCase() : undefined,
        },
      });
    };

    switch (key) {
      case Key.Space: {
        this.throttledJoin(event, board, sendShortcutEvent, editable);
        return;
      }
      case Key.a:
      case Key.m:
        if (editable && !isOnBoardTemplate) {
          this.changeMembersSidebar();
          event.preventDefault();
          sendShortcutEvent('assignMembersShortcut');
        }
        return;

      case Key.e:
        if (editable) {
          this.descView.editDesc();
          event.preventDefault();
          sendShortcutEvent('editDescriptionShortcut');
        }
        return;

      case Key.l:
        if (editable) {
          this._openEditLabelsSidebar({ hideOnSelect: false });
          event.preventDefault();
          sendShortcutEvent('editLabelsShortcut');
        }
        return;

      case Key.d:
        if (editable && !isTemplate) {
          const seeDateRangePicker = seesVersionedVariation(
            'ecosystem.timeline-version',
            'stable',
          );
          if (seeDateRangePicker) {
            this.showDateRangePicker();
          } else {
            if (this.model.get('due') != null) {
              this.showDueDateBadgeMenu();
            } else {
              this.dueDateSidebar();
            }
          }
          event.preventDefault();
          sendShortcutEvent('dueDatesShortcut');
        }
        return;

      case Key.Dash:
        if (editable) {
          this.onChecklistShortcut();
          event.preventDefault();
          sendShortcutEvent('addChecklistShortcut');
        }
        return;

      case Key.c:
        this.throttledClose(event, sendShortcutEvent, editable);
        return;

      case Key.t:
        if (editable) {
          this.editTitle();
          event.preventDefault();
          sendShortcutEvent('editTitleShortcut');
        }
        return;

      case Key.AngleRight:
      case Key.Period:
        this.throttledMoveToNextList(event, key, sendShortcutEvent, editable);
        return;

      case Key.AngleLeft:
      case Key.Comma:
        this.throttledMoveToPrevList(event, key, sendShortcutEvent, editable);
        return;

      case Key.Zero:
      case Key.One:
      case Key.Two:
      case Key.Three:
      case Key.Four:
      case Key.Five:
      case Key.Six:
      case Key.Seven:
      case Key.Eight:
      case Key.Nine: {
        if (editable) {
          let hasUniqueLabel = true;
          const fxNoUniqueLabel = (color) => {
            hasUniqueLabel = false;
            return this._openEditLabelsSidebar({
              searchInit: color,
              hideOnSelect: true,
            });
          };
          LabelKeyHelper.setLabelFromKey(key, this.model, fxNoUniqueLabel);
          event.preventDefault();

          let toggleValue = 'showLabelsPopover';
          if (hasUniqueLabel) {
            const color = LabelKeyHelper.colorForKey(key);
            toggleValue = this.model.hasLabel(color) ? 'add' : 'remove';
          }
          sendShortcutEvent('toggleLabelShortcut', { toggleValue });
        }
        return;
      }

      case Key.v:
        if (!isTemplate && board.canVote(Auth.me())) {
          this.model.toggleVote();
          event.preventDefault();
          sendShortcutEvent('voteShortcut', {
            toggleValue: this.model.voted() ? 'vote' : 'unvote',
          });
        }
        return;

      case Key.s:
        this.throttledSubscribe(event, sendShortcutEvent, loggedIn);
        return;

      case Key.j:
      case Key.ArrowRight:
        if (
          !this.isOpenedOutsideOfBoardOfOrigin() &&
          (nextCard = this.model.nextCard()) != null
        ) {
          Controller.showCardDetail(nextCard, { isNavigating: true });
          event.preventDefault();
          sendShortcutEvent('moveDownShortcut');
        }
        return;

      case Key.k:
      case Key.ArrowLeft:
        if (
          !this.isOpenedOutsideOfBoardOfOrigin() &&
          (prevCard = this.model.prevCard()) != null
        ) {
          Controller.showCardDetail(prevCard, { isNavigating: true });
          event.preventDefault();
          sendShortcutEvent('moveUpShortcut');
        }
        return;

      case Key.z:
      case Key.Z:
        if (editable) {
          event.preventDefault();
          // Check shiftKey > Key.Z for consistency in case of caps lock.
          if (event.shiftKey) {
            redoAction({ source: 'cardDetailScreen', idCard: this.model.id });
            sendShortcutEvent('redoActionShortcut', {
              shortcutKey: 'Shift+Z',
            });
          } else {
            undoAction({ source: 'cardDetailScreen', idCard: this.model.id });
            sendShortcutEvent('undoActionShortcut');
          }
        }
        return;

      case Key.r:
        if (editable) {
          event.preventDefault();
          this.waitForId(this.model, () => {
            repeatAction({
              source: 'cardDetailScreen',
              idBoard: this.model.getBoard().id,
              idCard: this.model.id,
            });
            sendShortcutEvent('repeatActionShortcut');
          });
        }
        return;

      default:
        return;
    }
  };

  getData() {
    this.loading = true;
    this.$('.js-loading-card-actions').show();

    this.waitForId(this.model, () => {
      const limit = this.fShowAllActions
        ? this.maxActionLimit
        : this.defaultActionLimit;
      return Promise.try(() => {
        if (!Auth.isLoggedIn() || Auth.me().getShowDetails()) {
          return ModelLoader.loadCardDetails(this.model.id, limit);
        } else {
          return ModelLoader.loadCardHideDetails(this.model.id, limit);
        }
      })
        .finally(() => {
          this.loading = false;
          return this.$('.js-loading-card-actions').hide();
        })
        .then(() => {
          this.renderShowAllActionsButton();
          return this.scrollToHighlight();
        })
        .done();
    });
  }

  render() {
    this.rendered = true;
    this.fShowAllAttachments = false;
    this.fShowAllTrelloAttachments = false;
    this.fShowAllActions = false;
    const board = this.model.getBoard();

    const data = _.extend(this.model.toJSON(), {
      canComment: board.canComment(Auth.me()) && !this.isOnBoardTemplate(),
      isLoggedIn: Auth.isLoggedIn(),
      canToggleDetails: Auth.isLoggedIn(),
      hasAttachments: this.model.attachmentList.length > 0,
      me: Auth.me().toJSON(),
      loading: this.loading,
      editable: this.model.editable(),
      subscribeOnComment: Auth.me().isSubscribeOnCommentEnabled(),
      isOnBoardTemplate: this.isOnBoardTemplate(),
      isSubscribed:
        this.model.get('subscribed') ||
        __guard__(this.model.get('badges'), (x) => x.subscribed),
      hideVotes: !!__guard__(board.get('prefs'), (x1) => x1.hideVotes),
      viewingMemberVoted: __guard__(
        this.model.get('badges'),
        (x2) => x2.viewingMemberVoted,
      ),
      cardCoverChooserEnabled: board.getPref('cardCovers'),
      cardCoverIsAttachment: this.model.hasAttachmentCover(),
      isTemplate: !!this.model.get('isTemplate'),
      isMapCore: board.isMapCore(),
      isCustomFieldsCore: board.isCustomFieldsCore(),
      isCustomFieldsEnabled: board.isCustomFieldsEnabled(),
      fullCoverCardBackEnabled: this.isFullCoverCardBackEnabled(),
      canRecordVideo: this.isLoomIntegrationEnabled,
    });

    this.$el.html(cardDetailTemplate(data));

    this.actionListView.setElement(this.$('.js-list-actions')[0]);

    this.commentInput = this.$('.js-new-comment-input')[0];
    this.renderCover()
      .renderStickers()
      .renderName()
      .renderList()
      .renderActionList()
      .renderShowAllActionsButton()
      .renderMembers()
      .renderSuggestedActions()
      .renderArchived()
      .renderDelete()
      .renderChecklists()
      .renderCardTemplate()
      .renderSubscribe()
      .renderVotes()
      .renderDueDate()
      .renderStartDate()
      .renderAttachments()
      .renderLocation()
      .renderPluginSections()
      .renderAddAttachments()
      .renderAddChecklists()
      .renderLabels()
      .renderAging()
      .renderEditing()
      .renderCustomFieldBadges()
      .renderPluginBadges()
      .renderPluginButtons()
      .renderButlerCardButtons()
      .renderDateRangePickerButton()
      .renderCustomFieldsButton()
      .renderCustomFieldsBadges()
      .renderCustomFieldsDisabled()
      .renderCustomFieldsUpgradePrompt()
      .renderBanner()
      .renderCardRecordButton()
      .renderCopyCard();

    this.appendSubview(this.descView, this.$('.js-fill-card-detail-desc'));

    if (data.canComment) {
      this.recallDrafts();
    }

    _.defer(() => {
      this.$('.js-card-detail-title-input').autosize({ append: false });
      this.$('.js-new-comment-input').autosize({ append: false });
      return this.renderCommentControls();
    });

    Dates.update(this.el);

    return this;
  }

  getCard() {
    return this.model;
  }

  getTextInput() {
    return this.$('.js-new-comment-input');
  }

  getMentionTarget() {
    return this.$('.js-comment-mention-member:visible')[0];
  }

  getEmojiTarget() {
    return this.$('.js-comment-add-emoji:visible')[0];
  }

  closeDialog() {
    // This is called in response to the card being deleted or
    // moved to another board, and in either case we want to force the dialog
    // to close, even if it looks like we're in the middle of editing something.
    // Leaving the dialog open could result in operating on a card that has
    // been deleted or isn't fully loaded, and most attempts to edit it will
    // likely fail
    if (featureFlagClient.get('nusku.force-close-card-detail', false)) {
      return Dialog.hide(false, true);
    } else {
      return Dialog.hide();
    }
  }

  showMoreMenu(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: this.$('.js-more-menu'),
      view: CardDetailMoreMenuView,
      options: { model: this.model, modelCache: this.modelCache },
    });
  }

  renderList() {
    let left, left1;
    const list = this.model.getList();
    const board = this.model.getBoard();

    // It's possible that the list won't be loaded, if the card has been moved
    // to another board
    this.$('.js-current-list').html(
      cardDetailListTemplate({
        listName:
          (left = list != null ? list.get('name') : undefined) != null
            ? left
            : '…',
        showBoardName: this.isOpenedOutsideOfBoardOfOrigin(),
        boardName:
          (left1 = board != null ? board.get('name') : undefined) != null
            ? left1
            : '…',
        boardUrl: board != null ? board.get('shortUrl') : undefined,
        editable: this.model.editable(),
      }),
    );

    if (this.isFullCoverCardBackEnabled()) {
      let left2;
      this.$('.js-list-text').text(
        (left2 = list != null ? list.get('name') : undefined) != null
          ? left2
          : '…',
      );
    }

    return this;
  }

  expandDesc() {
    // For `showCardDetail` in card view
    return this.descView.expandDesc();
  }

  setOneTimeMessagesToDismiss(id) {
    return this._messagesToDismissOnClose.push(id);
  }

  renderBanner() {
    const board = this.model.getBoard();
    const org = board.getOrganization();
    const idOrg = org?.get('id');
    const isBC = org?.isBusinessClass();

    renderComponent(
      <CardBackBanner
        idCard={this.model.id}
        editable={this.model.editable()}
        idOrg={idOrg}
        setIdToDismiss={this.setOneTimeMessagesToDismiss}
        isBC={isBC}
      />,
      this.$('.js-card-banner')[0],
    );

    return this;
  }

  renderCustomFieldsUpgradePrompt() {
    const reactRoot = this.$('.js-card-back-custom-fields-prompt')[0];
    if (reactRoot) {
      renderComponent(
        <UpgradeSmartComponentConnected
          orgId={this.model.getBoard().getOrganization()?.id}
          promptId="customFieldsPromptPill"
        />,
        reactRoot,
      );
    }
    return this;
  }

  removeBanner() {
    if (this._messagesToDismissOnClose.length > 0) {
      //dismisses all oneTimeDismissedMessage ids stored in Array;
      //Currently sourced from CardBackBanner for remarkable.bc-trial-views-upsells
      this._messagesToDismissOnClose.forEach((bannerDismissId) =>
        Auth.me().dismiss(bannerDismissId),
      );
    }
    return ReactDOM.unmountComponentAtNode(this.$('.js-card-banner')[0]);
  }

  renderCardRecordButton() {
    if (
      this.isLoomIntegrationEnabled &&
      this.model.id != null &&
      this.$('.js-comment-record-button').length
    ) {
      renderComponent(
        <SpotlightLoomCommentButton>
          <LazyVideoRecordButton
            id={`card-comment-record-${this.model.id}`}
            insert={this.insertRecording}
            className="comment-box-record-button"
            analyticsSource="cardDetailScreen"
            analyticsContainers={{
              card: {
                id: this.model.id,
              },
              board: {
                id: this.model.getBoard()?.id,
              },
              enterprise: {
                id: this.model.getBoard()?.get('idEnterprise'),
              },
              organization: {
                id: this.model?.getBoard()?.getOrganization()?.id,
              },
            }}
          />
        </SpotlightLoomCommentButton>,
        this.$('.js-comment-record-button')[0],
      );
    }

    return this;
  }

  removeCardRecordButton() {
    if (this.$('.js-comment-record-button').length) {
      return ReactDOM.unmountComponentAtNode(
        this.$('.js-comment-record-button')[0],
      );
    }
  }

  removeButlerCardButtons() {
    const reactRoot = this.$('.js-butler-card-buttons')[0];
    if (reactRoot) {
      ReactDOM.unmountComponentAtNode(reactRoot);
    }
  }

  removeCustomFieldsButton() {
    const reactRoot = this.$('.js-custom-fields')[0];
    if (reactRoot) {
      ReactDOM.unmountComponentAtNode(reactRoot);
    }
  }
  removeDateRangePicker() {
    const reactRoot = this.$('.js-date-range-picker')[0];
    if (reactRoot) {
      ReactDOM.unmountComponentAtNode(reactRoot);
    }
  }

  // Comment functions
  keydownEvent(e) {
    // We're overriding keydownEvent from EditableView
    super.keydownEvent(...arguments);
    return Auth.me().editing({
      idBoard: this.model.getBoard().id,
      idCard: this.model.id,
      action: 'editing',
    });
  }

  clearEdits() {
    this._cancelEditing();
    return super.clearEdits(...arguments);
  }

  commitEdits() {
    this._cancelEditing();
    // to hide the 'Edit' button for the description field
    this.$('.card-detail-description .editing').removeClass('editing');
    return super.commitEdits(...arguments);
  }

  stopEditing() {
    this._cancelEditing();
    return super.stopEditing(...arguments);
  }

  recallDrafts() {
    const commentDraftText = TrelloStorage.get(this._commentDraftKey());
    if (commentDraftText) {
      this.$('.js-new-comment-input').val(commentDraftText);
    }
    this.renderCommentSubmitAbility();
    return super.recallDrafts(...arguments);
  }

  isFullCoverCardBackEnabled() {
    if (this.fullCoverCardBackEnabled == null) {
      this.fullCoverCardBackEnabled = featureFlagClient.get(
        'remarkable.full-cover-cardback',
        false,
      );
    }
    return this.fullCoverCardBackEnabled;
  }
}
CardDetailView.initClass();

_.extend(
  CardDetailView.prototype,
  AutoInsertionView,
  CompleterUtil,
  CardViewHelpers,
);

module.exports = CardDetailView;
