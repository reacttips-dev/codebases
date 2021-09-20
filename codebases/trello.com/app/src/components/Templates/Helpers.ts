import { usesLanguages } from '@trello/locale';
import { useTemplateBackgroundImageScaleQuery } from './TemplateBackgroundImageScaleQuery.generated';
// eslint-disable-next-line no-restricted-imports
import { TemplateLanguage } from '@trello/graphql/generated';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import { TrelloBlue500 } from '@trello/colors';
import { sendErrorEvent } from '@trello/error-reporting';
import React from 'react';

export const templateUrlSlug = (
  category: string,
  name: string,
  shortLink: string,
) => {
  return `${category}/${(name || '')
    .replace(/\s+/g, '-')
    .toLowerCase()}-${shortLink}`;
};

export const DEFAULT_LANGUAGE: TemplateLanguage = {
  __typename: 'TemplateLanguage',
  language: 'en',
  locale: 'en-US',
  description: 'English',
  localizedDescription: 'English',
  enabled: true,
};

export const DEFAULT_LOCALE: string = 'en-US';

export const showGalleryLocalization = () =>
  usesLanguages(['en', 'pt-BR', 'fr']);

export const submitTemplateUrls = (
  locale: string,
  simpleTypeform: boolean = false,
) => {
  if (locale === 'fr') {
    return 'https://trello.typeform.com/to/e2fpuF';
  } else if (locale === 'pt-BR') {
    return 'https://trello.typeform.com/to/so0XYj';
  } else if (simpleTypeform) {
    return 'https://trello.typeform.com/to/s67e0q'; // simpler English typeform
  } else {
    return 'https://trello.typeform.com/to/YxMGeV'; // more complex English typeform
  }
};

export const getTemplateLanguageEnabledFromMemberLocale = (
  locale: string,
  languages: TemplateLanguage[],
): TemplateLanguage => {
  const language = locale.split('-')[0];
  const languageMemberMatch = languages.find(
    (l: TemplateLanguage) =>
      l.enabled && (locale === l.locale || language === l.language),
  );

  return languageMemberMatch || DEFAULT_LANGUAGE;
};

export const useBackgroundStyle = (
  boardId: string,
  backgroundColor?: string,
  backgroundUrl?: string,
) => {
  const css: React.CSSProperties = {};
  const { data, error, loading } = useTemplateBackgroundImageScaleQuery({
    variables: {
      idBoard: boardId,
    },
  });

  if (backgroundUrl) {
    let scaledBackgroundUrl = backgroundUrl;

    if (loading) {
      return {
        loading,
        templateBackgroundStyle: css,
      };
    }

    if (error) {
      sendErrorEvent(new Error(error.message), {
        tags: {
          ownershipArea: 'trello-teamplates',
        },
        extraData: {
          networkError: error.networkError ? error.networkError.message : false,
          extraInfo: error.extraInfo,
          graphQLErrors: error.graphQLErrors.toString(),
          stack: error.stack ? error.stack : false,
          name: error.name,
        },
      });
    } else {
      const backgroundImageScaled =
        (!!data &&
          !!data.board &&
          !!data.board.prefs &&
          !!data.board.prefs.backgroundImageScaled &&
          data.board.prefs.backgroundImageScaled) ||
        undefined;

      const preview =
        !!data && smallestPreviewBiggerThan(backgroundImageScaled, 300, 150);
      scaledBackgroundUrl = (!!preview && preview.url) || backgroundUrl;
    }

    css.backgroundImage = `url('${scaledBackgroundUrl}')`;
    css.backgroundSize = 'cover';
    css.backgroundPosition = 'center';
  } else {
    css.backgroundColor = backgroundColor || TrelloBlue500;
  }

  return {
    loading: false,
    templateBackgroundStyle: css,
  };
};

export const Helpers = {
  templateUrlSlug,
  showGalleryLocalization,
  submitTemplateUrls,
  getTemplateLanguageEnabledFromMemberLocale,
  useBackgroundStyle,
};
