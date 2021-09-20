import { useEffect, useState } from 'react';
import { addLocaleData } from 'react-intl';

import { languageParts, currentLocale } from '@trello/locale';
import { sendErrorEvent } from '@trello/error-reporting';

import { Feature } from 'app/scripts/debug/constants';
import { importWithRetry } from '@trello/use-lazy-component';

const getLocaleData = async (locale: string) => {
  switch (locale) {
    case 'cs':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-cs" */ 'react-intl/locale-data/cs'
          ),
      );
    case 'da':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-da" */ 'react-intl/locale-data/da'
          ),
      );
    case 'de':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-de" */ 'react-intl/locale-data/de'
          ),
      );
    case 'es':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-es" */ 'react-intl/locale-data/es'
          ),
      );
    case 'et':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-et" */ 'react-intl/locale-data/et'
          ),
      );
    case 'fi':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-fi" */ 'react-intl/locale-data/fi'
          ),
      );
    case 'fr':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-fr" */ 'react-intl/locale-data/fr'
          ),
      );
    case 'hu':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-hu" */ 'react-intl/locale-data/hu'
          ),
      );
    case 'is':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-is" */ 'react-intl/locale-data/is'
          ),
      );
    case 'it':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-it" */ 'react-intl/locale-data/it'
          ),
      );
    case 'ja':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-ja" */ 'react-intl/locale-data/ja'
          ),
      );
    case 'ko':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-ko" */ 'react-intl/locale-data/ko'
          ),
      );
    case 'nb':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-nb" */ 'react-intl/locale-data/nb'
          ),
      );
    case 'nl':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-nl" */ 'react-intl/locale-data/nl'
          ),
      );
    case 'pl':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-pl" */ 'react-intl/locale-data/pl'
          ),
      );
    case 'ro':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-ro" */ 'react-intl/locale-data/ro'
          ),
      );
    case 'ru':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-ru" */ 'react-intl/locale-data/ru'
          ),
      );
    case 'sk':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-sk" */ 'react-intl/locale-data/sk'
          ),
      );
    case 'sv':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-sv" */ 'react-intl/locale-data/sv'
          ),
      );
    case 'zh':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "react-intl-locale-zh" */ 'react-intl/locale-data/zh'
          ),
      );

    default:
      return importWithRetry(
        () =>
          import(
            /* webpackChunkName: "react-intl-locale-en" */ 'react-intl/locale-data/en'
          ),
      );
  }
};

const getMediaMessages = async (msgType: string) => {
  switch (msgType) {
    case 'cs':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-cs" */ '@atlaskit/media-ui/dist/esm/i18n/cs'
          ),
      );
    case 'da':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-da" */ '@atlaskit/media-ui/dist/esm/i18n/da'
          ),
      );
    case 'de':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-de" */ '@atlaskit/media-ui/dist/esm/i18n/de'
          ),
      );
    case 'en_GB':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-en_GB" */ '@atlaskit/media-ui/dist/esm/i18n/en_GB'
          ),
      );
    case 'es':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-es" */ '@atlaskit/media-ui/dist/esm/i18n/es'
          ),
      );
    case 'et':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-et" */ '@atlaskit/media-ui/dist/esm/i18n/et'
          ),
      );
    case 'fi':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-fi" */ '@atlaskit/media-ui/dist/esm/i18n/fi'
          ),
      );
    case 'fr':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-fr" */ '@atlaskit/media-ui/dist/esm/i18n/fr'
          ),
      );
    case 'hu':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-hu" */ '@atlaskit/media-ui/dist/esm/i18n/hu'
          ),
      );
    case 'is':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-is" */ '@atlaskit/media-ui/dist/esm/i18n/is'
          ),
      );
    case 'it':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-it" */ '@atlaskit/media-ui/dist/esm/i18n/it'
          ),
      );
    case 'ja':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-ja" */ '@atlaskit/media-ui/dist/esm/i18n/ja'
          ),
      );
    case 'ko':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-ko" */ '@atlaskit/media-ui/dist/esm/i18n/ko'
          ),
      );
    case 'nb':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-nb" */ '@atlaskit/media-ui/dist/esm/i18n/nb'
          ),
      );
    case 'nl':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-nl" */ '@atlaskit/media-ui/dist/esm/i18n/nl'
          ),
      );
    case 'pl':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-pl" */ '@atlaskit/media-ui/dist/esm/i18n/pl'
          ),
      );
    case 'pt_BR':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-pt_BR" */ '@atlaskit/media-ui/dist/esm/i18n/pt_BR'
          ),
      );
    case 'pt_PT':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-pt_PT" */ '@atlaskit/media-ui/dist/esm/i18n/pt_PT'
          ),
      );
    case 'ro':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-ro" */ '@atlaskit/media-ui/dist/esm/i18n/ro'
          ),
      );
    case 'ru':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-ru" */ '@atlaskit/media-ui/dist/esm/i18n/ru'
          ),
      );
    case 'sk':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-sk" */ '@atlaskit/media-ui/dist/esm/i18n/sk'
          ),
      );
    case 'sv':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-sv" */ '@atlaskit/media-ui/dist/esm/i18n/sv'
          ),
      );
    case 'zh':
    case 'zh-Hans':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-zh" */ '@atlaskit/media-ui/dist/esm/i18n/zh'
          ),
      );
    case 'zh_TW':
    case 'zh-Hant':
      return importWithRetry(
        () =>
          import(
            /*webpackChunkName: "media-messages-zh-tw" */ '@atlaskit/media-ui/dist/esm/i18n/zh_TW'
          ),
      );
    default:
      return importWithRetry(
        () =>
          import(
            /* webpackChunkName: "media-messages-en" */ '@atlaskit/media-ui/dist/esm/i18n/en'
          ),
      );
  }
};

export const useAkMediaLocale = () => {
  const [messages, setMessages] = useState({});
  const [isLocaleReady, setIsLocaleReady] = useState(false);
  const { language, region, script } = languageParts(currentLocale);

  useEffect(() => {
    const mediaMsgType = region
      ? `${language}_${region}`
      : script
      ? `${language}-${script}`
      : language;
    const setLocaleData = async () => {
      try {
        const localeData = await getLocaleData(language);
        const mediaMessages = await getMediaMessages(mediaMsgType);

        addLocaleData(localeData.default);
        setMessages(mediaMessages.default);
        setIsLocaleReady(true);
      } catch (error) {
        setIsLocaleReady(true);
        setMessages({});
        sendErrorEvent(error, {
          tags: {
            ownershipArea: 'trello-workflowers',
            feature: Feature.SmartLink,
          },
        });
      }
    };

    setLocaleData();
  }, [setMessages, script, region, language]);

  return {
    language,
    messages,
    isLocaleReady,
  };
};
