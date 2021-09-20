import { ReactElement } from 'react';
import TrelloMarkdown from '@atlassian/trello-markdown';
import TrelloEmoji from 'app/src/emoji';
import { State } from 'app/gamma/src/modules/types';
import { Store } from 'redux';

import { getCardByShortLink } from 'app/gamma/src/selectors/cards';
import {
  getMemberByFullName,
  getMemberByIdMemberOrUsername,
} from 'app/gamma/src/selectors/members';
import { isMe } from 'app/gamma/src/selectors/session';
import { featureFlagClient } from '@trello/feature-flag-client';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { emojiProvider } from 'app/src/components/Emoji/EmojiProvider';
import NimbleEmoji from 'emoji-mart/dist-es/components/emoji/nimble-emoji';
import { EmojiSkin } from 'emoji-mart';
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

export interface ParserOptions {
  textInline: (text: string) => string;
  format: (
    text: string,
    options?: object,
  ) => {
    output: string;
    locations: [{ rule: object; start: number; stop: number }];
  };
}

export interface TrelloMarkdownWrapper {
  description: ParserOptions;
  comments: ParserOptions;
  checkItems: ParserOptions;
  powerUpDescription: ParserOptions;
  store: Store<State>;
}

interface EmojiState {
  textData?: {
    emoji: { [key: string]: string };
  };
}

export class TrelloMarkdownWrapper {
  constructor(store: Store<State>) {
    this.store = store;

    const defaults = {
      lookupEmoji: this.lookupEmoji.bind(this),
      lookupCardInfo: this.lookupCardInfo.bind(this),
      lookupMember: this.lookupMember.bind(this),
      //TODO: include parseURL in Gamma
      // shouldOpenLinkInNewTab: (url: string) => {
      //   const parsed = parseURL(url);
      //   /*
      //     A mismatched host is obviously external; also reject anything that
      //     looks like it might be an attempt at a protocol relative URL
      //     (i.e. two //, or something tricky like /\)  Also consider anything
      //     with a /. or .. in it to be external
      //   */

      //   return (parsed.host !== document.location.host) || /\/\/^ [\\/.]{2,} \/\//.test(parsed.pathname)
      // }
    };
    //TODO: externalLink stuff.
    //defaults.shouldOpenLinkInNewTab = Util.isExternalURL
    this.description = new TrelloMarkdown(defaults);
    //TFM for comments
    this.comments = new TrelloMarkdown({
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
      ...defaults,
    });

    // Checklist Items
    this.checkItems = new TrelloMarkdown({
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
      ...defaults,
    });
  }

  lookupEmoji(
    emoji: string,
    state: EmojiState,
  ): string | undefined | Record<string, ReactElement<object, string> | null> {
    emoji = emoji.toLowerCase();
    const customEmoji = state.textData?.emoji[emoji];

    if (customEmoji) return customEmoji;
    if (featureFlagClient.get('fep.emoji-mart-completer', false)) {
      let markup: ReactElement<object, string> | null;
      // in case the emoji data is not loaded yet
      try {
        // return the skin-tone number matched by \d
        const skinToneMatch: Array<EmojiSkin | string> | null = emoji.match(
          /([a-z0-9_+-:]+)::skin-tone-([\d])/,
        );
        markup = NimbleEmoji({
          data: emojiProvider.getDataSync(),
          backgroundImageFn: emojiProvider.getSpritesheetsUrl,
          html: true,
          emoji: skinToneMatch ? (skinToneMatch[1] as string) : emoji,
          set: emojiProvider.getDefaultEmojiSet(),
          size: 18,
          skin: skinToneMatch ? (skinToneMatch[2] as EmojiSkin) : 1,
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

  lookupMember(username: string): [string | null | undefined, boolean] {
    const reduxState = this.store.getState();
    if (['card', 'board'].includes(username)) {
      return [username, true];
    }

    const member =
      getMemberByFullName(reduxState, username) ||
      getMemberByIdMemberOrUsername(reduxState, username);
    if (member) {
      return [member.name, isMe(reduxState, member)];
    } else if (/^[a-z0-9_]{3,}/.test(username)) {
      // Even if we couldn't find a member record, assume that it's still a
      // mention if it looks like a username.  It's possible, e.g. in a
      // notification, that we haven't loaded the member that's being mentioned
      return [username, false];
    } else {
      return [null, false];
    }
  }

  lookupCardInfo(idShort: string) {
    const reduxState = this.store.getState();

    const parsedIdShort = parseInt(idShort, 10).toString();
    //const idBoard = state && state.board && state.board.id;

    //TODO: Need to complete the logic for this: tfm.coffee in Classic.

    /*
    If it was passed a boardId, we use that boardId to find the card, otherwise we use
    the current boardId. If we find a card, it means that the desired card is loaded to
    the model cache, and we use its URL and title. Otherwise, we create a URL based on
    what it should be, which redirects to the correct one when clicked on. However,
    the link title is still called "Card <cardNum>," as it has not been loaded into the model cache.
    */
    const card = getCardByShortLink(reduxState, parsedIdShort);
    if (card) {
      return {
        title: card.name,
        url: 'fakeUrl',
      };
    } else {
      return {
        title: `Card ${parsedIdShort}`,
        url: 'fakeUrl',
      };
    }
  }
}
