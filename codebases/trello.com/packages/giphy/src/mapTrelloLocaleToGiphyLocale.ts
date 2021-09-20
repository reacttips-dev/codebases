const localeMap: { [k: string]: string } = {
  'en-AU': 'en',
  'en-GB': 'en',
  'en-US': 'en',
  'pt-BR': 'pt',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
};

export const mapTrelloLocaleToGiphyLocale = (code: string) => {
  if (localeMap[code]) {
    return localeMap[code];
  }

  return code;
};
