/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
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
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const AutoInsertionView = require('app/scripts/views/internal/autocomplete/auto-insertion-view');
const CompleterUtil = require('app/scripts/views/internal/autocomplete/completer-util');
const EditableView = require('app/scripts/views/internal/editable-view');
const FormattingHelpView = require('app/scripts/views/card/formatting-help-view');
const Layout = require('app/scripts/views/lib/layout');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const AttachmentViewer = require('app/scripts/views/internal/attachment-viewer');
const TFM = require('app/scripts/lib/markdown/tfm');
const { Util } = require('app/scripts/lib/util');
const friendlyLinks = require('app/scripts/views/internal/friendly-links');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');
const template = require('app/scripts/views/templates/description');
const { getKey, Key, isForceSubmitEvent } = require('@trello/keybindings');
const {
  applyMarkdownShortcuts,
} = require('app/scripts/views/lib/markdown-transform');

class DescriptionView extends EditableView {
  static initClass() {
    this.prototype.events = {
      'click .js-format-help': 'openFormatHelp',
      'click .js-edit-desc': 'editDesc',
      'click .js-edit-desc-button'() {
        return Analytics.sendClickedButtonEvent({
          buttonName: 'editDescriptionButton',
          source: this.source,
          containers: {
            board: { id: this.board != null ? this.board.id : undefined },
            card: { id: this.card != null ? this.card.id : undefined },
          },
        });
      },

      'keydown .field'(e) {
        // Override the default keydown handler for EditableView (if we don't, it
        // will close PopOvers before we have a chance to check if one is open)
        //
        // (Handle Esc on keydown instead of keyup because we won't get a keydown
        // event if the Esc happened while an IME was open)

        // Discard the draft before saving on force submit
        // Otherwise, the component is rendered before the draft is discarded
        // in the async callback, thus re-saving the draft
        if (isForceSubmitEvent(e)) {
          this.recordCardAction();
          this._discardDraft('desc');
        }

        applyMarkdownShortcuts(e);

        if (getKey(e) === Key.Escape) {
          Util.stop(e);

          if (AttachmentViewer.isActive()) {
            AttachmentViewer.clear();
            return;
          }

          if (PopOver.isVisible) {
            PopOver.hide();
            return;
          }

          // Save the drafts and put the model desc back in the draft
          // to prevent it from autosaving
          this.saveDrafts();
          this.$('.js-description-draft').val(this.model.get('desc'));

          Analytics.sendPressedShortcutEvent({
            shortcutName: 'escapeShortcut',
            keyValue: 'esc',
            source: this.source,
            containers: {
              board: { id: this.board != null ? this.board.id : undefined },
              card: { id: this.card != null ? this.card.id : undefined },
            },
            attributes: {
              whileEditingDescription: true,
            },
          });

          // Usually render fires on changes to the description, but we're
          // putting the model desc back in the description (see above) to
          // prevent the autosave. To show the "unsaved edits" dialog, we
          // have to call render here
          this.render();
          return;
        }
      },

      'keyup .field'(e) {
        if (getKey(e) === Key.Escape) {
          // Don't let the keyup propagate; we want to handle PopOvers differently;
          // (we wait until keydown so we won't cancel editing if a PopOver is open)
          Util.stop(e);
        }

        return this.keyAutoMention(e);
      },

      'click .js-cancel-edit'(e) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'cancelEditDescriptionButton',
          source: this.source,
          containers: {
            board: { id: this.board != null ? this.board.id : undefined },
            card: { id: this.card != null ? this.card.id : undefined },
          },
        });

