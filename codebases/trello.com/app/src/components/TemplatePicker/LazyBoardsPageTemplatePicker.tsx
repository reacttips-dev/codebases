import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Category } from './types';
import { Null } from 'app/src/components/Null';

export const LazyBoardsPageTemplatePicker: React.FC<{
  category: Category;
  isNewAccount: (date: Date) => boolean;
  isDismissed: (oneTimeMessageId: string) => boolean;
  setDismissed: (oneTimeMessageId: string) => boolean;
}> = ({
  category = Category.Popular,
  isNewAccount,
  isDismissed,
  setDismissed,
}) => {
  const BoardsPageTemplatePicker = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "boards-page-template-picker" */ './BoardsPageTemplatePicker'
      ),
    { namedImport: 'BoardsPageTemplatePicker' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.BoardsPageTemplatePicker,
      }}
      errorHandlerComponent={Null}
    >
      <Suspense fallback={null}>
        <BoardsPageTemplatePicker
          category={category}
          isNewAccount={isNewAccount}
          isDismissed={isDismissed}
          setDismissed={setDismissed}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
