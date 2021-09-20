/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const CardLabelSelectView = require('app/scripts/views/label/card-label-select-view');
const CardMemberSelectView = require('app/scripts/views/card/card-member-select-view');
const CardMoveView = require('app/scripts/views/card/card-move-view');
const CardViewHelpers = require('./card-view-helpers');
const CardViewMixins = require('./card-view-mixins');
const DatePickerView = require('app/scripts/views/card/date-picker-view');
const {
  getKey,
  Key,
  registerShortcutHandler,
  Scope,
  unregisterShortcutHandler,
} = require('@trello/keybindings');
const { forTemplate } = require('@trello/i18n');
const {
  LazyDateRangePicker,
} = require('app/src/components/DateRangePicker/LazyDateRangePicker');
const { defaultRouter } = require('app/src/router');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const StickerEditView = require('app/scripts/views/stickers/sticker-edit-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { track } = require('@trello/analytics');
const { seesVersionedVariation } = require('@trello/feature-flag-client');
const {
  trackSeparator,
} = require('app/scripts/views/card/SeparatorCard/SeparatorCard');
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { ConvertCardRoleButton } = require('app/src/components/QuickCardEditor');
const {
  renderDueComplete,
} = require('app/scripts/views/card/card-view-plugins');
const { Urls } = require('app/scripts/controller/urls');
const { getCardUrl } = Urls;
const {
  toggleCardCoverChooserPopover,
} = require('app/scripts/views/card/card-cover-chooser-popover.tsx');
// TODO: Remove feature flag after successful deploy according to https://trello.com/c/VGE8H3ka/392-remove-feature-flag-for-copy-cards-date-tbd
const CardCopyViewDeprecated = require('app/scripts/views/card/card-copy-view-deprecated');
const CardCopyViewUpdated = require('app/scripts/views/card/card-copy-view');
const { featureFlagClient } = require('@trello/feature-flag-client');

const format = forTemplate('due_date_picker');

function onTracedUpdate(opts) {
  const { traceId, taskName, field } = opts;
  return (err, card) => {
    if (err) {
      throw Analytics.taskFailed({
        taskName,
        traceId,
        source: 'quickCardEditorInlineDialog',
        error: err,
      });
    } else {
      Analytics.sendUpdatedCardFieldEvent({
        field,
        source: 'quickCardEditorInlineDialog',
        containers: {
          card: { id: card.id },
          board: { id: card.idBoard },
          list: { id: card.idList },
        },
        attributes: {
          taskId: traceId,
        },
      });
      Analytics.taskSucceeded({
        taskName,
        traceId,
        source: 'quickCardEditorInlineDialog',
      });
    }
  };
}

class QuickCardEditorView extends View {
  static initClass() {
    this.prototype.className = 'quick-card-editor';
    this.prototype.isMouseDownOnOverlay = false;

    this.prototype.renderDueComplete = renderDueComplete;

    this.prototype.events = {
      'keydown .js-edit-card-title': 'quickCardEditKeydown',
      'click .js-save-edits': 'saveEdits',

      'click .js-stop': 'stopCard',

      'click .js-edit-labels': 'editLabels',
      'click .js-edit-members': 'editMembers',
      'click .js-edit-cover': 'editCover',
      'click .js-move-card': 'moveCard',
      'click .js-copy-card': 'copyCard',
      'click .js-edit-due-date': 'editDueDate',
      'click .js-archive': 'archive',
      'click .js-due-date-badge': 'toggleDueDateComplete',

      click: 'checkCloseEditor',
      'click .js-close-editor': 'closeEditor',

      mousedown: 'mousedownOnOverlay',
    };
  }

  constructor(options) {
    super(options);
    this.onShortcut = this.onShortcut.bind(this);
    registerShortcutHandler(this.onShortcut, { scope: Scope.Overlay });
  }

  static open(cardView) {
    this.close();

    const { $el } = cardView;
    const offset = $el.offset();

    const opts = {
      width: $el.width(),
      left: offset.left,
      top: offset.top,
      onMap: cardView.onMap,
    };

    Analytics.sendScreenEvent({
      name: 'quickCardEditorInlineDialog',
      attributes: {
        view: getScreenFromUrl(),
      },
    });

    return (this.current = new QuickCardEditorView({
      model: cardView.model,
      modelCache: cardView.modelCache,
      onRemove: () => {
        this.current = null;
      },
    }).render(opts));
  }

  static close() {
    if (this.current != null) {
      this.current.closeEditor();
    }
    return (this.current = null);
  }

  initialize() {
    this.makeDebouncedMethods(
      'render',
      'renderStickers',
      'renderLabels',
      'renderCover',
      'renderBadges',
      'updateBadges',
      'rerender',
    );

    // We need to subscribe this onRouteChanged function to the router
    // so we would know when a user is navigating away from the page
    // where this was initialized. Otherwise the quick editor would
    // still be open regardless of the page the user navigates to.
    //
    // Specifically if they come to the board from the board list.
    // Without this subscription, after they hit the back button
    // the quick editor would sit on top of the board list page.
    this.unsubscribeFromRouter = defaultRouter.subscribe(
      this.onRouteChanged.bind(this),
    );
    this.routeWhenOpened = defaultRouter.getRoute().routePath;

    this.listenTo(this.model, {
      'change:labels': this.renderLabelsDebounced,
      'change:idLabels': this.renderLabelsDebounced,
      'change:idAttachmentCover': this.renderCoverDebounced,
      'change:cover': this.renderCoverDebounced,
      'change:dueComplete': this.renderDueComplete,
      'change:due change:subscribed change:isTemplate': this
        .renderBadgesDebounced,
      'change:badges': this.updateBadgesDebounced,
      'change:cardRole': this.rerenderDebounced,
    });

    this.listenTo(this.model.labelList, 'add remove reset change', () => {
      return this.renderLabelsDebounced();
    });

    this.listenTo(
      this.model.memberList,
      'add remove reset',
      this.frameDebounce(this.renderMembers),
    );

    return this.listenTo(
      this.model.stickerList,
      'add remove reset change sort',
      function () {
        return this.renderStickersDebounced();
      },
    );
  }

  shouldRenderFullCover() {
    return false;
  }

  onRouteChanged(routeContext) {
    // Backbone will fire this function once when the editor is opened
    // this conditional is here just to prevent the editor from instantly closing.
    if (routeContext.routePath !== this.routeWhenOpened) {
      return this.closeEditor();
    }
  }

  remove() {
    this.unsubscribeFromRouter();
    unregisterShortcutHandler(this.onShortcut);
    this.options.onRemove?.();
    return super.remove(...arguments);
  }

  showCover() {
    return this.model.getBoard().getPref('cardCovers') && this.model.hasCover();
  }

  showStickers() {
    return true;
  }

  onShortcut(event) {
    switch (getKey(event)) {
      case Key.Escape:
        this.closeEditor();
        track(
          'Keyboard Shortcuts',
          'Esc - Close Quick Card Editor',
          'Quick Card Editor',
        );
        return event.preventDefault();

      case Key.Enter:
        this.saveEdits();
        track(
          'Keyboard Shortcuts',
          'Enter - Save Quick Card Edits',
          'Quick Card Editor',
        );
        return event.preventDefault();

      default:
        break;
    }
  }

  render(opts) {
    this.opts = opts;

    const data = this.model.toJSON();
    data.labels = this.model.getLabels();
    data.showCover = this.showCover();
    data.hasStickers = this.model.hasStickers();
    data.cardUrl = getCardUrl(this.model);
    data.quickEdit = true;
    data.members = [];
    data.isTemplate = this.model.isOnBoardTemplate();
    data.isCardTemplate = !!this.model.get('isTemplate');
    data.cardRole = this.model.getCardRole();

    // gotta position this thing
    data.left = this.cLeft = opts.left;
    data.top = this.cTop = opts.top;
    data.width = this.cWidth = opts.width;
    // 160 is the width of the controls, which are absolutely positioned
    const cRight = this.cWidth + this.cLeft + 160;
    const wWidth = $(window).width();

    // completely cover card on map
    if (opts.onMap) {
      data.top = data.top - 20;
    }

    if (cRight > wWidth) {
      data.leftButtons = true;
      this._usingLeftButtons = true;
    }

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/quick_card_editor'),
        data,
        {},
      ),
    );

    this.renderStickers()
      .renderCover()
      .renderLabels()
      .renderBadges()
      .renderMembers()
      .checkShowCover();

    this.renderDueComplete();

    // view.remove() removes the editor from# the DOM, which happens every time
    // we close the editor, so this is okay.
    $('#chrome-container').append(this.$el);

    this.calcHeight();

    this.focusInput();

    this.defer(() => {
      return this.$('.quick-card-editor-buttons').addClass('fade-in');
    });

    this.$('.js-edit-card-title').autosize();

    renderComponent(
      React.createElement(ConvertCardRoleButton, {
        idCard: this.model.get('id'),
        onLoad: () => this.calcHeight(),
        analyticsContainers: this.model.getAnalyticsContainers(),
      }),
      this.$('#convert-card-role-button-react-root')[0],
    );

    return this;
  }

  rerender() {
    this.render(this.opts);
  }

  calcHeight() {
    let top;
    const wHeight = $(window).height();

    // Might overflow the window height so lets make sure that doesn't happen.
    // This needs to happen here because it's in the DOM now and the
    // calculations will be right.
    const cHeight = this.$('.quick-card-editor-card').outerHeight();
    if (this.cTop + cHeight > wHeight) {
      top = wHeight - cHeight - 8;
      this.$('.quick-card-editor-card').css({ top });
    }

    const $buttons = this.$('.quick-card-editor-buttons');
    const bHeight = $buttons.outerHeight();
    const bOffset = $buttons.offset();

    if (bHeight + bOffset.top > wHeight) {
      $buttons.css({ top: cHeight - bHeight });
    }
  }

  renderStickers() {
    // Don't re-render the stickers if we contain something that's in
    // the middle of an edit
    if (this.$('.sticker.moving, .sticker.rotating').length > 0) {
      return this;
    }

    const $stickers = this.$('.js-card-stickers').empty();
    const subviews = Array.from(this.model.stickerList.models).map((sticker) =>
      this.subview(StickerEditView, sticker, { card: this.model }),
    );
    this.appendSubviews(subviews, $stickers);

    this.$('.list-card').toggleClass('is-stickered', this.model.hasStickers());

    return this;
  }

  checkShowCover() {
    this.$('.list-card')
      .toggleClass('is-covered', this.showCover())
      .toggleClass('is-stickered', this.model.hasStickers());

    return this;
  }

  focusInput() {
    return this.$('.js-edit-card-title').focus().select();
  }

  showPopOver(e, viewClass, trackStr, opts) {
    if (opts == null) {
      opts = {};
    }
    Util.stop(e);

    PopOver.toggle({
      elem: $(e.target).closest('a'),
      view: new viewClass(
        _.extend({ model: this.model, modelCache: this.modelCache }, opts),
      ),
      alignRight: this._usingLeftButtons,
    });

    track('Quick Card Editor', trackStr, undefined, this.model.trackProperty());
  }

  showDateRangePicker(e) {
    const elem = this.$('.js-card-menu');
    if (elem) {
      return PopOver.toggle({
        elem: $(e.target).closest('a'),
        getViewTitle: () => format('dates'),
        keepEdits: true,
        reactElement: React.createElement(LazyDateRangePicker, {
          due: this.model.get('due'),
          start: this.model.get('start'),
          dueReminder: this.model.get('dueReminder'),
          hidePopover: () => PopOver.hide(),
          idCard: this.model.id,
          idBoard: this.model.getBoard()?.id,
          idOrg: this.model.getBoard()?.get('idOrganization'),
        }),
      });
    }
  }

  editLabels(e) {
    return this.showPopOver(e, CardLabelSelectView, 'Open Label Edit');
  }

  editMembers(e) {
    return this.showPopOver(e, CardMemberSelectView, 'Open Member Edit');
  }

  editCover(e) {
    toggleCardCoverChooserPopover({
      elem: this.$(e.currentTarget),
      cardId: this.model.id,
    });
  }

  copyCard(e) {
    // TODO: Remove feature flag after successful deploy according to https://trello.com/c/VGE8H3ka/392-remove-feature-flag-for-copy-cards-date-tbd
    const isUpdatedCopyViewEnabled = featureFlagClient.get(
      'enterprise.allow-enterprise-users-to-copy-enterprise-cards',
      false,
    );
    const CardCopyView = isUpdatedCopyViewEnabled
      ? CardCopyViewUpdated
      : CardCopyViewDeprecated;
    return this.showPopOver(e, CardCopyView, 'Open Copy Card', {
      onCopy: this.closeEditor.bind(this),
    });
  }

  editDueDate(e) {
    const seeDateRangePicker = seesVersionedVariation(
      'ecosystem.timeline-version',
      'stable',
    );

    if (seeDateRangePicker) {
      this.showDateRangePicker(e);
    } else {
      this.showPopOver(e, DatePickerView, 'Open Due Date Edit', {
        trackingCategory: 'quick card editor',
      });
    }
  }

  moveCard(e) {
    const onCommit = this.closeEditor.bind(this);
    return this.showPopOver(e, CardMoveView, 'Open Move Card', { onCommit });
  }

  archive(e) {
    Util.stop(e);

    const traceId = Analytics.startTask({
      taskName: 'edit-card/closed',
      source: 'quickCardEditorInlineDialog',
    });

    this.model.close(
      traceId,
      onTracedUpdate({
        traceId,
        taskName: 'edit-card/closed',
        field: 'closed',
      }),
    );

    this.closeEditor();

    track(
      'Quick Card Editor',
      'Archive',
      undefined,
      this.model.trackProperty(),
    );
  }

  quickCardEditKeydown(e) {
    if (getKey(e) === Key.Enter) {
      return this.saveEdits(e);
    }
  }

  saveEdits(e) {
    Util.stop(e);

    const val = this.$('.js-edit-card-title').val().trim();
    const currentVal = this.model.get('name');

    if (val === currentVal) {
      this.closeEditor();
    } else if (val !== '') {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/name',
        source: 'quickCardEditorInlineDialog',
      });
      this.model.recordAction({
        type: 'rename',
        name: val,
        previousName: currentVal,
      });
      this.model.update(
        { name: val, traceId: traceId },
        onTracedUpdate({ traceId, taskName: 'edit-card/name', field: 'name' }),
      );
      this.closeEditor();
      track(
        'Quick Card Editor',
        'Save Name',
        undefined,
        this.model.trackProperty(),
      );
      trackSeparator(val, {
        category: 'quick card editor',
        method: 'by editing name',
      });
    } else {
      this.$('.js-edit-card-title').focus().select();
    }
  }

  mousedownOnOverlay(e) {
    this.isMouseDownOnOverlay = e.target === this.$el[0];
  }

  checkCloseEditor(e) {
    if (this.isMouseDownOnOverlay) {
      this.isMouseDownOnOverlay = false;

      if (PopOver.isVisible) {
        PopOver.hide();
      } else if (this.$('.sticker.editing').length > 0) {
        this.stopEditingStickers();
      } else {
        this.closeEditor(e);
      }
    }
  }

  closeEditor(e) {
    this.remove();
    PopOver.hide();
    track('Quick Card Editor', 'Close', undefined, this.model.trackProperty());
  }

  stopEditingStickers() {
    for (const sticker of Array.from(_.clone(this.model.stickerList.models))) {
      sticker.trigger('stopEditing');
    }
  }

  stopCard(e) {
    Util.stopPropagation(e);
    PopOver.hide();
  }
}
QuickCardEditorView.initClass();

_.extend(QuickCardEditorView.prototype, CardViewMixins, CardViewHelpers);

module.exports = QuickCardEditorView;