        return this.cancelEditDesc(e, 'by clicking on cancel button');
      },
      'click .js-desc-content.is-hide-full'() {
        Analytics.sendClickedButtonEvent({
          buttonName: 'showFullDescriptionButton',
          source: this.source,
          containers: {
            board: { id: this.board != null ? this.board.id : undefined },
            card: { id: this.card != null ? this.card.id : undefined },
          },
        });

        return this.showFullDescription();
      },
    };
  }

  initialize({ board, card, maxDescLength, placeholderKey, source }) {
    this.board = board;
    this.card = card;
    this.maxDescLength = maxDescLength;
    this.placeholderKey = placeholderKey;
    this.source = source;
    super.initialize(...arguments);

    this.hideFullDescription =
      __guard__(this.model.get('desc'), (x) => x.length) > this.maxDescLength;
    this.descType = `${this.model.typeName.toLowerCase()} description`;

    this.makeDebouncedMethods('render');

    this.listenTo(Layout, this.getAutosaveEvent(), this.onAutosaveEdit);
    return this.listenTo(this.model, 'change:desc', this.renderDebounced);
  }

  render() {
    const data = {};
    data.editable = this.model.editable();
    data.isCardDesc = this.model.typeName === 'Card';
    data.placeholderKey = this.placeholderKey;
    data.isTemplate = data.isCardDesc
      ? this.model.isOnBoardTemplate()
      : this.model.isTemplate();

    this.$el.html(template(data));

    const desc = this.model.get('desc');

    const descHtml = TFM.description.format(desc != null ? desc : '', {
      textData: this.model.get('descData'),
    }).output;
    const $desc = this.$('.js-desc');
    $desc.empty().append(descHtml).data('unmarkeddown', desc);
    $desc.find('p').attr('dir', 'auto');
    friendlyLinks($desc[0], this.board, {
      analyticsContext: {
        source: this.source,
        containers: this.model?.getAnalyticsContainers?.(),
        attributes: {
          fromSection: 'description',
        },
      },
    });

    const hasDesc = !/^\s*$/.test(descHtml);
    this.$('.js-show-with-desc').toggleClass('hide', !hasDesc);
    this.$('.js-hide-with-desc').toggleClass('hide', hasDesc);

    const descriptionDraft =
      __guard__(this.$('.js-description-draft').val(), (x) => x.length) > 0;
    this.$('.js-description-draft').addClass(
      this.descType.split(' ').join('-'),
    );
    this.$('.js-hide-with-draft').toggleClass('hide', descriptionDraft);
    this.$('.js-desc-content').toggleClass(
      'is-hide-full',
      this.hideFullDescription,
    );

    this.renderFormattingButton();
    this.recallDrafts();

    return this;
  }

  showFullDescription() {
    this.hideFullDescription = false;
    this.$('.js-desc-content').removeClass('is-hide-full');
  }

  editDesc(e) {
    Util.stop(e);
    this.showFullDescription();
    this.edit('desc');
  }

  cancelEditDesc(e, method) {
    const fromEscape = method.includes('escape key');
    Analytics.sendTrackEvent({
      action: 'cancelled',
      actionSubject: 'descriptionEdit',
      source: this.source,
      containers: {
        board: { id: this.board != null ? this.board.id : undefined },
        card: { id: this.card != null ? this.card.id : undefined },
      },
      attributes: {
        method: fromEscape ? 'escapeKey' : 'cancelEditDescriptionButton',
      },
    });

    return this.clearEdits(e);
  }

  expandDesc(e) {
    Util.stop(e);
    this.showFullDescription();
    this.edit('desc', false);
  }

  renderFormattingButton() {
    const localizedText = l(['view title', 'formatting help']);
    // Wrap button with longer button text only on board sidebar, where there's less horizontal space
    const wrapButton =
      this.descType === 'board description' && localizedText.length > 20;
    this.$('.description-edit').toggleClass('long', wrapButton);
    return this.$('.description-edit .helper').toggleClass('long', wrapButton);
  }

  openFormatHelp(e) {
    Analytics.sendClickedButtonEvent({
      buttonName: 'formattingHelpDescriptionButton',
      source: this.source,
      containers: {
        board: { id: this.board != null ? this.board.id : undefined },
        card: { id: this.card != null ? this.card.id : undefined },
      },
    });
    PopOver.toggle({
      elem: this.$('.js-format-help'),
      view: FormattingHelpView,
      options: { model: this.model, modelCache: this.modelCache },
      keepEdits: true,
    });
    return false;
  }

  // Autosave

  getAutosaveEvent() {
    return `autosave${this.model.typeName}Description`;
  }

  onAutosaveEdit($target) {
    this.hideFullDescription = false;
    return this.commitEdits(null, $target);
  }

  commitEdits() {
    const isEditing = this.$('.description-title .editing').length;
    if (isEditing) {
      // Validate current input before removing "editing" class
      if (!this.validate()) {
        return;
      }

      Auth.me().editing({ idBoard: this.board.id });
      // Show 'Edit' button upon saving description
      this.$('.description-title .editing').removeClass('editing');

      if (!this.card && this.board) {
        Analytics.sendUpdatedBoardFieldEvent({
          field: 'description',
          source: this.source,
          containers: {
            board: { id: this.board != null ? this.board.id : undefined },
            card: { id: this.card != null ? this.card.id : undefined },
          },
        });
      } else {
        this.recordCardAction();
      }

      // Discard the draft before autosaving
      // Otherwise, the component is rendered before the draft is discarded
      // in the async callback, thus re-saving the draft
      this._discardDraft('desc');

      return super.commitEdits(...arguments);
    }
  }

  recordCardAction() {
    if (this.model.typeName !== 'Card') {
      return;
    }
    const description = this.$('.js-description-draft').val();
    const previousDescription = this.model.get('desc');
    if (previousDescription !== description) {
      this.model.recordAction({
        type: 'update-description',
        description,
        previousDescription,
      });
    }
  }

  // Auto Completer

  getTextInput() {
    const descInput = this.$('.js-description-draft:visible');
    if (descInput.length) {
      return descInput;
    }
  }

  getMentionTarget() {
    const descInput = this.$('.js-description-draft:visible');
    if (descInput.length) {
      return descInput[0];
    }
  }

  getEmojiTarget() {
    const descInput = this.$('.js-description-draft:visible');
    if (descInput.length) {
      return descInput[0];
    }
  }
}
DescriptionView.initClass();

_.extend(DescriptionView.prototype, AutoInsertionView, CompleterUtil);

module.exports = DescriptionView;
function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
