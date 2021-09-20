/* eslint-disable @trello/export-matches-filename */
import { clientVersion } from '@trello/config';
import { TrelloStorage } from '@trello/storage';

import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

const CUSTOM_ACTION_PREFIX = 'custom_action_';
const CUSTOM_ACTIONS_TRANSLATIONS_KEY = `${CUSTOM_ACTION_PREFIX}i18n`;

async function loadCustomActionTypes(locale: string) {
  const res = await fetch(`/1/customActionTypes?locale=${locale}`, {
    headers: {
      'X-Trello-Client-Version': clientVersion,
    },
  });
  return res.json();
}

interface CustomActionType {
  translationKey: string;
  text: string;
}

interface ActionWithDisplay {
  display: {
    translationKey: string;
  };
}

type CustomActionTranslations = Record<string, string>;

export function isCustomAction({ display }: ActionWithDisplay) {
  return display.translationKey.startsWith(CUSTOM_ACTION_PREFIX);
}

export function getStrings(): CustomActionTranslations {
  const currentLocale = window.locale;
  const translations = TrelloStorage.get(CUSTOM_ACTIONS_TRANSLATIONS_KEY) || {};
  return translations[currentLocale];
}

async function refresh() {
  const currentLocale = window.locale;
  const types = await loadCustomActionTypes(currentLocale);
  const translations: Record<string, CustomActionTranslations> = {
    [currentLocale]: types.reduce(
      (all: CustomActionTranslations, type: CustomActionType) => {
        all[type.translationKey] = type.text;
        return all;
      },
      {},
    ),
  };
  TrelloStorage.set(CUSTOM_ACTIONS_TRANSLATIONS_KEY, translations);
}

let isRefreshing = false;
export async function refreshIfMissing(...translationKeys: string[]) {
  if (isRefreshing) {
    return;
  }
  const customTranslationKeys = translationKeys.filter((tk) =>
    tk.startsWith(CUSTOM_ACTION_PREFIX),
  );
  if (customTranslationKeys.length) {
    const strings = getStrings();
    if (customTranslationKeys.some((key) => !strings?.[key])) {
      isRefreshing = true;
      try {
        await refresh();
      } finally {
        isRefreshing = false;
      }
    }
  }
}
