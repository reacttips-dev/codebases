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
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const $ = require('jquery');
const { ActionView, events } = require('app/scripts/views/action/action-view');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const AutoInsertionView = require('app/scripts/views/internal/autocomplete/auto-insertion-view');
const CardAttachLinksView = require('app/scripts/views/card/attach-links-view');
const CompleterUtil = require('app/scripts/views/internal/autocomplete/completer-util');
const Confirm = require('app/scripts/views/lib/confirm');
const { getKey, isForceSubmitEvent, Key } = require('@trello/keybindings');
const Layout = require('app/scripts/views/lib/layout');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const AttachmentViewer = require('app/scripts/views/internal/attachment-viewer');
const { TrelloStorage } = require('@trello/storage');
const TFM = require('app/scripts/lib/markdown/tfm');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const f = require('effing');
const {
  linksFromMarkdown,
} = require('app/scripts/lib/util/text/links-from-markdown');
const { track } = require('@trello/analytics');
const LengthCheckingMixin = require('app/scripts/views/internal/disable-submit-if-length-too-long');
const {
  applyMarkdownShortcuts,
} = require('app/scripts/views/lib/markdown-transform');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  LazyVideoRecordButton,
} = require('app/src/components/VideoRecordButton');

class CommentActionView extends ActionView {
  static initClass() {
    this.prototype.events = {
      ...events,
      'click .js-confirm-delete-action': 'confirmDeleteAction',
      'click .js-edit-action': 'editAction',
      'click .js-discard-comment-edits': 'cancelEdit',
      'click .js-save-edit': 'saveEdit',
      'keyup .js-text': 'keyAutoMention',
      'keydown .js-text': 'keydownJsText',
      'input .js-text': 'checkLength',
      'mutated .js-text': 'mutatedEvent',

      'click .js-comment-add-attachment': 'commentAddAttachment',
      'click .js-comment-mention-member': 'commentMentionMember',
      'click .js-comment-add-emoji': 'commentAddEmoji',
      'click .js-comment-add-card': 'commentAddCard',
      'click .js-attach-link': 'attachLink',
    };
  }

  constructor(options) {
    super(options);

    this.insertRecording = this.insertRecording.bind(this);
  }

  initialize() {
    super.initialize(...arguments);

    const context = this.getContext();
    this.canRecordVideo = context.canRecordVideo;

    return $(window).on(
      `beforeunload.CommentActionView-${this.model.cid}`,
      f(this, 'saveDraft'),
    );
  }

  remove() {
    this.saveDraft();
    if (this.canRecordVideo) {
      this.removeCardRecordButton();
    }
    $(window).off(`.CommentActionView-${this.model.cid}`);
    super.remove(...arguments);
  }

  mutatedEvent(e) {
    this.checkLength(e);
    this.getTextInput().trigger('autosize.resize');
  }

  potentialAttachments() {
    const card = this.model.getCard();
    return _.filter(
      linksFromMarkdown(this.model.get('data').text, TFM.comments),
      function ({ url }) {
        // Don't include URLs that are not allowed by the enterprise
        if (card.attachmentUrlRestricted(url)) {
          return false;
        }

        // Don't include things that have already been attached
        return !card.attachmentList.any(
          (attachment) => attachment.get('url') === url,
        );
      },
    );
  }

  getContext() {
    const data = super.getContext(...arguments);
    const card = this.model.getCard();
    // It's possible that comment is for a card that isn't currently cached, in
    // which case we can't attach a link to it
    data.canAttachLink =
      card != null && card.editable() && this.potentialAttachments().length > 0;
    return data;
  }

