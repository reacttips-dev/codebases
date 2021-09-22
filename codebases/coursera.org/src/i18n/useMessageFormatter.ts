import { useMessageFormatter } from '@react-aria/i18n';

import useLocale from '@core/i18n/useLocale';
import { getLocaleWithoutRegion } from '@core/i18n/utils';

type LocalizedStrings = {
  [lang: string]: {
    [key: string]: string;
  };
};

type FormatMessage = (
  key: string,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  variables?: { [key: string]: any }
) => string;

export default (strings: LocalizedStrings): FormatMessage => {
  const { locale } = useLocale();

  // if locale does not exist in the translated strings,
  // attempt to strip region and compare
  if (!strings[locale]) {
    const localeWithoutRegion = getLocaleWithoutRegion(locale);

    if (strings[localeWithoutRegion]) {
      strings[locale] = strings[localeWithoutRegion];
    } else {
      // if locale without region does not exist in the translated strings,
      // default to english
      strings[locale] = strings['en'];
    }
  }

  return useMessageFormatter(strings);
};
