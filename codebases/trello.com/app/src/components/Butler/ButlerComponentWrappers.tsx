/* eslint-disable @trello/export-matches-filename */

import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Feature } from 'app/scripts/debug/constants';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import {
  ButlerCardButtons,
  ButlerCardButtonsProps,
} from './Buttons/ButlerCardButtons';
import type { AutomaticReportsViewProps } from './Reports/types';

// Entry points required for lazily loading Butler components in non-React contexts.

export const ButlerCardButtonsWrapper: React.FunctionComponent<ButlerCardButtonsProps> = (
  props,
) => (
  <ErrorBoundary
    tags={{
      ownershipArea: 'trello-workflowers',
      feature: Feature.ButlerOnBoards,
    }}
  >
    <ButlerCardButtons {...props} />
  </ErrorBoundary>
);

export const AutomaticReportsWrapper: React.FunctionComponent<AutomaticReportsViewProps> = (
  props,
) => {
  const AutomaticReportsView = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "automatic-reports-view" */ './Reports/AutomaticReportsView'
      ),
    { namedImport: 'AutomaticReportsView' },
  );

  return (
    <Suspense fallback={null}>
      <AutomaticReportsView {...props} />
    </Suspense>
  );
};
