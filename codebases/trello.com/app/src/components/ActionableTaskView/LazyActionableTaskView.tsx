import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyActionableTaskView: React.FunctionComponent = () => {
  const ActionableTaskView = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "actionable-task-view" */ './ActionableTaskView'
      ),
  );

  return (
    <Suspense fallback={null}>
      <ActionableTaskView />
    </Suspense>
  );
};
