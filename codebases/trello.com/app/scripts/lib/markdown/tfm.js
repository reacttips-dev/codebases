/* eslint-disable
    eqeqeq,
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
const { Auth } = require('app/scripts/db/auth');
const { ModelCache } = require('app/scripts/db/model-cache');
const TrelloMarkdown = require('@atlassian/trello-markdown');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const TrelloEmoji = require('app/src/emoji').default;
const { emojiProvider } = require('app/src/components/Emoji/EmojiProvider');
const NimbleEmoji = require('emoji-mart/dist-es/components/emoji/nimble-emoji')
  .default;
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const { Urls } = require('app/scripts/controller/urls');
const { getCardUrl, getCardUrlWithoutModels } = Urls;
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

/*
Optional Block Rules:
  blockquote    # >>>
  def           # [1] https://trello.com
  code          #     code
  fencedCode    # ```
  heading       # ## Heading
  hr            # ----
  lheading      # Heading followed by -----
  list          # - foo
  newline       # (Just separates paragraphs)
  paragraph     #

Optional Inline Rules:
  atMention     # @someone
  autolink      # <google.com> or <foo@bar.com>
  break         # single newline
  code          # `code`
  em            # *em*
  emoji         # :facepalm:
  link          # [something](http://...) or ![something](http:///)
  nolink        # [something] or ![something]
  strong        # **strong**
  reflink       # [something[1] or ![something][1]
  url           # https://trello.com
  colorChip     # #ABC123 or rgb(123, 12, 5) or rgba(120, 250, 3, 0.5)
*/

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports = window.TFM = new (class {
  constructor() {
    const defaults = {
      lookupEmoji: this.lookupEmoji,
      lookupCardInfo: this.lookupCardInfo,
      lookupMember: this.lookupMember,
    };
    defaults.shouldOpenLinkInNewTab = Util.isExternalURL;

    this.name = new TrelloMarkdown({
      inlineOnly: true,
      restrict: {
        inline: ['colorChip', 'url'],
      },
      lookupCardInfo: this.lookupCardInfo,
    });
    this.description = new TrelloMarkdown(defaults);
    // TFM for comments
    this.comments = new TrelloMarkdown(
      _.extend(
        {
          restrict: {
            block: [
              'blockquote',
              'code',
              'fencedCode',
              'hr',
              'list',
              'newline',
              'paragraph',
              'heading',
              'lheading',
            ],
            inline: [
              'atMention',
              'autolink',
              'break',
              'code',
              'colorChip',
              'em',
              'email',
              'emailLink',
              'emoji',
              'link',
              'strong',
              'strikethrough',
              'url',
            ],
          },
        },
        defaults,
      ),
    );

    // Checklist Items
    this.checkItems = new TrelloMarkdown(
      _.extend(
        {
          inlineOnly: true,
          restrict: {
            inline: [
              'atMention',
              'autolink',
              'code',
              'colorChip',
              'em',
              'email',
              'emailLink',
              'emoji',
              'link',
              'strong',
              'strikethrough',
              'url',
            ],
          },
        },
        defaults,
      ),
    );
  }

  lookupEmoji(emoji, state) {
    emoji = emoji.toLowerCase();
    const customEmoji = state.textData?.emoji[emoji];

    if (customEmoji) return customEmoji;
    if (featureFlagClient.get('fep.emoji-mart-completer', false)) {
      let markup;
      // in case the emoji data is not loaded yet
      try {
        // return the skin-tone number matched by \d
        const skinToneMatch = emoji.match(/([a-z0-9_+-:]+)::skin-tone-([\d])/);
        markup = NimbleEmoji({
          data: emojiProvider.getDataSync(),
          backgroundImageFn: emojiProvider.getSpritesheetsUrl,
          html: true,
          emoji: skinToneMatch ? skinToneMatch[1] : emoji,
          set: emojiProvider.getDefaultEmojiSet(),
          size: 18,
          skin: skinToneMatch ? skinToneMatch[2] : 1,
        });
      } catch (e) {
        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'emoji',
          source: getScreenFromUrl(),
          attributes: {
            error: e,
          },
        });
        return;
      }
      // we return as an object here to differentiate to @atlassian/trello-markdown between rendering pure markup vs sending a url
      // https://bitbucket.org/trello/markdown/src/060bbddc4404e2a3f236f2457f345b45a40c5d58/src/index.coffee#lines-1026
      return markup
        ? {
            emojiMarkup: markup,
          }
        : TrelloEmoji[emoji];
    } else {
      return TrelloEmoji[emoji];
    }
  }

  lookupMember(username, state) {
    username = username.toLowerCase();

    if (['card', 'board'].includes(username)) {
      return [username, true];
    }

    const member = ModelCache.findOne('Member', 'username', username);
    if (member != null) {
      return [member.get('fullName'), Auth.isMe(member)];
    } else if (/^[a-z0-9_]{3,}/.test(username)) {
      // Even if we couldn't find a member record, assume that it's still a
      // mention if it looks like a username.  It's possible, e.g. in a
      // notification, that we haven't loaded the member that's being mentioned
      return [username, false];
    } else {
      return [null, false];
    }
  }

  lookupCardInfo(idShort, state) {
    let currentBoard;
    idShort = parseInt(idShort, 10);
    let idBoard = __guard__(
      state != null ? state.board : undefined,
      (x) => x.id,
    );

    /*
    If it was passed a boardId, we use that boardId to find the card, otherwise we use
    the current boardId. If we find a card, it means that the desired card is loaded to
    the model cache, and we use its URL and title. Otherwise, we create a URL based on
    what it should be, which redirects to the correct one when clicked on. However,
    the link title is still called "Card <cardNum>," as it has not been loaded into the model cache.
    */
    if (
      idBoard == null &&
      (currentBoard = currentModelManager.getCurrentBoard()) != null
    ) {
      idBoard = currentBoard.id;
    }
    const card = ModelCache.findOne(
      'Card',
      (card) =>
        card.get('idBoard') === idBoard && card.get('idShort') === idShort,
    );
    if (card != null) {
      return {
        title: card.get('name'),
        url: getCardUrl(card),
      };
    } else {
      const cardTitle = `Card ${idShort}`;
      return {
        title: cardTitle,
        url: getCardUrlWithoutModels(idBoard, idShort, cardTitle),
      };
    }
  }
})();
