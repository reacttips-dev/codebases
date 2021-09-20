import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Null } from 'app/src/components/Null';

export const LazyTeamTemplatePicker: React.FC<{ orgId: string }> = ({
  orgId,
}) => {
  const TeamTemplatePicker = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "team-template-picker" */ './TeamTemplatePicker'
      ),
    { namedImport: 'TeamTemplatePicker' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.TeamTemplatePicker,
      }}
      errorHandlerComponent={Null}
    >
      <Suspense fallback={null}>
        <TeamTemplatePicker orgId={orgId} />
      </Suspense>
    </ErrorBoundary>
  );
};
