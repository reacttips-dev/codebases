import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { SourceType } from '@trello/atlassian-analytics';

interface ClosedBoardsButtonLazyWrappedProps {
  orgId: string;
  analyticsSource: SourceType;
}

export const ClosedBoardsButtonLazyWrapped = ({
  orgId,
  analyticsSource,
}: ClosedBoardsButtonLazyWrappedProps) => {
  const ClosedBoardsButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "closed-boards-button" */ './ClosedBoardsButton'
      ),
    { namedImport: 'ClosedBoardsButton' },
  );

  return (
    <ComponentWrapper>
      <Suspense fallback={null}>
        <ClosedBoardsButton orgId={orgId} analyticsSource={analyticsSource} />
      </Suspense>
    </ComponentWrapper>
  );
};
