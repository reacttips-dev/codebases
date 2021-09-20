const { l } = require('app/scripts/lib/localize');

module.exports = {
  BOARD_NAME: 'board-name',
  LIST_NAME: 'list-name',
  CARD_NAME: 'card-name',
  CHECKITEM_NAME: 'check-name',
  CARD_DRAG: 'card-drag',
  translatedCardDragFileMap: {
    cs: require('resources/images/create-first-board/card-drag/cs-card-drag.gif'),
    de: require('resources/images/create-first-board/card-drag/de-card-drag.gif'),
    en: require('resources/images/create-first-board/card-drag/en-card-drag.gif'),
    es: require('resources/images/create-first-board/card-drag/es-card-drag.gif'),
    fi: require('resources/images/create-first-board/card-drag/fi-card-drag.gif'),
    fr: require('resources/images/create-first-board/card-drag/fr-card-drag.gif'),
    hu: require('resources/images/create-first-board/card-drag/hu-card-drag.gif'),
    it: require('resources/images/create-first-board/card-drag/it-card-drag.gif'),
    ja: require('resources/images/create-first-board/card-drag/ja-card-drag.gif'),
    nb: require('resources/images/create-first-board/card-drag/nb-card-drag.gif'),
    nl: require('resources/images/create-first-board/card-drag/nl-card-drag.gif'),
    pl: require('resources/images/create-first-board/card-drag/pl-card-drag.gif'),
    'pt-br': require('resources/images/create-first-board/card-drag/pt-br-card-drag.gif'),
    ru: require('resources/images/create-first-board/card-drag/ru-card-drag.gif'),
    sv: require('resources/images/create-first-board/card-drag/sv-card-drag.gif'),
    th: require('resources/images/create-first-board/card-drag/th-card-drag.gif'),
    tr: require('resources/images/create-first-board/card-drag/tr-card-drag.gif'),
    uk: require('resources/images/create-first-board/card-drag/uk-card-drag.gif'),
    vi: require('resources/images/create-first-board/card-drag/vi-card-drag.gif'),
    'zh-hans': require('resources/images/create-first-board/card-drag/zh-hans-card-drag.gif'),
    'zh-hant': require('resources/images/create-first-board/card-drag/zh-hant-card-drag.gif'),
  },
  translatedCardBackFileMap: {
    cs: require('resources/images/create-first-board/card-back/cardBack-cs.svg'),
    de: require('resources/images/create-first-board/card-back/cardBack-de.svg'),
    en: require('resources/images/create-first-board/card-back/cardBack-en.svg'),
    es: require('resources/images/create-first-board/card-back/cardBack-es.svg'),
    fi: require('resources/images/create-first-board/card-back/cardBack-fi.svg'),
    fr: require('resources/images/create-first-board/card-back/cardBack-fr.svg'),
    hu: require('resources/images/create-first-board/card-back/cardBack-hu.svg'),
    it: require('resources/images/create-first-board/card-back/cardBack-it.svg'),
    ja: require('resources/images/create-first-board/card-back/cardBack-ja.svg'),
    nb: require('resources/images/create-first-board/card-back/cardBack-nb.svg'),
    nl: require('resources/images/create-first-board/card-back/cardBack-nl.svg'),
    pl: require('resources/images/create-first-board/card-back/cardBack-pl.svg'),
    'pt-br': require('resources/images/create-first-board/card-back/cardBack-pt-br.svg'),
    ru: require('resources/images/create-first-board/card-back/cardBack-ru.svg'),
    sv: require('resources/images/create-first-board/card-back/cardBack-sv.svg'),
    th: require('resources/images/create-first-board/card-back/cardBack-th.svg'),
    tr: require('resources/images/create-first-board/card-back/cardBack-tr.svg'),
    uk: require('resources/images/create-first-board/card-back/cardBack-uk.svg'),
    vi: require('resources/images/create-first-board/card-back/cardBack-vi.svg'),
    'zh-hans': require('resources/images/create-first-board/card-back/cardBack-zh-hans.svg'),
    'zh-hant': require('resources/images/create-first-board/card-back/cardBack-zh-hant.svg'),
  },
  initialData: {
    name: '',
    checkItem: '',
    defaultValue: l(['templates', 'onboarding', `board-name:title`]),
    lists: [
      {
        name: l(['templates', 'onboarding', `list-name:placeholder:0`]),
        cards: [
          {
            name: '',
            large: false,
            defaultValue: l([
              'templates',
              'onboarding',
              `card-name:placeholder:0`,
            ]),
          },
          {
            name: '',
            large: false,
          },
          {
            name: '',
            large: false,
          },
        ],
      },
      {
        name: l(['templates', 'onboarding', `list-name:placeholder:1`]),
        cards: [
          {
            name: '',
            large: true,
          },
          {
            name: '',
            large: false,
          },
          {
            name: '',
            large: true,
          },
        ],
      },
      {
        name: l(['templates', 'onboarding', `list-name:placeholder:2`]),
        cards: [
          {
            name: '',
            large: false,
          },
          {
            name: '',
            large: true,
          },
          {
            name: '',
            large: false,
          },
        ],
      },
    ],
  },
};