  confirmDeleteAction(e) {
    Util.stop(e);

    Confirm.toggle('delete comment', {
      elem: $(e.target).closest('.js-confirm-delete-action')[0],
      model: this.model,
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: () => {
        const traceId = Analytics.startTask({
          taskName: 'delete-comment',
          source: 'cardDetailScreen',
        });
        track('Card', 'Delete Comment');
        return this.model.destroyWithTracing(
          {
            traceId,
          },
          tracingCallback(
            {
              taskName: 'delete-comment',
              traceId,
              source: 'cardDetailScreen',
            },
            (err) => {
              if (!err) {
                Analytics.sendTrackEvent({
                  action: 'deleted',
                  actionSubject: 'comment',
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

  getTextInput() {
    return this.$('.js-text');
  }

  getMentionTarget() {
    return this.$('.js-comment-mention-member:visible')[0];
  }

  getEmojiTarget() {
    return this.$('.js-comment-add-emoji:visible')[0];
  }

  editAction(e) {
    Util.stop(e);
    if (this.$el.hasClass('is-editing')) {
      return;
    }
    this.$el.addClass('is-editing');
    this.$('textarea').focus().select();
    return this.openEditView();
  }

  openEditView() {
    this.$('.js-text').attr('placeholder', '').autosize({ append: false });
  }

  keydownJsText(e) {
    applyMarkdownShortcuts(e);

    if (isForceSubmitEvent(e)) {
      return this.saveEdit(e);
    } else if (getKey(e) === Key.Escape) {
      Util.stop(e);

      if (AttachmentViewer.isActive()) {
        AttachmentViewer.clear();
        return;
      }

      return this.cancelEdit();
    } else {
      return this.checkInsert(e);
    }
  }

  saveEdit(e) {
    if (
      !(
        e.type !== 'keypress' ||
        // If they pressed ctrl+enter, then that's always a submit
        isForceSubmitEvent(e) ||
        // If they pressed enter, and they aren't on a multi-line textarea, that's also a submit
        (getKey(e) === Key.Enter &&
          (!$(e.target).is('textarea') ||
            $(e.currentTarget).hasClass('single-line')))
      )
    ) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-comment',
      source: 'cardDetailScreen',
    });

    Util.stop(e);
    const newValue = this.$('.js-text').val();

    this.$('.js-spinner').show();
    this.$('.js-hide-on-sending').hide();

    this.$('.current-comment').text(newValue);
    Layout.cancelEdit(this.$el);
    this.discardDraft();

    // So that we don't have to wait for the roundtrip to display the
    // new text, which would be very scary for users.
    this.model.get('display').entities.comment.text = newValue;
    const data = {
      text: newValue,
      traceId,
    };
    this.model.update(
      data,
      tracingCallback(
        {
          taskName: 'edit-comment',
          source: 'cardDetailScreen',
          traceId,
        },
        (err, response) => {
          if (!err && response) {
            Analytics.sendTrackEvent({
              action: 'updated',
              actionSubject: 'comment',
              source: 'cardDetailScreen',
              containers: {
                card: { id: response.data?.card?.id },
                board: { id: response.data?.board?.id },
                list: { id: response.data?.list?.id },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      ),
    );

    this.$('.js-text').trigger('autosize.destroy');

    PopOver.hide();

    track('Card', 'Edit Comment');
  }

  showError(e) {}

  cancelEdit() {
    const prevComment = this.model.get('data').text;
    this.$('.js-text').val(prevComment);
    Layout.cancelEdit(this.$el);
    this.discardDraft();
    this.$('.js-text').trigger('autosize.destroy');
  }

  getCard() {
    return this.model.getCard();
  }

  attachLink(e) {
    Util.stop(e);

    track('Card', 'Open Attach Links View');
    const links = this.potentialAttachments();
    return PopOver.toggle({
      elem: $(e.currentTarget),
      view: new CardAttachLinksView({
        model: this.getCard(),
        modelCache: this.modelCache,
        links,
      }),
    });
  }

  render() {
    super.render(...arguments);
    this.recallDraft();

    if (this.canRecordVideo) {
      this.renderCardRecordButton();
    }

    return this;
  }

  _draftKey() {
    return `draft_${this.model.id}_edit`;
  }

  recallDraft() {
    const draftText = TrelloStorage.get(this._draftKey());
    if (draftText) {
      this.getTextInput().val(draftText);
      return this.$el.find('.edits-warning').show();
    }
  }

  saveDraft() {
    if (this.$el.hasClass('is-editing')) {
      const text = this.getTextInput().val();

      if (text && text !== this.model.get('data').text) {
        TrelloStorage.set(this._draftKey(), text);
        this.$el.find('.edits-warning').show();
      } else {
        this.discardDraft();
      }
    }
  }

  discardDraft() {
    TrelloStorage.unset(this._draftKey());
    return this.$el.find('.edits-warning').hide();
  }

  renderCardRecordButton() {
    if (this.model.id != null && this.$('.js-comment-record-button').length) {
      renderComponent(
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
        />,
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
}
CommentActionView.initClass();

_.extend(
  CommentActionView.prototype,
  AutoInsertionView,
  CompleterUtil,
  LengthCheckingMixin,
);

module.exports = CommentActionView;
