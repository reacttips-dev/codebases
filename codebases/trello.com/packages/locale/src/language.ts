import Cookies from 'js-cookie';
import { locale as globalLocale } from '@trello/config';

const FALLBACK_LOCALE = 'en';

const capitalize = (str: string) =>
  `${str.slice(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`;

export const languageParts = (locale: string) => {
  const pattern = /^([a-zA-Z]{2,3})(?:[_-]+([a-zA-Z]{3})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{4})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{2}|[0-9]{3})(?=$|[_-]+))?/;
  const [, language = '', extlang = '', script = '', region = ''] =
    locale.match(pattern) || ([] as RegExpMatchArray);

  return {
    language: language.toLowerCase(),
    extlang: extlang.toLowerCase(),
    script: capitalize(script),
    region: region.toUpperCase(),
  };
};

/*
 * Normalize locale languageTags reported from the browser
 * Spec https://tools.ietf.org/html/rfc5646#section-2.1
 * Guide https://www.w3.org/International/articles/language-tags/
 */
export const normalizeLocale = (languageTag: string) => {
  const cleaned = languageTag.split(/[@.]/)[0];
  const { language, script, region } = languageParts(cleaned);
  const locale = [language];
  if (script) {
    locale.push(script);
  }
  if (region) {
    locale.push(region);
  }

  return locale.join('-');
};

// eslint-disable-next-line @trello/no-module-logic
export const currentLocale = normalizeLocale(globalLocale);

/*
 * Returns true if the locales are the same or if one of the
 * locales are a prefix of the other:
 *
 * "en-US" matches "en-US"
 * "en-US" matches "en"
 * "en" matches "en-US"
 * "en-US" does not match "en-GB"
 */
export const matches = (localeA: string, localeB: string) => {
  let shorter = normalizeLocale(localeA).split('-');
  let longer = normalizeLocale(localeB).split('-');
  if (shorter.length > longer.length) {
    [shorter, longer] = [longer, shorter];
  }

  return shorter.every((part: string, index: number) => longer[index] === part);
};

/*
 * Get a list of preferred locales based on the user's browser
 * settings & preferences. May or may not align with window.locale
 * which is set by the HTML Webpack Plugin
 */
export const getPreferredLanguages = (): string[] =>
  [
    Cookies.get('lang'),
    navigator.language,
    ...(navigator.languages || []),
    FALLBACK_LOCALE,
  ].reduce((result, lang) => {
    if (!lang || result.includes(lang)) {
      return result;
    }
    result.push(normalizeLocale(lang));

    return result;
  }, [] as string[]);

/*
 * Given an ordered list of preferred locales and a list of locales to test,
 * find the first match between the two as the "most preferred" option
 */
export const getMostPreferred = (locales: string[]): string => {
  for (const preferred of getPreferredLanguages()) {
    const matched = locales.find((locale) => matches(preferred, locale));
    if (matched) {
      return matched;
    }
  }

  return FALLBACK_LOCALE;
};

export const usesEnglish = () => languageParts(currentLocale).language === 'en';

export const usesLanguages = (locales: string[]) => {
  return locales.some((locale) => {
    return (
      currentLocale === locale ||
      languageParts(currentLocale).language === locale
    );
  });
};
