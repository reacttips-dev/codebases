import {
  compress,
  Data,
  Emoji,
  SkinVariation,
} from 'emoji-mart/dist-es/utils/data';
import NimbleEmojiIndex from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import { EmojiDataResponse } from 'app/gamma/src/types/responses';
import { mapObject } from 'underscore';
import { currentLocale } from '@trello/locale';
import API from 'app/gamma/src/api';
import { importWithRetry } from '@trello/use-lazy-component';
import { EmojiSet } from 'emoji-mart/dist-es/utils/shared-props';

export class EmojiProvider {
  categories = [
    ['Smileys & People', 'people'],
    ['Animals & Nature', 'nature'],
    ['Food & Drink', 'foods'],
    ['Activities', 'activity'],
    ['Travel & Places', 'places'],
    ['Objects', 'objects'],
    ['Symbols', 'symbols'],
    ['Flags', 'flags'],
  ];
  defaultEmojiSet: EmojiSet = 'twitter';
  private data: Data;
  private emojiFetch: Promise<EmojiDataResponse> | null = null;
  private emojiIndex: NimbleEmojiIndex;
  private spriteSheets: EmojiDataResponse['spriteSheets'];

  private async fetchEmoji() {
    try {
      if (this.emojiFetch === null) {
        this.emojiFetch = API.client.rest.get<EmojiDataResponse>('emoji', {
          query: {
            spritesheets: true,
            locale: currentLocale,
          },
        });
      }

      const emojis = await this.emojiFetch;

      return this.processEmoji(emojis);
    } catch (e) {
      console.error(e);

      return importWithRetry(
        () =>
          // @ts-expect-error
          // prettier-ignore
          import(/* webpackChunkName: "emoji-mart-data-twitter" */ 'emoji-mart/data/twitter'),
      ).then((m) => m.default);
    }
  }

  private formatName(name: string) {
    // This is a list of words that should not be capitalized for title case.
    const nonTitlecasedWords = [
      'and',
      'or',
      'nor',
      'a',
      'an',
      'the',
      'so',
      'but',
      'to',
      'of',
      'at',
      'by',
      'from',
      'into',
      'on',
      'onto',
      'off',
      'out',
      'in',
      'over',
      'with',
      'for',
    ];

    return name
      .toLowerCase()
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map((word) =>
        nonTitlecasedWords.includes(word)
          ? word
          : word.replace(/\b\w/g, (l) => l.toUpperCase()),
      )
      .join(' ');
  }

  // Adapted from Emoji-Marts build process
  // emoji-mart/scripts/build.js
  private processEmoji(emojiSource: EmojiDataResponse) {
    const data: Data = {
      compressed: true,
      categories: [],
      emojis: {},
      aliases: {},
    };

    const categoriesIndex: { [key: string]: number } = {};
    this.categories.forEach(([name, id], i) => {
      data.categories[i] = {
        id,
        name,
        emojis: [],
      };

      categoriesIndex[name] = i;
    });

    type EmojiType = Emoji & { short_name: string };

    emojiSource.trello.forEach((datum) => {
      const emoji: EmojiType = {
        name: this.formatName(datum.name || datum.shortName),
        unified: datum.unified,
        sheet_x: datum.sheetX,
        sheet_y: datum.sheetY,
        text: datum.text || '',
        emoticons: datum.texts || [],
        short_name: datum.shortName,
        short_names: datum.shortNames,
        keywords: datum.keywords,
      };

      if (datum.skinVariations) {
        emoji.skin_variations = mapObject<SkinVariation>(
          datum.skinVariations,
          (variation) => ({
            unified: variation.unified,
            native: variation.native,
            sheet_x: variation.sheetX,
            sheet_y: variation.sheetY,
            non_qualified: null,
            image: '',
            added_in: 'trello',
            has_img_apple: false,
            has_img_google: false,
            has_img_twitter: true,
            has_img_emojione: false,
            has_img_facebook: false,
            has_img_messenger: false,
          }),
        );
      }

      if (datum.category !== 'Skin Tones') {
        const categoryIndex = categoriesIndex[datum.category];
        data.categories[categoryIndex].emojis.push(emoji.short_name);
        data.emojis[emoji.short_name] = emoji;
      }

      if (emoji.short_names) {
        emoji.short_names.forEach(function (shortName, i) {
          if (i === 0) {
            return;
          }
          data.aliases[shortName] = emoji.short_name;
        });
      }

      compress(emoji);
    });

    const flags = data.categories[categoriesIndex.Flags];
    flags.emojis = flags.emojis
      .filter((flag) => {
        // Until browsers support Flag UN
        if (flag === 'flag-un') {
          return;
        }

        return true;
      })
      .sort();

    this.data = data;
    this.emojiIndex = new NimbleEmojiIndex(data);
    this.spriteSheets = emojiSource.spriteSheets;

    return data;
  }

  getData() {
    return this.fetchEmoji();
  }

  getDataSync() {
    return this.data;
  }

  getIndex() {
    return this.fetchEmoji().then(() => this.emojiIndex);
  }

  getSpritesheets() {
    return this.fetchEmoji().then(() => this.spriteSheets);
  }

  getSpritesheetsSync() {
    return this.spriteSheets;
  }

  getSpritesheetsUrl = (set: 'twitter', sheetSize: 16 | 20 | 32 | 64) => {
    if (
      this.spriteSheets &&
      this.spriteSheets[set] &&
      this.spriteSheets[set][sheetSize]
    ) {
      return this.spriteSheets[set][sheetSize].url;
    }

    return '';
  };

  getDefaultEmojiSet() {
    return this.defaultEmojiSet;
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const emojiProvider = new EmojiProvider();
