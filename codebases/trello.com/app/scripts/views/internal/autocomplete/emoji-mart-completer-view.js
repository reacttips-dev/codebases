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
const { l } = require('app/scripts/lib/localize');
const popoverEmojiCompleter = require('app/scripts/views/templates/popover_emoji_completer');
const { dontUpsell } = require('@trello/browser');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const TrelloEmojiPicker = require('app/scripts/views/emoji/trello-emoji-picker');
const { emojiProvider } = require('app/src/components/Emoji/EmojiProvider');
const NimbleEmoji = require('emoji-mart/dist-es/components/emoji/nimble-emoji')
  .default;

class EmojiMartCompleterView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'emoji';
    this.prototype.displayType = 'mod-reaction-selector';

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

    data.upsellEnabled =
      !dontUpsell() ||
      Auth.me().hasPremiumFeature('customEmoji') ||
      this.options.card
        ?.getBoard()
        ?.getOrganization()
        ?.hasPremiumFeature('customEmoji');

    if (this.options.button) {
      // render the picker within the popover we selected for it
      ReactDOM.render(this.getEmojiPicker(), this.$el[0]);
    } else {
      this.$el.html(popoverEmojiCompleter(data));
      this.$emojiList = this.$('.js-available-emoji');
      this.filterEmoji(this.getInput());
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
    const $textInput = this.getTextInput();
    const word = Util.getWordFromCaret($textInput);
    return word.str.substring(1);
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
      const emojiMartMarkup = NimbleEmoji({
        data: emojiProvider.getDataSync(),
        backgroundImageFn: emojiProvider.getSpritesheetsUrl,
        html: true,
        emoji: e,
        set: emojiProvider.getDefaultEmojiSet(),
        size: 18,
      });
      const data = {
        html: emojiMartMarkup,
        isEmojiMart: true,
        name: e,
        image: this._customEmoji[e] != null ? this._customEmoji[e] : null,
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

  fillEmojiList(input) {
    let validatedInput = input.replace(/\W+/g, '');

    if (/[A-Z]/.test(validatedInput) && this.options.input) {
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
    const regex = new RegExp(`^${Util.escapeForRegex(text)}`);
    const customMatches = Object.keys(this._customEmoji).filter((e) =>
      regex.test(e),
    );

    const standardMatches = emojiProvider.emojiIndex
      .search(text)
      .map((o) => o.id);

    // We _.uniq because custom matches override standard matches
    return _.uniq([
      ...Array.from(customMatches),
      ...Array.from(standardMatches),
    ]);
  }

  hoverItem(e) {
    const $elem = $(e.target).closest('.item');
    return Util.selectMenuItem(this.$emojiList, '.item', $elem);
  }

  selectEmoji(e, emojiName) {
    Util.stop(e);
    if (typeof emojiName === 'string') {
      this.insertEmoji(emojiName);
    } else {
      // we need to play nicely with both jquery and React here

      // any custom emoji matches get passed as HTML attributes
      const emojiString = $(e.target)
        .closest('.js-select-emoji')
        .find('.emoji-name')
        .text();

      // we search for any best results from emoji mart
      const emojiMartMatch = emojiProvider.emojiIndex
        .search(emojiString)
        .map((o) => o.id);

      // use custom emoji, if found, or the first result from emoji mart search
      this.insertEmoji(emojiString || (emojiMartMatch && emojiMartMatch[0]));
    }
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

  remove() {
    ReactDOM.unmountComponentAtNode(this.$el[0]);
    return super.remove(...arguments);
  }

  getEmojiPicker() {
    const customEmojiEnabled =
      !dontUpsell() ||
      Auth.me().hasPremiumFeature('customEmoji') ||
      this.options.card
        ?.getBoard()
        ?.getOrganization()
        ?.hasPremiumFeature('customEmoji');

    // https://github.com/missive/emoji-mart#custom-emojis
    const custom = Auth.me().customEmojiList.map((e) => ({
      name: e.get('name'),
      short_names: [e.get('name')],
      imageUrl: e.get('url'),
    }));

    return (
      <TrelloEmojiPicker
        custom={custom}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(emoji, e) => this.selectEmoji(e, emoji.id)}
        showCustomEmojiButton={customEmojiEnabled}
        // eslint-disable-next-line react/jsx-no-bind
        onCustomEmojiButtonClick={this.openEmojiUploader.bind(this)}
      />
    );
  }

  willBePopped() {
    $(document).off(
      'click',
      '.emoji-mart, .emoji-mart-anchor, .emoji-mart-skin-swatch-selected, .emoji-mart-skin-swatches-opened .emoji-mart-skin',
    );
    return $(document).off('input', '.emoji-mart-search input');
  }
}

EmojiMartCompleterView.initClass();
module.exports = EmojiMartCompleterView;
