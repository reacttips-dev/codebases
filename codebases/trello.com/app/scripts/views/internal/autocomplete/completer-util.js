/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const AttachmentTypePickerView = require('app/scripts/views/card/attachment-type-picker-view');
const AutoMentionerView = require('app/scripts/views/internal/autocomplete/auto-mentioner-view');
const EmojiCompleterView = require('app/scripts/views/internal/autocomplete/emoji-completer-view');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const TrelloCompleterView = require('app/scripts/views/internal/autocomplete/trello-completer-view');
const { Util } = require('app/scripts/lib/util');
const { Analytics } = require('@trello/atlassian-analytics');
const Promise = require('bluebird');
const _ = require('underscore');

const membersLastLoaded = {};

const CompleterUtil = {
  openEmojiCompleter(e) {
    Util.stop(e);

    return PopOver.pushView({
      view: this.getEmojiCompleterView('button'),
    });
  },

  autoMentionerView(source, card, board) {
    const model = card != null ? card : board;
    return new AutoMentionerView({
      model,
      button: source === 'button',
      input: source === 'input',
      target: this.getTextInput(),
      card,
      board,
      modelCache: this.modelCache,
    });
  },

  getAutoMentionerView(source) {
    // Define source models for both card-detail and description views
    let org;
    const card = this.getCard != null ? this.getCard() : this.card;
    const board = card ? card.getBoard() : this.board;

    // Load the org members if we haven't done that recently
    if ((org = board != null ? board.getOrganization() : undefined) != null) {
      if (
        !membersLastLoaded[org.id] ||
        Date.now() - membersLastLoaded[org.id] > 5 * 60 * 1000
      ) {
        membersLastLoaded[org.id] = Date.now();
        ModelLoader.loadOrganizationMembersData(org.id);
      }
    }

    // Load board members if modelCache isn't properly populated
    const memberships = this.modelCache
      .get('Board', board.id)
      .get('memberships');
    const idBoardMemsById = _.indexBy(board.getIdBoardMems());

    if (idBoardMemsById.length !== memberships.length) {
      // NOTE: Unfortunately this situation is also triggered by boards that
      // have a deactivated user (which due to a server bug leaves a membership
      // behind for the deleted member)  If we only have deactivated users missing
      // that's not a problem and we don't need to load all the members
      const hasUnloadedMembers = memberships.some(
        (membership) =>
          !membership.deactivated &&
          !idBoardMemsById.hasOwnProperty(membership.idMember),
      );

      if (hasUnloadedMembers) {
        return ModelLoader.loadBoardMembers(board.id).then(() =>
          this.autoMentionerView(source, card, board),
        );
      }
    }

    return Promise.resolve(this.autoMentionerView(source, card, board));
  },

  getEmojiCompleterView(source) {
    // Define source models for both card-detail and description views
    const card = this.getCard != null ? this.getCard() : this.card;
    const board = card ? card.getBoard() : this.board;
    const model = card != null ? card : board;

    return new EmojiCompleterView({
      model,
      button: source === 'button',
      input: source === 'input',
      target: this.getTextInput(),
      card,
      modelCache: this.modelCache,
    });
  },

  getTrelloCompleterView() {
    const card = this.getCard();

    return new TrelloCompleterView({
      model: card,
      button: true,
      target: this.getTextInput(),
      card,
      modelCache: this.modelCache,
    });
  },

  commentAddAttachment(e) {
    Util.stop(e);

    const $textInput = $(e.target).closest('.comment-box').find('textarea');
    const selectionStart = $textInput.prop('selectionStart');
    const selectionEnd = $textInput.prop('selectionEnd');
    const selectedText = $textInput
      .val()
      .substring(selectionStart, selectionEnd);

    const card = this.getCard();

    const view = new AttachmentTypePickerView({
      model: card,
      modelCache: this.modelCache,
      defaultName: selectedText,
    });

    view.on('attach', function ({ url, name }) {
      name = name || selectedText;

      const replacement = name ? `[${name}](${url})` : url;
      Util.insertSelection(
        $textInput,
        `${replacement} `,
        selectionStart,
        selectionEnd,
      );
      return $textInput.trigger('autosize.resize');
    });

    PopOver.toggle({
      elem: $(e.currentTarget),
      keepEdits: true,
      view,
      options: { model: card, modelCache: this.modelCache },
    });

    Analytics.sendScreenEvent({
      name: 'cardAttachmentPickerInlineDialog',
      containers: {
        card: {
          id: card.id,
        },
      },
    });
  },

  commentMentionMember(e) {
    Util.stop(e);

    this.getAutoMentionerView('button').then((view) =>
      PopOver.toggle({
        elem: $(e.currentTarget),
        keepEdits: true,
        view,
      }),
    );

    Analytics.sendScreenEvent({
      name: 'mentionMembersInlineDialog',
      containers: {
        card: {
          id: __guard__(this.getCard(), (x) => x.id),
        },
      },
    });
  },

  commentAddEmoji(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: $(e.currentTarget),
      keepEdits: true,
      view: this.getEmojiCompleterView('button'),
    });

    Analytics.sendScreenEvent({
      name: 'cardEmojiPickerInlineDialog',
      containers: {
        card: {
          id: __guard__(this.getCard(), (x) => x.id),
        },
      },
    });
  },

  commentAddCard(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: $(e.currentTarget),
      keepEdits: true,
      view: this.getTrelloCompleterView(),
    });

    Analytics.sendScreenEvent({
      name: 'cardTrelloCompleterInlineDialog',
      containers: {
        card: {
          id: __guard__(this.getCard(), (x) => x.id),
        },
      },
    });
  },

  insertRecording(url) {
    let word;
    const textInput = this.getTextInput();
    const caretPosition = Util.getCaretPosition(textInput);

    if (caretPosition !== null && caretPosition !== undefined) {
      word = {
        start: caretPosition,
        end: caretPosition,
      };
    }

    Util.insertSelection(
      textInput,
      `${`${url}`.trim()} `,
      word?.start || undefined,
      word?.end || undefined,
    );
  },
};

module.exports = CompleterUtil;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
