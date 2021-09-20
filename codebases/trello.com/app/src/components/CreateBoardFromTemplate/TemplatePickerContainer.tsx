/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { Suspense, useEffect } from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { Spinner } from '@trello/nachos/spinner';
import { TemplateBoardIcon } from '@trello/nachos/icons/template-board';
import { TemplateBoardCreate } from 'app/src/components/Templates/types';
import { DEFAULT_LOCALE } from 'app/src/components/Templates/Helpers';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { forTemplate } from '@trello/i18n';
import { Auth } from 'app/scripts/db/auth';
import { languageParts } from '@trello/locale';
import { TemplateBoardCreateTemplatePicker } from './types';
import { useTemplatePickerContainerGalleryQuery } from './TemplatePickerContainerGalleryQuery.generated';
import { useTemplatePickerContainerMyTemplatesQuery } from './TemplatePickerContainerMyTemplatesQuery.generated';
import { useTemplatePickerStarredQuery } from './TemplatePickerStarredQuery.generated';
import { useMemberLocaleQuery } from 'app/src/components/PowerUpDirectory/MemberLocaleQuery.generated';
import { TemplatePicker } from './TemplatePicker';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { checkIsTemplate } from '@trello/boards';
import { Analytics } from '@trello/atlassian-analytics';

import styles from './TemplatePickerContainer.less';

const format = forTemplate('templates');

const loadingSpinner = (
  <div className={styles.spinnerContainer}>
    <Spinner />
  </div>
);

const normalizeTemplates = (
  template: TemplateBoardCreateTemplatePicker,
): TemplateBoardCreate => ({
  id: template.id,
  name: template.name || '',
  prefs: {
    backgroundColor:
      (template.prefs && template.prefs.backgroundColor) || undefined,
    backgroundImage:
      (template.prefs && template.prefs.backgroundImage) || undefined,
  },
});

const sortTemplates = (a: TemplateBoardCreate, b: TemplateBoardCreate) => {
  if (a.name.toUpperCase() < b.name.toUpperCase()) {
    return -1;
  } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
    return 1;
  } else {
    return 0;
  }
};

interface TemplatePickerContainerOwnProps {
  hide: () => void;
  onSelectTemplate: ({ id, name }: { id: string; name: string }) => void;
}

interface TemplatePickerContainerDispatchProps {
  onMount: () => void;
}

interface TemplatePickerContainerProps
  extends TemplatePickerContainerOwnProps,
    TemplatePickerContainerDispatchProps {}

const mapDispatchToProps = (
  dispatch: Dispatch,
): TemplatePickerContainerDispatchProps => {
  return {
    onMount() {
      dispatch(preloadCreateBoardData());
    },
  };
};

const TemplatePickerContainerUnconnected: React.FunctionComponent<TemplatePickerContainerProps> = ({
  hide,
  onSelectTemplate,
  onMount,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onMount(), []);

  const locale = Auth.me().get('lang');

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.TemplatesInCreateFlow,
      }}
    >
      <Suspense fallback={null}>
        {locale ? (
          <TemplatePickerContainerInner
            hide={hide}
            onSelectTemplate={onSelectTemplate}
            locale={locale}
          />
        ) : (
          <TemplatePickerContainerFetchLocale
            hide={hide}
            onSelectTemplate={onSelectTemplate}
          />
        )}
      </Suspense>
    </ErrorBoundary>
  );
};

export const TemplatePickerContainer = connect(
  null,
  mapDispatchToProps,
)(TemplatePickerContainerUnconnected);

const TemplatePickerContainerFetchLocale: React.FunctionComponent<TemplatePickerContainerOwnProps> = ({
  hide,
  onSelectTemplate,
}) => {
  const { data, loading, error } = useMemberLocaleQuery();

  if (loading) {
    return loadingSpinner;
  } else if (error) {
    return null;
  }

  const locale = data?.member?.prefs?.locale || DEFAULT_LOCALE;

  return (
    <TemplatePickerContainerInner
      hide={hide}
      onSelectTemplate={onSelectTemplate}
      locale={locale}
    />
  );
};

interface TemplatePickerContainerInnerProps {
  hide: () => void;
  onSelectTemplate: ({ id, name }: { id: string; name: string }) => void;
  locale: string;
}

