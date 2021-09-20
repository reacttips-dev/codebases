/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const EmojiUploaderView = require('app/scripts/views/internal/autocomplete/emoji-uploader-view');
const { getKey, Key } = require('@trello/keybindings');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { Analytics } = require('@trello/atlassian-analytics');
const TrelloEmoji = require('app/src/emoji').default;
const { l } = require('app/scripts/lib/localize');
const popoverEmojiCompleter = require('app/scripts/views/templates/popover_emoji_completer');
const { dontUpsell } = require('@trello/browser');
const EmojiMartCompleterView = require('app/scripts/views/internal/autocomplete/emoji-mart-completer-view');
const { featureFlagClient } = require('@trello/feature-flag-client');

class EmojiCompleterView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'emoji';

    this.prototype.events = {
      'mouseenter .js-select-emoji': 'hoverItem',
      'click .js-select-emoji': 'selectEmoji',
      keydown: 'keydownEvent',
      'keyup .js-filter-emoji': 'keyupEvent',
      'click .js-upload-emoji': 'openEmojiUploader',
    };
  }

  initialize() {
    this._customEmoji = {};
    if (
      Auth.me().hasPremiumFeature('customEmoji') ||
      this.options.card
        ?.getBoard()
        ?.getOrganization()
        ?.hasPremiumFeature('customEmoji')
    ) {
      Auth.me().loadCustomEmojis();
      this.listenTo(
        Auth.me().customEmojiList,
        'change add remove reset',
        this.updateCustomEmoji,
      );
      this.updateCustomEmoji();
    }
  }

  render() {
    const data = {};

    if (this.options.input) {
      data.input = true;
    }
    if (this.options.button) {
      data.button = true;
    }

    data.upsellEnabled =
      !dontUpsell() ||
      Auth.me().hasPremiumFeature('customEmoji') ||
      this.options.card
        ?.getBoard()
        ?.getOrganization()
        ?.hasPremiumFeature('customEmoji');

    this.$el.html(popoverEmojiCompleter(data));

    this.$emojiList = this.$('.js-available-emoji');
    if (this.options.input) {
      this.filterEmoji(this.getInput());
    }

    if (this.options.button) {
      this.fillDefaultEmojiList();
    }

    return this;
  }

  keyupEvent(e) {
    const key = getKey(e);

    if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      Util.stop(e);
      Util.navMenuList(this.$emojiList, '.item', key);
      return;
    } else if ([Key.Enter, Key.Tab].includes(key)) {
      return;
    }

    const input = this.getInput();
    return this.filterEmoji(input);
  }

  keydownEvent(e) {
    let needle;
    if (((needle = getKey(e)), [Key.Enter, Key.Tab].includes(needle))) {
      Util.stop(e);
      const $item = this.$emojiList.find(
        '.item.selected:first .js-select-emoji',
      );
      if ($item.length > 0) {
        return $item.click();
      }
    }
  }

  updateCustomEmoji() {
    this._customEmoji = _.object(
      Auth.me().customEmojiList.map((e) => [e.get('name'), e.get('url')]),
    );
    return this.render();
  }

  getTextInput() {
    return $(this.options.target);
  }

  getInput() {
    if (this.options.button) {
      return this.$('.js-filter-emoji').val();
    } else {
      const $textInput = this.getTextInput();
      const word = Util.getWordFromCaret($textInput);
      return word.str.substring(1);
    }
  }

  filterEmoji(input) {
    this.clearEmojiList();
    if (this.fillEmojiList(input)) {
      return Util.selectMenuItem(
        this.$emojiList,
        '.item',
        this.$emojiList.find('.item').first(),
      );
    }
  }

  renderEmojiList(list) {
    for (const e of Array.from(list)) {
      const data = {
        name: e,
        image:
          this._customEmoji[e] != null ? this._customEmoji[e] : TrelloEmoji[e],
      };

      this.$emojiList.append(
        templates.fill(
          require('app/scripts/views/templates/select_emoji'),
          data,
        ),
      );
    }

    return this;
  }

  fillDefaultEmojiList(input) {
    const defaultEmoji = [
      'thumbsup',
      'smile',
      'warning',
      'sunglasses',
      'ballot_box_with_check',
      'facepalm',
    ];

    this.renderEmojiList(defaultEmoji);
  }

  fillEmojiList(input) {
    let validatedInput = input.replace(/\W+/g, '');

    if (input === '') {
      this.fillDefaultEmojiList();
      return false;
    } else if (/[A-Z]/.test(validatedInput) && this.options.input) {
      PopOver.hide();
      return false;
    }

    validatedInput = validatedInput.toLowerCase();

    this.$('.js-upload-emoji')
      .text(l('upload emoji named', { emojiName: validatedInput }))
      .attr('data-emojiname', validatedInput);

    this.$('.js-no-matching-emoji-helper').text(
      l('no matching emoji helper', { emojiName: validatedInput }),
    );

    const emojiMatches = this.getEmojiSuggestions(validatedInput).slice(0, 6);

    if (emojiMatches.length > 0) {
      this.$('.js-results').removeClass('hide');
      this.$('.js-no-results').addClass('hide');

      this.renderEmojiList(emojiMatches);
    } else {
      this.$('.js-results').addClass('hide');
      this.$('.js-no-results').removeClass('hide');
    }

    return emojiMatches.length !== 0;
  }

  clearEmojiList() {
    return this.$emojiList.empty();
  }

  getEmojiSuggestions(text) {
    let key;
    const regex = new RegExp(`^${Util.escapeForRegex(text)}`);

    const customMatches = (() => {
      const result = [];
      for (key in this._customEmoji) {
        if (regex.test(key)) {
          result.push(key);
        }
      }
      return result;
    })();
    const standardMatches = (() => {
      const result1 = [];
      for (key in TrelloEmoji) {
        if (regex.test(key)) {
          result1.push(key);
        }
      }
      return result1;
    })();

    // Bias the autocomplete towards popular emoji
    if (this._sortOverride == null) {
      const sortOverride = [
        'thumbsup',
        'smile',
        'warning',
        'sunglasses',
        'facepalm',
        'question',
        'thumbsdown',
        'wink',
        'smiley',
        'smile_cat',
        'bowtie',
        'heart',
        'laughing',
        'bug',
        'cry',
        'dancer',
        'dancers',
        'clap',
        'shipit',
        'white_check_mark',
        'star',
        'arrow_down',
        'point_down',
        'point_up',
        'point_left',
        'metal',
      ];

      this._sortOverride = {};
      for (let index = 0; index < sortOverride.length; index++) {
        const entry = sortOverride[index];
        this._sortOverride[entry] = index + 1;
      }
    }

    // We _.uniq because custom matches override standard matches
    return _.uniq([
      ...Array.from(customMatches),
      ...Array.from(standardMatches),
    ]).sort((a, b) => {
      const aOverride = this._sortOverride[a];
      const bOverride = this._sortOverride[b];

      if (aOverride && !bOverride) {
        return -1;
      } else if (bOverride && !aOverride) {
        return 1;
      } else if (aOverride && bOverride) {
        a = aOverride;
        b = bOverride;
      }

      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  hoverItem(e) {
    const $elem = $(e.target).closest('.item');
    return Util.selectMenuItem(this.$emojiList, '.item', $elem);
  }

  selectEmoji(e) {
    Util.stop(e);
    const emojiName = $(e.target)
      .closest('.js-select-emoji')
      .find('.emoji-name')
      .text();
    this.insertEmoji(emojiName);
    PopOver.hide();
  }

  insertEmoji(name) {
    let word;
    const $textInput = this.getTextInput();
    if (this.options.input) {
      word = Util.getWordFromCaret($textInput);
    } else {
      const caretPosition = Util.getCaretPosition($textInput);
      if (caretPosition != null) {
        word = {
          start: caretPosition,
          end: caretPosition,
        };
      }
    }

    Util.insertSelection(
      $textInput,
      `:${`${name}`.trim()}: `,
      word != null ? word.start : undefined,
      word != null ? word.end : undefined,
    );

    return Analytics.sendUIEvent({
      action: 'selected',
      actionSubject: 'emoji',
      source: 'emojiCompleterInlineDialog',
      attributes: {
        emojiName: name,
      },
    });
  }

  openEmojiUploader(e) {
    Util.stop(e);

    const emojiName = this.$(e.target).attr('data-emojiname');

    PopOver.pushView({
      keepEdits: true,
      view: EmojiUploaderView,
      options: {
        model: Auth.me(),
        emojiName,
        completerView: this,
        card: this.options.card,
      },
    });

    Analytics.sendUIEvent({
      action: 'opened',
      actionSubject: 'inlineDialog',
      actionSubjectId: 'customEmojiUploaderInlineDialog',
      source: 'cardDetailScreen',
    });
  }
}

EmojiCompleterView.initClass();
let exported = EmojiCompleterView;
if (featureFlagClient.get('fep.emoji-mart-completer', false)) {
  exported = EmojiMartCompleterView;
}
module.exports = exported;
