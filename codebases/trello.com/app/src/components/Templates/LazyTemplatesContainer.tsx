import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { sendErrorEvent } from '@trello/error-reporting';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { useTemplateLanguagesQuery } from './TemplateLanguagesQuery.generated';
import { Spinner } from '@trello/nachos/spinner';

// eslint-disable-next-line @trello/less-matches-component
import styles from './Spinner.less';

const loadingSpinner = (
  <div className={styles.spinnerContainer}>
    <Spinner />
  </div>
);

const TemplatesContainerRoot: React.FunctionComponent<{
  locale?: string;
  category?: string;
  shortLink?: string;
  isSubmitPage?: boolean;
  isInAppGallery: boolean;
}> = ({ locale, category, shortLink, isSubmitPage, isInAppGallery }) => {
  const TemplatesContainer = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "templates-container" */ './TemplatesContainer'
      ),
    { namedImport: 'TemplatesContainer' },
  );

  const {
    data: languagesData,
    error: languagesError,
    loading: languagesLoading,
  } = useTemplateLanguagesQuery();

  if (languagesLoading) {
    return loadingSpinner;
  } else if (languagesData?.templateLanguages) {
    return (
      <TemplatesContainer
        locale={locale}
        languages={languagesData.templateLanguages}
        category={category}
        shortLink={shortLink}
        isSubmitPage={isSubmitPage}
        isInAppGallery={isInAppGallery}
      />
    );
  } else if (languagesError) {
    sendErrorEvent(new Error(languagesError.message), {
      tags: {
        ownershipArea: 'trello-teamplates',
      },
      extraData: {
        networkError: languagesError.networkError
          ? languagesError.networkError.message
          : false,
        extraInfo: languagesError.extraInfo,
        graphQLErrors: languagesError.graphQLErrors.toString(),
        stack: languagesError.stack ? languagesError.stack : false,
        name: languagesError.name,
      },
    });
  }

  return <></>;
};

export const LazyTemplatesContainer: React.FunctionComponent<{
  locale?: string;
  category?: string;
  shortLink?: string;
  isSubmitPage?: boolean;
  isInAppGallery: boolean;
}> = ({ locale, category, shortLink, isSubmitPage, isInAppGallery }) => (
  <ErrorBoundary
    tags={{
      ownershipArea: 'trello-teamplates',
      feature: Feature.TemplatesGallery,
    }}
  >
    <Suspense fallback={null}>
      <ComponentWrapper>
        <TemplatesContainerRoot
          locale={locale}
          category={category}
          shortLink={shortLink}
          isSubmitPage={isSubmitPage}
          isInAppGallery={isInAppGallery}
        />
      </ComponentWrapper>
    </Suspense>
  </ErrorBoundary>
);