const TemplatePickerContainerInner: React.FunctionComponent<TemplatePickerContainerInnerProps> = ({
  hide,
  onSelectTemplate,
  locale,
}) => {
  const topTemplates: { [key: string]: string[] } = useFeatureFlag(
    'teamplates.web.create-flow-top-templates',
    {},
  );
  const language = languageParts(locale).language;
  let topTemplatesList: string[] = [];
  if (topTemplates[locale]) {
    topTemplatesList = topTemplates[locale];
  } else if (topTemplates[language]) {
    topTemplatesList = topTemplates[language];
  } else {
    topTemplatesList = topTemplates['en'];
  }

  const {
    data: galleryTemplatesData,
    error: galleryTemplatesError,
    loading: galleryTemplatesLoading,
  } = useTemplatePickerContainerGalleryQuery({
    variables: {
      boardIds: topTemplatesList,
    },
  });

  const {
    data: myTemplatesData,
    error: myTemplatesError,
    loading: myTemplatesLoading,
  } = useTemplatePickerContainerMyTemplatesQuery();

  const {
    data: starredData,
    error: starredError,
    loading: starredLoading,
  } = useTemplatePickerStarredQuery();

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'createFromTemplateInlineDialog',
    });
  }, []);

  if (galleryTemplatesLoading || myTemplatesLoading || starredLoading) {
    return loadingSpinner;
  } else if (galleryTemplatesError || myTemplatesError || starredError) {
    return null;
  }

  const galleryTemplates = (galleryTemplatesData?.boards || [])
    .map(normalizeTemplates)
    .sort(sortTemplates);

  const myTemplates = (myTemplatesData?.member?.boards || [])
    .filter((board) => !board?.closed)
    .map(normalizeTemplates)
    .sort(sortTemplates);

  // We're fetching all starred boards and filtering out just the templates
  // because the API doesn't support fetching boards that are both starred and templates
  const starredBoardsMap = (starredData?.member?.boards || [])
    .filter((board) => !board?.closed)
    .filter((board) =>
      checkIsTemplate({
        isTemplate: board?.prefs?.isTemplate,
        permissionLevel: board?.prefs?.permissionLevel,
        premiumFeatures: board?.premiumFeatures,
      }),
    )
    .map(normalizeTemplates)
    .reduce((accumulator, currentTemplate) => {
      return accumulator.set(currentTemplate.id, currentTemplate);
    }, new Map<string, TemplateBoardCreate>());

  // The boardStars.pos is how the user manually orders starred boards
  // So we need to sort based on that and then get the rest of the template data
  const starredTemplates = (starredData?.member?.boardStars
    ? [...starredData?.member?.boardStars]
    : []
  )
    .sort((a, b) => (a.pos || 0) - (b.pos || 0))
    .reduce((accumulator: TemplateBoardCreate[], boardStar) => {
      // Was originally doing a .filter((boardStar) => starredBoardsMap.get(boardStar.idBoard)
      // to get rid of undefineds. But Typescript doesn't recognize different Map.get() calls
      // To get Typescript to recognize that undefined isn't possible you need to store the
      // result of Map.get() in a variable and use that to compare and then push
      const starredBoard = starredBoardsMap.get(boardStar.idBoard);
      if (starredBoard) {
        accumulator.push(starredBoard);
      }

      return accumulator;
    }, []);

  const allTemplates = [
    {
      title: format('starred-templates'),
      templates: starredTemplates,
    },
    { title: format('my-templates'), templates: myTemplates },
    { title: format('top-templates'), templates: galleryTemplates },
  ];

  return (
    <div className={styles.templatePickerContainer}>
      <TemplatePicker
        onSelectTemplate={onSelectTemplate}
        allTemplates={allTemplates}
      />
      <div className={styles.exploreTemplatesContainer}>
        <div className={styles.descriptionContent}>
          <TemplateBoardIcon
            dangerous_className={styles.icon}
            color="blue"
            size="large"
            block
          />
          <p>{format('hundreds-of-templates')}</p>
        </div>
        {window.location.pathname === '/templates' ? (
          <button
            className={styles.exploreTemplatesButton}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendClickedButtonEvent({
                buttonName: 'exploreTemplatesButton',
                source: 'createFromTemplateInlineDialog',
              });
              hide();
            }}
          >
            {format('explore-templates')}
          </button>
        ) : (
          <RouterLink
            className={styles.exploreTemplatesLink}
            href="/templates"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendClickedButtonEvent({
                buttonName: 'exploreTemplatesButton',
                source: 'createFromTemplateInlineDialog',
              });
            }}
          >
            {format('explore-templates')}
          </RouterLink>
        )}
      </div>
    </div>
  );
};
